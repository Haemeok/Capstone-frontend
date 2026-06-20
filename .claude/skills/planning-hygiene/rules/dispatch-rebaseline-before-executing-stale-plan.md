---
title: Re-baseline Against HEAD Before Executing a Pre-Written Plan — the Architecture May Be Superseded
impact: HIGH
impactDescription: stops you from building a second, conflicting implementation of work a parallel committer already shipped during your planning phase
tags: planning, git, parallel, worktree, execution
---

## Re-baseline Against HEAD Before Executing a Pre-Written Plan — the Architecture May Be Superseded

A planning chain (brainstorm → slices → test design → plan) can take many turns. On a shared or long-lived feature branch, the codebase keeps moving while you plan: the user or a parallel session commits. By the time you start executing, the plan was authored against a **stale snapshot** — and the gap is not just new files, it can be a different _architecture_ for the very thing you planned. Execute the plan blindly and you ship a second, competing implementation that duplicates and conflicts with what already landed.

The trap is that the plan reads as authoritative — you wrote it carefully, it has task IDs and a test matrix — so the instinct is to dispatch task 1 immediately. But the plan is a hypothesis about a codebase state that no longer exists. The first implementer "succeeding suspiciously fast" (because the work is already there) or reporting a divergent shape (a simpler flag where you specified stars, a client-lazy slide where you specified a server ISR widget) is the tell that the ground truth drifted.

**Incorrect — dispatch straight from the plan against a moved branch:**

```text
[finish long planning chain on branch feature/X]
[Agent: implement Task 1 per plan]   ← plan assumed HEAD from 20 commits ago
# Implementer: "most of this already exists, with a different design"
# You now have plan's UnifiedWidget AND the user's PerItemComponent pattern.
```

**Correct — re-baseline, then realign before executing:**

```bash
git log --oneline -15                 # parallel commits since planning started?
git status --short                    # foreign WIP / co-edited files?
git grep -n "<thing the plan introduces>"   # already built? by a different pattern?
```

If commits touching your target area landed during planning: read the new pattern, decide whether the plan's architecture is still the right one, and **realign to the shipped pattern** rather than executing the stale one. Surface the divergence to the user — which architecture wins is their call, not a detail you silently resolve by following the plan.

Key points:

- **A plan is a hypothesis about a codebase state, not a contract with the future.** The longer the planning chain, the more HEAD has moved — re-verify HEAD and the target files at execution start, not just at planning start.
- **Detect the drift:** an implementer reporting "already done" / "done suspiciously fast" / "done but with a different shape", new ` M`/`??` entries you didn't cause, or `git log` showing commits in your feature area authored mid-planning. Any of these → stop dispatching and re-scope.
- **Realign, don't duplicate.** When the branch already has a divergent pattern for your feature, adopt that pattern for the un-built remainder; the find-the-gap move (build only what's genuinely missing, in the established shape) beats re-deriving your plan's parallel architecture.
- **Scope divergence is the user's decision.** "My plan's ISR widget vs the shipped client-lazy slide" is an architecture choice — present it; don't let the written plan cast the deciding vote.
- Complements `dispatch-no-amend-on-parallel-branch` and `dispatch-explicit-staging-shared-worktree`: those keep your _commits_ clean on a shared branch; this keeps your _plan_ from building the wrong thing on one.
