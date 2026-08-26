---
title: Defer Non-Essential Auto-Open Overlays Until the Page Is Idle
impact: HIGH
impactDescription: prevents portal side effects from corrupting hydration
tags: rendering, react, nextjs, hydration, dialog, drawer, portal
---

## Defer Non-Essential Auto-Open Overlays Until the Page Is Idle

An overlay that opens automatically can mutate DOM outside its own React subtree. Dialog and drawer libraries commonly add `aria-hidden`, `inert`, scroll locks, or pointer-event styles to page siblings as soon as they open. In a streamed Next.js page, one client boundary can finish hydrating while a sibling `Suspense` boundary is still hydrating. Opening the overlay at that moment changes the DOM React expects and can produce hydration warnings even though the overlay's own server and client markup match.

**Incorrect — open as soon as the overlay component hydrates:**

```tsx
const getServerSnapshot = () => false;
const getSnapshot = () => localStorage.getItem("welcome-seen") !== "1";

const WelcomeDrawer = () => {
  const shouldOpen = useSyncExternalStore(
    subscribeToStorage,
    getSnapshot,
    getServerSnapshot
  );

  return <Drawer open={shouldOpen}>...</Drawer>;
};
```

`useSyncExternalStore` keeps this component's hydration snapshot stable, but it does not prove that sibling boundaries have hydrated. The drawer may still open early enough for its focus and accessibility guards to modify those siblings.

**Correct — wait for page load and an idle turn before opening:**

```tsx
const WelcomeDrawer = () => {
  const [isPageIdle, setIsPageIdle] = useState(false);
  const shouldOpen = useShouldShowWelcomeDrawer();

  useEffect(() => {
    let idleId: number | undefined;
    let frameId: number | undefined;

    const markReady = () => setIsPageIdle(true);
    const scheduleWhenIdle = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(markReady, { timeout: 1500 });
        return;
      }

      frameId = window.requestAnimationFrame(markReady);
    };

    if (document.readyState === "complete") {
      scheduleWhenIdle();
    } else {
      window.addEventListener("load", scheduleWhenIdle, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleWhenIdle);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <Drawer open={isPageIdle && shouldOpen}>...</Drawer>;
};
```

This keeps the server render and initial client render closed, then allows the browser to finish loading and gives pending hydration work an idle turn before the portal library mutates the rest of the page.

Key points:

- A matching snapshot only protects the component using it; streamed sibling boundaries can still be hydrating.
- Apply this delay to non-essential overlays that open without a user action, such as launch notices and onboarding prompts. User-triggered dialogs should open immediately.
- A single `requestAnimationFrame` only waits for the next paint and is not evidence that hydration elsewhere has finished. Prefer an idle callback after `load`, with a bounded timeout and a fallback.
- Reproduce the original failure in a fresh browser context. Client navigation or a warmed development session can hide a first-load hydration race.
- Suspect this problem when an auto-open overlay causes hydration warnings in an unrelated header or sibling and the overlay library manages focus, accessibility hiding, or scroll locking.
