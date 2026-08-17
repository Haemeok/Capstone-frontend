---
title: Don't Refetch a List to Reflect a Mutation — Patch the Cache
prefix: policy
trigger: A mutation's onSettled/onSuccess calls invalidateQueries on a list the user is currently looking at, especially an infinite list.
---

## Symptom
A list endpoint gets hammered — thousands of short requests in minutes at peak. Each add/remove a user does on a browsable list fires one network request *per loaded page* of that list. With several quick interactions across many users it stampedes.

## Root cause
`invalidateQueries` on an **infinite** query refetches **every currently-loaded page** (each page = one request). So "one mutation" against an active multi-page list = N requests, and N grows the more the user scrolled. High-frequency mutations (toggle add/remove on a browse list) multiply N by the number of clicks.

It hides behind a dead optimistic update: `setQueryData(["things"], …)` written to an **exact** key silently no-ops when the real query key is segmented (`["things", category, q]`) — `getQueryData` misses, the updater gets `undefined`, nothing changes. The screen only updates because of the refetch, so nobody notices the optimistic code does nothing.

## Recommended pattern
Patch the cache in place; refetch only when you must.

```ts
// Membership-invariant change (a flag toggles; item stays in the list):
//   optimistic patch + NO refetch.
queryClient.setQueriesData(
  { queryKey: ["things"] },                 // prefix → reaches every ["things", …] page
  setFlagForIds(new Set([id]), true)
);
queryClient.invalidateQueries({ queryKey: ["things"], refetchType: "none" }); // mark stale, don't refetch now

// Membership-changing change (item must leave/enter the infinite list):
//   patch the visible data, discard stale page boundaries, then refetch page 0.
queryClient.setQueriesData({ queryKey: ["myList"] }, removeIdsAndDecrementTotal(ids));
queryClient.setQueriesData({ queryKey: ["myList"] }, (data) =>
  data
    ? {
        ...data,
        pages: data.pages.slice(0, 1),
        pageParams: data.pageParams.slice(0, 1),
      }
    : data
);
queryClient.invalidateQueries({ queryKey: ["myList"] }); // active query refetches page 0 only
```

- `setQueriesData` (plural, **prefix** match) reaches all matching queries and all their pages — `setQueryData` (singular, **exact**) does not.
- `refetchType: "none"` = mark invalid but don't refetch now; the next natural trigger (remount/focus) refreshes. Decouples "invalidate" from "refetch".
- A key factory (single source of truth) makes the mutation patch the *same* key the list renders — otherwise correctness rides on the caller passing a matching key by hand ("works by accident").

## Anti-pattern
```ts
onMutate: () => queryClient.setQueryData(["things"], patch),       // exact key → no-op on ["things", cat, q]
onSettled: () => queryClient.invalidateQueries({ queryKey: activeListKey }), // refetches all loaded pages, every time
```

## Heuristic
- Membership-invariant (flag) → pure optimistic, `refetchType:"none"`, zero refetch.
- Membership-changing (add/remove) → optimistic edit + count fix, then trim both `pages` and `pageParams` to page 0 before invalidating. Offset pagination can't be perfectly patched client-side, and invalidating an untrimmed infinite query refetches every loaded page rather than one page.
- If your optimistic `onMutate` and your `invalidateQueries` target different keys, one of them is wrong. Both should come from the same key factory.
- A list patched optimistically and invalidated with `refetchType:"none"` will **not** self-correct on mutation **error** either — so it MUST be rolled back. Snapshot in `onMutate` and restore in `onError`. With `setQueriesData` (many queries at once) capture all of them: `const prev = queryClient.getQueriesData({ queryKey })` → on error `prev.forEach(([key, data]) => queryClient.setQueryData(key, data))`. (A list whose `onSettled` uses a *default* refetch self-heals on error and needs no rollback.)
