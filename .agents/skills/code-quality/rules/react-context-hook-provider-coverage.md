---
title: Migrating a Shared Leaf to a Context Hook Requires a Provider at Every Render Site
prefix: react
trigger: Converting a shared/reused component from props to a context hook (`useT`, `useTheme`, `useX` backed by `useContext`) so it can read ambient state without prop drilling.
---

## Symptom

You switch a shared leaf component from a prop to a context hook to avoid drilling. The screen you were working on renders fine. A _different_ page that also reuses that leaf throws `"useX must be used within a Provider"` at runtime — and `tsc` was green the whole time.

## Root cause

A context hook has **no compile-time link to its provider**. `useContext` resolves at render against whatever provider happens to be above it in the tree; if there's none, it hits the default (often `null`) and the hook throws. When the converted component is shared, each independent render site is a separate tree — and only the one you wired has the provider ancestor. The type-checker can't see the gap because consuming a context isn't expressed in the component's prop types.

## Recommended pattern

Before converting, enumerate every render site of the shared component and ensure each has the provider above it.

```tsx
// converting Leaf from `locale` prop → useT()
// ❌ wire only the tree you happened to be editing

// ✅ grep ALL render sites first, then cover each
//    git grep -n "<Leaf" -- src        → page A, page B, widget C ...
const PageA = () => (
  <Provider value={dict}>
    {" "}
    {/* the one you were editing */}
    <Leaf />
  </Provider>
);
const PageB = () => (
  <Provider value={dict}>
    {" "}
    {/* the reuse you'd otherwise miss */}
    <OtherSection>
      <Leaf />
    </OtherSection>
  </Provider>
);
```

## Anti-pattern

- Assuming the component is only mounted where you're working. A shared leaf is shared; `git grep "<Leaf"` (and its lazy/barrel wrappers) is the only reliable site list.
- Trusting `tsc` or a unit test of the edited page to vouch for the migration. A missing provider is a runtime fault on an _unedited_ page — it surfaces only when that route renders.

## Heuristic

Switching a reused component from prop to context turns a compile-time contract (the prop) into a runtime one (an ancestor provider). The new obligation is "every render site has a provider above it," and nothing checks it for you — enumerate the sites with grep, including lazy/dynamic-import and barrel re-export wrappers, and confirm provider coverage at each.
