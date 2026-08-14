---
title: Hold a Lazy Section's Reserved Height Through Loading — Collapse Only After Load
prefix: react
trigger: An in-view/lazy-loaded section reserves placeholder height before fetch, then does `if (isLoading) return null` (or renders zero-height) while the query runs.
---

## Symptom

A section that fetches when it scrolls into view makes the page jump: the space it reserved before fetching collapses to zero the moment loading starts, then re-expands when content arrives. On scroll this reads as a double layout shift — the content below jumps up, then back down.

## Root cause

The component reserves height while off-screen (`if (!inView) return <div className="h-[260px]" />`) but then returns `null` during the fetch (`if (isLoading) return null`). That collapses the reserved box to 0 height for the duration of the request, so the layout reflows twice: `reserved → 0 → content`. The reserved height was supposed to be a stable stand-in until the _final_ outcome is known, but the loading branch throws it away mid-flight.

## Recommended pattern

Keep the reserved-height placeholder through the loading state too. Collapse to `null` only **after** load, and only when the section is genuinely empty/hidden — that's the one transition you can't avoid (you don't know it's empty until it resolves).

```tsx
if (disabled) return null;

// reserve the SAME height while off-screen AND while loading
if (!inView || isLoading) {
  return <div ref={ref} className="h-[260px] w-full" aria-hidden />;
}

if (shouldHide({ recipeCount: items.length, ... })) return null; // post-load only

return <div ref={ref} className="w-full"><Content items={items} /></div>;
```

## Anti-pattern

```tsx
if (!inView) return <div ref={ref} className="h-[260px] w-full" aria-hidden />;
if (isLoading) return null; // ❌ collapses the reserved 260px to 0 → jump
```

## Heuristic

- A placeholder you reserved _before_ a fetch must persist _until you know the final content_. The only legitimate collapse is the post-load empty case.
- Match the loading placeholder's height to the off-screen reservation (same class), so `off-screen → loading` is a no-op visually and only `loading → content` (same height) animates.
- Don't render the real section shell with a half-known title during loading either: if the title interpolates not-yet-fetched metadata, an aria-hidden height box avoids showing a blank `"  분"` / empty-meta heading. See [Render already-available content](react-static-content-not-gated-on-enrichment-query.md) for the inverse case (don't _over_-hide content you already have).
