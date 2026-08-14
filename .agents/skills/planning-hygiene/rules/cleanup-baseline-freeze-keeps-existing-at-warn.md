---
title: When Freezing a Lint Baseline, Keep Existing Violations at warn, Not off or error
impact: MEDIUM
impactDescription: stops new violations at CI without blocking unrelated edits to legacy files or hiding the debt
tags: planning, lint, cleanup, baseline, ci
---

## When Freezing a Lint Baseline, Keep Existing Violations at warn, Not off or error

After a partial cleanup you usually want to "freeze" the remaining violations: stop _new_ ones while tolerating the _existing_ ones until they're paid down. The naive move — flip the rule to `error` globally — backfires, because most pre-commit (`lint-staged`) and changed-files CI setups fail **only on `error`, and pass on `warn`**. Promote the rule to `error` everywhere and any unrelated one-line edit to a legacy file that still holds a violation now fails the hook, forcing an out-of-scope fix. The opposite extreme — setting those files to `off` — hides the debt so it never gets repaid and silently grows.

The fix is three severities working together: rule is `error` by default, the **listed legacy files are downgraded to `warn`**, and everything else inherits `error`. A new violation in a clean/new file is `error` → blocked. A legacy file's existing violation is `warn` → visible but not blocking, so touching it for unrelated reasons still passes.

**Incorrect — global error (blocks unrelated edits) or global off (hides debt):**

```js
// eslint.config — flips the whole rule
rules: { "local/some-rule": "error" }   // editing any legacy file now fails pre-commit
// or
rules: { "local/some-rule": "off" }     // new violations slip in; debt invisible
```

`error` everywhere means a typo fix in a file that already had 3 violations fails the `lint-staged` hook on those 3 pre-existing problems. `off` everywhere means the next PR can add fresh violations with nothing to catch them.

**Correct — error by default, a generated baseline list pinned to warn:**

```js
const baseline = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : [];
const config = [
  { rules: { "local/some-rule": "error" } }, // default: new code blocked
  {
    files: baseline.length ? baseline : ["__none__"], // legacy: visible, not blocking
    rules: { "local/some-rule": "warn" },
  },
];
```

Generate `baseline` by running the linter once and collecting the files that currently violate; commit it. Add a `lint:<rule>-baseline` script that regenerates the list so a developer who _fixes_ violations can ratchet the baseline down.

Key points:

- Confirm the assumption first: check that this repo's pre-commit/CI actually fails on `error` and passes on `warn` (run the linter on a warn-only file and inspect the exit code). The whole scheme rests on that asymmetry — if the hook runs `--max-warnings 0`, warn won't save you and you need a different gate.
- `warn`, not `off`, for the baseline: `off` makes the violation invisible, defeating gradual repayment and letting the same file accrue more. `warn` keeps it on the report so progress is measurable.
- A later flat-config block wins, so the baseline `warn` override must come **after** the default `error` block.
- Guard the empty case: an empty `files` array can match unexpectedly in some configs — fall back to a sentinel glob (`["__none__"]`) when the baseline is empty.
- The baseline is a ratchet: regenerate only when the count drops. If a workflow lets it grow, you've reintroduced the original "violations pile up" problem the freeze was meant to stop — surface baseline growth in review.
