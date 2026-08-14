---
title: Test Invariants, Not Tuning Constants
prefix: test
trigger: A test asserts exact values that mirror a lookup table, curve, or other constant a designer/PM could retune without anything being "wrong".
---

## Symptom
`progress.ts:5` holds a UX curve: `[{5,10},{15,25},{40,45},{90,65},{150,85},{210,95}]`. `progress.test.ts` reads it straight back — `:11` "5초에 10%", `:15` "15초에 25%", `:19` "40초에 45%", and so on. These numbers are not a requirement; they're an arbitrary feel-good curve. Tune it to feel a touch faster and seven tests turn red while nothing actually broke. That's the textbook change-detector: it fails on legitimate change and catches no real bug.

## Recommended pattern
Pin the **invariants** the behavior must hold regardless of the exact constants, plus the **algorithm** (not the table). The same file already does this well:

```ts
// invariants — survive any curve retune
it("단조 증가", ...)                    // progress never decreases (:66)
it("어떤 시점도 [0,100] 안", ...)        // bounded (:55)
it("210초 후 95% 캡", ...)              // cap holds (:47)
it("3초에 이미 >0 (즉각 피드백)", ...)    // real UX contract (:77)
it("보간 정확성 (2.5초 → 5%)", ...)      // tests the interpolation math, not the table (:35)
```

If you genuinely need to freeze the curve against accidental edits, capture it in **one** snapshot — not N hand-written equalities.

## Anti-pattern
```ts
expect(calculateFakeProgress(at(5))).toBe(10);   // mirrors PROGRESS_CURVE[1]
expect(calculateFakeProgress(at(15))).toBe(25);  // mirrors PROGRESS_CURVE[2]
expect(calculateFakeProgress(at(40))).toBe(45);  // ...table copy, not behavior
```

## Heuristic
- Ask: **"if a designer tweaks this number, should a test break?"** No → assert an invariant, not the value.
- The exception is a value that *is* a requirement or external contract (a tax rate, a billing threshold, a protocol code). Keep those exact — and cite the source (see `policy-` rules). A "fake progress" percentage is not that.
- One curve → many invariants + at most one snapshot. Never one equality per keyframe.
