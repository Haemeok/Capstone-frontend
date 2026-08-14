---
title: Wiring a Self-Detect Locale Hook Into an Existing Module Breaks Its Pre-Existing `next/navigation` Test Mock — Update the Mock, and Don't Trust the `i18n` Test Filter
prefix: policy
trigger: Adding a self-detect dictionary hook (`useXxxDict` / anything calling `usePathname` via `resolveChromeLocale`) into a hook or component that already existed and already had tests, in a codebase where locale is read from the pathname.
---

## Symptom

After localizing an existing hook/component (you added `const t = useXxxDict()`), a **pre-existing, unrelated test suite** for that module suddenly fails with `TypeError: (0 , _navigation.usePathname) is not a function` — every test in the file throws at render/`renderHook`. Your new `*.i18n.test.tsx` is green, `npx tsc --noEmit` is clean, and `npx jest i18n` is green, so nothing in your normal verification flags it. It surfaces only when the full suite runs (CI) or a reviewer runs the module's other tests.

## Root cause

Self-detect dict hooks resolve locale from the URL: `usePathname()` → `resolveChromeLocale(pathname)` → `messages[locale]`. The moment you add `useXxxDict()` to a module, that module's render path now calls `usePathname()`. But the module's **older** tests were written before it had any navigation dependency, so they either don't mock `next/navigation` at all, or mock it with only the members they needed then (commonly just `useRouter`). A partial mock replaces the whole module — so `usePathname` is `undefined`, and calling it throws.

The trap compounts because the failing file is named for the module (`useSubmitRemix.test.tsx`), not `*.i18n.*`, so a `jest <feature> i18n`-style filter skips it. "All my i18n tests pass" is true and misleading.

**Incorrect — partial mock predates the new `usePathname` dependency:**

```tsx
// useSubmitRemix.test.tsx (written before localization)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ replace: jest.fn() })),
}));
// ...then the hook gains `const { ui } = useRecipeFormDict()` → calls usePathname() → throws
```

**Correct — add the member the new dict hook needs:**

```tsx
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ replace: jest.fn() })),
  usePathname: jest.fn(() => "/foo/bar"), // any path; these tests don't assert locale copy
}));
```

## Recommended pattern

- When you wire `useXxxDict()` (or any `usePathname` consumer) into an **existing** module, immediately `git grep -l` for that module's test files and confirm each one's `next/navigation` mock includes `usePathname`. Treat this as part of the change, not a follow-up.
- For tests that don't care about locale, `usePathname: jest.fn(() => "/")` (default/source locale) is enough — don't over-specify.
- Don't gate your verification on a name filter. After localizing a shared module, run the module's **own** test file by name (and ideally the touched feature directory), not just `jest i18n`. The regression hides precisely in the files that don't match `i18n`.

## Anti-pattern

- Reaching for `jest.mock("@/shared/i18n", () => …)` (a barrel mock of your own dictionary module) to "make the import work." The barrel loads fine under jest — verify by checking that an existing test already imports from it. Mocking your own module is forbidden by the test rules and it masks the real hook. If a single submodule is all you need, import it directly (`@/shared/i18n/recipeFormMessages`) instead of barrel-mocking.
- Assuming `tsc` will catch it. A partial `jest.mock` factory is untyped against the real module shape, so the missing `usePathname` is a runtime-only failure.

## Heuristic

Adding a pathname-reading hook to an existing module is a **test-surface change**, not just a behavior change: every render site now needs `usePathname` mocked. The tell is `usePathname is not a function` in a suite you didn't touch. Verify by running the module's pre-existing test file by name — and note that jest CLI treats App Router dynamic-segment paths like `app/recipes/[recipeId]/__tests__/x.test.tsx` as a **regex** (`[recipeId]` is a char class), so a batched run can silently skip them; use `jest --runTestsByPath "<path>"` or per-file quoted invocations to be sure they actually ran.

Related: [[policy-i18n-type-gate-misses-unextracted-strings]] (the other "my green checks lied" i18n trap — the type gate and the `i18n` filter both miss things grep/by-name runs catch).
