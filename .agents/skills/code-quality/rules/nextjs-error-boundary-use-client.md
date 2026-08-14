---
title: error.tsx / global-error.tsx Must Carry "use client" on Their Own File
prefix: nextjs
trigger: Creating a locale-aliased or re-exported error.tsx/global-error.tsx, or a build fails with "X must be a Client Component".
---

## Symptom

`next build` fails: `app/<locale>/.../error.tsx must be a Client Component. Add the "use client" directive...` — even though the component it re-exports already starts with `"use client"`.

## Root cause

Next treats `error.tsx` and `global-error.tsx` as special convention files: the **file used as the error boundary must itself be a Client module**. A bare re-export is its own module boundary and does _not_ inherit the directive from the target it re-exports — Next checks _this_ file, finds no directive, and fails the build.

```tsx
// app/ja/calendar/[date]/error.tsx — FAILS the build
export { default } from "../../../calendar/[date]/error";
//  ↑ the re-exported default IS a client component, but THIS module isn't marked
```

## Recommended pattern

Put `"use client"` at the top of the re-export file itself:

```tsx
// app/ja/calendar/[date]/error.tsx
"use client";

export { default } from "../../../calendar/[date]/error";
```

## Anti-pattern

Assuming a re-export inherits client-ness like a normal `page.tsx`/`layout.tsx` would. Regular page/layout re-exports of a client component build fine; **only** `error.tsx` and `global-error.tsx` demand the directive on their own file.

## Heuristic

- When mirroring routes per locale (ko → `/ja`·`/en` re-export stubs), audit every error boundary at once — the build stops at the first offender, so fixing one just reveals the next:
  `for f in $(find src/app -name error.tsx -o -name global-error.tsx); do echo "$(head -1 "$f")  $f"; done` — every line must print `"use client"`.
- `tsc --noEmit` will **not** catch this; it's a build-time RSC boundary check. Only `next build` (or CI) surfaces it.
