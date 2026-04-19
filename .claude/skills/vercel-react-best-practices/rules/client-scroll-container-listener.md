---
title: Subscribe Scroll Listeners to the Actual Scroll Container, Not Window
impact: MEDIUM
impactDescription: fixes silent no-ops when the app uses a custom scroll wrapper
tags: client, scroll, event-listeners, layout, context, mobile
---

## Subscribe Scroll Listeners to the Actual Scroll Container, Not Window

Many app shells — mobile PWAs, iOS/Android WebView bridges, page-transition wrappers, sticky-header apps — place `overflow-y-auto` on an inner wrapper element instead of letting the document itself scroll. In that setup `window.scrollY` is permanently `0` and `window.addEventListener("scroll", ...)` never fires. Scroll-driven UI wired to `window` silently does nothing — the component mounts, the handler attaches, the user scrolls, nothing happens, no error.

This is one of the most common "works in a fresh codesandbox, does nothing in the real app" failure modes.

**Incorrect — listens to something that never scrolls:**

```tsx
useEffect(() => {
  const onScroll = () => {
    setCollapsed(window.scrollY > window.innerHeight * 0.5);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

Looks correct in isolation, but if the app's layout wraps children in:

```tsx
<div className="h-[100dvh] overflow-y-auto">{children}</div>
```

...the document itself doesn't scroll — that inner `<div>` does. The listener above never fires. `window.scrollY` stays at `0` forever.

**Correct — expose the scroll container through Context and subscribe to it:**

```tsx
// The provider that owns the scrolling element exposes its ref:
const ScrollContext = createContext<{ ref: RefObject<HTMLDivElement | null> } | null>(null);

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <ScrollContext.Provider value={{ ref }}>
      <div ref={ref} className="h-[100dvh] overflow-y-auto">{children}</div>
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollContext must be inside ScrollProvider");
  return ctx;
};

// Consumers read scroll state from the container, not from window:
const { ref } = useScrollContext();

useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const onScroll = () => {
    setCollapsed(el.scrollTop > el.clientHeight * 0.5);
  };
  el.addEventListener("scroll", onScroll, { passive: true });
  return () => el.removeEventListener("scroll", onScroll);
}, [ref]);
```

Key points:
- **Ask the layout what scrolls.** Before writing any scroll-based component, open the top-level layout/provider and check whether it's using `document` scrolling or containerised scrolling. `grep -rn "overflow-y-auto\|overflow-y-scroll"` on the layout tree usually answers this in one shot.
- **Use `el.scrollTop` / `el.clientHeight`** (not `window.scrollY` / `window.innerHeight`) once you're inside a scroll container.
- **`resize` still belongs on `window`.** The container's height is usually tied to the viewport (`h-[100dvh]` / `h-screen`), so `window.resize` is the right signal for threshold recomputation.
- **Same applies to `IntersectionObserver`.** Pass `root: scrollEl` in the observer options, otherwise the viewport default (`null` = the document) will intersect nothing because the target is inside the inner scroller.
- **`useLayoutEffect` for initial scroll-state reads.** If you're seeding `collapsed`/`activeIndex`/etc. from the current scroll position (e.g., to handle restored scroll on back-navigation), do the read in a `useLayoutEffect` so the first paint is already in the correct state — a regular `useEffect` runs after paint and will briefly show the wrong state.

Failure-mode heuristic: if a scroll-driven feature "compiles, attaches, and does nothing," the listener is almost certainly pointed at the wrong element. Don't add retry logic — fix the subscription target.
