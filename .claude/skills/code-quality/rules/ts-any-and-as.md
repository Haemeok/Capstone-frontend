---
title: any Banned; as Justified
prefix: ts
trigger: Writing `: any`, `as Something`, or `as unknown as Something`.
---

## Symptom
`any` is a type-system opt-out. Every value that touches it pollutes downstream types and disables every safety check from that point. `as` casts silently lie: the runtime value may not be what TypeScript now believes, and the next bug travels with no warning.

## Recommended pattern
- **`any`**: unconditionally banned. There is no PR rationale that survives review.
- **`as`**: allowed in narrow cases, each requiring a one-line comment explaining why:
  ```ts
  // `as` permitted: Object.keys widens to string[]; the runtime invariant
  // is that this object's keys are exactly Status values.
  const statuses = Object.keys(STATUS_LABELS) as Status[];

  // `as` permitted: zod validates the shape at runtime; TS cannot infer this.
  const parsed = JSON.parse(raw) as RecipeDraft;
  RecipeDraftSchema.parse(parsed);

  // `as` permitted: third-party type definition is incomplete.
  (window as Window & { gtag?: GTag }).gtag?.('event', /* ... */);
  ```
- **`unknown`**: preferred over `any` for "I don't know yet." Narrow before use.

## Anti-pattern
```ts
function handle(payload: any) { /* ... */ }       // banned outright
const x = result as RecipeDraft;                  // no justification comment → reject
const y = result as unknown as RecipeDraft;       // double-cast — same issue, sneakier
```

## Heuristic
- `grep ": any"` and `grep "as "` should both return zero unjustified hits.
- Permitted `as` reasons in this project: `Object.keys` / `Object.entries` narrowing, `JSON.parse` + runtime validation, narrowing beyond TS reach, third-party type gaps.
