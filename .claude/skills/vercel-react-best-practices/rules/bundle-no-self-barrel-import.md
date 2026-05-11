---
title: Never Import Your Own Layer's Barrel From Inside the Layer
impact: CRITICAL
impactDescription: Prevents Turbopack `dynamic_imports.rs` Option::unwrap panic on route-handler / server-action compile
tags: bundle, imports, barrel-files, turbopack, fsd, server-actions
---

## Never Import Your Own Layer's Barrel From Inside the Layer

A module living *inside* a layer (FSD entity/feature/shared, or any folder with an `index.ts` re-export) must not import from that layer's barrel. If `entities/recipe/model/api.ts` imports from `@/entities/recipe`, and that barrel re-exports `./model/api`, the module imports itself transitively. Page-tree graphs absorb this silently, but when the same module gets pulled into a **route-handler graph** or a **server-action registry graph**, Turbopack's `dynamic_imports` analyzer hits the cycle and panics with `called Option::unwrap() on a None value` (Next 15.x via `crates/next-api/src/dynamic_imports.rs:70`). The route returns 500 with no JS-level stack — the handler module never gets to run.

The trap is that the cycle is invisible in normal dev. It only fires once a route handler or server action first imports the cycle-bearing module. Adding a new helper to the layer's barrel *months later* can suddenly break a feature that "was working yesterday".

**Incorrect — `api.ts` reaches back through its own barrel:**

```ts
// src/entities/recipe/model/api.ts
import { ensureSource } from "@/entities/recipe";        // ← barrel of the layer this file lives in
import type { Recipe } from "./types";

export const getRecipe = async (id: string) => {
  const r = await api.get<Recipe>(`/recipes/${id}`);
  return ensureSource(r);
};
```

```ts
// src/entities/recipe/index.ts (the barrel)
export * from "./model/api";          // re-exports getRecipe
export { ensureSource } from "./lib/visibility";
```

The cycle: `model/api.ts → @/entities/recipe → ./model/api`. Add this module to a route-handler import graph and Turbopack panics.

**Correct — use the direct deep path to the sibling:**

```ts
// src/entities/recipe/model/api.ts
import { ensureSource } from "@/entities/recipe/lib/visibility";  // direct path, no barrel
import type { Recipe } from "./types";

export const getRecipe = async (id: string) => {
  const r = await api.get<Recipe>(`/recipes/${id}`);
  return ensureSource(r);
};
```

Same behavior, no cycle. The barrel stays clean for *external* consumers.

Key points:

- **Barrels are for outside consumers, not for the layer's own internals.** Inside `<layer>/...`, always import siblings via direct deep paths (`@/<layer>/sub/file` or relative `../sub/file`), never via `@/<layer>`.
- **Failure mode is delayed and graph-shape dependent.** The cycle exists from the moment you write it, but it only crashes when a route handler or server action first imports the affected module. "It worked yesterday" usually means yesterday's dev session never compiled the bad graph.
- **Turbopack signature to recognize:** `thread 'tokio-runtime-worker' panicked at crates\next-api\src\dynamic_imports.rs:NN:NN: called 'Option::unwrap()' on a 'None' value`, route 500 with no JS log. If you see this, grep the route's transitive imports for self-barrel patterns: `grep -rE "from ['\"]@/(entities|features|shared|widgets)/[a-z-]+['\"]" src/<that-layer>/`.
- **Diagnosis playbook when this panic strikes:** Reduce the route handler to a stub returning `NextResponse.json({ok:true})`. If panic stops, add imports back one at a time (binary-search the graph) until it returns. The culprit is the first import that re-introduces the cycle.
- **Prevention via lint:** an ESLint `no-restricted-imports` rule scoped per-folder can forbid importing the layer's own barrel from inside that layer. Worth adding once FSD layers stabilize.
- **Adjacent symptom:** the same self-cycle can silently corrupt `optimizePackageImports` or `serverExternalPackages` decisions in Next.js, leading to "package resolves to a different version" warnings. If you see both, suspect a barrel cycle before chasing the version mismatch.
