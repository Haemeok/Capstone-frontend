---
title: Tailwind v4 Palette Overrides Live in @theme, Not the JS Config
prefix: policy
trigger: Adding or overriding color tokens (especially a default namespace like `gray`) in a Tailwind v4 project that loads a legacy `tailwind.config.js` via `@config`.
---

## Symptom
After overriding a default color namespace (e.g. `gray`) in `tailwind.config.js`, the utility classes (`text-gray-500`, `bg-gray-50`) render the new values — but every element relying on a `var(--color-gray-*)` consumer silently changes. Typical blast radius: a `@layer base` rule like `border-color: var(--color-gray-200, currentColor)` falls back to `currentColor`, turning every unspecified border near-black app-wide. Nothing errors; the page just looks suddenly heavier.

## Root cause
In Tailwind v4, default palette colors exist as `--color-*` CSS variables emitted from the built-in `@theme`. Overriding a namespace through the legacy JS config (`@config "./tailwind.config.js"`) replaces the *utility generation* for that namespace but **removes the default `--color-*` variables without emitting replacements**. Utilities keep working; every `var(--color-*)` reference breaks to its fallback.

## Recommended pattern
Define palette overrides and new tokens in `@theme` in the CSS entrypoint — this emits both the utilities and the CSS variables:

```css
@theme {
  --color-gray-200: #e5e5e5;
  --color-gray-500: #737373;
  --color-ink: #222222;
  --color-ink-muted: #767676;
}
```

`text-ink`, `border-gray-200`, and `var(--color-ink)` all stay consistent from one source.

## Anti-pattern
```js
// tailwind.config.js (loaded via @config) — utilities update, vars vanish
theme: {
  extend: {
    colors: {
      gray: { 200: "#e5e5e5", 500: "#737373" },
    },
  },
},
```

```css
/* this base rule now silently falls back to currentColor */
* { border-color: var(--color-gray-200, currentColor); }
```

## Heuristic
After any palette change in a v4 project, probe a computed style that flows through a CSS variable (e.g. `getComputedStyle` on an element with an unspecified border), not just a utility class. Brand-new custom colors are also affected: JS-config-only colors work as utilities but are invisible to `var()` consumers, animation libraries reading vars, and `@theme`-driven tooling.
