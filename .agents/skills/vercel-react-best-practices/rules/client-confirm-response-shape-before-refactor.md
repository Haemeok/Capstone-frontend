---
title: Instrument the Fetcher Boundary to Confirm Backend Response Shape Before Refactoring Types
impact: HIGH
impactDescription: prevents typed code from silently lagging the actual API
tags: client, api, typescript, data-fetching, migration
---

## Instrument the Fetcher Boundary to Confirm Backend Response Shape Before Refactoring Types

When a backend evolves an API field — for example a boolean `private` flag becoming a `visibility: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED'` enum — the frontend can keep compiling against the legacy shape indefinitely. TypeScript only sees what the type declares; new fields that the backend has added are invisible, so no compile error signals that the contract has moved. Worse, if you respond to a "I think the API changed" hunch by updating the type first, you end up theorizing about a shape that is already concrete on the wire and may guess wrong about field names, casing, or values (`'PRIVATE'` vs `'private'`, `boolean` vs `string`). The first move when contract drift is suspected is not to refactor types; it is to **observe** what the server is actually sending, at the boundary where the response enters your app.

**Incorrect — refactor types from a hypothesis, then chase compile errors:**

```ts
// You heard the backend added a `visibility` enum. You guess the shape:
export type Resource = {
  // ...
  visibility: "public" | "private"; // wrong case AND wrong scope
};

// Then you migrate consumers:
if (resource.visibility === "private") return notFound();
// → never matches; backend actually sends "PRIVATE", and a third value
//   "RESTRICTED" exists that this branch doesn't handle.
```

The compiler is happy. The bug surfaces in production: every private resource appears public because the equality check never matches the real server values. You spend the next iteration debugging your own guess instead of the actual contract.

**Correct — log the raw response at the fetcher boundary, then refactor from data:**

```ts
// Server fetcher: capture the parsed body once before returning.
const data = await res.json();
const raw = data as Record<string, unknown>;
console.log("[diag:resource]", {
  id,
  keys: Object.keys(raw),
  candidates: {
    legacyFlag: raw.legacyFlag,
    newField: raw.newField,
    altName: raw.altName,
  },
});
return data;
```

```tsx
// Client list: a one-shot useEffect on the first row is enough.
useEffect(() => {
  if (items.length === 0) return;
  const first = items[0] as unknown as Record<string, unknown>;
  console.log("[diag:list]", {
    keys: Object.keys(first),
    legacyFlag: first.legacyFlag,
    newField: first.newField,
  });
}, [items]);
```

Run the app once, read the console: now you know the exact field names, exact casing, and whether the backend is shipping both the legacy and new fields during a transition. **Then** refactor types and consumers from observed reality. Remove the diagnostic log in the same PR that completes the migration so it does not survive past its purpose.

Key points:

- **TypeScript only narrates what the type declares.** Fields that exist on the wire but not in the type are silent. Compile success ≠ type accuracy. When the API has changed, the existing type is a stale theory until proven otherwise.
- **Refactor from data, not from documentation.** Swagger references and migration notes are aspirational — the wire is authoritative. Logging `Object.keys(raw)` plus each candidate field resolves the contract in one round trip; that is faster and more reliable than reading docs and guessing.
- **Log at the fetcher boundary, not at the leaf consumer.** A `console.log` inside a presentational component reflects whatever its parent passed, not what the server sent. If the two diverge you have a separate bug; either way the boundary is the right place to start because it isolates "did the API change?" from "did our mapping break?".
- **After confirming, pick one source of truth.** If the backend ships both the legacy and the new field during a transition window, do not keep dual-fallback logic (`new ?? legacy`) in production code — it lets the two values drift without anyone noticing which side is correct. Delete the legacy field from your types, branch on the new field only, and treat the migration as finished. Two parallel signals are technical debt that grows silently.
- **Heuristic for code review:** any PR that introduces a comparison between two fields that "should" mean the same thing is suspect. Ask whether both are still being shipped, when the legacy field will be removed, and require a single signal in the merged code.
