---
title: Wire UI to a Store Signal Only After Verifying Production Writers
prefix: react
trigger: About to subscribe new UI (badge, toast, notifier, indicator) to an existing store/context field — or reviewing a PR that does.
---

## Symptom

A newly added notifier (toast/badge subscribed to a store field) compiles, its unit tests pass, and it never fires in production. Nobody notices until manual QA, because every automated signal is green.

## Root cause

The subscribed field had **zero production write-sites**. The store was a legacy version (V1) superseded by a newer pipeline (V2); its mutators existed and type-checked, but no production code called them anymore. Unit tests green-light the dead wiring because they set the store state **directly** (`useStore.setState(...)` / render with a prepared state), which proves "UI reacts to state" — not "state ever changes in production".

Second-order failure: the live pipeline (V2) already surfaced the same event through its own channel, so "fixing" the dead signal by bridging V1↔V2 would have shipped a duplicate notification.

## Recommended pattern

Before subscribing UI to an existing state field:

1. **Grep the mutator call-sites, excluding tests.** `setGenerationState(`, `store.setState(`, action names. Zero non-test callers = dead signal — stop.
2. **Trace the live pipeline** for the event you want to surface. If an active code path already notifies (an existing toast/redirect/refetch), the right move is usually to pin **that** behavior with a test, not to add a channel.
3. If the signal is genuinely dead, delete the dead store instead of wiring more readers to it.

```ts
// Before wiring <JobDoneBadge/> to useJobStoreV1((s) => s.doneJobs):
//   rg "setDoneJobs|jobStoreV1.setState" src --glob '!**/__tests__/**'
//   → 0 hits outside tests = nothing ever writes it in production.
```

Key points:

- A store with readers but no writers is undetectable by tsc, eslint, and state-injection unit tests — only a call-site grep or an e2e catches it.
- Tests that prepare state directly answer "does the UI react?"; they cannot answer "does this state ever occur?". For notification-style features, the second question is the feature.

## Anti-pattern

```tsx
// Subscribes to a field nothing writes; test sets it manually and passes.
const doneJobs = useJobStoreV1((s) => s.doneJobs);   // V1 is dead — V2 owns the pipeline
useEffect(() => { if (doneJobs.length) toast(...); }, [doneJobs]);
```
