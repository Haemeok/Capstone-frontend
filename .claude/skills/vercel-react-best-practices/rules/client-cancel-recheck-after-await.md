---
title: Re-check Cancel Flag After Every Await in Polling Loops
impact: HIGH
impactDescription: prevents stale poll updates from overwriting cancelled state
tags: async, polling, cancellation, react, hooks
---

## Re-check Cancel Flag After Every Await in Polling Loops

A cancel flag (`stoppedRef.current`, `cancelledRef.current`, etc.) checked only at the loop boundary is not enough when the body awaits. Every `await` is a yield point — by the time the promise resolves, the user may have already cancelled, and any `setState` that runs before the next iteration's check will clobber the cancelled state.

**Incorrect — flag checked only at loop top:**

```tsx
const stoppedRef = useRef(false);

const run = useCallback(async (taskId: string) => {
  stoppedRef.current = false;
  while (!stoppedRef.current) {
    const r = await fetch(`/status/${taskId}`);  // yields here
    const t = await r.json();                    // yields here

    // BUG: by the time we get here, cancel() may have set stoppedRef=true
    // and setState({status:"idle"}). The next setState overwrites it.
    if (t.status === "succeeded") {
      setState({ status: "success", videoUrl: t.videoUrl });
      return;
    }
    setState({ status: "polling", lastStatus: t.status });

    await new Promise((r) => setTimeout(r, 5000));
  }
}, []);

const cancel = useCallback(() => {
  stoppedRef.current = true;
  setState({ status: "idle" });
}, []);
```

When `cancel()` runs while a fetch is in-flight, the loop body still completes one more `setState` (success or polling) before the next `while` check exits the loop. The user sees the UI flicker back from "idle" — and worse, a successful response can land *after* cancel and write `success` over the cancelled idle.

**Correct — re-check the flag after every await, before any setState:**

```tsx
const stoppedRef = useRef(false);

const run = useCallback(async (taskId: string) => {
  stoppedRef.current = false;
  while (!stoppedRef.current) {
    try {
      const r = await fetch(`/status/${taskId}`);
      const t = await r.json();

      if (stoppedRef.current) return;  // post-await guard

      if (t.status === "succeeded") {
        setState({ status: "success", videoUrl: t.videoUrl });
        return;
      }
      setState({ status: "polling", lastStatus: t.status });
    } catch (err) {
      if (stoppedRef.current) return;  // also guard the error path
      setState({ status: "error", message: String(err) });
      return;
    }

    await new Promise((r) => setTimeout(r, 5000));
  }
}, []);
```

Key points:
- Every `await` releases the microtask queue and gives `cancel()` a window to flip the flag and call its own `setState`. Treat each `await` as an "any state could have changed" boundary.
- Place the guard between the `await` that consumed the body and the first `setState` of that iteration. Returning silently is correct — the cancel path already set the terminal state.
- The `catch` branch needs the same guard. An `AbortError` or network failure that arrives *after* cancel must not write `error` over `idle`.
- This applies to any cancel-flag pattern in async loops, not just polling: streaming readers, retry loops, paginated fetchers — anywhere the body can await and a sibling action can mutate the cancel flag.
