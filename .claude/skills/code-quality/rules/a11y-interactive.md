---
title: Interactive Elements — Native Buttons, Cursor, Aria-Label
prefix: a11y
trigger: Wiring up a click handler on a non-button element, or shipping an icon-only button.
---

## Symptom
`<div onClick>` is not keyboard-focusable, does not announce as a button to assistive tech, and has no default focus ring. Icon-only buttons without `aria-label` are unreachable for screen-reader users. Buttons without `cursor-pointer` give no hover affordance. Each is a small bug; together they compound into "this UI is hostile."

## Recommended pattern
- **Interactive elements**: native `<button>`, `<a>`, or a Radix primitive.
  ```tsx
  <button onClick={handleClick} className="cursor-pointer">Save</button>
  ```
- **Cursor**: every interactive element carries `cursor-pointer` (Tailwind), so the affordance is visible on hover.
- **Icon-only buttons**: `aria-label` required.
  ```tsx
  <button aria-label="Close" onClick={onClose} className="cursor-pointer">
    <X className="h-4 w-4" />
  </button>
  ```
- **Form inputs**: linked to a `<label>` via `htmlFor`, or supply `aria-label`.

## Anti-pattern
```tsx
<div onClick={handleClick}>Save</div>      // not a button
<button><X /></button>                     // no aria-label
<input type="text" />                      // no label
<button onClick={/* ... */}>...</button>   // no cursor-pointer
```

## Heuristic
Before shipping any click handler: is the element a `<button>`, `<a>`, or Radix primitive? Does it have `cursor-pointer`? If the content is icon-only, does it have `aria-label`?
