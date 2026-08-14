---
title: Pathspec Staging Isolates Files, Not Hunks — Check `git diff --cached` on Hot Shared Files
impact: HIGH
impactDescription: stops an explicit-pathspec commit from still capturing a parallel editor's uncommitted hunks inside a co-edited shared file
tags: planning, subagents, git, worktree
---

## Pathspec Staging Isolates Files, Not Hunks — Check `git diff --cached` on Hot Shared Files

Explicit per-path staging (`git add <file>` + `git commit -- <file>`) is the rule for a shared worktree — see `dispatch-explicit-staging-shared-worktree`. But it is **necessary, not sufficient**. Pathspec selects _which files_ enter the commit; it does **not** select _which hunks within a file_. `git add <file>` stages that file's **entire current working-tree blob**. So when your task edits a **hot shared file** — a `types.ts`, a barrel `index.ts`, a dictionary aggregate — that another workstream is _also_ editing uncommitted, your `git add <file>` sweeps in their hunks too, even though you named only that one path.

The failure is quiet and irreversible: your commit now contains a foreign, half-finished hunk (often non-compiling in isolation, masked because the rest of that work sits in the dirty tree). By the time it's noticed, the other workstream may have committed _on top_ of yours — now the contamination is frozen in history and a rebase/amend would endanger their commits. You can't cleanly undo it.

**Incorrect — explicit pathspec, but the file is concurrently edited:**

```bash
# Task edits ONE hunk in a shared type file. Another agent/user has
# uncommitted edits elsewhere in the same file.
git add src/shared/i18n/types.ts
git commit -m "feat: add Foo namespace" -- src/shared/i18n/types.ts
# Commit now also contains the other workstream's unrelated type hunks.
```

**Correct — verify the staged content before committing a hot shared file:**

```bash
# 1. Inspect what's actually in the file's working tree first.
git diff src/shared/i18n/types.ts        # foreign hunks present?

# 2. If foreign hunks exist, stage only YOUR hunks.
git add -p src/shared/i18n/types.ts

# 3. PROVE the index holds only your change before committing.
git diff --cached src/shared/i18n/types.ts   # must show only your hunk
git commit -m "feat: add Foo namespace" -- src/shared/i18n/types.ts
```

Key points:

- **File granularity ≠ hunk granularity.** Pathspec on `add`/`commit` is file-level. The only hunk-level tools are `git add -p` (interactive) and verifying with `git diff --cached <file>`.
- **`git add -p` is defeated by a whole-file-restaging pre-commit hook** (`lint-staged`/`husky` runs `git add <file>` after formatting). When such a hook exists, partial staging doesn't survive the commit — use remove-commit-restore instead. See `dispatch-lint-staged-defeats-partial-staging`.
- **Identify hot shared files up front:** type definition files, barrel/`index.ts` re-export hubs, dictionary aggregates, route manifests — anything multiple features touch. When your task must edit one in a parallel-edit window, switch from blind `git add <file>` to inspect-then-`add -p`.
- **Tell subagents this explicitly.** "Stage only the paths you modified" is not enough; add: "before `git add` on a shared file (types/index/barrel), run `git diff <file>` — if it contains hunks you didn't write, `git add -p` only yours and confirm `git diff --cached <file>` before committing."
- **The blast radius is permanent.** Once a parallel workstream commits on top of your contaminated commit, history is shared and you must not rewrite it — flag it to the user and move on; don't amend/rebase someone else's work to "clean up."
- Sibling rule `dispatch-explicit-staging-shared-worktree` blocks `git add -A`; this rule blocks the subtler leak that survives correct per-file staging.
