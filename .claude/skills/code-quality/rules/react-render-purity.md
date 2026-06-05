---
title: Keep Render Pure — Seed Time/Random State via Lazy Init, Not in Render
prefix: react
trigger: Calling Date.now() / Math.random() / new Date() in a component body, or setState synchronously at the top of a useEffect.
---

## Symptom

React Compiler's lint treats the render path as pure, and two common patterns trip it:

- Calling `Date.now()`, `Math.random()`, or `new Date()` directly in the component body — flagged as impure render (the value differs every render, breaking memoization/replay assumptions).
- Calling `setState(...)` synchronously at the top of a `useEffect` body — flagged `react-hooks/set-state-in-effect` ("cascading renders"), because an effect should sync _with external systems_, not immediately re-derive state on mount.

A naive countdown/clock hook hits both at once: `const remaining = target - Date.now()` in render, plus `setRemaining(...)` as the first line of the effect.

## Recommended pattern

- Seed time/random-derived initial state with a **lazy `useState` initializer** — it runs once at mount, outside the render-purity check:
  ```tsx
  const [remaining, setRemaining] = useState(() => computeRemaining(target));
  ```
- In the effect, **only set up the subscription**; update state from the timer/event callback (a real external-event callback), never synchronously in the effect body:
  ```tsx
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setRemaining(computeRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  ```

## Anti-pattern

```tsx
// Date.now() in render body — impure render
const remaining = targetMs - Date.now();

// setState synchronously in effect body — cascading-render lint
useEffect(() => {
  setRemaining(computeRemaining(target)); // ← redundant with lazy init, flagged
  const id = setInterval(/* ... */, 1000);
  return () => clearInterval(id);
}, [target]);
```

## Heuristic

- Need "now" or a random seed for initial state? Put it in `useState(() => ...)`, never bare in the body.
- A `setState` directly inside an effect body (not in a callback/cleanup) is a smell — the value is either derivable (compute in render) or belongs in the subscription callback. See [Effect / state diet](react-effect-discipline.md).
- Trade-off: a lazy initializer snapshots once. If the prop it derives from changes mid-mount and you need instant resync (not "by next tick"), drive the update from the callback or remount via `key` — don't reach back for a sync setState in the effect body.
