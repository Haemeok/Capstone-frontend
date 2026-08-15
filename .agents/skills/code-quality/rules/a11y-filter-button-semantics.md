---
title: Match Filter Controls to Their Actual Interaction Semantics
prefix: a11y
trigger: Styling a row of selectable filters like tabs, or adding tab roles to buttons without implementing tab keyboard behavior.
---

## Symptom

A filter row announces itself as tabs, but arrow keys do nothing, every item remains in the normal tab order, or activation behaves like independent buttons. Pointer users can still select a filter, so the mismatch often survives visual review while screen-reader and keyboard users receive a false interaction contract.

## Root cause

`role="tablist"`, `role="tab"`, and `aria-selected` describe the complete ARIA tabs pattern, not a pill-shaped visual style. That pattern also requires coordinated arrow-key navigation, focus management, and an associated tab panel. Adding only the roles makes native buttons less truthful without providing tab behavior.

## Recommended pattern

For a set of filters that replace the visible result while remaining ordinary buttons, use a named group and expose the selected state with `aria-pressed`.

```tsx
<div role="group" aria-label="Result filter">
  {filters.map((filter) => {
    const isSelected = filter.id === selectedId;

    return (
      <button
        key={filter.id}
        type="button"
        aria-pressed={isSelected}
        onClick={() => onSelect(filter.id)}
      >
        {filter.label}
      </button>
    );
  })}
</div>
```

Use the ARIA tabs pattern only when the control really owns tab panels and implements its keyboard contract, preferably through a tested accessible primitive.

## Anti-pattern

```tsx
<div role="tablist" aria-label="Result filter">
  <button role="tab" aria-selected={selectedId === "all"}>
    All
  </button>
</div>
```

The markup promises tab behavior while supplying only button click behavior.

## Heuristic

Choose semantics from the interaction contract, not the shape. If there is no associated tab panel, roving focus, and arrow-key navigation, keep native button behavior and represent selection with `aria-pressed` inside a named group.
