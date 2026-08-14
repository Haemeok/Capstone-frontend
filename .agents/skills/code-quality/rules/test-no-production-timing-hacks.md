---
title: Never Change Production Timing to Make a Test Pass — Fix the Fixture
prefix: test
trigger: A hook/mutation test only goes green after you add a setTimeout/delay to production, or after you tweak when production fires a refetch/effect.
---

## Symptom
A test for an optimistic mutation flakes or fails. It starts passing only once production `onSettled` wraps its reconciling `invalidateQueries` in `setTimeout(…, 100)` (or some other artificial delay). The product gained a 100ms lag for no user-facing reason.

## Root cause
The test asserts the **optimistic** state (item removed, count decremented), but strategy-A code also fires a reconciling **refetch** — and the test's mock returns the **pre-mutation** page on that refetch. The refetch lands and clobbers the optimistic state back to "before". Delaying the production refetch just lets the assertion sneak in first. The bug is the fixture (mock returns stale data), not production timing.

## Recommended pattern
Make the mock return what the **server would actually return after the mutation**, so optimistic state and refetch result agree — then timing is irrelevant.

```ts
// Mock reflects the post-delete server state on refetch:
const makeListQueryFn = () => {
  let calls = 0;
  return jest.fn(async () => {
    calls += 1;
    return calls === 1 ? pageWithItem() : pageWithItemRemoved(); // server after delete
  });
};
// Optimistic (immediate) AND refetch (reconciled) both show the item gone → assertion holds regardless of order.
```

Production keeps firing the refetch immediately:

```ts
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ["myList"] }); // no setTimeout — reconcile now
},
```

## Anti-pattern
```ts
onSettled: () => {
  setTimeout(() => queryClient.invalidateQueries({ queryKey: ["myList"] }), 100); // delaying refetch so the optimistic assertion wins the race
},
```

## Heuristic
- If a green test requires editing **production** timing/order, stop: the test's fixture or seam is wrong. Fix the test, not the app.
- Optimistic-update tests that also reconcile: mock the **reconciled** server response, not the original. Then assert the converged state; don't race the refetch.
- This is a review gate: when an implementer reports "had to add a delay/timeout for the test", treat it as a rejected change, not a clever fix.
