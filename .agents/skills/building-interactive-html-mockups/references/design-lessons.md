# Compounded Design Lessons

Read this file before shaping a new mockup. Add a lesson only after the revised design has been rendered and the underlying principle has been verified.

## Entry Contract

Each lesson has exactly four parts:

### Imperative principle

- **Symptom:** Describe the visible design failure.
- **Mechanism:** Explain the structural reason it occurs.
- **Rule:** State the reusable correction in imperative form.
- **Verification:** Name the rendered states or measurements that prove the correction.

Before adding an entry:

1. Search this file for an equivalent mechanism and strengthen that entry instead of duplicating it.
2. Remove screen names, product copy, route names, and one-off pixel values.
3. Keep preferences that are unique to the current product in project instructions.
4. Do not capture the lesson until the corrected mockup has been inspected and accepted or objectively verified.

## Constrain Preview Footprint Separately from Media Ratio

- **Symptom:** A square photo preview is technically correct but dominates the form and pushes the primary inputs and actions too far down.
- **Mechanism:** `aspect-ratio` controls shape, not visual footprint; a `width: 100%` square grows with the drawer even when the task only needs a recognizable preview.
- **Rule:** Preserve the output aspect ratio while setting an intentional preview width or maximum size based on the form hierarchy. Use `object-fit: cover` inside that bounded frame.
- **Verification:** Compare the form at narrow and wide drawer widths, confirm the preview remains square without becoming full-width, and verify the title, note, and primary action remain visible in the intended reading order.

## Collapse Absent Optional Copy Without a Placeholder

- **Symptom:** An item with no optional description shows an awkward empty gap or a noisy “no description” message that competes with the actual content.
- **Mechanism:** A fixed text slot preserves space and hierarchy for content that does not exist, so adjacent media and metadata no longer feel intentionally aligned.
- **Rule:** Omit absent optional copy entirely, rebalance the remaining identity content within the media row, and keep the following summary or action anchored consistently across filled and empty states.
- **Verification:** Render filled, empty, and long-copy states at mobile width; confirm the empty state has no placeholder or reserved gap, while the media, title, and following summary remain aligned and reachable.

## Diagnose Spacing Before Shrinking a Token-Aligned Heading

- **Symptom:** A heading that matches the established type scale appears oversized or visually detached from the content below it.
- **Mechanism:** Removing supporting copy without recalibrating the container padding leaves stacked vertical gaps, making the remaining heading look larger than it is.
- **Rule:** Preserve a heading that matches its semantic type token, then remove obsolete copy and tighten the adjacent section spacing before considering a font-size override.
- **Verification:** Compare desktop and mobile renders before and after spacing changes; confirm the heading retains its intended hierarchy while reading as part of the following content group.

## Reserve Grid Gaps Before Dividing the Available Width

- **Symptom:** The last grid item touches or crosses the container edge even though the container has visible horizontal padding.
- **Mechanism:** Percentage columns that already total 100% consume the full content width; a separate `gap` is added on top and forces the grid past its padded area.
- **Rule:** Use fractional tracks such as `minmax(0, 2fr) minmax(0, 3fr)` when columns should share the space remaining after gaps, or subtract fixed gaps explicitly before assigning percentage widths.
- **Verification:** Render the narrowest and widest supported layouts, compare the first and last item edges with the container content box, and confirm both horizontal paddings remain visible without clipping or overflow.
