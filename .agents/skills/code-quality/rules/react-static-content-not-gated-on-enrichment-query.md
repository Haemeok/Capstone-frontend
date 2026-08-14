---
title: Render Already-Available Content Immediately — Don't Gate It on a Secondary Enrichment Query
prefix: react
trigger: A component receives data via props or SSR/prefetch, but also runs a second query for cosmetic enrichment (favorite state, badges, presence) and feeds that query's isLoading into the content render gate.
---

## Symptom

A list/section that _already has its data_ (passed as props, or server-prefetched) flashes a skeleton on every load before the real content appears — defeating the whole point of fetching on the server. SSR renders the skeleton too, so it's a visible flicker + layout shift on first paint, not just a client blip.

## Root cause

The render is gated on a **secondary enrichment query's** `isLoading`, not on the availability of the primary content. The enrichment query (favorite status, per-item badges, view counts) has no `initialData`/`placeholderData`, so on the first client render its status is `pending` → `isLoading === true`. Passing that flag into `if (isLoading) return <Skeleton/>` hides content that is already in hand. The enrichment is cosmetic — it should paint _onto_ the content when it arrives, never block the content from existing.

## Recommended pattern

Render the primary content with `isLoading={false}` (you have it). Let the enrichment query resolve in the background and update only its own slice (the heart icon, the badge) when it lands.

```tsx
const Section = ({ items }: { items: Item[] }) => {
  // enrichment only — its loading state must NOT gate the render
  const { data: status } = useEnrichmentQuery(items.map((i) => i.id));

  const enriched = items.map((i) => ({
    ...i,
    isFavorite: status?.[i.id]?.isFavorite ?? false, // default now, fill in later
  }));

  return <List items={enriched} isLoading={false} />;
};
```

## Anti-pattern

```tsx
const Section = ({ items }: { items: Item[] }) => {
  // ❌ enrichment query's isLoading drives the content gate
  const { data: status, isLoading } = useEnrichmentQuery(
    items.map((i) => i.id)
  );
  if (isLoading) return <Skeleton />; // items already exist — this is a flash
  // ...
};
```

## Heuristic

- A loading flag should reflect the absence of the **primary** data only. If you can already render meaningful content, no query's `isLoading` may hide it.
- When you see `isLoading` come from a query whose result is merged in with `?? defaultValue`, that query is enrichment — give it a non-blocking default, don't gate on it.
- Server-prefetched/`initialData` content that still skeletons on mount is the tell: trace which `isLoading` reaches the gate and confirm it belongs to the content fetch, not an enrichment fetch.
