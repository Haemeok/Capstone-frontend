---
title: Match TanStack Query queryKey Shape Between SSR Prefetch and Client Hook
impact: HIGH
impactDescription: silent SSR cache miss doubles requests
tags: client, tanstack-query, ssr, hydration, data-fetching
---

## Match TanStack Query queryKey Shape Between SSR Prefetch and Client Hook

When a Next.js server component prefetches via `queryClient.prefetchInfiniteQuery` / `prefetchQuery` and dehydrates into `<HydrationBoundary>`, the client hook (`useInfiniteQuery` / `useQuery`) must build a queryKey that is **byte-identical** to the server's. TanStack Query's cache lookup is a deep-equality check on the queryKey array — any drift (a CSV vs an array, a `null` vs a `string`, a missing slot, a different join separator) puts the client in a different cache slot. The hydrated data sits unused and the client immediately refetches. The bug is invisible: hydration "succeeds", the UI renders, but the network tab shows a duplicate first-page request. Type narrowing during a refactor is a common trigger because TypeScript happily accepts a narrower shape that still compiles.

**Incorrect — client narrows the queryKey shape during a hook split:**

```tsx
// Server (app/.../page.tsx)
const queryKey = [
  "items",
  category,                // string | null
  sort,                    // string
  tags.join(","),          // CSV
  JSON.stringify(filters),
] as const;

await queryClient.prefetchInfiniteQuery({ queryKey, queryFn, ... });

// Client (refactored hook)
type Snapshot = {
  queryKey: readonly [
    "items",
    string,          // narrowed from string | null
    string,
    string,
    string,
  ];
};
const queryKey = ["items", category ?? "", sort, tagsArr, filtersObj] as const;
//                          ^^^^^^^^^^^^^      ^^^^^^^   ^^^^^^^^^^
//                          coerced to ""      raw array  raw object
```

The client's `queryKey` looks "the same" — same length, same intent — but every position diverges:
1. `null` was coerced to `""`, so the `category` slot doesn't match.
2. `tags.join(",")` was kept as an array, so position 3 stringifies differently.
3. `JSON.stringify(filters)` was replaced with the raw object, so position 4 is structurally different.

TanStack Query stores the cache under the server's serialized form; the client's deepEqual lookup misses, the dehydrated data is ignored, and the page silently refetches.

**Correct — preserve every serialization decision verbatim:**

```tsx
// Snapshot hook owns the canonical shape; both sides use the SAME construction.
export const useFilterSnapshot = () => {
  const category = useCategory();        // string | null — keep nullable
  const sort = useSort();
  const tags = useTags();
  const filters = useFilters();

  const queryKey = [
    "items",
    category,                            // string | null, NOT coerced
    sort,
    tags.join(","),                      // CSV, matching server
    JSON.stringify(filters),             // stringified, matching server
  ] as const;

  return { queryKey, /* ... */ };
};
```

Key points:

- **The queryKey shape is a wire format.** Treat it like an API contract between server and client. Document the serialization choice (CSV vs array, JSON vs object) once, and use the same construction on both sides — ideally by importing a shared helper, or at minimum by having a comment in both files pointing at each other.
- **TypeScript will not save you.** Both `string` and `string | null` satisfy `string | null`, both `string[]` and `string` are valid generic params for TanStack Query's queryKey. The compiler accepts narrowing that breaks runtime cache equality.
- **Detect the bug in the network tab, not in the UI.** The page renders fine on hydration; only a duplicate XHR for the first page reveals the miss. After any SSR-prefetched query refactor, open DevTools Network and confirm no client request fires for already-prefetched data.
- **When refactoring, don't "normalize" the shape.** If the original built `tags.join(",")` and you think `tags` (raw array) reads cleaner, you must change BOTH sides in the same commit, or the SSR prefetch goes dark.
- **Heuristic for code review:** any change that touches a queryKey on one side of the SSR boundary without touching the other side is suspect. Flag it.

Reference: [TanStack Query — SSR + Next.js App Router](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
