---
name: vertical-slicing
description: Use when you have an approved feature or spec and are about to break it into tasks or GitHub issues — before designing tests or decomposing work. Triggers when the task list is grouped by layer (types/API/store/UI), when a task delivers no user-observable outcome, when starting from a "foundation everything depends on", when error/empty/loading states get bucketed into one task, when there are no acceptance criteria or non-goals yet, or in the gap between brainstorming and designing-tests-from-requirements.
license: MIT
metadata:
  author: recipio
  version: "0.1.0"
---

# Vertical Slicing

## Overview

A feature is decomposed into **vertical slices** — thin threads of user-observable value, each cut start-to-finish through every layer it needs. Not into horizontal layers (all the types, then all the API, then all the UI).

**Core principle:** The slice is the unit your tests will bind to. Slice by **behavior** and each task's natural test is a behavior test. Slice by **layer** and each task's natural test is a unit test of that layer — which is how a test suite explodes into hundreds of "무지성 유닛테스트" that verify implementation units nobody asked for.

**This is upstream of, and more important than, the test strategy.** Tests depend on requirements; the slice *is* the requirement unit. Get the cut wrong here and no downstream test rule can recover — the tests will faithfully verify the wrong-shaped tasks. Knowing the test-design skill exists does **not** fix this: given layer-shaped tasks, the test matrix just maps layers to layer-tests.

## Where this sits

```
brainstorming  ──▶  vertical-slicing  ──▶  designing-tests-from-requirements  ──▶  writing-plans
(what success is)   (THIS: cut into       (AC → scenarios → tests → layers)        (tasks w/ test code)
                     behavior threads;
                     emit AC + non-goals
                     + glossary)
```

brainstorming gives you *what success looks like*. This skill cuts it into demoable threads and emits each thread's **acceptance criteria**, the feature's **non-goals**, and one **glossary**. designing-tests then consumes those AC directly — its matrix's left column is the AC you write here. **Terminal state: invoke designing-tests-from-requirements.**

## The test of a slice

> A slice is a slice only if you could **demo it to the product owner** and they'd see value.

"Define the meal-plan types" — can't demo. Not a slice; it's a layer. "A user picks 3 saved recipes and sees them bundled as a named plan" — can demo. That's a slice.

## The Method

### 1. Find the user-observable threads

List the things a user can *do and observe*, each phrased "a user can `<verb>` and `<observe outcome>`". Each becomes a candidate slice. The first slice is the **walking skeleton**: the thinnest thread that proves the whole path end-to-end (e.g. "create a plan with one recipe and open it"), even if ugly. The walking skeleton **replaces** the "foundation everything depends on" — you build the thinnest full thread, never the full bottom layer.

### 2. Cut vertically, never horizontally

Each slice cuts through every layer it needs (type + api + store + ui) — but only the sliver that *this* thread needs. Enforce:

- **No layer-as-a-task.** A task whose deliverable is "the types" / "the API functions" / "the store" / "the query keys" has no user-observable outcome. It belongs *inside* the first slice that uses it. Build only the slice of that layer the thread needs.
- **No `everything depends on this` task.** That sentence is the horizontal tell. Replace it with the walking skeleton.
- **No cross-cutting `error / empty / loading states` task.** Each empty/invalid/unauthorized/loading state is the **failure or edge AC of a specific slice**. Fold it into that slice. A states-blob task makes you test a generic blob instead of a behavior.

### 3. Write each slice's Acceptance Criteria

For each slice, 2–5 AC as **observable outcomes**, in the user's language:

> "When `<actor / condition>`, the system `<observable outcome>`."

Include the happy path **and** the edges/errors that belong to *this* slice (the empty, the invalid token, the unauthorized viewer). Reject implementation statements ("uses a `buildShareTarget` helper" is not an AC). These AC are exactly what designing-tests step 1 consumes — so write them here, once, well.

An AC is **one sentence**, the cheapest artifact in this whole skill. Under a deadline it is the last thing to cut, not the first: slices without AC is half a job — you've said which behaviors exist but not what "working" means for any of them, so the implementer fills that gap by guessing. Writing "When X, the system Y" is faster than debugging a behavior that shipped subtly wrong.

### 4. Name the Out of Scope (non-goals)

