---
title: Locale-Dependent Query Keys and Optimistic Mutations Must Change Together
prefix: policy
trigger: Making a TanStack Query list locale-aware by appending `locale` to its `queryKey`, when a mutation optimistically updates that same list via `getQueryData`/`setQueryData` on a key built from the same factory.
---

## Symptom

After localizing an infinite/list query by adding `locale` to its `queryKey` (so `ja`/`en` data caches separately), the list still shows correct data — but **optimistic add/remove on that list stops appearing**. The item only flips after a network round-trip + refetch, or not at all until navigation. No error, no console warning.

## Root cause

The list now reads from a key like `["fridgeIngredients", category, q, locale]` (4 elements), but the mutation still snapshots and patches the **3-element** key from the factory:

```tsx
const browseKey = INGREDIENT_QUERY_KEYS.browse(category, q); // ["fridgeIngredients", category, q]
queryClient.getQueryData(browseKey); // reads the 3-tuple cache — the list isn't there
queryClient.setQueryData(browseKey, patch); // writes a 3-tuple entry no query observes
```

`getQueryData`/`setQueryData` match the key **exactly** (length + every element). The list's cache lives under the 4-tuple, so the optimistic snapshot/patch target a phantom entry. `invalidateQueries`/`setQueriesData`/`cancelQueries` match by **prefix**, so those keep working — which is why the bug hides: invalidation still fires, only the instant optimistic patch is lost.

## Recommended pattern

Decide per list, by how that key is mutated:

- **List has no exact-match mutation (only prefix `invalidateQueries`, or no mutation at all):** safe to append `locale` to its `queryKey`. Add it where the locale actually varies (e.g. a page that exists under `/ja`·`/en`) so cross-locale cache doesn't collide.
- **List is optimistically patched via exact `setQueryData`/`getQueryData`:** add `locale` to the **factory and the mutation together**. A source-language default preserves omitted-argument calls, not the old key shape. Pass the active locale explicitly from localized consumers:

```tsx
// factory
browse: (category, q, locale: Locale = "ko") =>
  ["fridgeIngredients", category, q, locale] as const,

// mutation
const browseKey = INGREDIENT_QUERY_KEYS.browse(category, q, locale); // same 4-tuple as the list
```

- **Locale-independent response:** omit locale only when the cached response has the same meaning and values across locales. If the response changes with `lang`, separate its cache by locale and update all exact-match consumers. Wiring cost, eventual refetch, or component remount is not an exception. For a shared entity mutation, explicitly update or invalidate the affected locale variants.

## Anti-pattern

- Appending `locale` to a list key and calling it done because "the data looks translated." Optimistic UX on that list is now broken; verify add/remove still flips instantly.
- Assuming a default preserves the old key shape. `browse(cat, q)` now returns a 4-tuple ending in `"ko"`; it does not address the former 3-tuple. Update readers, writers, and SSR prefetch together; an omitted argument is appropriate only for a source-language caller.
- Assuming all cache APIs behave alike: `invalidateQueries`/`setQueriesData`/`cancelQueries` are prefix matches (survive a longer key); `getQueryData`/`setQueryData` are exact matches (break).

## Heuristic

When you add a segment to any `queryKey`, grep that key's factory name (and the bare key literal) across `setQueryData`/`getQueryData` call sites. Update every exact-match read/write in lockstep. Omit locale only for a locale-independent response; do not omit a required cache dimension to avoid updating consumers. The tell is "the list translates correctly but optimistic add/remove went dead on it."

Related: localizing chrome doesn't localize the fetch — plumb locale through key + fetch params together ([[policy-i18n-chrome-vs-content-axes]]); and the SSR/client keys must still byte-match after adding the segment ([[policy-ssr-client-query-key-parity]]).
