---
title: Test `typeof window`-Gated Code in the node Environment, Not by Deleting window in jsdom
prefix: test
trigger: A unit test for a util that branches on `typeof window === "undefined"` (isServer/isClient guards) tries `delete global.window` to hit the server branch and the "returns undefined on server" assertion fails.
---

## Symptom

A util guards a browser-only API behind `if (typeof window === "undefined") return undefined`. The test simulates the server with `delete global.window` and asserts `undefined`, but the function still runs the client branch — the assertion fails because `typeof window` is still `"object"`.

## Root cause

The default jest environment for frontend code is **jsdom**, which installs `window` on the global so robustly that `delete global.window` is effectively a no-op for `typeof window`: the binding still resolves, so the server branch is never taken. You cannot remove jsdom's `window` from inside a test to fake a server render.

## Recommended pattern

Run the file in the **node** environment (no `window` exists → server branch is the default), and fake the _client_ case by assigning a stub `window` for that one test:

```ts
/**
 * @jest-environment node
 */
import { getValue } from "../util";

describe("getValue", () => {
  afterEach(() => {
    // @ts-expect-error client simulation cleanup
    delete global.window;
  });

  it("returns undefined on the server", () => {
    expect(getValue()).toBeUndefined(); // node env: no window
  });

  it("reads the browser API on the client", () => {
    // @ts-expect-error client simulation
    global.window = {};
    expect(getValue()).toBe("..."); // typeof window === "object" now
  });
});
```

In node, `delete global.window` genuinely makes `typeof window === "undefined"`, so the cleanup actually works (unlike jsdom).

## Anti-pattern

```ts
// default (jsdom) environment
it("returns undefined on the server", () => {
  // @ts-expect-error
  delete global.window;
  expect(getValue()).toBeUndefined(); // ← still runs client branch; window survives
});
```

Reaching for a redundant guard like `typeof window === "undefined" || window === undefined` to make the jsdom test pass is treating the symptom — it muddies the production contract to satisfy a wrongly-environed test.

## Heuristic

- Testing both branches of an `isServer`/`isClient` util? The two branches need opposite global states — split by _environment_, not by mutating jsdom. Use `@jest-environment node` and inject `global.window` for the client case.
- `delete global.window` only behaves as intended in the node environment. In jsdom it silently leaves `typeof window` defined.
- Keep the production guard as the single canonical `typeof window === "undefined"`; if a test forces you to weaken it, the test is in the wrong environment.
