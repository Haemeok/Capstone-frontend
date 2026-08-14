---
title: Make Locale Preference Durable via a Cookie Aligned in Middleware — Not localStorage, Never Read in Pages
prefix: policy
trigger: A path-prefixed i18n setup (`/`=default, `/en`, `/ja`) where the user also has an explicit language setting, and you need that setting to actually stick across entries (OAuth redirect, shared/deep links, reloads). Or when tempted to "just read the preference from localStorage everywhere".
---

## Symptom

A user sets the app language (e.g. Korean) but the UI and search keep rendering in another locale (e.g. English): localized search returns nothing for a native-language query ("양배추" → 0 results) while the foreign term works ("cabbage" → results). The setting visibly persists, yet has no effect — and changing it "fixes" the screen only until the next entry, then reverts.

## Root cause

Three locale sources exist but there is no single source of truth, and the authoritative one is the one the user's setting cannot durably override:

- **URL path prefix** — the de-facto SSOT for both UI dictionaries and the search `lang`. Every internal link/router re-derives locale from the current path, so the prefix is **self-perpetuating**: once on `/en`, you stay on `/en`.
- **localStorage** — written by the toggle, but read only as a weak fallback _when the path has no prefix_. On an `/en` path it's ignored. Crucially the **server cannot read localStorage at all**, so SSR and server-side data fetches never see it.
- **account preference (backend)** — often write-only; nothing reads it to steer routing.

So any single `/en` entry (OAuth post-login redirect derived from referer, a shared link, a deep link, history) lands the user on `/en`, and the saved preference has no mechanism to pull the path back.

## Recommended pattern

Split the roles. **Path stays the rendering SSOT** (keep it — it's what makes each locale a separately cacheable static route and powers hreflang/SEO). **Preference becomes the routing input**, stored in a **cookie** so the server can read it, and the path is aligned to it **in middleware only**.

```ts
// middleware.ts — read the cookie HERE, redirect to align. Pages never read it.
const preferred = request.cookies.get(PREFERRED_LOCALE)?.value;
if (isLocale(preferred)) {
  const { barePath } = stripLocale(pathname);
  const target = localizedHref(barePath, preferred); // preserves the resource
  if (target !== pathname) {
    return NextResponse.redirect(new URL(`${target}${search}`, request.url));
  }
}
```

Then the toggle mirrors the choice into the cookie (alongside localStorage/account), and a client effect reconciles cookie ⟸ localStorage ⟸ account on load (migrating users who chose before the cookie existed) plus one `router.replace` to correct a mismatched path.

Key consequences that make this correct:

- **localStorage cannot be the SSOT.** Flipping the resolver to "localStorage first" only fixes the client; the server still renders path-based → hydration mismatch + server-side search `lang` stays wrong. The server must see the preference → it must be a cookie.
- **Never read the locale cookie in a layout/page/RSC.** `cookies()` in a Server Component opts the whole route into **dynamic rendering**, killing the full-route cache. Middleware reads cookies for free without affecting downstream static rendering — that's the only place the cookie belongs.
- **Only redirect when the cookie is present.** No-cookie requests (crawlers, first visit, someone opening a shared `/en` link who hasn't chosen a locale) pass through to the requested path → SEO/hreflang and public localized links stay intact.

## Anti-pattern

- "Just store the setting in localStorage and read it everywhere." Server-invisible → FOUC/hydration mismatch and server-side fetches ignore it. The fix isn't more reads; it's a cookie.
- Reading the preference cookie in a route layout/page to pick the dictionary. Works, but silently turns every page dynamic — you traded the bug for a cache regression.
- Letting an explicit `/en` link permanently flip the preference (path → cookie on every visit). That re-introduces the original bug: one foreign link strands a user in a language they didn't choose. Preference changes only via the explicit toggle; tapping a localized link redirects to the user's language instead.
- Deriving post-login locale from the `referer` instead of the user's cookie/account — every login can drop a preference-set user onto the wrong locale.

## Heuristic

The tell is "the setting persists but doesn't stick" — it fixes the current screen and reverts on next entry. When locale lives in the URL path, ask: _what reads the saved preference to decide the path, and can the server see it?_ If the answer is "only client code, via localStorage", the preference can't survive a path-prefixed entry. The durable shape is always: preference in a cookie → middleware aligns path → path drives render. Once middleware guarantees path == preference, path-based resolvers (`useApiLocale`, active-tab checks) are automatically correct — see [[policy-i18n-locale-prefix-breaks-path-equality]] and [[policy-i18n-imperative-nav-drops-locale]]. Redirecting to a localized path still requires that route to exist — [[policy-i18n-route-exists-not-localized]].
