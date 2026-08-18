---
title: Lock Scrollspy Selection During Programmatic Smooth Scrolling
impact: MEDIUM
impactDescription: prevents intermediate sections from overriding the user's clicked destination
tags: client, scroll, intersection-observer, navigation, state, react
---

## Lock Scrollspy Selection During Programmatic Smooth Scrolling

When both a navigation click and a scrollspy update the same active-section state, smooth scrolling creates a race. Every intermediate section becomes visible on the way to the destination, so an `IntersectionObserver` can overwrite the clicked section and make the active control flicker or stop on the wrong item.

**Incorrect — click selection and scrollspy compete for the same state:**

```tsx
const selectSection = (id: string) => {
  setActiveId(id);
  elements.get(id)?.scrollIntoView({ behavior: "smooth" });
};

const observer = new IntersectionObserver((entries) => {
  const visible = entries.find((entry) => entry.isIntersecting);
  if (visible) setActiveId((visible.target as HTMLElement).id);
});
```

Moving from the first section to the third passes through the second. The observer reports the second section after the click already selected the third, so the UI reverts during the animation.

**Correct — keep the clicked destination authoritative until scrolling ends:**

```tsx
const isProgrammaticScrollRef = useRef(false);

const selectSection = (id: string) => {
  isProgrammaticScrollRef.current = true;
  setActiveId(id);
  elements.get(id)?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  const root = scrollRootRef.current;
  if (!root) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (isProgrammaticScrollRef.current) return;

      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActiveId((visible.target as HTMLElement).id);
    },
    { root }
  );

  const unlockScrollspy = () => {
    isProgrammaticScrollRef.current = false;
  };

  root.addEventListener("scrollend", unlockScrollspy);
  return () => {
    root.removeEventListener("scrollend", unlockScrollspy);
    observer.disconnect();
  };
}, []);
```

Key points:

- Treat the click destination as authoritative for the full programmatic scroll, not merely until the target first intersects.
- Release the lock from the actual scroll container's completion event. A fixed timeout can unlock before a long animation ends or keep the UI locked after a short one.
- Keep direct-scroll tracking enabled outside the lock so the active control still follows user scrolling.
- Test the state sequence explicitly: click section three, report section two during movement, finish scrolling, then report section two again. The first report must be ignored and the second accepted.
