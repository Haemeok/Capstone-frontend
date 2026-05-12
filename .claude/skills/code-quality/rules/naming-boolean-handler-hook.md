---
title: Booleans, Handlers, Hooks
prefix: naming
trigger: Naming a boolean variable / prop, an event handler, or a custom hook.
---

## Symptom
Free-form naming forces every reader to interpret intent at every call site. `disabled={!enabled}` and `isLoading={!isReady}` and `onClick={openModal}` all work, but the patterns drift; the codebase loses signal density. Negation in boolean names (`isNotDisabled`) is its own crime — the reader parses two negations to decide whether the UI is active.

## Recommended pattern
- **Boolean**: `is*` / `has*` / `can*` / `should*`. Never negative (`isNotDisabled` → `isEnabled`).
  ```ts
  isLoading, hasError, canSubmit, shouldRender
  ```
- **Handler**:
  - `on*` for props (`onClick`, `onSubmit`) — what the parent receives.
  - `handle*` for the function declared inside the component (`handleClick`, `handleSubmit`).
  ```tsx
  function Form({ onSubmit }: Props) {
    const handleSubmit = (e: FormEvent) => { /* ... */; onSubmit(); };
    return <form onSubmit={handleSubmit}>...</form>;
  }
  ```
- **Hook**: `use*`. Singular vs plural matches the result shape.
  ```ts
  useUser(id);    // single user
  useUsers();     // list of users
  ```

## Anti-pattern
```ts
const isNotDisabled = !disabled;             // double negation
function Button({ click }: Props) { /* ... */ }   // not `onClick`
function getUser(id) { return useQuery(/* ... */); } // hook missing `use` prefix
```

## Heuristic
At each name, ask: "what kind of thing is this?" Boolean → prefix. Event source-of-truth (parent) → `on*`. Local handler → `handle*`. React hook → `use*`.
