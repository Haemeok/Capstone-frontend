---
title: Widget vs Page-Local Component
prefix: fsd
trigger: A page-section component is ≥100 lines but currently used in only one page.
---

## Symptom
Two parallel placement instincts compete: "this is big enough to be a widget" vs "this is only used here, it should sit next to the page." Without an explicit rule, the same kind of file lands in both places randomly.

## Recommended pattern
Use the canonical [component placement table](fsd-layer-routing.md). Size alone does not promote a section to `widgets/`; a second consuming route does. Keep page-local `_components/` flat.

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
- Nesting `_components/_internal/...` because a file got large. Split page-local pieces into sibling files; use a feature only for a user action, or a widget when the placement table calls for one.
- Treating "uses multiple entities" as the sole widget signal. A single-route hero that touches three entities is still a `_components/` file if no other page imports it.

## Heuristic
Count routes using [component placement](fsd-layer-routing.md), then check imports before moving. Do not infer reuse from component size or nested folders.
