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

## Anti-pattern
```tsx
const handleClick = useCallback(() => {  // ← compiler handles this; remove the wrap
  setOpen(true);
}, []);

return <Button onClick={handleClick}>Open</Button>;
```

## Heuristic
Look at the call site of the wrapped value. Does it cross into an external system, feed `useEffect` deps, or expose an imperative handle? No → unwrap.
