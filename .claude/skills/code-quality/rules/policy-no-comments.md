# No code comments

## Symptom

Prose comments explaining WHAT the code does, WHY it changed, what alternative
was tried, or which library quirk forced a workaround. These rot, duplicate the
identifier's intent, and bury the change rationale where `git log` can't find it.

## Recommended pattern

```ts
const expiredTokens = tokens.filter((t) => t.expiresAt < now);
```

WHAT is carried by names (`expiredTokens`, not `// filter expired`). WHY,
incident history, tried alternatives, and library quirks go in the **commit
message body**, not the source.

## Anti-pattern

```ts
// filter out the tokens that already expired (see incident 2026-05, the SDK
// returns stale entries because refresh is lazy)
const result = tokens.filter((t) => t.expiresAt < now);
```

## Heuristic

Banned everywhere in code. Exactly two allowed comments, both mechanical markers
forced by other rules:

- a one-line reason next to an `as` cast (`ts-any-and-as`)
- a one-line intent note on a `||` default fallthrough (`policy-nullish-coalescing`)

Shared docs (`CLAUDE.md`, `docs/`, `SKILL.md`) are not code — this rule does not
apply to them.
