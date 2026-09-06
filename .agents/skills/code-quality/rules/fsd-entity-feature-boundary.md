---
title: Entity vs Feature Boundary
prefix: fsd
trigger: Adding a mutation, or noticing one inside `entities/`.
---

## Symptom
Mutations leaking into `entities/` blurs the layer's purpose. The entity slice becomes an "everything about this domain" bag; features lose their reason to exist; the dependency direction reverses (feature has to import entity hooks instead of entity data + presentation).

## Recommended pattern
- **Entity**: data + presentation only. Read queries (`useRecipe(id)`, `RecipeCard`). No mutations.
- **Feature**: one user action per slice. Mutations live here, but are not required: search, filtering, and local state interactions can also be features. Names follow verb-noun (`recipe-create`, `comment-like`).

```ts
// entities/recipe/model/api.ts — read only
export const useRecipe = (id: string) =>
  useQuery({ queryKey: ['recipe', 'detail', id], /* ... */ });

// features/recipe-create/model/api.ts — mutation lives here
export const useCreateRecipe = () =>
  useMutation({ mutationFn: createRecipe, /* ... */ });
```

## Anti-pattern
```ts
// entities/recipe/model/api.ts
export const useRecipe = (id: string) => useQuery({ /* ... */ });
export const useUpdateRecipe = () => useMutation({ /* ... */ });  // ← belongs in a feature
export const useDeleteRecipe = () => useMutation({ /* ... */ });  // ← belongs in a feature
```

## Heuristic
Scanning a slice's `model/api.ts`: a `useMutation` in `entities/` needs feature ownership. The reverse does not follow: absence of `useMutation` says nothing about feature ownership. Identify the user action first. Pure presentation follows [component placement](fsd-layer-routing.md).
