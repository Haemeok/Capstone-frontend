---
title: Prefer `??` over `||` for Default Values
prefix: policy
trigger: Writing `x || default` where the intent is "use default when null/undefined".
---

## Symptom
`||` and `??` look interchangeable until the value can legitimately be `0`, `""`, or `false`. Then `||` discards the real value as falsy and substitutes the default, silently. `progress: 0` becomes the default 50. An intentional empty search string becomes the placeholder. A boolean flag explicitly set to `false` reads as if it were unset.

The bug is subtle: tests with non-zero / non-empty fixtures pass, production data shipping the falsy real value silently breaks.

## Recommended pattern
Default to `??`. It triggers only on `null` / `undefined`.

```ts
const progress = status.progress ?? 0;       // 0 stays 0
const query    = searchParams.q ?? "";       // "" stays ""
const isOpen   = props.isOpen ?? defaultOpen; // false stays false
```

Reach for `||` **only when you actually want any falsy value to fall through to the default** — and even then add a comment explaining why:

```ts
// `||` intentional: empty string, 0, and null all mean "no fallback URL"
const fallback = config.fallbackUrl || DEFAULT_URL;
```

## Anti-pattern
```ts
const progress = status.progress || 0;        // 0 → 0 by luck, but intent is wrong
const message  = job.message || "실패";        // legitimate "" message replaced
const count    = props.count || 1;            // count of 0 silently becomes 1
```

Each looks fine in isolation. Each carries a falsy-substitution bug waiting for the right payload.

## Heuristic
- Default to `??`. The only justification for `||` is "I want every falsy value to fall through", and that justification belongs in a comment.
- `grep -nE "\\|\\| " src/` periodically. Every hit should be either (a) a boolean expression (`if (a || b)`), or (b) a defaulting case with a comment.
- When migrating, watch for cases where the falsy substitution was actually the intent — for instance, `count || 1` to skip zero-counts. Those should become explicit: `count > 0 ? count : 1` or similar.
