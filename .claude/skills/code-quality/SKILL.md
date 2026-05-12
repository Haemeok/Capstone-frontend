---
name: code-quality
description: >
  Always-applicable code quality rules for React/Next.js/TypeScript work in this
  repo. Triggers on ANY code authoring or review — component creation,
  refactoring, FSD slice placement, Next.js caching decisions, TS strictness,
  naming, a11y. Reference matching `rules/<prefix>-*.md` when violating or unsure.
license: MIT
metadata:
  author: recipio
  version: "0.1.0"
---

# Code Quality

Tier-2 (on-demand) detail for the always-on self-check block in `CLAUDE.md`
(section "코드 작성 자가체크"). The inline block is the trigger; this folder
holds the elaboration.

## When to apply

Every code-authoring or code-reviewing task in the repo. The inline self-check
fires first; if a rule is violated, unclear, or about to be violated, read the
specific `rules/<prefix>-<topic>.md` file.

## Rule prefixes

| Prefix     | Topic                                              |
| ---------- | -------------------------------------------------- |
| `size-`    | Component and function size limits                 |
| `fsd-`     | Feature-Sliced Design layer placement              |
| `policy-`  | Human-error blockers (URL / env / keys / etc.)     |
| `nextjs-`  | Next.js cache, static/dynamic, server/client       |
| `react-`   | React Compiler-era memoization and effect hygiene  |
| `ts-`      | TypeScript strictness                              |
| `naming-`  | High-payoff naming conventions                     |
| `a11y-`    | Accessibility minimum bar                          |

## Quick reference

### Size
- [Component size limits](rules/size-component.md) — 100/150 hard, SRP signals
- [Function complexity](rules/size-function.md) — 30 lines + branch / nesting / verb-pair / await flags

### FSD
- [4-layer placement](rules/fsd-layer-routing.md) — shared / widget / `_components/` / page
- [Widget vs page-local](rules/fsd-widget-vs-page-local.md) — single-page → `_components/`, multi-page → `widget/`
- [Entity vs feature boundary](rules/fsd-entity-feature-boundary.md) — mutations live in features

### Policy (human-error blockers)
- [URL and query strings](rules/policy-url-and-query.md) — `new URL` / `URLSearchParams`
- [TanStack Query keys](rules/policy-query-key.md) — `[domain, sub, ...ids]` tuple
- [Env via shared/config](rules/policy-env-config.md) — no direct `process.env`
- [Storage keys](rules/policy-storage-keys.md) — constants module
- [Z-index tokens](rules/policy-zindex.md) — semantic names, no magic numbers
- [Dates and numbers](rules/policy-date-number.md) — single library, `Intl.NumberFormat`

### Next.js
- [Cache and revalidation](rules/nextjs-cache-and-revalidation.md) — mutation → `revalidate*`; Request Memoization
- [Dynamic vs static](rules/nextjs-dynamic-vs-static.md) — static is default; recognize triggers
- [Server vs client boundary](rules/nextjs-server-vs-client-boundary.md) — `'use client'` at the lowest point; `initialData`

### React (Compiler era)
- [Compiler memoization](rules/react-compiler-memoization.md) — three legitimate `useCallback` cases
- [Effect / state diet](rules/react-effect-discipline.md) — derived computed, events handled, effects only for external sync

### TypeScript
- [`any` and `as`](rules/ts-any-and-as.md) — `any` banned; `as` justified with a comment
- [Non-null and union](rules/ts-non-null-and-union.md) — no `!`; discriminated unions

### Naming
- [Booleans, handlers, hooks](rules/naming-boolean-handler-hook.md) — `is/has/can/should`, `on*`/`handle*`, `use*`
- [Function verbs](rules/naming-function-verbs.md) — `get` / `fetch` / `load`

### A11y
- [Interactive elements](rules/a11y-interactive.md) — native button, `cursor-pointer`, `aria-label`

## File template

Every rule file uses this four-section shape:

- **Symptom** — what fails when the rule isn't followed
- **Recommended pattern** — short code example
- **Anti-pattern** — short code example
- **Heuristic** — when and how to self-check
