---
title: Derive Layout Test Geometry From the Rendered Order
prefix: test
trigger: A test mocks offsetLeft or getBoundingClientRect for a list that can be sorted, filtered, rotated, or reordered.
---

## Symptom

A horizontal rail changes from a fixed order to a route-dependent order, but its old scroll tests still pass with the previous coordinates. The component renders the selected item first while the test reports that same item near the end of the rail, so assertions run against a layout that cannot exist in the browser.

## Root cause

The geometry mock calculates positions from a canonical ID array instead of the rendered DOM. Once production reorders the nodes, the component and the test double use different coordinate systems. A green test then proves only that the scroll logic agrees with the stale mock.

## Recommended pattern

Derive mocked positions from actual sibling order so the geometry changes whenever rendering order changes:

```ts
const getSiblingIndex = (element: HTMLElement) => {
  if (!element.parentElement) return -1;

  return Array.from(element.parentElement.children).indexOf(element);
};

Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
  configurable: true,
  get() {
    if (!this.dataset.itemId) return 0;

    return getSiblingIndex(this) * ITEM_PITCH_PX;
  },
});
```

Use the same sibling-derived index in `getBoundingClientRect`. Keep expected ID sequences as independent acceptance assertions, not as the source of mocked layout coordinates.

## Anti-pattern

```ts
const itemIndex = CANONICAL_IDS.findIndex(
  (id) => id === this.dataset.itemId
);

return itemIndex * ITEM_PITCH_PX;
```

This silently pins every item to its original position even when React has rendered a different order.

## Heuristic

- If sorting or rotation changes but old exact scroll values still pass, inspect the geometry mock before trusting the test.
- For reordered DOM lists, derive positions from rendered siblings or explicit per-test layout input, never an unrelated production-order constant.
- Mutation-check the harness: reorder the rendered nodes without changing the mock setup and confirm their measured positions move too.
- Keep two signals separate: assert the visible order from links or labels, and assert scroll behavior from DOM-derived geometry.
