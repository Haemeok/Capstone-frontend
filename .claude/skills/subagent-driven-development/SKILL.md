---
name: subagent-driven-development
description: Project-local override. Use when executing implementation plans with independent tasks in the current session. Prefer this over superpowers:subagent-driven-development — it adds a mandatory parallel-batch gate so independent tasks run concurrently instead of strictly one-at-a-time.
---

# Subagent-Driven Development (parallel-batch override)

Execute a plan by dispatching fresh subagents per task, with two-stage review (spec compliance, then code quality). **The only change from the superpowers version: independent tasks are dispatched in parallel batches instead of strictly serially.**

## Why this override exists

The plugin version is structurally serial — its process is `implement → spec review → quality review → mark done → NEXT task`, and a Red Flag forbids "dispatch multiple implementation subagents in parallel". That blanket ban exists for ONE reason: subagents sharing one working tree (and one git index) would conflict on files and commits.

Remove that single cause and the ban dissolves. So: partition tasks so parallel ones touch **disjoint files**, have parallel implementers **edit + test but NOT commit** (the controller commits at the barrier with explicit pathspec), and the conflict is gone — independent tasks run concurrently.

**Do NOT use git worktrees for this.** CLAUDE.md forbids agent-created worktrees / branch switches, and a single-IDE setup makes them error-prone. The disjoint-files + controller-commits approach below needs no worktrees.

## Step 0 — Determine independence yourself, then partition (MANDATORY, before any dispatch)

**The controller decides independence autonomously. Do not wait for the plan to declare it, and do not push the judgment onto the user.** Plan annotations (if any) are a hint, never the source of truth — verify them.

1. Read the plan once. Extract every task with full text + context. Create TodoWrite.
2. For each task, **derive its file footprint yourself**: the set of files it will create/modify. The plan rarely states this fully, so infer it — read the task intent, then inspect the codebase (Grep/Glob/Read the relevant slices) to see which files that change actually lands in. Don't guess from the task title alone; a "add field X" task often touches a type, a parser, an API call, and a component.
3. Also derive **data dependencies**: does task B consume a symbol/file/export that task A produces? If yes, B depends on A regardless of file overlap.
4. Build the groups from those two facts: two tasks are **independent** iff their file footprints are disjoint AND neither consumes the other's output. Independent tasks → same parallel group.
5. Tasks that share a file or have a producer→consumer dependency stay **serial** (separate, ordered groups).

When a footprint is genuinely ambiguous after inspection, treat the tasks as dependent (serial) — conservative is correct here, since a wrong "independent" call causes a real conflict. Ambiguity means _inspect more_, not _ask the user_.

State the grouping explicitly before dispatching, e.g.:

```
Group A (parallel): Task 1 (src/foo/*), Task 3 (src/baz/*)   ← disjoint files
Group B (serial after A): Task 2 (edits src/foo/index.ts produced by Task 1)
```

If you cannot cleanly partition (everything touches shared files / tightly coupled), fall back to the original serial path — that's legitimate, not a failure. But do not default to serial without attempting Step 0.

## Per-group execution

### Parallel group (2+ independent tasks)

1. **Dispatch all implementers in ONE message** (multiple Task calls in a single response — this is what makes them actually run concurrently). Each implementer prompt: focused single-task scope, full task text + scene-setting context, follow TDD, **must NOT run `git add`/`git commit`** (controller commits at the barrier), report status + list of changed files + test results.
2. **Reviews in parallel too.** When implementers return, dispatch spec reviewers for all tasks in one message; then, for tasks that pass spec, dispatch quality reviewers in one message. Review loops (reviewer finds issue → same implementer fixes → re-review) run per-task but across the group concurrently.
3. **Barrier — controller commits.** Once every task in the group is spec-✅ and quality-✅, the controller commits each task separately with **explicit pathspec** per CLAUDE.md (`git add <those files>` then `git commit -m "..." -- <those files>`). One commit = one task's meaning unit.
4. Mark the group's tasks complete in TodoWrite. Proceed to the next group.

### Serial group (single task, or coupled tasks)

Original flow: dispatch implementer → spec review (loop) → quality review (loop) → controller commits with pathspec → mark complete. Implementer still does not commit; controller does.

## Model selection

Least powerful model that fits, to save cost/time:

- 1–2 files, complete spec, mechanical → fast/cheap model
- Multi-file integration / pattern matching / debugging → standard model
- Architecture / design / review → most capable model

## Handling implementer status

- **DONE** → proceed to spec review.
- **DONE_WITH_CONCERNS** → read concerns; correctness/scope concerns get addressed before review, observations get noted.
- **NEEDS_CONTEXT** → provide missing context, re-dispatch.
- **BLOCKED** → diagnose: more context / more capable model / split the task / escalate to human if the plan is wrong. Never silently retry the same model unchanged.

## Red Flags

**Never:**

- **Run independent tasks serially without attempting Step 0 partition** (the whole point of this override).
- Dispatch parallel implementers whose file sets **overlap**, or let parallel implementers **commit** (shared-index race) — controller commits at the barrier.
- Dispatch independent tasks one-per-message across turns when they could go in one message (that silently serializes them).
- Start on main/master without explicit user consent.
- Skip either review (spec compliance OR code quality), or proceed with unfixed issues.
- Start code quality review before spec compliance is ✅.
- Make a subagent read the plan file (provide full task text instead).
- Use `git worktree add` / `git switch` / `git checkout` to isolate parallel work (CLAUDE.md ban; use disjoint files instead).
- `git add -A` / `git add .` / argument-less `git commit` (always explicit pathspec).

## Integration

- **superpowers:writing-plans** (project-local override) — creates the plan. Step 0 does NOT depend on the plan marking independence; the controller derives it from the codebase itself. Any plan annotation is a hint to verify, not a substitute.
- **superpowers:requesting-code-review** — template for reviewer subagents.
- Subagents follow **superpowers:test-driven-development** per task.
- **finishing-a-development-branch** (project-local) after all groups complete — then **compounding-lessons** (mandatory per CLAUDE.md).

## Prompt templates

Reuse the superpowers plugin templates as a base — `implementer-prompt.md`, `spec-reviewer-prompt.md`, `code-quality-reviewer-prompt.md` in the `superpowers:subagent-driven-development` skill dir — with one edit to the implementer prompt: **"Do not commit. Report your changed files and test results; the controller commits."**
