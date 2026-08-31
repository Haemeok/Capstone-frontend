---
title: Reveal Active Rail Items Outside Overlay and Padding Zones
impact: MEDIUM
impactDescription: keeps selected tabs visible after routing and responsive resize
tags: client, scroll, overflow, resize-observer, navigation, layout
---

## Reveal Active Rail Items Outside Overlay and Padding Zones

Horizontally scrolling tab rails often place padding inside the scroller and a fade or arrow overlay above its right edge. Checking only whether the active item is inside `clientWidth` is insufficient: the item can be technically inside the scrollport while still sitting underneath the overlay. The same bug returns after responsive resize if reveal logic runs only when the selected ID changes.

**Incorrect — ignores the rail's padding, overlay, and resize path:**

```tsx
const reveal = (scroller: HTMLDivElement, item: HTMLElement) => {
  const itemRight = item.offsetLeft + item.offsetWidth;
  const visibleRight = scroller.scrollLeft + scroller.clientWidth;

  if (itemRight > visibleRight) {
    scroller.scrollLeft = itemRight - scroller.clientWidth;
  }
};

useLayoutEffect(() => {
  reveal(scrollerRef.current!, activeItemRef.current!);
}, [activeId]);
```

`offsetLeft` is measured in the content coordinate space, while the painted item is also shifted by the scroller's content padding. A right-edge overlay reduces the usable viewport further. Running only on `activeId` changes also leaves the item hidden when the container later becomes narrower.

**Correct — reserve every occluded pixel and remeasure through one observer:**

```tsx
const reveal = (
  scroller: HTMLDivElement,
  item: HTMLElement,
  rightOverlayWidth: number
) => {
  const paddingLeft = Number.parseFloat(getComputedStyle(scroller).paddingLeft);
  const safeRightInset = rightOverlayWidth + paddingLeft;
  const itemRight = item.offsetLeft + item.offsetWidth;
  const visibleRight =
    scroller.scrollLeft + scroller.clientWidth - safeRightInset;

  if (itemRight <= visibleRight) return;

  const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
  scroller.scrollLeft = Math.min(
    itemRight - scroller.clientWidth + safeRightInset,
    maxScrollLeft
  );
};

useLayoutEffect(() => {
  const scroller = scrollerRef.current;
  const item = activeItemRef.current;
  if (!scroller || !item) return;

  const measure = () => {
    reveal(scroller, item, 48);
    updateOverflowFade(scroller);
  };

  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(scroller);
  return () => observer.disconnect();
}, [activeId]);
```

Key points:

- Keep coordinate spaces explicit. Account for content padding when comparing `offsetLeft` values with painted viewport edges.
- Treat overlays as unusable viewport area. A fade can be visually transparent near one edge and still obscure the active label or indicator.
- Re-run reveal logic on both selection changes and container resize. Route state can stay constant while the usable width changes.
- Reuse the observer that already measures overflow; duplicate observers can race and perform redundant layout reads.
- Do not reveal on every user `scroll` event. Only resize or selection changes should correct an active item that became hidden.
- Clamp to the maximum scroll position. At the final item, reaching the end should remove the overflow fade rather than inventing extra blank space.
- Test in painted coordinates: active item and indicator edges must stay before the overlay boundary, including padding, and a visible item must preserve the user's current `scrollLeft`.
