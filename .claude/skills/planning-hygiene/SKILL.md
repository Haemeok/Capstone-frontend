---
name: planning-hygiene
description: Planning-time discipline rules — what to do BEFORE touching code when authoring an implementation plan. Covers fabricating lookup/config/pricing tables instead of reusing existing ones, inventing external-API-controlled values (model IDs, prices), subagent dispatch shape and git staging in a shared worktree, and planning codebase-wide mechanical lint/refactor cleanups (linter-as-oracle, whole-file pre-commit leakage, deferral markers). Reference when scoping a feature that depends on vendor pricing or catalogs, dispatching subagents that commit, or planning a lint/cleanup sweep.
license: MIT
metadata:
  author: recipio
  version: "0.1.0"
---

# Planning Hygiene

Plans look professional but ship bugs when they fabricate values that should have been looked up. This skill captures rules for what to do BEFORE writing the plan, not while writing code.

## When to Apply

Reference these guidelines when:

- Authoring an implementation plan that introduces pricing, cost estimation, or per-model configuration.
- Naming a third-party model, endpoint, or product variant in a plan or code comment.
- About to write a new `*Pricing.ts`, `*Config.ts`, `models.ts`, or any lookup-table-shaped module.
- Deciding default values for tunables that map onto real billing or external API contracts.

## Rule Categories

| Prefix      | Topic                                                       |
| ----------- | ----------------------------------------------------------- |
| `lookup-`   | Reuse existing lookup tables before authoring parallel ones |
| `external-` | External-source-of-truth values (vendor IDs, prices, rates) |
| `scope-`    | Disambiguating user intent before committing to a plan      |
| `dispatch-` | Subagent dispatch shape and git staging at plan time        |
| `cleanup-`  | Planning a codebase-wide mechanical lint/refactor cleanup   |
| `no-`       | Anti-patterns to avoid emitting in plans or generated code  |

## Quick Reference

### Lookup tables

- `lookup-search-before-fabricating` — Before writing a new pricing/config/catalog file, grep the project for an existing table in the same domain. Adjacent admin pages often already encode the values you'd reach for.

### External facts

- `external-no-reasonable-defaults-for-billing` — When a value maps to real billing (per-image cost, per-second rate, model ID), never plug in a "reasonable default" without sourcing it from authoritative docs OR from an existing place in the codebase that already calls the same API. Cite the source in a comment.

### Scope disambiguation

- `scope-confirm-mode-vs-mechanism` — Vague feature requests often have two valid readings: a new mechanism on top of existing flow, OR a mode the underlying API already supports. Read the API surface first; if both readings are valid, ask one disambiguating question rather than committing to a multi-task plan for the bigger reading.

### Subagent dispatch

- `dispatch-mcp-tools-force-sequential-subagents` — MCP servers (Playwright, Vercel, etc.) are session-scoped, not per-subagent. Parallel subagents sharing the same MCP tool will contend on one connection. At plan time, classify each subagent's tools — anything `mcp__*` forces sequential dispatch. Decide in the plan, not at runtime.
- `dispatch-explicit-staging-shared-worktree` — A subagent commits in the same working tree the user may be editing in parallel. `git add -A` sweeps their unrelated WIP into your commit. Stage only the exact paths the task touched, and tell the subagent to ignore `tsc`/test errors in files it didn't touch (those are the user's WIP).
- `dispatch-pathspec-leaks-foreign-hunks-in-shared-file` — Even correct per-file staging leaks: `git add <file>` stages the file's whole blob, so a hot shared file (types/`index.ts`/barrel) co-edited in parallel carries the other workstream's hunks into your commit. Before committing a shared file, `git diff <file>` for foreign hunks, `git add -p` only yours, and confirm `git diff --cached <file>`.

### Cleanup planning

- `cleanup-whole-file-hook-leaks-rule-slices` — When a lint cleanup is sliced by rule but a pre-commit hook lints the whole touched file, a file with multiple rules' violations forces the first slice that touches it to silence the others' errors too. Defer out-of-scope rules with a grep-able `-- deferred to #N` marker (suppressed violations vanish from linter output, so the deferred issue's scope = lint errors ∪ grep of the marker).
- `cleanup-linter-is-the-test-oracle` — For a no-behavior-change lint/refactor cleanup, the linter's rule count is the red→green oracle (red = N, green = 0); existing tests + `tsc` + `build` guard behavior. Don't invent new unit tests to satisfy a TDD gate. Attach a real behavior-preservation review only to behavior-adjacent slices.

### Anti-patterns

- `no-file-path-header-comments` — Never write the file's own path as a header comment. It duplicates info the editor shows, lies the moment the file moves, and turns "rename one file" into "fix N comments." Don't bake this into plan templates either; implementers will copy it faithfully.

## How to Use

Read individual rule files for the failure mode, the example, and the heuristic:

```
rules/lookup-search-before-fabricating.md
rules/external-no-reasonable-defaults-for-billing.md
```

Each rule starts with the symptom (what someone almost shipped) and ends with the search-or-source command that would have caught it during planning.
