---
title: FSD Component Placement
prefix: fsd
trigger: Deciding where a new file lives, or moving an existing one.
---

## Symptom
Without an internal philosophy, FSD becomes a folder convention with no semantic teeth. Components land in `widgets/` because "it's pages-ish" without anyone defining what widget means. Six months in, the layers blur and the layout no longer guides choice.

## Recommended pattern
Use this table for component placement. `_components/` and `page.tsx` are locations within `app`, not separate FSD layers. Entity and feature ownership is defined in [Entity vs feature](fsd-entity-feature-boundary.md).

| Layer | Test |
|---|---|
| `shared/` | Domain-independent primitive. Reuse follows [Rule of three](size-rule-of-three.md), including its policy/primitive exceptions. |
| `widgets/` | Composes features + entities into a section used by at least two routes. Read queries OK; mutations delegated to features. |
| `app/(route)/_components/` | Used in exactly one route. Flat structure — no nested folders. |
| `app/(route)/page.tsx` | Pure composition of widgets + `_components/`. |

Promotion / demotion:
- `_components/` → `widgets/` when a second route needs the section, including a second route being implemented in the current task. Hypothetical future reuse is insufficient.
- `widgets/` → `_components/` when it has shrunk to one route; consider this on a relevant touch, not as an unrelated cleanup mandate.
- `widgets/` → `shared/ui/` when it has lost business meaning (e.g. a generic toast shell).

Count distinct consuming routes, not JSX occurrences. A section rendered twice on one route remains page-local. Before promotion, apply [sibling-import check](fsd-extract-surfaces-sibling-imports.md).

## Anti-pattern
- Putting a route-specific section in `widget/` because "it's big." Size doesn't determine layer; reuse + composition does.
- Putting a generic UI primitive (`Spinner`, `Card`) in `widget/` because it landed there once.

## Heuristic
"How many call sites does this file have, and what domain does it know?" Two answers, two layers. Don't overthink; correct on the next touch ("방청소" cadence).
