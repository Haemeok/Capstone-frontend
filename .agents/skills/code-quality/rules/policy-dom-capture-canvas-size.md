---
title: Resize the Export Canvas, Not the Captured DOM
prefix: policy
trigger: Exporting a responsive DOM card with html-to-image when the saved image clips or shifts content near the right or bottom edge.
---

## Symptom

A responsive card looks correct in the browser, but its downloaded image clips a right-aligned badge, shifts centered content, or loses elements near the bottom edge. The output file still has the expected pixel dimensions, so the bug can look like an overflow or padding mistake.

## Root cause

`html-to-image` copies computed child styles from the live card before applying export options to the cloned root. Passing `width` and `height` changes the clone's CSS layout size. Children whose computed widths came from the original responsive card can keep those pixel widths, overflow the smaller root, and then be cut by `overflow: hidden`.

## Recommended pattern

Preserve the captured DOM layout and resize only the output canvas. `canvasWidth × pixelRatio` and `canvasHeight × pixelRatio` determine the final bitmap size.

```ts
const EXPORT_SIZE = 360;
const PIXEL_RATIO = 3;

await toBlob(node, {
  canvasWidth: EXPORT_SIZE,
  canvasHeight: EXPORT_SIZE,
  pixelRatio: PIXEL_RATIO,
  skipAutoScale: true,
});
```

This keeps the live card's proportions intact while producing a 1080×1080 image.

## Anti-pattern

```ts
await toBlob(node, {
  width: 360,
  height: 360,
  pixelRatio: 3,
});
```

These options resize the cloned DOM itself. A card rendered at 390px can retain child geometry calculated for 390px inside a 360px root.

## Heuristic

- If the browser preview is correct but only the export is clipped, compare the live element size with the `width` and `height` passed to the capture library.
- Use canvas dimensions when the goal is output resolution. Use DOM dimensions only when the exported layout is intentionally meant to reflow.
- If a fixed export layout is required, render a separate fixed-size capture node instead of resizing a responsive preview during capture.
