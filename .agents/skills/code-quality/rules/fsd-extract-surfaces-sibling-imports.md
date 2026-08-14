---
title: Extracting App Composition Into a Widget Surfaces Sibling-Widget Imports
prefix: fsd
trigger: Moving a route's section components out of `app/(route)/_components/` into a `widget/` so a second route can share them.
---

## Symptom

A "pure move" refactor (relocate section components into a shared widget, no logic change) compiles and tests green, but the FSD lint suddenly reports a batch of `slice-isolation` violations that didn't exist before — the widget now "must not import sibling slice X". The diff added no imports; the warnings appeared anyway.

## Root cause

While the section components lived under `app/(route)/_components/`, their imports of other widgets were **legal**: `app` is the top layer, so `app → widget` flows downward. The moment they move into a `widget/` slice, those same imports become **same-layer** `widget → widget` — a slice-isolation violation. The coupling was always there; the layer move only changed its legality.

## Recommended pattern

Before extracting, grep the candidate components for sibling-widget imports and decide the home for that shared dependency up front.

```
# Before moving app/(route)/_components/* into widgets/Detail/
rg "@/widgets/" app/(route)/_components/    # ← every hit becomes a widget→widget violation after the move
```

- Genuinely shared primitive (Toast, carousel shell, header chrome) → lift to `shared/ui` first, then both widgets consume it.
- Composition that only the page should own → inject via `children`/props from the app layer instead of importing the sibling widget inside the new widget.
- If lifting is out of scope for the current task, **file the violation as a tracked issue and accept it as a warning** — but surface the consequence at planning time, not as a surprise at lint.

## Anti-pattern

- Treating "tsc passes + tests green" as proof the extraction was clean. FSD slice-isolation is a lint-layer concern; type-check and unit tests don't see it.
- Discovering the sibling coupling only when the lint runs after the move, then scrambling to restructure under deadline. The cost was knowable from a one-line grep beforehand.

## Heuristic

A widget may import `shared/`, `entities/`, `features/` — never another `widget/`. Before relocating app-layer composition into a widget, count its `@/widgets/*` imports: each one is a same-layer violation waiting to surface. Plan their home (lift to shared, or compose at the page) _before_ the move.
