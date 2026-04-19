---
name: compounding-lessons
description: Persist lessons learned from the current conversation into existing skill files so future Claude agents inherit the fix instead of re-discovering the bug. Use this skill whenever the user asks to "compound this", "save this lesson", "add to knowledge base", "컴파운드", "이거 스킬에 추가", "다른 에이전트가 참고하게", or any phrasing about preserving what was figured out in the current session. Also trigger proactively after a non-obvious bug has been solved through multiple iterations and a generalizable root cause has been identified — even if the user hasn't explicitly asked yet, offer to compound the lesson. Make sure to trigger even when the word "skill" isn't used; any mention of "save for future", "remember across conversations", or "learn from this" about technical findings should activate this.
---

# Compounding Lessons

This skill turns a conversation's hard-won debugging wins into persistent knowledge files that seed future conversations. Each session shouldn't have to re-discover the same root cause; if it took an hour of iteration here, the next Claude should arrive already knowing.

The output of this skill is a rule file (or an update to one) that reads like a rule — not a diary entry. If a future Claude can't internalize a generalizable principle from what you write, the compounding failed.

## When to Apply

Trigger on any of:
- User asks to save, compound, persist, or archive lessons from the current conversation
- A debugging arc just resolved a non-obvious bug with a non-obvious cause
- A generalizable pattern was discovered ("framework X silently no-ops when Y", "API Z jitters when nested inside W")
- Code review caught a re-introduction of a problem previously solved in another conversation — tighten the rule to be more explicit

Do NOT use for:
- Project-specific facts (go in `CLAUDE.md`)
- One-off user preferences (go in auto-memory via the memory system)
- Cosmetic or product decisions that won't recur

If the bug was "I forgot to import the right file", don't compound. If it was "this framework's `width: auto` animation interacts badly with nested children and the fix is non-obvious", compound.

## Process

### 1. Extract the lesson

Before writing anything, produce these five items internally. If any are fuzzy, ask one clarifying question of the user or drop the capture attempt.

1. **Symptom** — what the user was seeing, one sentence.
2. **Root cause** — what was actually happening underneath, one sentence.
3. **Incorrect code** — a minimal example that reproduces the bug.
4. **Correct code** — the fix, showing exactly what changes.
5. **Principle** — the generalizable rule a future Claude should internalize, imperative mood.

If you can't produce all five crisply, there isn't a lesson yet — there's a specific fix. Fixes go in git history; lessons go in skills.

### 2. Find the home for the lesson

Scan both `.claude/skills/` (project-local) and `~/.claude/skills/` (user-global). Match the lesson to an existing skill using these signals:

