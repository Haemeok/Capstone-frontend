---
title: For a Shared-Type-Contract Migration, the Type Checker Is the Consumer Oracle
impact: HIGH
impactDescription: catches the consumer your hand-enumerated task list silently missed, before it ships
tags: planning, typescript, refactor, migration, types
---

## For a Shared-Type-Contract Migration, the Type Checker Is the Consumer Oracle

When a shared type changes shape — a response DTO, a union, a widely-aliased generic — the set of code that must change is **whatever the compiler says it is**, not whatever you listed at plan time. Enumerating consumers by hand (grep, memory, an exploration pass) is structurally incomplete: it finds the obvious call sites and misses the indirect ones (a hook that forwards the old helper, an optimistic-cache update typed against the alias, a fallback object built inline). The plan reads complete, every listed task passes, and a consumer nobody named still ships broken.

The fix is to treat `tsc --noEmit` as the authoritative consumer-finder. Repoint the type first; the compiler then enumerates every break for you. The per-consumer tasks in the plan are just the _known-large_ ones you want reviewed individually — the **closing gate is "drive tsc to 0"**, and that gate is what makes the migration complete, not the checklist above it.

**Incorrect — plan enumerates consumers, treats the list as the definition of done:**

```
Task 3: fix search results page        (reads .page.totalPages)
Task 4: fix category detail            (reads .page.totalElements)
Task 5: fix my-recipes tab             (getNextPageParam)
# ...migration considered done after Task 5
```

The enumeration came from grep + an exploration agent. It missed a hook that forwarded the old page-based `getNextPageParam` into the now-changed type. Nothing in Tasks 3–5 touches it; every task goes green; the broken consumer is invisible until runtime — or until someone happens to run a full type check.

**Correct — repoint the type, let the compiler list the breaks, gate on zero:**

```
Task 2: repoint the alias to the new shape.
        → from here, `tsc --noEmit` is RED across all consumers (expected).
Task 3..N: fix each known-large consumer; after each, `tsc --noEmit` shrinks.
Task LAST (mandatory gate):
        run `tsc --noEmit` over the WHOLE project.
        every remaining error is a consumer the plan never named — fix each.
        migration is done only when tsc = 0, then run the full test suite.
```

Key points:

- The plan's consumer list is a _starting set for review_, never the completeness criterion. The completeness criterion is `tsc --noEmit` = 0 across the whole project. Always add that full sweep as the final task; it is the only step that finds what enumeration missed.
- Order matters: change the type _first_ so the compiler goes red everywhere. A migration that changes consumers before the type never gets the compiler's free enumeration. Expect and announce the project-wide red state between the type change and the closing gate — it is the tool working, not breakage.
- The same type can be shared by endpoints/callers that should _not_ change (a `PageResponse` kept for non-migrated APIs while only some aliases move to `SliceResponse`). The compiler distinguishes them automatically: a site that still type-checks is a site that didn't need touching. Don't hand-audit those — if tsc is silent, leave them.
- This is distinct from a lint cleanup (where the linter count is the oracle — see `cleanup-linter-is-the-test-oracle`). Here the _type checker_ is the oracle, and the risk it guards is a missed consumer, not an unmet style rule.
