---
title: A Pre-Commit Hook That Re-Stages Whole Files Defeats Partial Staging — Isolate via Remove-Commit-Restore
impact: HIGH
impactDescription: keeps a parallel editor's uncommitted hunks out of your commit even when `lint-staged`/`husky` re-adds the whole touched file
tags: planning, subagents, git, lint-staged, worktree
---

## A Pre-Commit Hook That Re-Stages Whole Files Defeats Partial Staging — Isolate via Remove-Commit-Restore

The sibling rule `dispatch-pathspec-leaks-foreign-hunks-in-shared-file` prescribes `git add -p` + `git diff --cached` to isolate your hunks in a co-edited shared file. That fix **silently fails the moment a pre-commit hook re-stages whole files** — which is the default for `lint-staged` (and most `husky` setups). `lint-staged` runs a formatter (prettier/eslint --fix) on each staged file and then `git add`s the **entire file** back to restage the formatted result. So the foreign hunks you carefully left unstaged get re-added during the commit, and they land in your commit anyway. The partial-staging step was real but the hook undid it.

Two compounding traps: (1) `git add -p` and `git reset -p` are **interactive**, so they don't run at all in a non-interactive/agent harness; (2) even piped non-interactively, or via `git apply --cached`, the result is wiped by the hook's whole-file re-add. Hunk-level staging and a whole-file-restaging hook are fundamentally incompatible.

**Incorrect — partial staging that a `lint-staged` hook will overwrite:**

```bash
# Shared file has YOUR hunk + a parallel workstream's uncommitted hunks.
git add -p src/widgets/Foo.tsx          # stage only your hunk (interactive)
git diff --cached src/widgets/Foo.tsx   # looks clean — only your hunk
git commit -m "feat: wire X" -- src/widgets/Foo.tsx
#   pre-commit lint-staged: prettier Foo.tsx → `git add src/widgets/Foo.tsx`
#   → foreign hunks re-staged → committed. Isolation lost, leak frozen.
```

**Correct — make the working tree contain only your delta at commit time:**

```bash
# 1. Apply YOUR change via the editor (you already did).
# 2. Temporarily remove the foreign hunks from the working tree
#    (edit them out — you know which lines are not yours).
# 3. Now `git diff <file>` shows ONLY your delta vs HEAD.
git diff src/widgets/Foo.tsx            # prove: only your change remains
npx tsc --noEmit                        # still compiles without the foreign lines
git add src/widgets/Foo.tsx
git commit -m "feat: wire X" -- src/widgets/Foo.tsx   # hook re-adds full file = your delta only
# 4. Re-apply (restore) the foreign hunks via the editor.
git diff src/widgets/Foo.tsx            # back to the parallel workstream's WIP, uncommitted
```

Key points:

- **A whole-file-restaging hook makes the commit see the working tree, not your index.** `lint-staged`'s `git add <file>` overrides whatever you partially staged. So control the **working tree**, not the index: at `git commit` time the file must differ from HEAD by your change alone.
- **Remove-commit-restore is the hook-proof technique.** Edit out the foreign lines → confirm `git diff <file>` is your delta only → `tsc`/test → commit → edit the foreign lines back. The other workstream's WIP returns to the dirty tree untouched.
- **Removing foreign lines may need a paired removal.** If a foreign import is only used by a foreign hunk (e.g. `import { AdSlot }` + `<AdSlot/>`), remove **both** so the temporary tree still compiles; restore both afterward. Optional props on the consumer make this safe.
- **Detect the trap at plan time:** if `.lintstagedrc*` / a `husky` `pre-commit` exists AND your task edits a hot shared file (`types.ts`, barrel `index.ts`, a widget many features touch) inside a parallel-edit window, plan the isolating commit for the **main session via remove-commit-restore** — don't hand `git add -p` to a subagent; the hook will defeat it and the leak is irreversible once a parallel commit lands on top.
- Complements `dispatch-pathspec-leaks-foreign-hunks-in-shared-file` (pathspec is file-level) and `dispatch-explicit-staging-shared-worktree` (blocks `git add -A`). This rule covers the third layer: the hook that undoes correct partial staging.
