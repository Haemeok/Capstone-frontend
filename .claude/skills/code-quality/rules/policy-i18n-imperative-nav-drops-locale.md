---
title: A Locale-Aware `<Link>` Doesn't Cover Imperative `router.push` — Wrap the Router Too and Lint Raw Navigation
prefix: policy
trigger: An app that encodes locale in the URL path prefix (`/ja/...`, `/en/...`) and already has a locale-aware `<Link>` wrapper, when adding or reviewing any imperative navigation (`useRouter().push/replace`, `redirect`, animated `motion(Link)`, or a raw `next/link`).
---

## Symptom

On a locale-prefixed route (`/ja/...`) a navigation action — a button `onClick` that calls `router.push`, a floating link, an animated `motion(Link)` — jumps to the **default-locale** route (no prefix), and from there every page renders the default locale. The declarative `<Link>`s on the same screen behave correctly, so it looks locale-aware until you trigger the imperative path.

## Root cause

When locale lives only in the URL prefix, it is preserved **only when navigation runs through a locale-aware helper** that prepends the current locale. A `LocalizedLink` wrapper fixes declarative `<Link href>`, but it does **not** cover:

- imperative `useRouter().push/replace/prefetch` with a hardcoded path,
- raw `next/link` (including `motion(Link)` / styled wrappers) used directly,
- `redirect()` in route handlers/server actions.

Each passes a bare path (`/foo/bar`) with no prefix → the router resolves it against the default locale. The bug hides because the default locale _is_ the unprefixed path, so it only surfaces on `/ja`·`/en`.

**Incorrect — imperative push drops the prefix:**

```tsx
const router = useRouter();
const go = () => router.push("/foo/bar"); // on /ja → navigates to /foo/bar (default locale)
```

**Correct — a router wrapper that prefixes like the Link wrapper does:**

```tsx
// useLocalizedRouter: push/replace/prefetch run href through localizedHref(path, currentLocale),
// where currentLocale is derived from the pathname (same source the Link wrapper uses). Default
// locale is a no-op; http/#/already-prefixed hrefs pass through.
const router = useLocalizedRouter();
const go = () => router.push("/foo/bar"); // on /ja → /ja/foo/bar
```

## Recommended pattern

- Provide the **imperative counterpart** to the Link wrapper: a `useLocalizedRouter` that wraps `push`/`replace`/`prefetch` through the same prefixer, sourced from the current pathname's locale. Delegate `back`/`forward`/`refresh` unchanged.
- **Lint-ban the raw primitives** (`no-restricted-imports`/a custom rule on `useRouter` from `next/navigation`, and on bare `next/link`) so new code can't silently regress; route everyone to the wrappers. Ship the rule as **warn** if the codebase has many existing raw call sites, then sweep — an error rule blocks CI on day one.
- Allow a **narrow, documented opt-out** (e.g. genuinely locale-free admin/desktop pages, or external/absolute URLs) via an `eslint-disable` with a reason.

## Anti-pattern

- Shipping a Link wrapper and assuming "locale is handled." Imperative nav and raw `next/link` leak silently; a Link-only solution is half a solution.
- Relying on per-call discipline (remembering to prefix every `router.push`) instead of a wrapper + lint. One missed call drops the user to the default locale, and reviewers won't catch it because it works on the default route.
- "Fixing" it with middleware that reads a locale cookie and redirects unprefixed paths. That **masks** the hardcoded path (the bug stays), adds a redirect hop on every mistake, and couples URL→content to hidden cookie state. Fix at the navigation source.

## Heuristic

When locale is in the URL prefix, **every navigation primitive must be locale-aware.** Grep the app for `useRouter(`, `from "next/link"`, and `redirect(`; each raw one is a locale leak on prefixed routes. The tell: "I'm on `/ja` but clicking X drops me to the default-locale page." Verify on a `/ja`·`/en` route, never the default locale.

Related: the active-state counterpart is [[policy-i18n-locale-prefix-breaks-path-equality]] (prefixed pathname breaks bare-route equality). Both are symptoms of "locale lives in the prefix, so every path-touching layer must agree on the prefix."
