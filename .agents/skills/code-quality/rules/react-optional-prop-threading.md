---
title: An Optional Prop Added But Not Forwarded Is a Silent No-Op
prefix: react
trigger: Threading a new prop (locale, theme, variant) through a multi-layer component chain to reach a leaf that consumes it.
---

## Symptom

You add `locale` to a feature and pass it into the top component. It compiles, ships, and does nothing — the leaf card still renders the default. No type error pointed at the gap.

## Root cause

Declaring `locale?: "ko" | "ja"` on an intermediate component's prop type does **not** wire it through. If that component never destructures the prop and never forwards it, the value stops there. Because the prop is **optional**, TypeScript is satisfied at every hop — the missing forward is invisible to the type-checker. The chain looks connected (every layer "has" the prop in its type) but the value only travels as far as the last layer that actually passes it on.

## Recommended pattern

Trace the prop from the producer to the leaf that consumes it, and confirm every hop both **destructures** and **forwards** it.

```tsx
// ❌ type declares it, body drops it — silent no-op
type SlideProps = { recipeId: string; locale?: Locale };
const Slide = (
  { recipeId }: SlideProps // locale never destructured
) => <Grid recipeId={recipeId} />; // …never forwarded

// ✅ destructured and forwarded at every hop until the leaf uses it
const Slide = ({ recipeId, locale }: SlideProps) => (
  <Grid recipeId={recipeId} locale={locale} />
); // reaches Card → buildHref(id, locale)
```

## Anti-pattern

- Adding the prop to each layer's type "so it type-checks" and assuming that wires it. The type is a declaration of intent, not a forward.
- Trusting `tsc` to catch the gap. Optional props make an unforwarded prop type-clean — only a leaf-level behavior test (assert the rendered `href`/output reflects the value) catches it.

## Heuristic

When threading a prop through N layers, the contract isn't "N types mention it" — it's "N−1 layers forward it and the leaf consumes it." Add or reuse a leaf behavior test (e.g. assert the card's `href` changes with `locale`) so an unforwarded hop fails loudly instead of silently.
