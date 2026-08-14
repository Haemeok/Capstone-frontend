---
title: Spend Test Depth by Blast Radius
prefix: test
trigger: Deciding how many tests, and how adversarial, a behavior deserves — especially when a feature touches auth, data exposure, money/limits, or merely cosmetics.
---

## Symptom
Test depth gets spread uniformly — every behavior gets "a few tests" — so the budget lands in the wrong place. In this slice the cosmetic `progress` curve carries ~14 tests, while the genuinely dangerous paths get little: "a private recipe must never leak through a shared link" or "the 429 rate-limit bucket is correct" deserve adversarial coverage and often have the least. A silent cosmetic glitch costs nothing; a silent data leak or billing error costs a lot.

## Recommended pattern
Set depth by **"if this silently breaks, who gets hurt and how badly?"** Tag each requirement in the test-design matrix and let the tag drive coverage:

- **Security / data exposure** (private recipe visibility, auth gates) → adversarial: every bypass path, every actor (logged-out, non-owner, crawler/metadata), explicit "no leak" assertions.
- **Money / limits** (rate-limit buckets, per-call cost, quotas) → exact + boundary on every branch; these map to real billing.
- **Data integrity** (dedup, quantity math, idempotency) → boundaries and conflict cases.
- **Cosmetic** (progress feel, animation timing) → invariants only (see `test-invariants-not-constants`). One or two, not fourteen.

## Anti-pattern
```ts
// 14 assertions on an arbitrary progress curve (cosmetic, silent failure = harmless)
// ...meanwhile the "private recipe never shared" path has 0 adversarial tests
```
Equal effort, inverted risk. The fourteen pin nothing that matters; the zero is where a real incident hides.

## Heuristic
- Before writing the Nth test for a behavior, ask: **is this risk tier earning more depth, or am I padding a cosmetic one?**
- High-tier (security/billing/integrity) requirements are the ones to make *more* adversarial than feels necessary; cosmetic ones are where you stop early on purpose. This mirrors the repo norm that billing/cost-affecting changes get extra scrutiny.
