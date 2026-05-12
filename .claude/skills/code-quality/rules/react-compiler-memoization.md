---
title: useCallback / useMemo Only When the Compiler Cannot
prefix: react
trigger: Writing or seeing a useCallback / useMemo call.
---

## Symptom
React Compiler is enabled, yet `useCallback` / `useMemo` are still everywhere — leftover habit from pre-Compiler code or copy-pasted patterns. The wraps now hide real referential-equality requirements; reviewing memoization correctness becomes harder because most of them are noise.

## Recommended pattern
`useCallback` / `useMemo` are legitimate in three cases only:

1. **Registering a callback with an external system that compares by reference.**
   ```ts
   useEffect(() => {
     const obs = new IntersectionObserver(handleVisible);
     obs.observe(ref.current);
     return () => obs.disconnect();
   }, [handleVisible]);  // handleVisible must be stable
   ```

2. **Entering `useEffect` deps where ref equality drives the comparison.**
   Same shape as case 1, more general.

3. **`forwardRef` / `useImperativeHandle`** when the imperative API surface must be stable across renders.

Anywhere else, remove the wrap and let the compiler handle it.

## Extraction alternative — preferred when 3+ `useCallback`s chain

When a hook accumulates three or more `useCallback`s — typically because each handler is consumed by the next, and the last one feeds a `useEffect` dep array — the cleaner move is to **lift the handlers out of the component entirely**. The hook becomes an orchestrator: subscribe to stores, build a `deps` object via `useMemo`, hand it to module-level pure helpers.

```tsx
// model/jobPollingHandlers.tsx — pure helpers, no React
type Deps = {
  queryClient: QueryClient;
  addToast: AddToast;
  storeActions: { completeJob, failJob, /* ... */ };
};

export const completePollingJob = (deps: Deps, key: string, recipeId: string) => { /* ... */ };
export const failPollingJob   = (deps: Deps, key: string, code: string, message: string) => { /* ... */ };
export const pollSingleJob    = async (deps: Deps, job: Job) => { /* ... */ };

// useJobPolling.tsx — orchestrator
const useJobPolling = () => {
  const deps = useMemo<Deps>(() => ({ queryClient, addToast, storeActions: { /* ... */ } }), [/* ... */]);
  useEffect(() => { pollSingleJob(deps, job); }, [/* ..., */ deps]);
};
```

Benefits:
- Zero `useCallback`. The compiler has nothing to wrap.
- Helpers are pure functions — testable without React.
- The hook body drops to half its previous size.
- Removing handlers from the component breaks no rendering invariants — they were never doing anything React-specific.

The cases above (external-system callback, `useEffect` deps, `forwardRef`) are still legitimate for **single** memoized values that genuinely need referential stability. The extraction pattern is for the moment you see a chain forming.

## Anti-pattern
```tsx
const handleClick = useCallback(() => {  // ← compiler handles this; remove the wrap
  setOpen(true);
}, []);

return <Button onClick={handleClick}>Open</Button>;
```

## Heuristic
Look at the call site of the wrapped value. Does it cross into an external system, feed `useEffect` deps, or expose an imperative handle? No → unwrap.
