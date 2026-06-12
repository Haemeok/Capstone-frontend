---
title: SSR Prefetch Query Key Must Byte-Match the Client Hook's Computed Key
prefix: policy
trigger: Adding a server page that `prefetchInfiniteQuery`/`prefetchQuery` + `dehydrate`s data a client hook will read via the same query key.
---

## Symptom

A new server page prefetches search/list data and `dehydrate`s it, but the client renders empty and immediately refetches on mount — the SSR'd data is in the cache, just under a key the client never looks up. No error, no warning; it silently degrades from SSR-hydrated to CSR-on-mount.

## Root cause

TanStack Query hydration matches by **structural equality of the query key**. If the server builds the key by hand and the client builds it from a hook (`useXxxSnapshot`), any divergence — element order, a missing slot, or a _default value the client computes that the server hardcoded differently_ — makes them two distinct cache entries. The trap is the defaults: the client key often runs values through codecs and parsers whose "empty" output is **not** what you'd guess.

## Recommended pattern

Import the same key-builder both sides use, and reproduce the client's defaults by reading the actual hook/codec code — not by guessing.

```ts
// ❌ hand-built SSR key guessing the defaults
const key = ["recipes", null, params.sort ?? "", "", q, "{}", "", "", "", "ja"];

// ✅ reproduce the client's exact slot values
//   - sortCodec.decode(null)  → "인기순" → encode → "popularityScore,DESC"  (NOT null, NOT "")
//   - parseTypes(undefined)   → ["USER","AI","YOUTUBE"]  (NOT [])
const base = buildClientBaseKey({
  q,
  sort: sortCodec.encode(sortCodec.decode(params.sort ?? null)),
  types: parseTypes(params) /* default-filled */,
});
const key = buildSearchQueryKey(base, "ja"); // same helper the hook calls
```

## Anti-pattern

- Assuming an unset filter serializes to `""`, `null`, or `[]`. Codec round-trips and parser defaults frequently produce a non-empty canonical value (a default sort code, a default type set). Verify by reading the codec/parser, not by intuition.
- Two independent key literals — one in the page, one in the hook. They will drift. Share one exported `buildKey` function and feed both from the same default-resolution logic.

## Heuristic

After wiring SSR prefetch, dump the server key and the client hook's key for the empty-filter case and assert they're `toEqual`. If you can't make that assertion pass without reading the client's codec defaults, you haven't matched them yet — you've guessed.
