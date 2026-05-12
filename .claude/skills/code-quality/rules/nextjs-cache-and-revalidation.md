---
title: Mutation → Revalidate; Request Memoization
prefix: nextjs
trigger: Writing a server action that mutates, or noticing parent/child server components fetching the same URL.
---

## Symptom
A server action commits the mutation, returns success, and the client UI displays the old data because no revalidation was triggered. Or: someone flags duplicate fetches in parent/child server components, not realizing Next deduplicates them automatically within a request.

## Recommended pattern
Every server-side mutation ends with `revalidatePath` or `revalidateTag`:

```ts
'use server';
export async function updateRecipe(id: string, input: Input) {
  const updated = await db.recipe.update({ where: { id }, data: input });
  revalidatePath(`/recipe/${id}`);                  // path-based
  // or:
  revalidateTag('recipe');                          // tag-based (pair with fetch tags)
  return { ok: true, data: updated };
}
```

Same-URL fetches inside the server tree are fine — Request Memoization deduplicates them within a request:

```tsx
// app/recipe/[id]/page.tsx
async function Page({ params }) {
  const recipe = await fetch(`/api/recipe/${params.id}`).then(r => r.json());
  return <RecipeShell><RecipeBody id={params.id} /></RecipeShell>;
}

// inside <RecipeBody>
async function RecipeBody({ id }) {
  const recipe = await fetch(`/api/recipe/${id}`).then(r => r.json());
  // ↑ dedup'd by Request Memoization, not a duplicate request
}
```

Exception: if fetch **options** differ (different headers, different `cache`), dedup breaks. Only then flag.

## Anti-pattern
```ts
'use server';
export async function updateRecipe(id, input) {
  await db.recipe.update({ /* ... */ });
  return { ok: true };  // ← no revalidation; client UI stays stale
}
```

## Heuristic
Server action without `revalidate*` at the end = bug.
Parent + child same fetch = not a bug unless options differ.
