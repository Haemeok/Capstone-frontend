---
title: Never `git commit --amend` on a Branch With Parallel Committers — HEAD Moves Under You
impact: HIGH
impactDescription: stops you from rewriting (and silently absorbing your change into) another session's commit when HEAD advanced mid-check
tags: planning, git, amend, worktree, parallel
---

## Never `git commit --amend` on a Branch With Parallel Committers — HEAD Moves Under You

`git commit --amend` rewrites whatever `HEAD` points to **right now**. On a branch where another session (or the user) is also committing — a shared worktree, a long-lived feature branch two agents push to — `HEAD` can advance between the moment you decide to amend and the moment the amend runs. Your amend then lands on **their** commit: it rewrites their SHA (breaking their in-flight work, since their session still thinks `HEAD` is the old SHA) and folds your delta into a commit whose message describes something else entirely.

The trap is that the obvious guard _looks_ sufficient and isn't. Chaining the HEAD check with the amend in one command defeats the check: you read the foreign SHA in the output, but the `&&` already fired the amend onto it. By the time a human would react to "wait, that's not my commit," history is rewritten.

**Incorrect — check-then-amend chained, on a branch a parallel session commits to:**

```bash
git log -1 --format="%H %s"      # prints 37af0… "fix: parallel session's work"
                                 #   ↑ you SEE it's not yours…
  && git commit --amend --no-edit  # …but && already amended ONTO it.
# Result: parallel commit rewritten 37af0…→015fe…, your hunk now inside
#         their commit, their session's HEAD is stale.
```

Even unchained, a clean check is stale the instant a parallel commit lands after it: `amend` has no "only if HEAD is still X" guard.

**Correct — on a shared/parallel branch, make a NEW commit; never amend:**

```bash
# A new commit stacks safely on ANY HEAD — parallel advances don't corrupt it.
git add src/featureX/thing.ts
git commit -m "fix(i18n): restore original ja aria strings" -- src/featureX/thing.ts
```

If a correction belongs logically inside your previous commit, prefer a follow-up commit over amend; squash later only if you solely own the branch.

Key points:

- **A new commit is HEAD-movement-proof; an amend is not.** New commits append; amend rewrites the tip. Only amend when you are the _sole_ writer of the branch and nothing can advance HEAD between check and amend.
- **Never join the HEAD check and the amend with `&&`/`;`.** The check must gate a human/agent decision, not feed an already-queued rewrite. If you insist on amend, run the check as its own step and _stop_ to read it before issuing amend.
- **The blast radius hits someone else.** Unlike a bad `git add -A` (your commit gets their files), a bad amend mutates _their_ commit's SHA — their session, their open PR, their reflog assumptions all break. It's the harder mess to untangle.
- **Detect the trap:** shared worktree, a branch named like a long-lived feature, board notes mentioning "parallel session" / "동시 커밋", or new ` M`/`??` entries you didn't cause. Any of these → amend is off the table; new commits only.
- Complements `dispatch-explicit-staging-shared-worktree` and `dispatch-lint-staged-defeats-partial-staging`: those keep _foreign content out of your commit_; this keeps _your content out of their commit_.