Explicitly list what this feature does **not** do — especially the tempting-adjacent things and any deferred product decision. Every open question resolves to one of two homes: an **AC** (in scope) or a **non-goal** (out). A question left as neither is exactly how a requirement silently vanishes (the "친구가 설치 없이 본다" that disappeared because nobody wrote it down). Non-goals get **no tests** — mark them so the downstream coverage gate can tell "missing test" apart from "deliberately absent".

### 5. Fix the Ubiquitous Language (one glossary)

List the 5–10 domain nouns and verbs this feature uses — **one word per concept**, in the product owner's language. Every downstream artifact draws from this glossary: AC text, code identifiers, test descriptions, the same word.

This is the traceability mechanism. When the AC says "완료되면", the code state is `completed`, and the test says `"completed를 반환한다"`, the requirement↔test link **is the word** — no ID tags, no RTM, no sync burden. Watch for the two ways it breaks: silent translation (오너가 "주간 식단"이라 했는데 `meal plan`으로 갈아끼움) and synonym drift (`token` / `slug` / `link` for one concept).

### 6. Order and hand off

Walking skeleton first, then slices that add value, edges last — this order becomes writing-plans' task order. Hand the slices + their AC + non-goals + glossary to **designing-tests-from-requirements**.

## Artifact

Write to `docs/superpowers/specs/YYYY-MM-DD-<topic>-slices.md`: the glossary, the non-goals, then each slice with its AC. Get the user's eyes on the **slice boundaries and non-goals** before designing tests — this is where the user verifies "yes, that's how the feature should be cut, and yes, that's what we're not building."

## Rationalizations — STOP

Harvested from real baseline planning runs. Every one produced a horizontal, untestable breakdown:

| Excuse | Reality |
|--------|---------|
| "타입/모델부터 정의해야 나머지가 의존하니까" | "everything depends on it" is the horizontal signal. Build the depended-on layer *inside the first slice that uses it.* The walking skeleton replaces the foundation. |
| "에러/빈/로딩 상태는 한 task로 묶는 게 깔끔" | Each error is the failure-AC of one slice. Bucketed, you test a state-blob, not a behavior. Fold each into its slice. |
| "이건 그냥 task 쪼개기지, AC까지 써야 하나" | A task without AC says *what you'll build* (deliverable), not *what counts as done* (outcome). Downstream test design then starts empty-handed. |
| "범위 밖은 다들 아니까 안 적어도 됨" | Implicit scope is what silently drops a requirement. Naming the non-goals closes the list of what's in. |
| "designing-tests가 어차피 AC 뽑아주잖아" | That skill extracts AC from the *units it's given.* Give it layers → it tests layers. Slicing is what makes the unit a behavior. |
| "코드는 영어로 통일하는 게 자연스러움" | Silently translating the domain word cuts the trace line before code exists. Fix the owner's word in the glossary first. |
| "마감이라 AC·글로서리는 다음에, 일단 슬라이스/task만" | AC is one sentence per slice — the *fastest* part, not ceremony. A deadline makes it more important: the wrong-shipped behavior you'd debug on stage costs far more than the sentence. Vertical slices with the AC dropped is half a job. |
| "이건 뱃지/토글 하나라 슬라이싱이 과하다" | Small features don't escape horizontal slicing — they *hide* it. Your in-head build order (타입 → UI → mutation) is already horizontal; the size just made you skip writing it down. Small = 2–3 thin slices, not zero. (Mirrors the "too simple to design" trap.) |
| "기존 코드가 이미 레이어로 깔끔하니 그 결대로 task 쪼개자" | The existing layer structure answers *where code lives*, not *how tasks are cut*. The slivers go in those folders; the task boundary is still the behavior. Reusing folders ≠ reusing them as the task breakdown. |

## Red Flags

- Task list grouped under layer headers (Data layer / API / State / UI)
- A task titled "타입 정의" / "API 추가" / "store" / "query keys" with no user-observable outcome
- "Foundation that all other tasks depend on"
- A single "에러/빈/로딩 상태" task
- Zero "When … the system …" criteria in the breakdown
- No non-goals list
- One concept written two ways (`token`/`slug`, `식단`/`plan`)
- Slices listed but their AC dropped "for time" / "because it's small"
- Existing folder layers (`types`/`api`/`store`/`ui`) copied straight into the task boundary

**Any of these: stop. Re-cut by behavior, write the AC, name the non-goals.**

## Handoff

Invoke **designing-tests-from-requirements**. Pass the slices forward: its matrix's AC column is the AC you wrote here, its glossary is yours, its coverage gate skips your non-goals.
