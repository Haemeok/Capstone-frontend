---
title: Rule of Three (extraction threshold)
prefix: size
trigger: You're about to extract a helper function, custom hook, or shared component to remove duplication.
---

## Symptom
Premature abstraction looks like cleanup but is its own debt. Two similar code blocks often look alike *by coincidence* — they're solving adjacent problems, not the same problem. Extract too early and the abstraction either bends out of shape when the third caller arrives (forcing more parameters / branches) or rots when one of the two callers diverges and silently no longer fits. Reviewers also pay a cognitive tax: now they hop to a shared module to understand what was previously inline.

## Recommended pattern
- **1 occurrence** — keep inline.
- **2 occurrences** — keep inline. Maybe note "watch for a third."
- **3+ occurrences** — extract. By the third, the *shape* of the duplication is real, not coincidental.

Special-case allowed extractions even at 2 occurrences:
- Identical block **within a single function/hook** (immediate cohesion gain, no cross-module hop).
- The duplicated block is itself a known primitive (storage I/O, URL build, query key tuple) that belongs in `shared/` regardless of count.
- The duplicated block embeds a **policy decision** (retry count, cache TTL, error code mapping) that must stay in lockstep — extract so it lives in one place.

```ts
// Before: 2 mutations with similar invalidation. KEEP INLINE.
export const useMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list });
      qc.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread });
    },
  });
};
export const useMarkAllRead = () => { /* same two invalidates */ };

// After a 3rd mutation arrives → NOW extract.
const invalidateNotificationCaches = (qc: QueryClient) => {
  qc.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list });
  qc.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread });
};
```

## Anti-pattern
Extracting `useGenericMutation<TInput, TOutput>` after the second mutation. The abstraction now needs five generic parameters, two callbacks, and a config object — and the third caller still doesn't fit, so you add a fourth option. The original two would have been ~10 lines each; the "DRY" version is 80 lines plus the callsites. Net cost up, clarity down.

Also bad: extracting two near-identical render branches into a `<GenericThing>` with a `mode` prop. By the third mode you have a `switch` inside a component you can't grow.

## Heuristic
Before extracting, count:

1. How many call sites today? (1, 2, or 3+)
2. Do they all use the same code path, or do they share *most* of it with small differences?
3. If you delete the shared abstraction, would each caller's inline version stay essentially identical, or would they each grow their own variation?

If (1) < 3 and you can't point to a special-case rule above — leave inline. Add a `// TODO: extract on 3rd occurrence` comment only if the pattern is genuinely policy-bearing.

The line "*Three similar lines is better than a premature abstraction*" in the root system prompt is this rule restated. Use the count, not the smell of duplication, as the trigger.
