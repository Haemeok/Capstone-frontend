---
title: Derive State at Render Instead of Mirroring via useEffect+setState
impact: HIGH
impactDescription: removes a render cycle and a class of cascading-render bugs
tags: rerender, useEffect, derived-state, react-hooks/set-state-in-effect
---

## Derive State at Render Instead of Mirroring via useEffect+setState

When a piece of state can be computed from other state (or props), do not mirror it into a separate `useState` synced by `useEffect`. The mirror pattern produces an extra render every time the source changes, masks the data dependency, and trips the `react-hooks/set-state-in-effect` lint rule. The fix is almost always to delete the state and the effect, and compute the value in render.

**Incorrect — mirror via effect:**

```tsx
function ImagePicker({ generatedImages }: { generatedImages: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  // Auto-pick the first image of any new batch
  useEffect(() => {
    if (generatedImages.length > 0 && !selected) {
      setSelected(generatedImages[0]);
    }
  }, [generatedImages, selected]);

  return <Grid selected={selected} onPick={setSelected} />;
}
```

The effect runs after the render that introduced the new `generatedImages`, calls `setSelected`, and triggers a *second* render to commit the auto-pick. Two renders for one state transition. The dep array also has to include `selected` to satisfy exhaustive-deps, which makes the effect re-fire on every user pick — harmless here, wasteful in general.

**Correct — derive at render, store only the irreducible part:**

```tsx
function ImagePicker({ generatedImages }: { generatedImages: string[] }) {
  // Store only what the user explicitly chose — null means "no override".
  const [userPick, setUserPick] = useState<string | null>(null);

  // Derive the effective selection in render: user pick wins, fallback to first.
  const selected = userPick ?? generatedImages[0] ?? null;

  return <Grid selected={selected} onPick={setUserPick} />;
}
```

If the parent regenerates the batch and wants to clear the override, it calls `setUserPick(null)` from a real event handler (not an effect) — the next render computes `selected = null ?? newImages[0]`.

Key points:
- Every `useEffect(() => { if (cond) setState(...) }, [...])` that mirrors other state is a flag. Ask: "Can I compute this in render instead?" The answer is yes far more often than you'd think.
- Keep in state only what is truly irreducible — values produced by user events, network responses, or refs to external systems. Everything else is a `const` in the render body.
- React's "You Might Not Need an Effect" guide and the `react-hooks/set-state-in-effect` lint rule both target this exact pattern. Synchronous setState inside an effect causes a double render; conditional setState inside an effect causes flickers and dependency-cycle bugs.
- The classic exception is *expensive* derivation, where `useMemo` is the right tool — still no `setState`, just memoize the derivation.
- Effects are for synchronizing with *external* systems (DOM, network, timers, subscriptions), not for syncing one piece of React state to another.
