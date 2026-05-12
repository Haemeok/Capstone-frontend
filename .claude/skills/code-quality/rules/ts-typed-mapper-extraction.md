---
title: Extract Inline Object Literals into Typed Mappers
prefix: ts
trigger: An inline object literal is built from another typed source and consumed by a typed sink, but never assigned through an explicitly-typed return.
---

## Symptom
TypeScript's excess-property check is stricter than its structural-assignability check. The strict version fires only on **direct** assignment of a fresh literal to a typed slot. Build the literal through a `const`, a `&&` short-circuit, or a JSX prop, and TS falls back to structural matching — which lets a typo'd field, a renamed field, or a field that no longer exists pass through unnoticed.

Real example from this repo: a mapper inside a component built `{ ..., isYoutube: true, ... }` while the consumer's type had **no** `isYoutube` field (the canonical shape is `source: "YOUTUBE"`). For months the dead field shipped, the YouTube marker silently didn't render, and the compiler had nothing to say.

## Recommended pattern
Pull the mapping into a named function with an explicit return-type annotation. The annotation turns the structural check into a strict one — extra and misspelled fields surface immediately.

```ts
// model/duplicateRecipeMapper.ts
import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";
import type { Recipe } from "@/entities/recipe/model/types";

export const toDetailedRecipeItem = (
  recipe: Recipe,
  youtubeMeta?: YoutubeMeta,
): DetailedRecipeGridItem => ({
  id: recipe.id,
  title: recipe.title,
  // ...
  source: youtubeMeta ? "YOUTUBE" : recipe.source,
  // `isYoutube: true` ← TS would reject this here
});
```

```tsx
// consumer site stays tiny
const item = recipe ? toDetailedRecipeItem(recipe, meta) : null;
return item ? <DetailedRecipeGridItem recipe={item} /> : null;
```

Bonus: the helper is now unit-testable without rendering anything.

## Anti-pattern
```tsx
function Page({ recipe, meta }: Props) {
  const item = recipe && {
    id: recipe.id,
    title: recipe.title,
    // ...
    isYoutube: true,            // ← typo / dead field passes
  };
  return <DetailedRecipeGridItem recipe={item} />;
}
```

The literal isn't directly assigned to `DetailedRecipeGridItem`. It flows through `&&`, then through a JSX prop. Structural match accepts it, the unknown `isYoutube` rides along, the consumer never reads it, and the bug ships.

## Heuristic
- The moment you write an inline `recipe && { ... }` or `{ a: x.a, b: x.b, ... }` mapping that fans out beyond ~4 fields, lift it into a named function with `: TargetType` on the return.
- Any time you rename a field on a domain type, grep for old inline literals that still build it — they won't compile-error on the rename until you extract.
- Mapper files belong next to the slice that needs the shape (`model/<feature>Mapper.ts`), not in the entity layer.
