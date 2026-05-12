---
title: No Non-Null Assertion; Discriminated Unions
prefix: ts
trigger: Writing `x!`, or modeling a value with several optional fields that should have been a union.
---

## Symptom
Non-null `!` is a runtime lie. The compiler asks "are you sure?" and you reply "yes" without checking. Production finds the null and crashes. Separately: unions modeled as "everything optional" force every consumer to null-check every field independently, when a discriminated union would have made the relationships visible.

## Recommended pattern
- **Optional chaining** or **explicit check**, never `!`.
  ```ts
  user?.profile?.email;    // OK
  if (!user) return null;  // explicit narrow
  user.profile.email;      // now non-null without `!`
  ```
- **Discriminated unions** over flat optionals.
  ```ts
  type AsyncState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };

  // Consumer switches on `status`; TS narrows the rest.
  if (state.status === 'success') {
    state.data;  // ← typed
  }
  ```

## Anti-pattern
```ts
const email = user!.profile!.email;   // ← banned

type AsyncState<T> = {
  isLoading?: boolean;
  isError?: boolean;
  data?: T;
  error?: Error;   // ← every consumer must null-check four fields
};
```

## Heuristic
- `grep "!\." src/` and `grep "!;" src/` — any hit needs review.
- If a type has ≥3 optional fields whose presence is correlated, model it as a discriminated union.
