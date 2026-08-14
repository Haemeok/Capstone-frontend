---
title: 'use client' at the Lowest Point; Server → Client Data Flow
prefix: nextjs
trigger: Adding `'use client'` to a file, or fetching the same data on both server and client.
---

## Symptom
`'use client'` placed on a page or layout cascades the entire subtree into client rendering — paying SSR for nothing. Or: the server fetches data, the client component refetches it on mount, doubling network calls and producing flicker.

## Recommended pattern
- `'use client'` lives on the smallest component that needs interactivity. Pages and layouts stay server.
- Server-fetched data passes to client components via props, or hydrates TanStack Query through `initialData`:

```tsx
// app/recipe/[id]/page.tsx — server component
async function RecipePage({ params }) {
  const initial = await getRecipe(params.id);
  return <RecipeDetailClient initial={initial} id={params.id} />;
}

// RecipeDetailClient.tsx
'use client';
function RecipeDetailClient({ id, initial }) {
  const { data } = useQuery({
    queryKey: ['recipe', 'detail', id],
    queryFn: () => fetchRecipe(id),
    initialData: initial,  // ← hydrates from SSR; no refetch on mount
  });
  // ...
}
```

## Anti-pattern
```tsx
// app/recipe/[id]/page.tsx
'use client';                  // ← the entire route is client now
export default function Page() {
  const { data } = useQuery({ /* ... */ });  // refetches what the server could have given
}
```

## Heuristic
If you wrote `'use client'`, ask: "could the parent stay server?" Move the directive down the tree until it stops compiling, then one level back up.
If two layers fetch the same URL and one is server, the client one should use `initialData`.
