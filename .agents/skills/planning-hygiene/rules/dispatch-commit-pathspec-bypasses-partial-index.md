---
title: Commit a Partially Staged Shared File From the Index, Not With a Pathspec
impact: CRITICAL
impactDescription: prevents a clean partial index from being replaced by the full working-tree file at commit time
tags: planning, git, pathspec, partial-staging, worktree
---

## Commit a Partially Staged Shared File From the Index, Not With a Pathspec

`git add -p` or `git apply --cached` can isolate one task's hunk in a shared file, but `git commit -- <path>` does not preserve that isolation. Supplying a pathspec tells Git to commit the named file's current working-tree content. Foreign unstaged hunks in that file can therefore enter the commit even when `git diff --cached <path>` looked clean immediately beforehand.

**Incorrect — the commit pathspec replaces hunk isolation with the whole file:**

```bash
git add -p src/shared/types.ts
git diff --cached src/shared/types.ts  # only your hunk
git commit -m "feat: add daily types" -- src/shared/types.ts
# The commit can contain every working-tree hunk from src/shared/types.ts.
```

The pathspec is useful for a fully staged file, but it changes commit semantics for a partially staged file. A pre-commit log that does not say it is hiding unstaged changes is another warning: the foreign content may already have been selected before the hook starts.

**Correct — audit the complete index, then commit the index without a pathspec:**

```bash
git add -p src/shared/types.ts
git diff --cached src/shared/types.ts
git diff --cached --name-only  # must be the complete expected file set
git commit -m "feat: add daily types"
```

Key points:

- Never pass a partially staged shared file as a commit pathspec. The pathspec selects the working-tree file, not just its staged hunks.
- Before the pathspec-free commit, compare `git diff --cached --name-only` against an explicit expected list and abort on any extra path. This preserves shared-worktree safety without discarding hunk isolation.
- Modern `lint-staged` can preserve partial staging by hiding unstaged changes. Confirm the hook output and inspect the resulting commit; do not assume every hook version or configuration behaves the same way.
- If the hook really re-stages whole files, use remove-commit-restore as described in `dispatch-lint-staged-defeats-partial-staging`.
- Always inspect `git show --format= HEAD -- <shared-file>` after committing. A pre-commit index check cannot catch semantics changed by the commit command itself.
