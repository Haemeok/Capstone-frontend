---
title: Adding Locale to a List Query Key Silently Breaks Exact-Match Optimistic Mutations — Thread Locale Through the Mutation Too, or Don't Add It There
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
- **List is optimistically patched via exact `setQueryData`/`getQueryData`:** add `locale` to the **factory and the mutation together**, defaulting to the source language so existing call sites and tests stay byte-identical:

```tsx
// factory
browse: (category, q, locale: Locale = "ko") =>
  ["fridgeIngredients", category, q, locale] as const,

// mutation
const browseKey = INGREDIENT_QUERY_KEYS.browse(category, q, locale); // same 4-tuple as the list
```

- **Not worth threading locale through the mutation:** leave the key bare and only pass `lang` to the fetch fn. Bare-key (cross-locale cache sharing) is acceptable when **either** locale can't change without a remount, **or** the only resulting glitch is cosmetic and self-healing. Weigh the actual failure: with a language switcher, the worst case is "switch language, revisit the same list within `staleTime` → old-language data shown briefly," which any later refetch/`invalidateQueries` (e.g. the next add/remove) corrects. Localized text going momentarily stale is not worth an asymmetric per-list rule plus wiring locale through every optimistic mutation — prefer one uniform rule (locale in the fetch param, never in the key) unless the stale data is correctness/security/billing-sensitive.

## Anti-pattern

- Appending `locale` to a list key and calling it done because "the data looks translated." Optimistic UX on that list is now broken; verify add/remove still flips instantly.
- Threading `locale` into the factory without a default — every existing call site and test that called `browse(cat, q)` now mismatches the new 4-tuple. Default to the source language so untouched callers resolve to the old key shape.
- Assuming all cache APIs behave alike: `invalidateQueries`/`setQueriesData`/`cancelQueries` are prefix matches (survive a longer key); `getQueryData`/`setQueryData` are exact matches (break).

## Heuristic

When you add a segment to any `queryKey`, grep that key's factory name (and the bare key literal) across `setQueryData`/`getQueryData` call sites. Every exact-match read/write must be updated in lockstep — or the key segment must not be added there. The tell is "the list translates correctly but optimistic add/remove went dead on it."

Related: localizing chrome doesn't localize the fetch — plumb locale through key + fetch params together ([[policy-i18n-chrome-vs-content-axes]]); and the SSR/client keys must still byte-match after adding the segment ([[policy-ssr-client-query-key-parity]]).
