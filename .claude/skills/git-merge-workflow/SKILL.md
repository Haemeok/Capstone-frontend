---
name: git-merge-workflow
description: Use when integrating a feature branch into main locally, when GitHub's web merge button is blocked ("This branch cannot be rebased due to conflicts" / UNSTABLE / a conflict that "shouldn't" exist), when a repo allows only rebase-merge, or when deciding between fast-forward, rebase, and merge-commit. Explains the refspec fast-forward push that integrates a branch without checking it out, and how to read GitHub's mergeable vs rebaseable verdicts.
---

# Git Merge Workflow

How to integrate a branch into `main` cleanly and safely, especially when the GitHub web UI refuses.

## "mergeable" and "rebaseable" are different verdicts

GitHub computes two independent flags. They can disagree, and that is not a bug:

- `mergeable` / `mergeable_state: clean` → a **merge-commit** or **squash** would apply with zero conflicts.
- `rebaseable: false` → the **"Rebase and merge"** strategy is blocked.

"Rebase and merge" replays every PR commit one-by-one onto the base, re-creating new SHAs. A long history that repeatedly rewrites the same lines (e.g. an i18n branch with many `consolidate`/`absorb`/`drop-redundant` commits) can hit an intermediate-replay conflict even when the _final_ tree merges cleanly. So `mergeable=clean` + `rebaseable=false` is a real, consistent state.

Read both before trusting any banner:

```bash
gh api repos/{owner}/{repo}/pulls/{n} --jq '{mergeable, mergeable_state, rebaseable}'
gh api repos/{owner}/{repo}        --jq '{merge_commit:.allow_merge_commit, squash:.allow_squash_merge, rebase:.allow_rebase_merge}'
```

If the repo allows **only** rebase-merge and `rebaseable=false`, the web has no working button — but a local fast-forward still works (below).

## Before blaming a conflict, check who moved main

A "sudden conflict" is usually nobody pushing to main at all. Verify read-only (no `pull`/`merge`):

```bash
git fetch origin
git log origin/main -5 --pretty='%h | %ad | %an | %s' --date=short   # did anyone actually push?
git merge-base --is-ancestor origin/main origin/<branch> && echo "main is an ancestor → 0 behind → conflict impossible"
git rev-list --count origin/main..origin/<branch>                     # commits ahead
```

If `main` is an ancestor of the branch (branch is 0 behind), a merge **cannot** conflict — the branch is already linear on top of main.

## Integrate via a fast-forward refspec push (no checkout)

When `main` is an ancestor of the branch, "rebase merge" is just a **fast-forward**: there is nothing to replay. Push the branch ref onto `main` directly — no `checkout`, no `switch`, no local `rebase`/`merge`:

```bash
git push origin <branch>:main
#                ^^^^^^^^ ^^^^  refspec: <src>:<dst> — update remote main to the branch's commit
```

`git push <remote> <src>:<dst>` is standard git. Why this is the right tool:

- **No branch switching** — satisfies the project rule against `checkout`/`switch`/`rebase`/`merge` on local branches.
- **Fast-forward only** (no `--force`): if `main` is _not_ an ancestor (someone pushed), git **rejects** it safely instead of clobbering. Built-in guardrail.
- **Linear, no merge bubble, original SHAs preserved** — the same outcome "Rebase and merge" aims for, minus the SHA rewrite.
- GitHub auto-marks the PR **MERGED** once the head commit becomes reachable from `main`.

Verify after:

```bash
git rev-parse --short origin/main
gh pr view {n} --json state,mergedAt,mergedBy -q '"state="+.state+" mergedAt="+(.mergedAt//"null")'
```

## Decision flow

1. `git fetch origin` (read-only).
2. `git merge-base --is-ancestor origin/main origin/<branch>`?
   - **Yes (0 behind)** → `git push origin <branch>:main`. Done.
   - **No (main moved ahead)** → a real rebase/merge is needed, which requires checkout. **Stop and ask the user** (per the project's no-checkout branch rule); don't `--force`.
3. Confirm `origin/main` advanced and the PR shows `MERGED`.

## Guardrails

- This whole flow runs **only on explicit user instruction to merge** — the project forbids branch-state changes otherwise.
- Never add `--force`/`+` to the refspec to "make it go through." A rejected fast-forward means main diverged — investigate, don't override.
- Confirm CI is green and the user wants it merged _now_ before pushing to `main`; merging is outward-facing and hard to reverse.
