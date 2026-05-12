---
title: Z-Index Tokens
prefix: policy
trigger: Writing a `z-` Tailwind class or `z-index:` CSS value.
---

## Symptom
Magic z-index numbers fight each other. The modal at `z-50` covers the toast at `z-40` — until someone adds a tooltip at `z-100` and now the modal sits on top of its own confirmation dialog. The fix becomes "bump my z-index higher than yours forever."

## Recommended pattern
Tokenize z-index in `shared/config/z-index.ts` (or via the Tailwind plugin) with semantic levels.

```ts
export const zIndex = {
  dropdown: 10,
  sticky: 20,
  drawer: 30,
  modal: 40,
  toast: 50,
  tooltip: 60,
} as const;
```

Expose them as Tailwind utilities (`z-modal`, `z-toast`, etc.) via `theme.extend.zIndex`.

## Anti-pattern
```tsx
<div className="z-50">      {/* ← what is 50 relative to? */}
<div className="z-[9999]">  {/* ← someone is sad about layering */}
```

## Heuristic
If two z-index values in the codebase lack a written ordering reason, they will fight. Tokenize once.
