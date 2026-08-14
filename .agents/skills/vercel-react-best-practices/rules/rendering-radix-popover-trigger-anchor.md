---
title: Anchor a Controlled Radix Popover to Its Real Trigger, Never an Empty Placeholder
impact: MEDIUM
impactDescription: prevents detached popovers and skewed flex layouts
tags: react, radix, popover, layout, positioning, portal
---

## Anchor a Controlled Radix Popover to Its Real Trigger, Never an Empty Placeholder

When a Radix `Popover` (or `DropdownMenu`, `Tooltip`, etc.) has its `open` state controlled externally, it's tempting to leave the trigger empty — "the button lives elsewhere, the trigger isn't needed". So the trigger becomes a throwaway node:

```tsx
<PopoverTrigger asChild>
  <div></div>
</PopoverTrigger>
```

This breaks in two compounding ways, and both are invisible until you look at the rendered layout:

1. **Layout node.** That empty `<div>` is a real element in the flow. Drop the popover as a sibling of a button inside a `justify-between` / `space-between` row and it becomes a _third_ flex child — the distribution shifts and the button drifts off its expected edge.
2. **Anchor node.** Radix positions `PopoverContent` (rendered in a portal) relative to _the trigger_. An empty zero-size `<div>` is what the floating content anchors to — so the popover opens detached from the visible button it conceptually belongs to.

**Incorrect — empty placeholder trigger + button as an external sibling:**

```tsx
// parent
<div className="flex items-center justify-between">
  <span>정렬</span>
  <MyButton onClick={() => setOpen(true)} />   {/* drifts to center */}
  <Picker open={open} onOpenChange={setOpen} /> {/* its empty trigger = 3rd flex child */}
</div>

// Picker
<Popover open={open} onOpenChange={onOpenChange}>
  <PopoverTrigger asChild><div></div></PopoverTrigger>
  <PopoverContent align="end" />               {/* anchors to the empty div */}
</Popover>
```

**Correct — pass the real element in as the trigger so it both lays out and anchors correctly:**

```tsx
// parent — one child, no stray node
<div className="flex items-center justify-between">
  <span>정렬</span>
  <Picker
    open={open}
    onOpenChange={setOpen}
    triggerButton={<MyButton onClick={() => setOpen(true)} />}
  />
</div>

// Picker
<Popover open={open} onOpenChange={onOpenChange}>
  <PopoverTrigger asChild>{triggerButton ?? <div></div>}</PopoverTrigger>
  <PopoverContent align="end" />               {/* anchors to the real button */}
</Popover>
```

**Counterintuitive trap — do NOT "clean up" by deleting the trigger on the no-trigger path.** A reviewer may suggest replacing `{triggerButton ?? <div></div>}` with a conditional that omits `<PopoverTrigger>` entirely when no trigger is passed. That _regresses_ positioning: `PopoverContent` anchors to the trigger, so with no trigger (and no `PopoverAnchor`) the content has nothing to anchor to and falls back to a default/origin position. For a genuinely trigger-less, externally-controlled popper, wrap the visible element in `PopoverAnchor` instead of removing the anchor altogether.

**The element you pass to `asChild` MUST accept a ref.** `asChild` works via Radix `Slot`, which forwards a ref to its single child and uses that DOM node as the positioning anchor. A native element (`<button>`, `<div>`) accepts the ref. A **custom function component does not** — unless it is wrapped in `forwardRef` and spreads the ref onto a real DOM node. Pass a plain function component and React silently leaves the ref `null` (only a console warning), so the anchor is null and `PopoverContent` renders off-screen/at the origin — **invisible, with no thrown error**.

**Incorrect — custom component child without `forwardRef`:**

```tsx
const MyButton = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);
// <PopoverTrigger asChild><MyButton .../></PopoverTrigger>  → ref null → no anchor → popover invisible
```

**Correct — forward the ref and spread props to the DOM node:**

```tsx
const MyButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ label, ...props }, ref) => (
    <button ref={ref} {...props}>
      {label}
    </button> // ref + data-state/aria from Radix land here
  )
);
MyButton.displayName = "MyButton";
```

**Test trap — a native element in the test gives a false green.** jsdom has no layout engine, so a component test cannot catch the _mispositioning_; and if the test passes `triggerButton={<button>…</button>}` (a native, ref-able element) it won't catch the _missing-ref_ either — the real bug only appears with the production custom component. Guard the contract directly with a ref-forwarding unit test on the actual component:

```tsx
const ref = createRef<HTMLButtonElement>();
render(<MyButton ref={ref} {...required} />);
expect(ref.current).toBeInstanceOf(HTMLButtonElement); // fails before forwardRef
```

Key points:

- A portal'd floating element still anchors to its in-tree trigger/anchor — the portal moves _where it renders_, not _what it positions against_.
- An empty placeholder element is never free: it occupies a layout slot (skews flex/grid distribution) and serves as a (wrong) anchor.
- "Controlled `open`, so the trigger is decorative" is the tell that leads to this bug. The trigger is still the anchor even when it doesn't toggle state.
- If you have a portal-based mobile branch (e.g. a `Drawer` with no built-in trigger slot) sharing the same component, render the trigger element there too — moving it into the shared component must not make it vanish on the branch that has no trigger slot.
- Any custom component handed to `asChild` must be `forwardRef` and spread the ref onto a real DOM node; a plain function component breaks the anchor with only a console warning, not an error.
- Suspect this when a popover opens in the wrong place, doesn't appear at all, or a button drifts within a `justify-between` row after a refactor.
