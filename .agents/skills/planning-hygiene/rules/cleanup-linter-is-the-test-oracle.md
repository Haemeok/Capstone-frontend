---
title: For a Mechanical Lint/Refactor Cleanup, the Linter Count Is the Red→Green Oracle
impact: MEDIUM
impactDescription: satisfies a test-first plan gate on a pure-refactor cleanup without inventing meaningless unit tests
tags: planning, lint, testing, refactor, tdd
---

## For a Mechanical Lint/Refactor Cleanup, the Linter Count Is the Red→Green Oracle

A pure cleanup — driving lint rules to zero, removing `any`, fixing dep arrays — has **no new behavior**, so writing new unit tests for it produces exactly the "무지성 유닛테스트" the project warns against: tests bound to implementation units nobody asked for. But a test-first plan gate still wants a red→green loop per task. Resolve the tension by recognizing the linter *is* the oracle: **red = N violations of the target rule, green = 0**. The acceptance criterion ("rule R reports 0 in area X") is the failing-then-passing check; no new test file is needed.

Behavior preservation — the one thing a refactor *can* break — is guarded by the **existing** suite plus `tsc` plus `build`, not by new tests. New tests would only re-assert what those already cover.

**Incorrect — inventing unit tests to satisfy a TDD gate on a cleanup:**

```
Task: remove `any` from apiClient.
  Step 1: write a test asserting apiClient<T>() returns T.   ← tests the type system
  Step 2: ...
```

This test traces to no requirement, exercises the compiler rather than behavior, and becomes a change-detector the moment the signature evolves.

**Correct — linter count as the oracle, existing suite as the behavior guard:**

```
Task: remove `any` from apiClient.   (AC: no-explicit-any = 0 in shared/api)
  Step 1 (red):   eslint <area> | grep -c no-explicit-any   → N
  Step 2:         replace each `any` with a real type / unknown+narrow
  Step 3 (green): eslint <area> | grep no-explicit-any       → (empty)
                  tsc --noEmit                                → exit 0
                  jest <area>                                 → pass  (behavior preserved)
  Step 4: commit
```

Key points:
- The acceptance criterion for a cleanup is observable through tooling, not through a new assertion: "rule R = 0 in area X", "`tsc` green", "existing tests still pass". Cite those as the task's check.
- Behavior-adjacent slices (effect dep changes, ref/render restructures, hoisting components) are the exception worth a real review: the linter says the rule is fixed, but only reasoning or an existing test confirms the runtime output is unchanged. Attach a behavior-preservation review to those slices, not to the mechanical ones (entity escaping, `any`→type, unused-var removal).
- Traceability is the acceptance-criterion wording itself (the rule name + area), shared by the plan, the commit, and the verification command — no separate test-ID matrix is needed when there are no tests.
- This applies only to genuine no-behavior-change cleanups. The instant a "cleanup" changes a runtime path, it needs a real test for that path.
