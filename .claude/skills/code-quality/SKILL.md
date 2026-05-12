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

_(Populated in Task 9 once every rule file exists.)_

## File template

Every rule file uses this four-section shape:

- **Symptom** — what fails when the rule isn't followed
- **Recommended pattern** — short code example
- **Anti-pattern** — short code example
- **Heuristic** — when and how to self-check
