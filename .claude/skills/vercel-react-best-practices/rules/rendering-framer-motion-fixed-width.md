---
title: Animate Framer Motion Width Between Fixed Pixel Values, Not to "auto"
impact: MEDIUM
impactDescription: eliminates jitter and first-render flicker on size-change animations
tags: rendering, animation, framer-motion, motion, layout, width
---

## Animate Framer Motion Width Between Fixed Pixel Values, Not to "auto"

When a Framer Motion container animates `width: "auto"` AND its children independently animate width or padding on a different timeline, the outer spring ends up chasing a target that keeps re-measuring each frame. Two failure modes usually co-occur:

1. **Re-expand jitter.** Inner children (a label animating `width: "auto"`, a padding CSS transition) change the outer container's natural size while the outer spring is still converging. The spring oscillates visibly — the element "trembles" as it grows back.
2. **Initial-render flicker.** First render sets `animate.width = "auto"`; the second render (after measurement) sets a pixel number. Motion treats the prop change as an animation, producing a brief shrink/grow on first paint, often amplified by font-load reflow between the two measurements.

Shrinking (px → px) looks fine because the target is a fixed number. Expanding (px → `"auto"`) is where the problem surfaces, which is why the bug often gets misattributed to "the expand animation."

**Incorrect — nested `"auto"` animations + late measurement:**

```tsx
const [collapsed, setCollapsed] = useState(false);
const [expandedWidth, setExpandedWidth] = useState<number | null>(null);

useLayoutEffect(() => {
  setExpandedWidth(ref.current?.offsetWidth ?? null);
}, []);

return (
  <motion.div
    animate={{ width: collapsed ? 56 : (expandedWidth ?? "auto") }}
    transition={{ type: "spring", stiffness: 380, damping: 32 }}
  >
    <Link
      className={cn(
        "transition-[padding] duration-200",
        collapsed ? "px-[18px]" : "pl-4 pr-5"
      )}
    >
      <Plus />
      <motion.span
        animate={{ width: collapsed ? 0 : "auto" }}  // inner "auto" animation
        transition={{ duration: 0.18 }}
      >
        Label
      </motion.span>
    </Link>
  </motion.div>
);
```

Three problems stacking: (a) the outer spring has to resolve `"auto"` every frame; (b) the inner `motion.span` width animation changes the measurement mid-spring; (c) the CSS `transition-[padding]` runs on yet another timeline. On expand, the spring oscillates; on first paint, a brief collapse-then-expand appears.

**Correct — ghost reports natural width, animate to fixed px, unify timelines, delay mount:**

```tsx
const [collapsed, setCollapsed] = useState(false);
const [expandedWidth, setExpandedWidth] = useState<number | null>(null);
const ghostRef = useRef<HTMLDivElement>(null);

// Hidden ghost renders the expanded content once. ResizeObserver keeps
// the measurement accurate across font loads and locale changes.
useLayoutEffect(() => {
  const ghost = ghostRef.current;
  if (!ghost) return;
  setExpandedWidth(ghost.offsetWidth);
  const observer = new ResizeObserver(() => setExpandedWidth(ghost.offsetWidth));
  observer.observe(ghost);
  return () => observer.disconnect();
}, []);

const MotionLink = motion.create(Link);  // motion v11+; use motion(Link) on older

return (
  <>
    {/* Invisible measurement ghost — never animated. */}
    <div
      ref={ghostRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 flex h-14 items-center whitespace-nowrap pl-4 pr-5 font-bold opacity-0"
    >
      <Plus /><span className="ml-1">Label</span>
    </div>

    {/* Only mount the real element once the target width is known.
        Motion never observes the "auto" state, so there's no first-paint animation. */}
    {expandedWidth !== null && (
      <MotionLink
        initial={false}
        animate={{
          width:        collapsed ? 56 : expandedWidth,  // always a number
          paddingLeft:  collapsed ? 18 : 16,             // same spring
          paddingRight: collapsed ? 18 : 20,             // same spring
        }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      >
        <Plus />
        <motion.span
          animate={{
            opacity: collapsed ? 0 : 1,
            width:   collapsed ? 0 : "auto",  // inner "auto" is now SAFE
          }}
          transition={{ duration: 0.15 }}
        >
          Label
        </motion.span>
      </MotionLink>
    )}
  </>
);
```

Key principles:
- **Measure, don't animate to `"auto"`.** The outer spring must have a numeric target every frame. Use a hidden ghost + `ResizeObserver` for static content, or `useMeasure`-style refs for dynamic content.
- **One timeline per group.** Properties that should arrive together (width, paddingLeft, paddingRight, gap) belong on the same `transition`. CSS transitions mixed with motion springs on interdependent values almost always desync.
- **Inner `"auto"` is only safe once the outer width is numeric.** Inside a container whose own width is fixed per frame, a child's `width: "auto"` animation can no longer perturb the outer spring — it's clipped by `overflow-hidden` and the parent doesn't have to remeasure.
- **`initial={false}` + conditional mount skips the `"auto" → px` transition on first render.** Motion starts life at the measured pixel value with no entry animation, so font-load reflow or SSR/hydration timing can't produce a flicker.
- **Put the navigable element on the outside.** With `motion.create(Link)` (or `motion(Link)` in older versions), padding animates on the clickable element itself — the entire visible area stays tappable. If padding is on a wrapper `motion.div` and `Link` is inside with `w-full`, taps on the padded circle edges don't navigate.

This pattern applies to any expanding FAB, chip, toast, toolbar, or pill whose "expanded" size is content-driven.
