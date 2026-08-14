---
title: Assert Optimistic UI While the Mutation Is Still Pending — Use a Deferred Promise
prefix: test
trigger: Writing or fixing a test for a TanStack Query optimistic update (onMutate cache patch) where the assertion flakes or sees the pre-mutation value.
---

## Symptom

A test for an optimistic update (row disappears immediately on delete, value updates before the server confirms) is flaky or red: at assertion time the UI shows the **original** fixture value again, even though the optimistic patch code is correct.

## Root cause

The mutation mock resolves immediately (`mockResolvedValue`). The mutation's `onSettled` then runs `invalidateQueries` → the (also mocked) fetch refetches and returns the **original fixture** → the optimistic cache patch is overwritten before `waitFor` samples the DOM. The test is racing the reconciliation it triggered, so it can't distinguish "optimistic update works" from "refetch happened to win".

## Recommended pattern

Keep the mutation **pending** while asserting; resolve it only at the end to let cleanup run.

```tsx
let resolveMutation: (() => void) | undefined;
deleteMock.mockImplementation(
  () =>
    new Promise<void>((resolve) => {
      resolveMutation = resolve;
    })
);

await userEvent.click(screen.getByRole("button", { name: "Item 삭제" }));

// Mutation unresolved → onSettled/invalidate hasn't fired → DOM shows the optimistic state.
await waitFor(() => {
  expect(deleteMock).toHaveBeenCalledWith("id1");
  expect(screen.queryByText("Item")).not.toBeInTheDocument();
});

await act(async () => {
  resolveMutation?.();
}); // settle before unmount — avoids act warnings
```

Key points:

- The deferred promise makes the assertion window deterministic: the only state the DOM can be in is the optimistic one.
- If instead you want to test **reconciliation**, mock the refetch to return the post-mutation shape — never fix the race by delaying production code (see `test-no-production-timing-hacks`).
- Symmetric trap for rollbacks: to assert rollback UI, reject the deferred promise while watching the DOM.

## Anti-pattern

```tsx
deleteMock.mockResolvedValue(undefined); // settles instantly
await userEvent.click(deleteButton);
expect(screen.queryByText("Item")).not.toBeInTheDocument();
// ↑ passes or fails depending on whether invalidate→refetch (fixture!) beat the assertion.
```
