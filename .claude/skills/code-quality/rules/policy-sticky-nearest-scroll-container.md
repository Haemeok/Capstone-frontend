---
title: Sticky Offsets Anchor to the Nearest Scroll Container, Not the Viewport
prefix: policy
trigger: Adding position sticky (or diagnosing scroll behavior) in an app whose layout scrolls inside an inner overflow container instead of the body.
---

## Symptom

A `sticky top-16` header floats with a 64px gap below the site chrome — or, while diagnosing, `window.scrollTo(...)` silently does nothing and `window.scrollY` stays `0` no matter how far the page visibly scrolls.

## Root cause

`position: sticky` offsets resolve against the **nearest scrollable ancestor**, not the viewport. Layouts like `<header class="fixed h-16">` + `<div class="h-[calc(100dvh-64px)] overflow-y-auto">` scroll in that inner div, which already _starts below_ the fixed header. Compensating for the header again (`top-16`) double-counts it. The dead `window.scrollTo` is the tell: the window isn't the scroller.

## Recommended pattern

Find the real scroll container first, then set the offset relative to **it**:

```js
// In DevTools / Playwright — locate the actual scroller:
[...document.querySelectorAll("*")]
  .filter(
    (el) =>
      el.scrollHeight > el.clientHeight + 50 &&
      ["auto", "scroll"].includes(getComputedStyle(el).overflowY)
  )
  .map((el) => ({ el, top: el.getBoundingClientRect().top }));
```

- Scroller starts below the fixed chrome (top ≈ chrome height) → `sticky top-0`.
- Body/window is the scroller → `sticky top-[chrome height]`.
- Verify by scrolling **the container** (`scroller.scrollTop = 400`) and measuring the sticky element's `getBoundingClientRect().top` — it should equal the container's top edge (+ own padding).

Key points:

- `window.scrollY === 0` after visible scrolling = inner-container scrolling; every viewport-based assumption (scroll listeners on `window`, `scrollTo`, sticky offsets vs. viewport) is wrong in that app.
- The same applies to `scroll-margin`/anchor offsets and IntersectionObserver `root` — they follow the scroll container too.

## Anti-pattern

```tsx
{/* scroller already starts below the fixed 64px header */}
<div className="sticky top-16 ...">  {/* sticks 64px below the header — floating gap */}
```
