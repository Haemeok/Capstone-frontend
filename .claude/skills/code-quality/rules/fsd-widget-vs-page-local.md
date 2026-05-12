---
title: Widget vs Page-Local Component
prefix: fsd
trigger: A page-section component is ≥100 lines but currently used in only one page.
---

## Symptom
Two parallel placement instincts compete: "this is big enough to be a widget" vs "this is only used here, it should sit next to the page." Without an explicit rule, the same kind of file lands in both places randomly.

## Recommended pattern
- **Single-page use** → `app/(route)/_components/<Name>.tsx`. Flat. Underscore prefix marks it private to the route (Next.js convention — not routed).
- **Multi-page use** OR strong cross-feature reuse intent → `widget/<Name>/` with its own slice structure (`ui/`, `model/`, `lib/`).

```
app/
  recipe/
    [id]/
      _components/
        RecipeHeader.tsx     ← only used by this page
        RecipeHero.tsx
      page.tsx               ← composes widget/ + _components/

widgets/
  RecipeGrid/                ← used by /recipe, /search, /my-recipes
    ui/
    model/
```

## Anti-pattern
- Nesting `_components/_internal/...` because a `_components/` file got large. Promote the inner pieces to a widget or feature instead.
- Treating "uses multiple entities" as the sole widget signal. A single-route hero that touches three entities is still a `_components/` file if no other page imports it.

## Heuristic
Count the import sites. 1 = `_components/`. ≥2 = `widget/`. When the count changes, move on the next touch.
