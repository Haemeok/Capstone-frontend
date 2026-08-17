---
title: Model Every Side-Effect Stage as a Mutation and Expose One Coherent Status
prefix: policy
trigger: A user action prepares or uploads data before a retryable final API request and the hook exposes TanStack mutation state.
---

## Symptom

An upload is running while the hook reports `isPending: false`, or a second attempt exposes impossible combinations such as `status: "success"` with `isError: true`. Retrying the final request may also repeat presigning or uploading files.

## Root cause

Preparation runs before `mutateAsync`, so TanStack cannot observe its pending or error state. Moving preparation inside one retrying mutation fixes the status but makes every retry repeat all earlier side effects. Splitting the stages without composing every status flag leaves consumers with contradictory state from two mutation observers.

## Recommended pattern

Give preparation and the retryable final request separate mutations. Reset both at the start of a new action, retry only the final mutation, and derive `status` plus all four status flags from the same precedence.

```ts
const prepare = useMutation({ mutationFn: prepareUpload, retry: false });
const final = useMutation({ mutationFn: submitKeys, retry: shouldRetryFinal });

const execute = async (draft: Draft) => {
  prepare.reset();
  final.reset();
  const request = await prepare.mutateAsync(draft);
  return final.mutateAsync(request);
};

const isPending = prepare.isPending || final.isPending;
const hasError = prepare.isError || final.isError;
const isError = !isPending && hasError;
const isSuccess = !isPending && !isError && final.isSuccess;
const status = isPending
  ? "pending"
  : isError
    ? "error"
    : isSuccess
      ? "success"
      : "idle";

return {
  execute,
  status,
  isIdle: status === "idle",
  isPending,
  isError,
  isSuccess,
  error: isError ? (prepare.error ?? final.error) : null,
};
```

## Anti-pattern

```ts
const mutation = useMutation({ mutationFn: submitKeys, retry: 3 });

const execute = async (draft: Draft) => {
  const request = await prepareAndUpload(draft); // invisible to mutation state
  return mutation.mutateAsync(request);
};

return {
  ...mutation,
  isPending: prepare.isPending || mutation.isPending,
  // status/isIdle/isSuccess still come from mutation and can contradict isPending.
};
```

Putting `prepareAndUpload` inside the retrying `mutationFn` is also incorrect when preparation creates external side effects: a retry of the final request will presign and upload again.

## Heuristic

- Draw the side-effect stages before choosing mutation boundaries. A stage that must not repeat belongs outside the retry scope but still inside an observable mutation.
- If a hook combines mutation observers, derive `status`, `isIdle`, `isPending`, `isError`, `isSuccess`, and `error` together. Overriding only one flag creates states no single TanStack mutation can produce.
- Start each new action by clearing every stage so an earlier final success cannot survive a later preparation failure.
- Test preparation pending, preparation failure, final retry count, success followed by preparation failure, and reset.
