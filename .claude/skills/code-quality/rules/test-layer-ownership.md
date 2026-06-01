---
title: One Behavior, One Owning Layer
prefix: test
trigger: The same behavior is asserted at more than one layer (pure function AND hook AND component), or a store/reducer test re-verifies a side effect that its collaborator already owns.
---

## Symptom
A requirement gets tested everywhere it passes *through*, not where it *lives*. The behavior "907 → 유튜브 링크만 가능해요" is pure string mapping owned by `lib/errors.ts`, yet it's asserted three times: in `errors.test.ts`, again in `errors.test.ts` for the sibling function, and a third time through the hook in `useJobPolling.test.tsx:153`. The hook adds nothing to that mapping — `jobStatusMapper.ts:24` just calls the pure function — so two of the three assertions buy zero extra coverage and triple the refactor cost.

Same shape with side effects: `persistence.test.ts` fully owns "save to localStorage", but `storeV2.test.ts` re-asserts it on nearly every reducer (`:40`, `:84`, `:138`, `:176`). The store's only new behavior there is "it calls persistence" — worth proving **once**, not per mutation.

## Recommended pattern
For each requirement, find the **lowest layer where the behavior actually originates** and make that layer the owner. Mark it in the test-design matrix `Layer` column. Higher layers get a test only when they catch something the owner structurally cannot.

- Pure transformation (copy mapping, status mapping) → **unit (pure function)** owns it. `jobStatusMapper.test.ts` is the model: owner is obvious, zero mocks.
- Emergent behavior (polling idempotency, "already completed → don't reprocess") → **hook** owns it, because no pure function or reducer can exhibit a loop.
- Stateful module + side effect → **two solitary truths + one wiring test**: test the pure state transition alone, test the side-effect module (`persistence`) alone, write exactly **one** sociable test proving they're connected.

## Anti-pattern
```ts
// useJobPolling.test.tsx — hook re-pins copy that lib/errors.ts already owns
expect(job.message).toBe("유튜브 링크만 가능해요"); // owner: errors.test.ts. delete here.

// storeV2.test.ts — persistence side effect re-verified on every reducer
it("localStorage에 job을 저장해야 함", ...)   // persistence.test.ts owns this
it("localStorage를 업데이트해야 함", ...)       // ... and this
it("localStorage에서 job을 제거해야 함", ...)   // ... and this
```

## Heuristic
- For every test ask: **"does the owner layer already prove this?"** If yes, delete unless this layer exercises a distinct failure mode (integration, timing, concurrency).
- A non-owner test must be able to answer "what do I catch that the owner can't?" in one sentence. No answer → cut or merge.
- One wiring test per collaborator pair is the budget. "Store calls persistence" needs one example, not one-per-method.
