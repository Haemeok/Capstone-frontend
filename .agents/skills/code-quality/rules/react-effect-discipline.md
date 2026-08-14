---
title: Effect / State Diet
prefix: react
trigger: Adding a useEffect, or seeing a useState that mirrors a prop.
---

## Symptom
Components push everything through `useState` + `useEffect` even when the value is derived from props (so it's just a computation) or when the logic completes inside an event handler (so the effect is redundant). The result: race conditions, stale state on prop changes, unnecessary renders, and the cognitive cost of treating React like a pub/sub bus.

## Recommended pattern
- **Derived state — compute, don't store.**
  ```tsx
  function Cart({ items }: Props) {
    const total = items.reduce((sum, i) => sum + i.price, 0);  // computed, not stored
    return <div>{total}</div>;
  }
  ```
- **Event-completable logic — handle inline, not in an effect.**
  ```tsx
  function SaveButton({ draft }: Props) {
    const handleClick = async () => {
      const result = await saveDraft(draft);
      toast.success(result.message);  // in the handler
    };
    return <Button onClick={handleClick}>Save</Button>;
  }
  ```
- **`useEffect` is for external system sync only.** WebSocket connects, IntersectionObserver, third-party SDK init, browser API subscriptions.

## Anti-pattern
```tsx
// Storing a prop in state
function Cart({ items }: Props) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(items.reduce((s, i) => s + i.price, 0));  // ← derived state in disguise
  }, [items]);
}

// Effect that should have been a handler
function SaveButton({ draft, isDirty }: Props) {
  useEffect(() => {
    if (isDirty) {
      saveDraft(draft).then(r => toast.success(r.message));  // ← belongs in onClick
    }
  }, [isDirty, draft]);
}
```

## Heuristic
Before writing `useEffect`, ask: "is this synchronizing with something outside React?" No → it's probably a handler or a computation.
Before writing `useState`, ask: "is the source of truth elsewhere?" Yes → don't store; compute.
