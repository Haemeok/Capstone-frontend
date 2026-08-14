---
title: Centralized Client API `lang` Must Fall Back to the Path, Not Read the Cookie Alone
prefix: policy
trigger: Centralizing the request locale (e.g. auto-injecting `?lang` in a shared `apiClient`) by reading the preference cookie, and/or removing the per-call-site path-based `lang` (`useApiLocale`) as "now redundant". Any move that treats the locale cookie as the single source of truth for outbound API language.
---

## Symptom

After centralizing API language on the preference cookie (`apiClient` reads `getLocaleCookie()` and appends `?lang`), and deleting the manual path-based `lang` at call sites, localized pages silently regress to the default language for a specific population: a visitor who **deep-links into `/en` or `/ja` without ever having set the language** (shared link, SEO/organic entry, crawler) sees the page chrome in the path locale but the **API data comes back in the default locale** (ko). Logged-in / returning users look fine, so it passes manual QA and only the no-cookie entry path is broken.

## Root cause

Two locale sources exist and they are **not interchangeable** — the cookie is `null` for exactly the population the path serves:

- **Path** (`resolveLocaleFromPath(usePathname())`, via `useApiLocale`) — present for every `/en`·`/ja` request, including first-time/no-cookie visitors.
- **Cookie** (`getLocaleCookie()`) — only written after the user (or a client sync effect) sets a preference. Absent on first deep-link entry, and **nothing seeds it from the path**.

The middleware that "aligns path to cookie" only fires `if (isLocale(preferred))` — i.e. **only when the cookie is present** (see [[policy-i18n-preference-durable-via-cookie-middleware]], which deliberately lets no-cookie requests pass through to preserve SEO/hreflang). So "middleware guarantees path == cookie" is true only in the cookie-present branch. In the cookie-absent branch, `path` is the _only_ locale signal — and a cookie-only central injection sends no `lang`, so the backend defaults to the source language. Replacing the path-based read with a cookie-only read drops locale for precisely the users the architecture intended to serve via the path.

## Recommended pattern

When centralizing, make the injected locale `cookie ?? path` — cookie wins (it's the durable preference), path is the fallback for the no-cookie population. Only then is the per-call-site path-based `lang` actually redundant.

**Incorrect — cookie-only central injection:**

```ts
// apiClient, client-side only
const locale = getLocaleCookie(); // null for no-cookie /en visitor
if (locale && locale !== "ko") params.lang = locale; // → no lang → ko data
```

**Correct — cookie, then path fallback:**

```ts
const locale =
  getLocaleCookie() ?? resolveLocaleFromPath(window.location.pathname);
if (locale && locale !== "ko") params.lang = locale; // /en visitor → en even with no cookie
```

Key points:

- Inject only on the **client** (`isClient` guard) and only for **same-origin** requests — `window.location.pathname` is client-only, and reading the cookie in a Server Component would force dynamic rendering. Server callers still pass `lang` explicitly.
- Preserve a caller-set `lang` (`params.lang === undefined` guard) so explicit overrides and server-coordinated call sites win.
- Omit `lang` for the default locale (`locale !== "ko"`) to keep cache parity with the backend default — `resolveLocaleFromPath` returning `null` for the bare path does this for free.

## Anti-pattern

- **"Central injection covers client lang, so the manual `useApiLocale` `lang` is redundant — delete it."** True only once the injection has a path fallback. Cookie-only injection + deleted manual lang = the regression above. Land the fallback first, then clean up.
- **Removing the path-based read from a call site whose `queryKey` includes `locale`.** The query function's `lang` may be redundant, but the key's `locale` is what separates ko/non-ko cache entries — drop the function arg, keep the key. A server-coordinated call site (locale arrives as a prop to match SSR prefetch) must keep its explicit lang entirely; central client injection would diverge from the server's choice. See [[policy-ssr-client-query-key-parity]].
- **Assuming a sync effect closes the gap.** A client effect that writes the cookie from `{cookie, stored, account}` does **not** seed from the path, so a no-cookie visitor on `/en` may never get a cookie — the path stays the only signal indefinitely.

## Heuristic

Before centralizing a value that has two derivation sources, **enumerate the states where the source you're keeping is null/empty** — don't trust a sync/redirect mechanism without checking the guard it fires under. Here the tell is: the alignment redirect is wrapped in `if (cookie present)`, so the cookie-absent population is exactly where cookie and path diverge. Whenever a "single source of truth" is established by a mechanism that only runs conditionally, the un-covered condition is where the old, "redundant" source was load-bearing. Verify the precondition before deleting the redundancy.
