---
title: Tests Are Liabilities — Prune Them and Distrust Coverage
prefix: test
trigger: Finishing a test file, inheriting one, or reviewing a suite — especially anything an agent generated, where volume accrues fast.
---

## Symptom
Tests only ever get added, never removed, so a suite silently fills with change-detectors and duplicates. The `recipe-import-youtube` slice is ~85 tests, of which roughly a quarter pull little weight: persistence wiring re-verified per reducer, the same error copy pinned at three layers, a progress curve copied keyframe-by-keyframe, store filtering duplicated inside the hook test. Nobody wrote a bad test on purpose — "write more tests" always *looks* like diligence, so the cruft compounds. With agents generating tests cheaply, this accelerates: the failure mode flips from too-few tests to too-many low-value ones.

## Recommended pattern
Run two explicit review passes over any test file before calling it done — one subtractive, one adversarial.

- **Deletion pass:** for each test, ask (a) *would this break under a legitimate refactor that keeps behavior?* (change-detector) and (b) *is this a copy of another test's coverage?* (duplicate). Either → cut or merge. Default to removing; a test must earn its lifetime maintenance.
- **False-confidence pass:** ask *what bug could ship that no test here would catch?* Then add that one. (In this slice the answer was backend error-code drift — see the cross-repo contract gap.)

Use the right **signal**, not line coverage. Line coverage rewards the keyframe tests (they execute the line) and never detects false confidence. Mutation testing — deliberately break the code and check a test fails — measures the thing that matters: *does this suite fail when behavior breaks?* Prefer it as the agent's target metric over a coverage percentage.

## Anti-pattern
Treating a line-coverage number as the goal. It greenlights change-detectors, blesses duplicate coverage as "more %", and is blind to the bug nothing catches.

## Heuristic
- Every test is an asset **and** a liability. If it doesn't catch a real, otherwise-uncaught bug, it's net-negative — delete it.
- Pair the two passes: deletion shrinks change-detectors (the false-fail mode), false-confidence fills the bug-nothing-catches gap (the false-pass mode). The two failure modes need opposite fixes.
- When an agent writes tests, make "propose deletions" an explicit step — agents add by default and won't cut unless told to.
