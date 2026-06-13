---
title: When Adding a Context Value to an Existing useCallback, Extract a Primitive in the Body — Don't Reference the Context Object Inside the Memoized Closure
prefix: react
trigger: Adding a context hook (`useT`, a store selector, `useTheme`) to a hook/component that already has a `useCallback`/`useMemo` with a manual deps array, and using the context value inside the memoized body.
---

## Symptom

You add `const t = useT()` to a hook that already has a legitimate `useCallback`, and reference `t.something` inside the callback. Pre-commit fails with React Compiler lint error `react-hooks/preserve-manual-memoization`: _"existing memoization could not be preserved; the inferred dependency was `t`, but the source dependencies were [a, b, c]."_ It's an **error**, not a warning, so lint-staged blocks the commit.

## Root cause

The existing `useCallback` has a manual dependency array (legitimately — it feeds an external system or a `useEffect`). React Compiler infers the callback's real dependencies from its body; once you read `t` inside, the inferred set includes `t`, but the hand-written array doesn't. The compiler refuses to "preserve" a manual memoization whose declared deps disagree with the inferred ones, because the mismatch could make the value change more or less often than intended. Adding a context hook to a memoized closure is the classic way to trip this during an i18n/theme migration.

**Incorrect — context object read inside the closure, deps array left untouched:**

```tsx
const t = useT();
const submit = useCallback(
  async (req) => {
    createJob({ displayName: t.domain.models[id].name, req }); // `t` inferred, absent from deps
  },
  [id, createJob] // ❌ inferred {t, id, createJob} ≠ manual {id, createJob}
);
```

**Correct — extract the primitive in the component body, add it to deps:**

```tsx
const t = useT();
const displayName = t.domain.models[id].name; // pull the leaf value out of the closure
const submit = useCallback(
  async (req) => {
    createJob({ displayName, req });
  },
  [id, createJob, displayName] // ✅ inferred == manual; `displayName` is a stable string
);
```

Key points:

- Extract a **primitive** (string/number), not the context object. A string compares by value, so adding it to deps is cheap and the inferred/manual sets line up. Threading the whole `t` object risks referential churn elsewhere.
- Do **not** dodge the error by wrapping in `useMemo`/`useRef` — this codebase restricts `useMemo` to the three referential-stability cases (see `react-compiler-memoization`). The fix is extraction, not more memoization.
- This is an error that gates the commit, not a soft warning. It surfaces the moment a context hook meets a pre-existing `useCallback`, which is exactly when bolting localization onto an existing data hook.

## Heuristic

After adding any context hook to a component that already memoizes, scan for `useCallback`/`useMemo` bodies that now read the context value. For each, hoist the specific leaf value to a `const` in the body and append it to the dep array — don't reference the context object from inside the closure.
