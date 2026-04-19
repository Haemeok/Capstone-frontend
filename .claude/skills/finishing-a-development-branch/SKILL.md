---
name: finishing-a-development-branch
description: Project-local override. Use when implementation is complete, all tests pass, and you need to decide how to integrate the work — guides completion of development work by presenting structured options for merge, PR, or cleanup. After the chosen option executes, MANDATORY final step is invoking compounding-lessons to persist session learnings. Prefer this skill over superpowers:finishing-a-development-branch in this project — the only difference is the required compounding step at the end.
---

# Finishing a Development Branch (project-local, compound-enforced)

## Overview

Guide completion of development work by presenting clear options, handling the chosen workflow, and then **compounding session learnings so the next conversation inherits what was figured out here**.

**Core principle:** Verify tests → Present options → Execute choice → Clean up → **Compound lessons**.

**Announce at start:** "I'm using the finishing-a-development-branch skill to complete this work."

This is a project-local override of `superpowers:finishing-a-development-branch`. It's identical to the plugin version through Step 5; the difference is a mandatory Step 6 that invokes `compounding-lessons`. Do not skip Step 6. If the plugin version is updated and this override drifts, refresh Steps 1–5 from the plugin but always keep Step 6.

## The Process

### Step 1: Verify Tests

**Before presenting options, verify tests pass:**

```bash
# Run project's test suite
npm test / cargo test / pytest / go test ./...
```

**If tests fail:**

```
Tests failing (<N> failures). Must fix before completing:

[Show failures]

Cannot proceed with merge/PR until tests pass.
```

Stop. Don't proceed to Step 2.

**If tests pass:** Continue to Step 2.

### Step 2: Determine Base Branch

```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

Or ask: "This branch split from main — is that correct?"

### Step 3: Present Options

Present exactly these 4 options:

```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option?
```

**Don't add explanation** — keep options concise.

### Step 4: Execute Choice

#### Option 1: Merge Locally

```bash
git checkout <base-branch>
git pull
git merge <feature-branch>
<test command>
# If tests pass
git branch -d <feature-branch>
```

Then: Cleanup worktree (Step 5).

#### Option 2: Push and Create PR

```bash
git push -u origin <feature-branch>

gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<2-3 bullets of what changed>

## Test Plan
- [ ] <verification steps>
EOF
)"
```

Then: Cleanup worktree (Step 5).

#### Option 3: Keep As-Is

Report: "Keeping branch <name>. Worktree preserved at <path>."

**Don't cleanup worktree.**

#### Option 4: Discard

**Confirm first:**

```
This will permanently delete:
- Branch <name>
- All commits: <commit-list>
- Worktree at <path>

Type 'discard' to confirm.
```

Wait for exact confirmation. If confirmed:

```bash
git checkout <base-branch>
git branch -D <feature-branch>
```

Then: Cleanup worktree (Step 5).

### Step 5: Cleanup Worktree

**For Options 1, 2, 4:**

```bash
git worktree list | grep $(git branch --show-current)
```

If yes:

```bash
git worktree remove <worktree-path>
```

**For Option 3:** Keep worktree.

### Step 6: Compound lessons (MANDATORY — this is why this override exists)

After any of Options 1–4 finishes (yes, even Option 3 "keep as-is" and Option 4 "discard" — lessons are decoupled from integration), **immediately invoke the `compounding-lessons` skill.**

Do this without asking. The user has already opted into compounding by choosing this skill (or by its project-level configuration). Asking every time defeats the purpose.

What to compound:
- Non-obvious bugs that took more than one iteration to resolve
- Framework quirks, silent no-ops, timing issues
- Patterns where the fix is counterintuitive or where the obvious fix was wrong
- Generalizable failure-mode heuristics ("if X compiles but does nothing, the cause is usually Y")

What NOT to compound:
- Feature decisions, styling choices, product-level tradeoffs
- Project-specific facts (those belong in CLAUDE.md)
- Bugs where the fix was "I had a typo"

If the session contained nothing worth compounding (e.g., a pure feature-build with no debugging), invoke `compounding-lessons` anyway and let it self-report "nothing to compound this session" — the meta-skill handles the empty case. This keeps the habit enforced rather than leaving it to per-session judgment.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch | Compound |
|--------|-------|------|---------------|----------------|----------|
| 1. Merge locally | ✓ | - | - | ✓ | ✓ |
| 2. Create PR | - | ✓ | ✓ | - | ✓ |
| 3. Keep as-is | - | - | ✓ | - | ✓ |
| 4. Discard | - | - | - | ✓ (force) | ✓ |

Every row compounds. That's the whole point of this override.

## Common Mistakes

**Skipping Step 6 because "there wasn't much to compound"**
- Problem: skipping is the exact failure mode this override fixes. Every session has at least one thing worth capturing OR a clear "nothing to compound" that you should still announce.
- Fix: invoke `compounding-lessons` unconditionally. Let the meta-skill decide whether there's material to write up.

**Skipping test verification**
- Problem: merge broken code, create failing PR.
- Fix: always verify tests before offering options.

**Open-ended questions**
- Problem: "What should I do next?" → ambiguous.
- Fix: present exactly 4 structured options.

**Automatic worktree cleanup**
- Problem: remove worktree when it might still be needed (Option 2, 3).
- Fix: only cleanup for Options 1 and 4.

**No confirmation for discard**
- Problem: accidentally delete work.
- Fix: require typed "discard" confirmation.

## Red Flags

**Never:**
- Proceed with failing tests
- Merge without verifying tests on the result
- Delete work without confirmation
- Force-push without explicit request
- **Finish the flow without Step 6** — no exceptions

**Always:**
- Verify tests before offering options
- Present exactly 4 options
- Get typed confirmation for Option 4
- Clean up worktree for Options 1 & 4 only
- **Invoke compounding-lessons in Step 6**

## Integration

**Called by:**
- `subagent-driven-development` (after all tasks complete)
- `executing-plans` (after all batches complete)
- User directly at any "I'm done" signal

**Pairs with:**
- `using-git-worktrees` — cleans up worktrees this creates
- `compounding-lessons` — the mandatory Step 6 follow-on
