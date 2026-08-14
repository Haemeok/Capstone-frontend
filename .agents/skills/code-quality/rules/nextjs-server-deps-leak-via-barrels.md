---
title: Server-Only Deps Leak Through Barrels into jsdom Tests
prefix: nextjs
trigger: A jsdom test of a client component fails with "Request is not defined" / "ReferenceError: fetch internals" although the component under test uses no server code.
---

## Symptom

`ReferenceError: Request is not defined` (or similar web-server-global errors) when jest loads a **client** component test. The component imports nothing server-ish directly, and the same component works fine in the browser.

## Root cause

Barrel chains. The client test imports a domain barrel (`@/entities/foo`), which re-exports a hook, which imports **another** domain's barrel (`@/shared/bar`), which re-exports an `api.server.ts` that imports `next/cache`. Loading `next/cache` in jsdom touches server-only globals (`Request`) that jsdom doesn't provide. The leak is invisible in the component's own imports — it's 3 hops down a re-export chain, and adding one innocent import to any barrel in the chain can break previously green test files.

## Recommended pattern

Immediate fix — mock `next/cache` at the top of the affected suite (before the imports that pull the chain):

```tsx
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  unstable_cache: (fn: unknown) => fn, // passthrough so wrapped fetchers still run
}));
```

Structural fix — don't re-export server-only modules from barrels that client code consumes:

- Keep `api.server.ts` out of the domain's `index.ts`; server consumers import it by full path.
- Or split barrels: `index.ts` (client-safe) vs `server.ts` (server-only exports).

Key points:

- Diagnose by walking the import chain from the test's imports, not the component's props: barrel → hook → barrel → `api.server` → `next/cache`.
- The error names a web global (`Request`, `Response`, `Headers`) — that's the fingerprint of a server-only module in a jsdom graph, not a bug in the component.
- When one suite needed the mock, the next suite touching the same barrel will too; prefer the structural fix once it happens twice.

## Anti-pattern

```ts
// entities/foo/index.ts
export * from "./api"; // includes api.server.ts → next/cache
export * from "./model/hooks"; // client hooks — now every client test that
// imports the barrel loads next/cache too
```
