---
title: Locale-Prefixing Links Breaks Path-Equality UI State — Normalize the Pathname Before Comparing
prefix: policy
trigger: Making shared nav/links locale-aware (a `LocalizedLink` wrapper or `/${locale}` href prefix) in a component that also compares the current pathname against a bare route to drive UI state (active tab, `aria-current`, selected highlight).
---

## Symptom

After wiring internal links to carry the current locale (so `/en` navigation stays in `/en`), the visible navigation **highlight / active state breaks on every localized page** — the bottom-tab or header item never shows as active under `/en/...` or `/ja/...`, though it still works on the default-locale (`/`) routes. No error; links navigate fine, only the active styling is wrong.

## Root cause

Two things now disagree about what "the current path" is. The link's **href** got locale-prefixed (`/search` → `/en/search`), so the browser URL — and therefore `usePathname()` — is now `/en/search`. But the **active comparison** still tests the bare route literal:

```tsx
const isActive = currentPath === path; // path = "/search"
const isActive =
  path === "/" ? currentPath === "/" : currentPath.startsWith(path);
```

On `/en/search`, `currentPath` is `/en/search` while `path` is the bare `/search`; `===` never matches and `startsWith("/search")` is false (the string starts with `/en`). The default locale keeps working only because its pathname has no prefix, which hides the bug until someone tests a localized route.

## Recommended pattern

Strip the locale prefix from the pathname before any route-equality check, so the comparison happens in one normalized (bare) space. Reuse the same `stripLocale` the link/href layer uses — comparing in the same space the hrefs were built from.

```tsx
// ❌ compares prefixed pathname against a bare route
const currentPath = usePathname();
const isActive = currentPath.startsWith(path); // false on /en/...

// ✅ normalize to bare path first, then compare
const { barePath } = stripLocale(usePathname()); // "/en/search" -> "/search"
const isActive = path === "/" ? barePath === "/" : barePath.startsWith(path);
```

The same fix applies to header nav (`barePath === link.href`), breadcrumbs, and any `aria-current` logic.

## Anti-pattern

- Locale-prefixing the href but leaving the active check on raw `usePathname()`. The two must live in the same space — either both bare (normalize the pathname) or both prefixed (also prefix `path`); normalizing to bare is simpler because route literals are already bare.
- "Links work, ship it." Navigation correctness and active-state correctness are separate; verify the highlight on a `/en` or `/ja` route, not just the default locale.
- Re-deriving the prefix-strip inline with an ad-hoc regex per component. Use the shared `stripLocale` so the strip rule (segment-boundary safety, default-locale fallback) stays consistent with the href builder.

## Heuristic

When you make links locale-aware, grep the same components for `usePathname`, `=== "/`, `.startsWith("/`, and `aria-current` — every raw-pathname route comparison is now wrong on prefixed routes and needs the bare-path normalization. The tell is "links go to the right place but nothing looks selected on `/en`."

Related: locale-prefixing a link only resolves if the destination route actually exists for that locale; uniformly prefixing every link will 404 on not-yet-localized destinations — an acceptable interim only when i18n is unreleased and pages are filled in incrementally. See also [[policy-i18n-chrome-vs-content-axes]].
