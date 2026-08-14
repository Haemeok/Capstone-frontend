---
title: Static Default; Recognize Dynamic Triggers
prefix: nextjs
trigger: A page renders unexpectedly slowly, or someone reaches for `force-dynamic`.
---

## Symptom
Pages get forced to dynamic by reflex (`export const dynamic = 'force-dynamic'`) when natural use of `searchParams` or `cookies()` would have achieved the same dynamism without surrendering the framework's automatic inference. Or: pages intended to be static silently opt into dynamic because `cookies()` was called for an analytics nice-to-have.

## Recommended pattern
Static is default. Dynamic is invoked **only** when one of these appears:

- `cookies()` · `headers()` · `searchParams`
- `noStore()` · `fetch({ cache: 'no-store' })`
- `export const dynamic = 'force-dynamic'`

`force-dynamic` is the last resort, not the first. If the page already uses `searchParams`, it is already dynamic — no flag needed.

## Anti-pattern
```ts
export const dynamic = 'force-dynamic';  // ← was the route already dynamic via searchParams?
```

```ts
// "let me log the user-agent" → triggers dynamic for the whole route
const ua = (await headers()).get('user-agent');
```

## Heuristic
Before writing `force-dynamic`, list the dynamic triggers already in the file. If any are present, drop the flag.
Before calling `headers()` / `cookies()` in a static-looking page, decide consciously: I am paying for dynamic rendering on every request because I need this value.
