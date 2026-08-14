---
title: Dates and Numbers — Single Library, Explicit Format
prefix: policy
trigger: Constructing a Date, formatting a number, or computing duration / currency.
---

## Symptom
Mixing `dayjs` and `date-fns` in the same project means dual learning curves and dual bundles. Implicit time zones bite when the server is UTC and the client renders KST. Currency via `toFixed(2)` rounds incorrectly for some values (the `0.1 + 0.2` family).

## Recommended pattern
- Pick one date library project-wide. Stay there.
- Time zone is explicit on every construction: `dayjs.tz(input, 'Asia/Seoul')`.
- Currency / large numbers via `Intl.NumberFormat`:

```ts
const won = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
}).format(amount);
```

## Anti-pattern
```ts
new Date(rawString);          // time-zone-dependent parse
amount.toFixed(2);            // float rounding for currency — wrong
import dayjs from 'dayjs';    // alongside date-fns somewhere else
```

## Heuristic
`grep "from 'date-fns'"` and `grep "from 'dayjs'"` — exactly one should match in the codebase.
