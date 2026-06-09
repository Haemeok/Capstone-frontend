---
title: Container Owns Background, Max-Width, and Padding — Don't Double It
prefix: policy
trigger: Building a page/route client that wraps content in `@/shared/ui/Container`, especially with a full-bleed hero or image band.
---

## Symptom

A hero/image band that should run edge-to-edge instead sits inset with side gutters, and inner sections get squeezed. Cause: `Container` already supplies `bg-white`, `md:max-w-4xl`, and (default `padding`) `px-4 pt-2 md:px-6`. Wrapping it again in `<div className="bg-white">` is redundant, and leaving the default padding on while each section also adds `px-4` produces **double padding** (effective `px-8`). The hero can never reach the edge because the Container padding boxes it in.

## Recommended pattern

For hero / full-bleed / image-led pages, opt out of Container padding and let each section own its horizontal padding. Standard example in repo: `widgets/IngredientDetailPage/IngredientDetailPageClient.tsx`.

```tsx
<Container padding={false}>
  <CategoryHero tagCode={tagCode} /> {/* full-bleed: no px */}
  <CategoryChips currentCode={tagCode} /> {/* section owns px-4 */}
  <div className="flex items-center justify-between px-4 py-3">…</div>…
</Container>
```

## Anti-pattern

```tsx
<Container>
  {" "}
  {/* default padding px-4 still on */}
  <div className="bg-white">
    {" "}
    {/* redundant — Container is already bg-white */}
    <Hero /> {/* boxed in by Container px — not full-bleed */}
    <div className="px-4">…</div> {/* px-4 + Container px-4 = px-8 */}
  </div>
</Container>
```

## Heuristic

If the page has a full-bleed hero or any section that manages its own `px`, use `<Container padding={false}>`. Never nest a `bg-white` wrapper directly inside Container. If you wrote `px-4` on a section, the Container above it must be `padding={false}`, or you've double-padded.
