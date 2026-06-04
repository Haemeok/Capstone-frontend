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
| `test-`    | Test strategy — layer ownership, mocking boundary, value-vs-constants, pruning |

## Quick reference

### Size
- [Component size limits](rules/size-component.md) — 100/150 hard, SRP signals
- [Function complexity](rules/size-function.md) — 30 lines + branch / nesting / verb-pair / await flags
- [Rule of three](rules/size-rule-of-three.md) — extract on 3rd occurrence, not 2nd (premature abstraction prevention)

### FSD
- [4-layer placement](rules/fsd-layer-routing.md) — shared / widget / `_components/` / page
- [Widget vs page-local](rules/fsd-widget-vs-page-local.md) — single-page → `_components/`, multi-page → `widget/`
- [Entity vs feature boundary](rules/fsd-entity-feature-boundary.md) — mutations live in features

### Policy (human-error blockers)
- [URL and query strings](rules/policy-url-and-query.md) — `new URL` / `URLSearchParams`
- [TanStack Query keys](rules/policy-query-key.md) — `[domain, sub, ...ids]` tuple
- [Query invalidation vs cache patch](rules/policy-query-invalidation.md) — invalidate refetches every loaded page (storm); patch via `setQueriesData` prefix + `refetchType:none`; refetch only for membership-changing lists
- [Env via shared/config](rules/policy-env-config.md) — no direct `process.env`
- [Storage keys](rules/policy-storage-keys.md) — constants module
- [Z-index tokens](rules/policy-zindex.md) — semantic names, no magic numbers
- [Dates and numbers](rules/policy-date-number.md) — single library, `Intl.NumberFormat`
- [Nullish coalescing](rules/policy-nullish-coalescing.md) — `??` for defaults; `||` only for actual falsy semantics

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
- [Discriminated unions at API boundary](rules/ts-discriminated-union-at-boundary.md) — translate correlated optionals into a union once at the seam
- [Typed mapper extraction](rules/ts-typed-mapper-extraction.md) — inline literals hide dead fields; extract with explicit return type
- [Type imports — avoid dist paths](rules/ts-type-imports-from-dist.md) — derive from public hook via `ReturnType`, don't reach into `pkg/dist/...`

### Naming
- [Booleans, handlers, hooks](rules/naming-boolean-handler-hook.md) — `is/has/can/should`, `on*`/`handle*`, `use*`
- [Function verbs](rules/naming-function-verbs.md) — `get` / `fetch` / `load`
- [Ubiquitous language](rules/naming-ubiquitous-language.md) — one concept, one glossary word across AC / code / test; the shared word is the requirement→test trace (no ID tags)

### A11y
- [Interactive elements](rules/a11y-interactive.md) — native button, `cursor-pointer`, `aria-label`

### Testing
- [Layer ownership](rules/test-layer-ownership.md) — one behavior owned by its lowest layer; non-owners justify or delete; store+side-effect = 2 truths + 1 wiring test
- [Mock at system edge](rules/test-mock-at-system-edge.md) — mock only unowned edges (network/time/random/3rd-party); >3 mocks → extract a pure function; real `QueryClientProvider` over module mock
- [Invariants, not constants](rules/test-invariants-not-constants.md) — tuning curves get invariants + one snapshot, never N keyframe equalities (change-detectors)
- [Name is a spec](rules/test-name-is-spec.md) — strip "해야 함"; if no contract remains, the test restates a setter — cut
- [Risk-weighted depth](rules/test-risk-weighted-depth.md) — depth by blast radius; security/billing adversarial, cosmetic invariants-only
- [Prune and distrust](rules/test-prune-and-distrust.md) — deletion pass + false-confidence pass; mutation signal over line coverage; agents must be told to cut
- [No production timing hacks](rules/test-no-production-timing-hacks.md) — never add a setTimeout/delay to production to win a test race; mock the reconciled (post-mutation) server response instead

## File template

Every rule file uses this four-section shape:

- **Symptom** — what fails when the rule isn't followed
- **Recommended pattern** — short code example
- **Anti-pattern** — short code example
- **Heuristic** — when and how to self-check
