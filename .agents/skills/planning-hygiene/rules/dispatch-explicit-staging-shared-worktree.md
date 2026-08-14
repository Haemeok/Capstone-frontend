---
title: Stage Explicit Paths in Subagents — Never `git add -A` in a Shared Worktree
impact: HIGH
impactDescription: prevents a subagent from committing the user's unrelated parallel edits sitting in the same working tree
tags: planning, subagents, git, worktree
---

## Stage Explicit Paths in Subagents — Never `git add -A` in a Shared Worktree

A subagent (or any automated commit step) often runs in the **same working tree the user is still editing**. The user may be building an unrelated feature in parallel — uncommitted modifications and untracked files you didn't create. If the subagent commits with `git add -A` / `git add .` / `git commit -a`, it sweeps those parallel edits into *your* commit. Now an unfinished, possibly non-compiling chunk of the user's work is attributed to your change, bundled into your PR, and will surface as a confusing CI failure or a "why is this in my diff" review comment.

This is invisible at plan time because the working tree was clean when you started. It only bites once the user touches a file mid-run. Don't rely on "the tree was clean" — by the time the subagent commits, it may not be.

**Incorrect — plan/prompt tells the subagent to stage everything:**

```
Step 4: commit
  git add -A
  git commit -m "refactor: ..."
```

The subagent finishes a 10-minute task. Meanwhile the user saved three files for a different feature. `git add -A` stages all 13 files; the commit now contains 3 files the subagent never read, never tested, and can't explain.

**Correct — enumerate exactly the paths this task touched:**

```
Step 4: commit (explicit staging only)
  git add src/featureX/thing.ts src/shared/lib/helper.ts
  git commit -m "refactor: ..."
```

And tell the subagent the rule explicitly in its prompt:

```
⚠️ The user may be editing other files in this same working tree in parallel.
- Never `git add -A` / `git add .`. Stage only the paths you personally modified.
- Do not touch or stage files under <area the user is working in>.
- If `tsc`/tests show errors in files you didn't touch, treat them as the
  user's WIP and ignore them — only verify your own files are clean.
```

Key points:
- The blast radius is high: a bad `-A` can attribute the user's broken WIP to your commit, poison your PR, and waste a review cycle untangling whose change is whose.
- "The working tree was clean when I planned" is not a guarantee at commit time. Parallel edits arrive mid-run (you'll see new ` M`/`??` entries in `git status` you didn't cause).
- When you detect parallel WIP (unexpected dirty files), switch *every* remaining commit in the batch to explicit staging and warn downstream subagents in their prompts — don't fix it once and forget.
- Verification (`tsc`, lint, tests) will report the user's WIP errors too. Separate them: group errors by file, confirm the failing files are outside your touched set, and don't block your task on someone else's half-finished code.
- This is the same discipline `compounding-lessons` and the commit skills already require (`git add <specific-path>`); the new caveat is that **a shared worktree makes it mandatory, not just tidy.**
