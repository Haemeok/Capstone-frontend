---
title: Absolute Badges Need a Content-Hugging Anchor — Inline Children Inflate the Wrapper
prefix: policy
trigger: Positioning a badge/dot with absolute offsets on a `relative` wrapper around an icon link/button, or a reusable badge wrapper looks right in one placement and wrong in another.
---

## Symptom

An absolutely-positioned count badge floats far from its icon — sometimes off-screen (`-top-*` resolving above the viewport) — while the exact same wrapper component looks correct elsewhere in the app.

## Root cause

The `relative` wrapper's box is not the icon's box. When the wrapper's only child is an **inline** element (an `<a>` around an svg), the wrapper's height is the _line box_: font strut, `line-height`, and baseline alignment can inflate a 22px icon's wrapper to 70px+. Absolute offsets (`-top-1 -right-1`) anchor to that inflated box, so the badge lands nowhere near the icon. The same wrapper works in another placement (e.g. around a block-level button), which hides the bug — the wrapper is context-sensitive, not broken.

## Recommended pattern

Make the anchor hug its content — turn the wrapper into a flex container (children become block-level flex items, no line-box strut):

```tsx
const POSITION = {
  nav: "-top-1 left-1/2 translate-x-1", // wide tab button — offset from center
  header: "-top-1.5 -right-1.5", // icon-sized anchor — corner offset
} as const;

<div className={cn("relative", variant === "header" && "flex")}>
  {children}
  <span className={cn("absolute ...", POSITION[variant])}>{count}</span>
</div>;
```

Key points:

- Verify with `getBoundingClientRect()` on wrapper vs icon, not by eyeballing a screenshot: `wrapper.h ≈ icon.h` is the invariant. A 22px icon inside a 70px wrapper is the fingerprint.
- A reusable positioned-overlay wrapper needs a per-placement variant (offset + display), because the anchor geometry depends on what it wraps.
- `inline-flex` on the child also works; fixing the wrapper (`flex`) is safer when the child comes in as `children`.

## Anti-pattern

```tsx
<div className="relative">
  {" "}
  {/* block wrapper, inline <a> child */}
  <a className="p-1">
    <Icon size={22} />
  </a>{" "}
  {/* line box → wrapper ~70px tall */}
  <span className="absolute -right-1 -top-1">3</span>{" "}
  {/* anchored to the wrong box */}
</div>
```
