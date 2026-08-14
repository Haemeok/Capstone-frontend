---
title: Function Verb Conventions — get / fetch / load
prefix: naming
trigger: Naming a function that retrieves a value.
---

## Symptom
A function named `getUser` is ambiguous: is it pure (synchronous from a known store) or does it hit the network? The reader has to open the body to find out. Multiplied across a codebase, this is constant low-grade friction.

## Recommended pattern
- **`get*`** — pure. From memory, arguments, or a synchronous lookup. No async.
  ```ts
  function getRecipeById(state: State, id: string): Recipe | null { /* ... */ }
  ```
- **`fetch*`** — network. Returns a Promise.
  ```ts
  async function fetchRecipe(id: string): Promise<Recipe> { /* ... */ }
  ```
- **`load*`** — resource. Often involves the network but emphasizes "loading a resource" (file, large blob, lazy module).
  ```ts
  async function loadRecipeImage(id: string): Promise<Blob> { /* ... */ }
  ```

## Anti-pattern
```ts
async function getRecipe(id: string) {   // ← async + `get` = misleading
  return await fetch(`/api/recipe/${id}`).then(r => r.json());
}
```

## Heuristic
If the function returns a Promise, its name should not start with `get`. Pick `fetch` or `load`.