| Lesson topic | Likely home |
|---|---|
| React / Next.js rendering, hooks, performance | `vercel-react-best-practices/rules/*.md` |
| Framer Motion / motion.dev animation | `vercel-react-best-practices/rules/rendering-*.md` |
| Scroll / layout / overflow patterns | `vercel-react-best-practices/rules/client-*.md` or `rendering-*.md` |
| iOS/Android haptic patterns | `haptic-feedback/SKILL.md` |
| UI styles, color palettes, spacing | `ui-ux-pro-max/` (usually reference data — don't modify lightly) |
| Korean writing / blog / portfolio | `tech-writing/` |
| Claude API / Anthropic SDK usage | `claude-api/` |
| Next.js caching / App Router specifics | `vercel:next-cache-components` or `vercel:nextjs` (read-only plugin skills — prefer writing to project-local override) |

Look at an existing rule file in the target skill first. Mimic its exact frontmatter fields, section layout, and code-fence style. Don't invent a new format — consistency is how the skill's progressive-disclosure system surfaces rules reliably.

If no existing skill fits, create a new project-local skill under `.claude/skills/<topic>/` with a `SKILL.md` + `rules/` structure (model it on `vercel-react-best-practices`). Pick this path only when the topic genuinely doesn't belong anywhere else — fragmented knowledge is worse than centralized knowledge.

**Important: don't modify plugin-cached skills** (files under `~/.claude/plugins/cache/...`). Those get overwritten on plugin updates. Either find the project-local copy (`.claude/skills/<name>/`) or create a sibling rule in a project-local skill.

### 3. Write the rule file

For `vercel-react-best-practices`-style skills, the template is:

```markdown
---
title: <Imperative rule title — says what to do, not what went wrong>
impact: CRITICAL | HIGH | MEDIUM | LOW
impactDescription: <what the fix earns the user in one short phrase>
tags: <category>, <framework>, <topic>, <more>
---

## <Same imperative title>

<One paragraph: the problem, why it matters, when it shows up.>

**Incorrect — <short label for what's wrong>:**

\`\`\`tsx
// code that exhibits the bug
\`\`\`

<Short explanation of why the above fails — the mechanism, not just "it's wrong".>

**Correct — <short label for what the fix does>:**

\`\`\`tsx
// the fix
\`\`\`

Key points:
- <generalizable principles that apply beyond this codebase>
- <failure-mode heuristics so the reader can spot the bug next time>
```

Filename: `<category>-<slug>.md` using the category prefix the target skill already uses (`rendering-`, `client-`, `async-`, `rerender-`, `bundle-`, `js-`, `advanced-`).

### 4. Update the skill's index

If the target skill has a SKILL.md "Quick Reference" table or category list, add a one-line pointer to the new rule in the matching section. Don't duplicate the body — just:

```markdown
- `<category>-<slug>` - <one-line summary matching the rule's impact>
```

This matters because the SKILL.md body is what Claude sees at skill-load time; rule files themselves are read on demand. A rule that isn't listed in SKILL.md might never get discovered.

### 5. Commit

Commit the new rule + index update together using conventional commit style. Example:

```
docs(skills): compound <topic> lesson

<1-2 lines on what future Claude will now know without having to rediscover it.>
```

Commit only the skill files — don't bundle unrelated changes. Use `git add <specific-path>`, not `git add .`.

## Output format

After committing, report to the user:
1. Lesson summary in 4-5 lines: symptom → root cause → principle.
2. Target skill + rule filename chosen, and why.
3. Commit SHA.

Keep this short — the user doesn't need you to re-explain the whole session.

## Writing principles

- **Generalize ruthlessly.** Future Claude won't have this project's code. Strip project-specific names (component names, color tokens, file paths) unless they clarify the concept. Use placeholder names (`Label`, `Component`, `MyButton`) in code examples.
- **Lead with the rule, not the story.** Title: "Animate Framer Motion Width Between Fixed Pixel Values". Not: "One time, someone was building a FAB..."
- **Explain the why.** An imperative without mechanism becomes dogma and gets ignored. Always name the underlying behavior (e.g., "Motion re-measures each frame when animating to `auto`") so future Claude can judge edge cases the rule didn't anticipate.
- **One rule per file.** If the lesson has two distinct principles, write two files. Progressive disclosure only loads what matches — splitting beats lumping.
- **Match the house style.** Read 2–3 existing rule files in the target skill before writing. Mimic frontmatter keys, section order, code-fence language, bullet style.
- **Show both the bug and the fix.** A rule without the incorrect example isn't checkable; a rule without the correct example isn't actionable.

## Anti-patterns

- **Transcript dumping.** Don't paste the conversation. Extract the principle, not the play-by-play.
- **Vague imperatives.** "Use Framer Motion carefully" is useless. Name the specific prop, the specific failure, the specific fix.
- **Creating a new skill when an existing one fits.** Duplication fragments knowledge.
- **Orphan rules.** Adding a rule file without updating SKILL.md's index means it exists on disk but nothing points at it. Always update both.
- **Editing plugin-cached skills.** Those get overwritten. Write to the project-local `.claude/skills/` copy or create a new project-local skill.
- **Capturing too early.** If the bug was just fixed and you haven't confirmed the fix works, don't compound yet. Wait for user confirmation, then compound.
- **Dogma creep.** If you catch yourself writing `ALWAYS` / `NEVER` in all caps without explaining why, reframe with the mechanism. Smart readers follow explanations; they ignore unexplained shouting.

## Quick self-check before committing

- Could a Claude with zero context about this project read the rule and apply it correctly on the first try? If not, generalize more.
- Does the rule name the specific failure mechanism, or is it a vague "be careful"? If vague, add the mechanism.
- Is there a one-line pointer in SKILL.md's Quick Reference? If not, add it.
- Does the filename match the target skill's naming convention? If not, rename.
