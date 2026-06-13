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

| Prefix    | Topic                                                                          |
| --------- | ------------------------------------------------------------------------------ |
| `size-`   | Component and function size limits                                             |
| `fsd-`    | Feature-Sliced Design layer placement                                          |
| `policy-` | Human-error blockers (URL / env / keys / etc.)                                 |
| `nextjs-` | Next.js cache, static/dynamic, server/client                                   |
| `react-`  | React Compiler-era memoization and effect hygiene                              |
| `ts-`     | TypeScript strictness                                                          |
| `naming-` | High-payoff naming conventions                                                 |
| `a11y-`   | Accessibility minimum bar                                                      |
| `test-`   | Test strategy — layer ownership, mocking boundary, value-vs-constants, pruning |

## Quick reference

### Size

- [Component size limits](rules/size-component.md) — 100/150 hard, SRP signals
- [Function complexity](rules/size-function.md) — 30 lines + branch / nesting / verb-pair / await flags
- [Rule of three](rules/size-rule-of-three.md) — extract on 3rd occurrence, not 2nd (premature abstraction prevention)

### FSD

- [4-layer placement](rules/fsd-layer-routing.md) — shared / widget / `_components/` / page
- [Widget vs page-local](rules/fsd-widget-vs-page-local.md) — single-page → `_components/`, multi-page → `widget/`
- [Entity vs feature boundary](rules/fsd-entity-feature-boundary.md) — mutations live in features
- [Extraction surfaces sibling imports](rules/fsd-extract-surfaces-sibling-imports.md) — moving app composition into a widget turns legal `app→widget` imports into `widget→widget` violations; grep `@/widgets/` before the move

### Policy (human-error blockers)

- [URL and query strings](rules/policy-url-and-query.md) — `new URL` / `URLSearchParams`
- [TanStack Query keys](rules/policy-query-key.md) — `[domain, sub, ...ids]` tuple
- [Query invalidation vs cache patch](rules/policy-query-invalidation.md) — invalidate refetches every loaded page (storm); patch via `setQueriesData` prefix + `refetchType:none`; refetch only for membership-changing lists
- [SSR ↔ client query key parity](rules/policy-ssr-client-query-key-parity.md) — SSR prefetch key must byte-match the client hook's key incl. codec/parser defaults, or hydration silently CSR-refetches
- [i18n type gate misses unextracted literals](rules/policy-i18n-type-gate-misses-unextracted-strings.md) — a typed Dictionary gates missing keys, not unextracted inline strings; grep the localized files for source-language chars after wiring
- [i18n chrome vs content axes](rules/policy-i18n-chrome-vs-content-axes.md) — localizing chrome doesn't localize the fetch; plumb the new locale through query key + fetch params + href, never a boundary remap-to-default (masked on SSR page 0)
- [i18n locale prefix breaks path equality](rules/policy-i18n-locale-prefix-breaks-path-equality.md) — locale-prefixing links breaks active-state/`aria-current` checks that compare raw `usePathname()` to a bare route; normalize via `stripLocale` first (only fails on `/en`·`/ja`, not default locale)
- [i18n query key vs optimistic mutation](rules/policy-i18n-querykey-vs-optimistic-mutation.md) — appending `locale` to a list `queryKey` silently breaks exact-match `getQueryData`/`setQueryData` optimistic patches (prefix `invalidateQueries` survives); thread locale through the factory+mutation (default source lang) or only add it to keys without exact-match mutations
- [i18n label doubles as key](rules/policy-i18n-label-doubles-as-key.md) — when a constant's source-language string is also its lookup key/state/comparison, don't migrate the key; leave the constant byte-identical, add a code-keyed locale dict, and resolve display at the render site (source-locale regression becomes structurally impossible)
- [i18n localize schema via factory](rules/policy-i18n-localize-schema-via-factory.md) — a module-level zod/yup schema with baked-in messages can't be localized in place; convert to `buildSchema(messages)`, build per render with the active-locale dict, and `useMemo` on the dict for resolver-reference stability
- [Env via shared/config](rules/policy-env-config.md) — no direct `process.env`
- [Storage keys](rules/policy-storage-keys.md) — constants module
- [Z-index tokens](rules/policy-zindex.md) — semantic names, no magic numbers
- [Dates and numbers](rules/policy-date-number.md) — single library, `Intl.NumberFormat`
- [Nullish coalescing](rules/policy-nullish-coalescing.md) — `??` for defaults; `||` only for actual falsy semantics
- [Container layout](rules/policy-container-layout.md) — Container owns bg/max-width/padding; full-bleed/hero pages use `padding={false}`; no double `px`, no nested `bg-white`
- [Tailwind v4 theme tokens](rules/policy-tailwind-v4-theme-tokens.md) — palette overrides in `@theme` (CSS), not the JS config; @config overrides drop `--color-*` vars and silently break `var()` consumers

### Next.js

- [Cache and revalidation](rules/nextjs-cache-and-revalidation.md) — mutation → `revalidate*`; Request Memoization
- [Dynamic vs static](rules/nextjs-dynamic-vs-static.md) — static is default; recognize triggers
- [Server vs client boundary](rules/nextjs-server-vs-client-boundary.md) — `'use client'` at the lowest point; `initialData`

### React (Compiler era)

- [Compiler memoization](rules/react-compiler-memoization.md) — three legitimate `useCallback` cases
- [Compiler context dep extraction](rules/react-compiler-context-dep-extraction.md) — adding a context value (`useT`/store) inside an existing `useCallback` trips `preserve-manual-memoization`; extract the primitive to the body + add to deps, don't wrap in `useMemo`
- [Effect / state diet](rules/react-effect-discipline.md) — derived computed, events handled, effects only for external sync
- [Render purity](rules/react-render-purity.md) — no `Date.now()`/random in render; seed time state via lazy `useState(() => …)`; no sync setState in effect body
- [Optional prop threading](rules/react-optional-prop-threading.md) — an optional prop declared but not forwarded is a silent no-op; `tsc` won't catch it, a leaf behavior test will
- [Context hook provider coverage](rules/react-context-hook-provider-coverage.md) — converting a shared leaf from prop to a context hook (`useT`/`useContext`) requires a provider at every render site; missing one is a runtime throw `tsc` can't see — grep all render sites first

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
- [Hoisted tags → query document](rules/test-react-hoisted-tags.md) — React 19 hoists `<script src>`/`<title>`/`<meta>`/stylesheet to `<head>`; assert on `document`, not RTL `container`

## File template

Every rule file uses this four-section shape:

- **Symptom** — what fails when the rule isn't followed
- **Recommended pattern** — short code example
- **Anti-pattern** — short code example
- **Heuristic** — when and how to self-check
