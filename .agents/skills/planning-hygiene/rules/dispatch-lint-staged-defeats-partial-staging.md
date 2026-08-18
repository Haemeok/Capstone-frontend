---
title: If a Pre-Commit Hook Re-Stages Whole Files, Isolate via Remove-Commit-Restore
impact: HIGH
impactDescription: keeps a parallel editor's uncommitted hunks out of your commit even when `lint-staged`/`husky` re-adds the whole touched file
tags: planning, subagents, git, lint-staged, worktree
---

## If a Pre-Commit Hook Re-Stages Whole Files, Isolate via Remove-Commit-Restore

The sibling rule `dispatch-pathspec-leaks-foreign-hunks-in-shared-file` prescribes `git add -p` + `git diff --cached` to isolate your hunks in a co-edited shared file. That fix **silently fails when the installed pre-commit hook re-stages whole files**. Some `lint-staged` versions and configurations hide unstaged hunks from partially staged files and restore them afterward; others run a formatter and re-add the entire file. Verify the actual hook output and resulting commit instead of assuming either behavior.

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

- **A whole-file-restaging hook makes the commit see the working tree, not your index.** When the hook runs `git add <file>` without first hiding unstaged hunks, it overrides whatever you partially staged. Control the **working tree**, not the index, for that configuration.
- **Remove-commit-restore is the hook-proof technique.** Edit out the foreign lines → confirm `git diff <file>` is your delta only → `tsc`/test → commit → edit the foreign lines back. The other workstream's WIP returns to the dirty tree untouched.
- **Removing foreign lines may need a paired removal.** If a foreign import is only used by a foreign hunk (e.g. `import { AdSlot }` + `<AdSlot/>`), remove **both** so the temporary tree still compiles; restore both afterward. Optional props on the consumer make this safe.
- **Detect the trap at plan time:** if `.lintstagedrc*` / a `husky` `pre-commit` exists and your task edits a hot shared file, run a controlled partial-staging check first. Output such as “Hiding unstaged changes to partially staged files” indicates preservation; otherwise inspect `git show` and switch to remove-commit-restore when whole-file restaging is confirmed.
- Complements `dispatch-pathspec-leaks-foreign-hunks-in-shared-file` (pathspec is file-level) and `dispatch-explicit-staging-shared-worktree` (blocks `git add -A`). This rule covers the third layer: the hook that undoes correct partial staging.
