---
title: Wrap Zustand Derived-Collection Selectors with useShallow
impact: HIGH
impactDescription: prevents infinite render loops when subscribing to computed arrays/objects from a Zustand store
tags: rerender, zustand, useSyncExternalStore, infinite-loop, store-selectors
---

## Wrap Zustand Derived-Collection Selectors with useShallow

Zustand v5 subscribes via React's `useSyncExternalStore`, which uses `Object.is` to compare the value returned by the selector across renders. A selector that derives a new array or object from store state — e.g. `Object.values(state.x).filter(...)` — returns a fresh reference every call. Even when the underlying state didn't change, the snapshot looks different to React → "selected store snapshot did not match" → forced re-render → next call returns yet another new reference → `Maximum update depth exceeded`.

The fix is to wrap the selector in `useShallow` (from `zustand/shallow`), which compares the result element-by-element (one level deep) instead of by reference.

**Incorrect — bare selector returns a fresh collection each call:**

```tsx
import { useMyStore } from "./store";

const selectActive = (state: State) =>
  Object.values(state.items).filter((i) => i.state === "active");

function ActiveList() {
  // ⚠️ Object.is(prevArr, nextArr) is always false → infinite re-render loop.
  const active = useMyStore(selectActive);
  return <ul>{active.map((i) => <Row key={i.id} item={i} />)}</ul>;
}
```

The selector body produces a brand-new array each time React asks for the current snapshot. `useSyncExternalStore` detects the mismatch and schedules another render to "catch up", which calls the selector again, gets yet another new array, and so on. The component never stabilizes.

**Correct — wrap derived-collection selectors with useShallow:**

```tsx
import { useShallow } from "zustand/shallow";
import { useMyStore } from "./store";

const selectActive = (state: State) =>
  Object.values(state.items).filter((i) => i.state === "active");

function ActiveList() {
  const active = useMyStore(useShallow(selectActive));
  return <ul>{active.map((i) => <Row key={i.id} item={i} />)}</ul>;
}
```

`useShallow` compares each top-level element of the returned array/object. As long as the filtered items themselves are the same references (which they are, since they come straight out of `state.items`), the snapshot is treated as unchanged.

Key points:
- The trigger is **derivation that builds a new container**: `Object.values`, `Array.prototype.filter` / `map`, `Object.entries`, spreading into a new object, etc. Selectors that return a single stable reference (`state.items[id]`, `state.count`, a single object you keep in the store) do not need `useShallow`.
- Subscribing to the raw container (`state => state.items`) and computing the derivation in render via `useMemo` is also valid — the choice is between two stable strategies, both of which avoid the infinite loop.
- `useShallow` is one level deep. If the derivation returns nested new objects (e.g. `{ id, computedLabel: \`${i.name} (${count})\` }`), the shallow check still sees fresh element refs and won't help — restructure to keep the elements stable, or use a deep-equality wrapper.
- Failure mode is loud (`Maximum update depth exceeded` in dev, white screen / hang in prod). If you see that error after introducing a Zustand selector, suspect this pattern first, not your own setState calls.
- The same principle applies to any `useSyncExternalStore`-based store (Redux Toolkit's `useSelector` uses its own equality, but plain `useSyncExternalStore` consumers must pass a custom `isEqual`). Zustand surfaces this as `useShallow`; other libraries name it differently (`shallowEqual`, `useSelectorShallow`, etc.).
