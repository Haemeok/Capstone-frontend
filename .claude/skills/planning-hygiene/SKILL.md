---
name: planning-hygiene
description: Planning-time discipline rules — what to do BEFORE touching code when authoring an implementation plan. Currently focuses on a single failure mode that has bitten this project: fabricating new lookup/config/pricing tables instead of reusing existing ones, and plugging in invented values for external-API-controlled facts (model IDs, prices). Reference when scoping any feature that depends on vendor pricing, model identifiers, or any catalog the project may already encode elsewhere.
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

| Prefix | Topic |
|---|---|
| `lookup-` | Reuse existing lookup tables before authoring parallel ones |
| `external-` | External-source-of-truth values (vendor IDs, prices, rates) |
| `scope-` | Disambiguating user intent before committing to a plan |
| `no-` | Anti-patterns to avoid emitting in plans or generated code |

## Quick Reference

### Lookup tables

- `lookup-search-before-fabricating` — Before writing a new pricing/config/catalog file, grep the project for an existing table in the same domain. Adjacent admin pages often already encode the values you'd reach for.

### External facts

- `external-no-reasonable-defaults-for-billing` — When a value maps to real billing (per-image cost, per-second rate, model ID), never plug in a "reasonable default" without sourcing it from authoritative docs OR from an existing place in the codebase that already calls the same API. Cite the source in a comment.

### Scope disambiguation

- `scope-confirm-mode-vs-mechanism` — Vague feature requests often have two valid readings: a new mechanism on top of existing flow, OR a mode the underlying API already supports. Read the API surface first; if both readings are valid, ask one disambiguating question rather than committing to a multi-task plan for the bigger reading.

### Anti-patterns

- `no-file-path-header-comments` — Never write the file's own path as a header comment. It duplicates info the editor shows, lies the moment the file moves, and turns "rename one file" into "fix N comments." Don't bake this into plan templates either; implementers will copy it faithfully.

## How to Use

Read individual rule files for the failure mode, the example, and the heuristic:

```
rules/lookup-search-before-fabricating.md
rules/external-no-reasonable-defaults-for-billing.md
```

Each rule starts with the symptom (what someone almost shipped) and ends with the search-or-source command that would have caught it during planning.
