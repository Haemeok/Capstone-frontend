---
title: Fields Optional on Write Come Back Null on Read — Normalize at the Fetch Boundary
prefix: ts
trigger: Typing an API response from a handoff doc / sample payload, especially when the write side (POST/PATCH) has optional fields.
---

## Symptom

Production crash (`Cannot read properties of null (reading 'trim')`) deep in UI/aggregation code, on a field the frontend typed as `string` because every sample payload in the handoff doc showed a string.

## Root cause

Sample payloads are **happy-path examples, not a nullability contract**. Any field that is optional on the write side (`quantity?: string` on POST) gets stored as `NULL` when omitted — and comes back as `null` on every read. The frontend types said `string`, so no consumer guarded, and the first null reached `.trim()` at runtime. tsc is green the whole time because the lie is at the boundary.

## Recommended pattern

Type the wire shape honestly and normalize **once** at the fetch function, so every consumer keeps a single invariant.

```ts
type RawItem = Omit<Item, "quantity" | "unit"> & {
  quantity: string | null;
  unit: string | null;
};

const normalizeItem = (item: RawItem): Item => ({
  ...item,
  quantity: item.quantity ?? "",
  unit: item.unit ?? "",
});

export const getList = async (): Promise<ListResponse> => {
  const raw = await api.get<RawListResponse>(ENDPOINT);
  return { ...raw, items: raw.items.map(normalizeItem) };
};
```

Key points:

- Heuristic: **write-optional ⇒ read-nullable.** For every `field?:` in a request type, assume `field: T | null` in the response until the OpenAPI spec (not a doc example) proves otherwise.
- Normalize at the boundary, not in consumers — one `?? ""` at the fetch beats null-guards scattered through UI, transforms, and tests.
- The UI still needs an intentional empty-state (e.g. a "값이 없어요 · 다시 담아주세요" label), because normalization makes the value renderable, not meaningful.
- If the server was _expected_ to fill the omitted field (fallback to a source value) and returns null instead, that's a backend gap — report it, but ship the boundary guard anyway.

## Anti-pattern

```ts
export type Item = { quantity: string; unit: string }; // copied from the doc's sample JSON
const total = items.reduce((sum, i) => sum + Number(i.quantity.trim()), 0); // 💥 null.trim()
```
