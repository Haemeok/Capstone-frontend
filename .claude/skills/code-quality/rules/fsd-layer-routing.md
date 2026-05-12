---
title: FSD 4-Layer Placement
prefix: fsd
trigger: Deciding where a new file lives, or moving an existing one.
---

## Symptom
Without an internal philosophy, FSD becomes a folder convention with no semantic teeth. Components land in `widgets/` because "it's pages-ish" without anyone defining what widget means. Six months in, the layers blur and the layout no longer guides choice.

## Recommended pattern
Four layers, each with a concrete test:

| Layer | Test |
|---|---|
| `shared/` | Doesn't know any business domain. Reused in ≥2 places. |
| `widget/` | Composes features + entities into a page section. Reusable (≥1 site). Read queries OK; mutations delegated to features. |
| `app/(route)/_components/` | Used in exactly one route. Flat structure — no nested folders. |
| `app/(route)/page.tsx` | Pure composition of widgets + `_components/`. |

Promotion / demotion:
- `_components/` → `widget/` when a second page imports it.
- `widget/` → `_components/` when it has shrunk to one usage and is unlikely to grow.
- `widget/` → `shared/ui/` when it has lost business meaning (e.g. `Toast`, `Footer`).

## Anti-pattern
- Putting a route-specific section in `widget/` because "it's big." Size doesn't determine layer; reuse + composition does.
- Putting a generic UI primitive (`Spinner`, `Card`) in `widget/` because it landed there once.

## Heuristic
"How many call sites does this file have, and what domain does it know?" Two answers, two layers. Don't overthink; correct on the next touch ("방청소" cadence).
