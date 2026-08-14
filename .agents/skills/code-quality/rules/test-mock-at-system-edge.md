---
title: Mock Only at the Edge of Your System
prefix: test
trigger: A unit test mocks a sibling module you wrote, whole-module-mocks a third-party library, or mocks more than ~3 modules to test one behavior.
---

## Symptom
`useJobPolling.test.tsx:9-26` mocks **seven** modules — including `@tanstack/react-query` wholesale (`:19`). Two problems compound. First, replacing a library with your own fake means the test verifies *your fake*, not react-query; when the library's real behavior changes, the test stays green while production breaks (false confidence). Second, needing seven fakes to test one thing (polling idempotency) is the unit screaming that it does too much — it owns polling **and** query invalidation **and** navigation **and** toast **and** haptic.

Mocking a module you *own* (your store, your mapper) is worse: the test now checks a promise you typed by hand, and if that promise drifts from the real module, every test passes while the app is broken.

## Recommended pattern
Mock only what sits at the **edge of your system** — things you don't own: network/API, time (`Date.now`, timers), randomness (uuid), the DOM, a third-party library's side effects.

- react-query: don't mock the module. Wrap the hook in a **real** `QueryClientProvider` with a real `QueryClient` — it's deterministic and built to be tested that way.
- If the unit only needs `invalidateQueries` as a signal, **inject it as a callback** so the test passes one spy — no module mock.
- Determinism: control time with fake timers; never `await new Promise(r => setTimeout(r))` against a real clock. If a test needs `await Promise.resolve()` microtask-flushing hacks to pass, treat that as a signal the async logic should be pulled into a pure function.

## Anti-pattern
```ts
// Replaces the whole library with a hand-typed fake — can't see real react-query changes
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: jest.fn() }),
}));
// ...plus 6 more jest.mock() calls to stand the hook up
```

## Heuristic
- More than ~3 mocks in a unit test? Stop. Before adding mock #4, ask **"can I extract the logic under test into a pure function?"** `jobStatusMapper.ts` is the payoff of doing exactly that: 0 mocks, owner-clear, the best test in the slice.
- Mocking a module from your own slice → almost always wrong. Restructure so the seam is a value (argument/return), not a fake.
- Whole-module-mocking a library isn't banned, it's the weakest option. Prefer real-instance > injected-callback > module mock, in that order.
