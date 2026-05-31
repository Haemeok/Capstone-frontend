---
name: designing-tests-from-requirements
description: Use when you have approved requirements or a spec and are about to plan or write tests — before decomposing tasks or writing any test code. Triggers when a feature request is vague, when tempted to unit-test the convenient internal helper instead of the user's requirement, when coverage is asserted by eyeball rather than mapped, or in the gap between the brainstorming and writing-plans steps.
license: MIT
metadata:
  author: recipio
  version: "0.1.0"
---

# Designing Tests From Requirements

## Overview

Tests are **designed top-down from the user's observable requirements** — not harvested bottom-up from the implementation units you happened to create. The test suite IS the requirement, encoded. If a requirement has no test that fails when that requirement breaks, the requirement is not covered — no matter how much code already exists.

**Core principle:** Design the test map from requirements before deciding on units. The implementation must satisfy the tests; the tests must encode the user's intent.

**Violating the letter of this rule is violating the spirit.** "I unit-tested the helper" is not "I proved the requirement."

## Where this sits

```
brainstorming  ──▶  designing-tests-from-requirements  ──▶  writing-plans
(requirements/spec)        (this skill: the test map)        (tasks w/ test code)
```

This is the bridge. brainstorming gives you *what success looks like*. This skill turns that into *a concrete, traceable set of test scenarios*. writing-plans then turns each scenario into a failing test inside a task. **Terminal state: invoke writing-plans.** Do not invoke any implementation skill from here.

## Compatibility with TDD (read this first)

This skill does NOT contradict superpowers:test-driven-development's "one minimal test at a time."

- **Here you design the MAP** — which behaviors must be tested, in what order. A map, not pre-written test code.
- **In TDD you still implement one test at a time** — red → green → refactor, per scenario, in the order this map defines.

The map is the territory you'll cross one step at a time. Do not batch-write all the test code now.

## The Method (6 steps)

### 1. Extract observable acceptance criteria from the requirement

Restate each requirement as **"When `<actor/condition>`, the system `<observable outcome>`."** Number them (AC-1, AC-2, …).

- Requirements are often **buried in a vague request.** "Share a recipe so a friend can view it without logging in" contains at least: AC-1 there's a share action that yields a link, AC-2 opening the link shows the recipe, AC-3 the viewer needs no login, AC-4 the viewer needs no app install (plain web), AC-5 a private recipe is never exposed via a shared link. Dig out the implicit ones.
- **Reject implementation statements.** "Uses a `buildShareTarget` helper" is not a criterion. "The shared link opens the recipe for a logged-out viewer" is.
- An acceptance criterion is something **the user could observe and verify**, stated in their language.

### 2. Decompose each criterion into scenarios

For each AC, enumerate scenarios using the heuristic catalog — do NOT freestyle:

- **Happy path** — the primary success case.
- **Boundary / edge** — empty, max, min, off-by-one, first/last, duplicate, zero.
- **Error / failure** — invalid input, missing dependency, permission denied, not-found, network fail.
- **State / sequence** — idempotency, ordering, concurrency (when relevant).

See `scenario-heuristics.md` for the full catalog and the per-category prompts.

### 3. Write each scenario as a concrete example

Given / When / Then with **real values**, not placeholders. `email = ""` → `error = "Email required"`, never "valid input → success". The concrete example is the seed of the failing test.

### 4. Build the traceability matrix

A table. Every AC maps to ≥1 scenario; every scenario gets a test ID.

| AC | Scenario | Test ID | Layer |
|----|----------|---------|-------|
| AC-2 | logged-out viewer opens public link → sees recipe title | T-05 | acceptance |
| AC-5 | private recipe link → 404, no content leaked | T-06 | acceptance |
| AC-2 | URL is absolute, joined with `new URL` | T-11 | unit |

**Coverage gate (mandatory):**
- Every AC has ≥1 test ID. **An AC with zero test IDs is a missing test — add it, don't ship.**
- Every AC has a happy-path test AND its relevant edge/error tests.
- Every AC has at least one **acceptance-layer** test (see step 5).

This gate is the thing that catches a silently-dropped requirement. Eyeballing "looks covered" is not the gate.

### 5. Separate the acceptance layer from the unit layer

- **Acceptance tests** encode the criterion at **the seam the user cares about** — the public API, the user-visible outcome, the end-to-end journey. These are the "all core requirements satisfied" guarantee.
- **Unit tests** drive the design of the internal pieces below that seam.

If you only have unit tests, you've tested the parts, not the promise. Pick the user's seam first, then go inward. Convenience of testing is not a reason to test the inner helper instead of the requirement.

### 6. Order for incremental TDD

Sequence the scenarios into a walking skeleton: the **thinnest end-to-end happy path first**, then layer edges and errors on top. This order becomes writing-plans' task order directly.

## Artifact

Write the matrix + scenarios to `docs/superpowers/specs/YYYY-MM-DD-<topic>-test-design.md` and commit. Then **get the user's eyes on it** — this artifact is exactly where the user verifies "do these tests actually cover what I asked for?" Ask:

> "Test design written to `<path>`. Each requirement is mapped to a test. Please confirm the coverage matches what you want before I write the implementation plan."

Only proceed to writing-plans after approval.

## Rationalizations — STOP

Harvested from real planning sessions. Every one of these means you're about to ship "무지성 유닛테스트":

| Excuse | Reality |
|--------|---------|
| "Most of the feature already exists" | Existing code ≠ proven requirement. A requirement needs a test that fails if it breaks, even when the code is already there. |
| "The unit under test is a small pure helper" | You reframed a user requirement into a convenient internal seam. Test the user-observable behavior first; unit-test the helper second. |
| "Keep wiring tests to one assertion, don't re-test" | Fine for trivial wiring. Not fine for a requirement with zero acceptance coverage. Wiring economy ≠ dropping a requirement. |
| "Tests 1–N cover the requirements" | Coverage claimed is not coverage proven. Map every AC to a test ID. No ID = no test. |
| "It's a deadline, keep it simple" | The matrix IS the fast path. It prevents the rework of discovering an unmet requirement after you shipped. |
| "I'll just test the units I'm building" | Bottom-up from units = biased by implementation. You test what you built, not what was required. |

## Red Flags

- Test list organized by file / function, not by requirement
- A requirement in the spec with no test ID beside it
- "Mostly covered by existing code" with no failing test to prove it
- Picked the easy-to-test internal seam over the user-observable behavior
- Coverage asserted in prose; no requirement→test table
- Zero acceptance-layer tests — only units

**Any of these: go back to step 1. Extract the criteria, map them, then proceed.**

## Common Mistakes

- **Skipping step 1 because the request "is already a list of requirements."** Even a clean list hides implicit ACs (error cases, the "no app install" kind). Restate them as observable outcomes anyway.
- **Treating the matrix as documentation to fill in later.** It's the gate. Build it before task decomposition, or writing-plans has nothing to refuse on.
- **Writing all test code now.** No. Map now, implement one test at a time in TDD.

## Handoff

After the user approves the test-design artifact, invoke **writing-plans**. Pass the matrix forward: every task's failing test must cite its test ID from the matrix.
