---
title: When a Pre-Commit Lint Blocks Your Feature Commit on a Pre-Existing Violation, Don't Silently Refactor Runtime Semantics
impact: MEDIUM
impactDescription: keeps an unrequested behavior change out of a commit whose stated purpose is unrelated, when lint-staged forces you to "fix" code you only barely touched
tags: planning, lint, lint-staged, refactor, behavior-preservation
---

## When a Pre-Commit Lint Blocks Your Feature Commit on a Pre-Existing Violation, Don't Silently Refactor Runtime Semantics

`lint-staged` lints the **whole** touched file, not just your diff. So a one-line edit (swap a hardcoded string for a dict lookup, rename a prop) in a file that already contains a _pre-existing_ lint violation makes the commit fail on a rule you never triggered — e.g. `react-hooks/set-state-in-effect` on a `useEffect` someone else wrote months ago. The path of least resistance is to refactor that code until lint passes. But that folds an **unrequested behavior change** into a commit whose message says "localize labels" — in code you never analyzed for regressions, reviewed by no one against its original semantics.

The danger is asymmetric: the lint rule only proves the _shape_ is now compliant, never that the _runtime output_ is unchanged. An `useEffect`→event-handler rewrite, a dep-array edit, or a ref restructure can pass the rule and still alter when/whether state syncs.

**Incorrect — satisfy the blocking rule by rewriting behavior into your string-only commit:**

```tsx
// Commit purpose: "localize drawer header". You also rewrote sync-on-open:
- useEffect(() => { if (open) setSelection(currentValue); }, [open, currentValue]);
+ const handleOpenChange = (next: boolean) => {
+   if (next) setSelection(currentValue);   // only fires on Drawer-internal opens…
+   onOpenChange(next);                      // …NOT when a parent sets open=true programmatically
+ };
```

The effect re-synced on _every_ open including programmatic ones; the handler only fires on the component's own open events. A controlled consumer that sets `open` from parent state now keeps a stale selection. Lint is green; behavior regressed — and it's buried in an i18n commit.

**Correct — keep the pre-existing code's behavior; don't let "make lint pass" drive a semantic change:**

1. **Report the blocker** and leave the pre-existing violation to its owner — the cleanest move when it's out of your scope. Your feature commit shouldn't carry someone else's refactor.
2. If you genuinely must clear it to commit, treat it as a **behavior-adjacent slice**: make the _minimal_ transformation that provably preserves semantics, verify behavior (existing tests / reasoning about every consumer / a behavior-preservation review), and call it out explicitly — never fold it in silently.
3. Before assuming the regression "doesn't matter," check the blast radius (`grep` the component's consumers). "It's an unused component" is luck, not a method.

Key points:

- **A passing lint rule is a shape check, not a behavior check.** `set-state-in-effect`, exhaustive-deps, and friends prove compliance with a pattern, never that the rendered/dispatched output is identical. Behavior is guarded by tests + reasoning, not by the rule going green.
- **The commit message is a contract.** "localize X" must not contain a control-flow rewrite. A reviewer scanning by message will never look for it there; it ships unreviewed.
- **Lint-staged makes pre-existing violations _your_ problem the moment you touch the file.** Expect it on hot/legacy files; decide up front whether to report-and-skip or do a verified behavior-preserving fix — don't improvise a refactor under commit-time pressure.
- Sibling `cleanup-linter-is-the-test-oracle` already flags behavior-adjacent slices (effect/dep/ref changes) as the exception needing a real review. This rule is the same principle arriving _unbidden_: when lint, not your task, is what dragged you into that code.
