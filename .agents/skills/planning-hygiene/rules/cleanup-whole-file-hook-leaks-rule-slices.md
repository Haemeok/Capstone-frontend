---
title: A Whole-File Pre-Commit Hook Leaks Rule-Sliced Cleanup Commits — Plan for It
impact: HIGH
impactDescription: keeps a lint/cleanup plan honest when one file carries violations from several rules and the commit hook lints the whole file
tags: planning, lint, git-hooks, cleanup
---

## A Whole-File Pre-Commit Hook Leaks Rule-Sliced Cleanup Commits — Plan for It

A codebase-wide lint cleanup is naturally sliced **by rule** (one commit drives `rule-A` to zero, the next drives `rule-B`). That clean slicing silently breaks when a pre-commit hook (`lint-staged`, `pre-commit`, `lefthook`) lints the **entire touched file**, not just your diff. If a single file has violations from rule-A *and* rule-B, the moment your rule-A commit touches that file, the hook re-lints it and **blocks on the still-present rule-B errors**. Your "rule-A only" commit is now forced to also resolve rule-B in that file — the slice leaked.

Plan for this instead of being surprised by it: a rule slice does not own *files*, it owns *violations*, but the commit gate operates on files. Where a file is shared across slices, the first slice to touch it inherits the obligation to silence the other rules' **errors** in that file (warnings usually don't block, errors do).

**Incorrect — plan assumes each rule-slice commit only changes its own rule:**

```
Task A: drive `no-explicit-any` to 0 in shared/api. Commit.
Task B: drive `set-state-in-effect` to 0. Commit.
```

`shared/api/client.ts` has both an `any` and a `set-state-in-effect` error. Task A edits the `any`, runs `git commit`, and the pre-commit hook lints the whole file → fails on the untouched `set-state-in-effect`. Task A is now stuck: it must either refactor out-of-scope code (the thing Task B owned) or bypass the hook.

**Correct — plan the leak: defer out-of-scope rules with a trackable marker:**

```
For a file a slice touches that ALSO has out-of-scope errors:
  - Do NOT refactor the out-of-scope rule here (it belongs to its own slice/issue).
  - Suppress it inline with a grep-able deferral marker, e.g.
      // eslint-disable-next-line some/other-rule -- deferred to #124
  - Never use --no-verify to skip the hook; that hides real regressions too.

Then the deferred slice/issue's work-list is NOT just `eslint` output —
because a suppressed violation no longer appears in the linter's report.
Its real scope = (current lint errors) ∪ (grep -rn "deferred to #124").
```

Key points:
- A suppressed violation is **invisible to the linter** afterward. If you defer a rule to a separate issue by inline-suppressing it, the issue's "drive this rule to 0" task will *miss the suppressed sites* unless you leave a consistent marker (`-- deferred to #N`) and tell the issue its work-list includes `grep`-ing for that marker. Suppression without a marker silently drops scope.
- Decide the policy at plan time: warnings typically don't block the hook (no `--max-warnings`), errors do. Only error-severity out-of-scope rules force a defer-suppress; out-of-scope warnings can be left alone.
- This also means rule-sliced commits won't be perfectly pure — a few will carry one-line defer-suppressions for neighboring rules. That's expected and correct, not a planning failure. Note it in the plan so reviewers don't flag it.
- Detect the hazard before writing the plan: check `.lintstagedrc`/`.husky`/`lefthook.yml`. If the hook runs the linter on the staged file (not on a diff), assume whole-file leakage.
