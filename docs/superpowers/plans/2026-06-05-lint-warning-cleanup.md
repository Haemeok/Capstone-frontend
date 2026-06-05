# Lint Warning Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drive the 53 in-scope lint warnings (no-img-element + no-unused-vars + exhaustive-deps) to zero, leaving only the 9 deliberately-kept React-Compiler-limitation warnings.

**Architecture:** Mechanical cleanup cut by **rule × nature** (one slice = one commit). The **red→green oracle is the linter's warning count**, not new tests — test design was waived (refactor; behavior guarded by the existing suite + `tsc`). Traceability is the AC word (AC-W1.1 …), no T-xx matrix by design.

**Tech Stack:** ESLint 9 flat config, Next.js, TypeScript, react-hooks plugin.

**Out of scope (do NOT touch):** `react-hooks/incompatible-library` (8, react-hook-form) and `react-hooks/unsupported-syntax` (1) — kept as informational; `set-state-in-effect` (25 errors, #124).

**Per-task discipline:** current branch `feature/17` only; never switch/create branches. After each task: `npx eslint src` (target rule warning = 0) + `npm run typecheck`. If a touched file's pre-commit hook is blocked by an unrelated error rule, add a `// eslint-disable-next-line <rule> -- deferred to #124` (set-state) and report it — do not refactor out of scope. Never `--no-verify`.

---

### Task W1: no-img-element config off (walking skeleton)

Target rule: `@next/next/no-img-element` (33). Codifies the project hard rule (next/image forbidden, plain `<img>`). One-line config change proves the loop. (AC-W1.1, AC-W1.2)

**Files:**
- Modify: `eslint.config.mjs` (the `rules` block inside the `{ plugins: { "simple-import-sort", local }, rules: {...} }` config object — the same block that holds `local/no-policy-comments` and `@typescript-eslint/no-unused-vars`)

- [ ] **Step 1 (red): confirm current count**

Run: `npx eslint src 2>&1 | grep -c no-img-element`
Expected: `33`

- [ ] **Step 2: add the off rule**

In `eslint.config.mjs`, inside that `rules` object, add the line (next to the existing `@typescript-eslint/no-unused-vars` entry):

```js
      "@next/next/no-img-element": "off",
```

Do NOT add a code comment explaining why (repo forbids prose comments). The rationale goes in the commit body.

- [ ] **Step 3 (green): verify count drops, nothing else moved**

Run: `npx eslint src 2>&1 | grep -c no-img-element` → Expected: `0`.
Run: `npx eslint src 2>&1 | tail -1` → Expected: problem total dropped by exactly 33 (warnings now ~29 + errors 25). Confirm no rule's count went UP.
Run: `npm run typecheck` → Expected: exit 0 (config change can't affect types, but confirm nothing else broke).

- [ ] **Step 4: commit**

```bash
git add eslint.config.mjs
git commit -m "chore(lint): disable next/next/no-img-element

The project deliberately uses plain <img> (next/image is forbidden by a
hard project rule for LCP/JS-chain reasons), so this rule only ever fires
false positives."
```

---

### Task W2: no-unused-vars cleanup (14)

Target rule: `@typescript-eslint/no-unused-vars` (14). Remove unused imports/vars; `_`-prefix only where removal is unsafe (public signature / type member). (AC-W2.1 … AC-W2.3)

**Files (warning line):**
- `src/app/admin/recipe-blog-test/components/QueueStatusCard.tsx:34`
- `src/app/archetype/[code]/page.tsx:28`
- `src/app/recipes/[recipeId]/layout.tsx:8`
- `src/entities/recipe/model/types.ts:182`
- `src/features/archetype/model/archeTypeResult.ts:28`
- `src/features/archetype/ui/hooks/useShareImage.ts:163`
- `src/shared/api/auth.ts:146`, `:172`
- `src/shared/api/serverApiClient.server.ts:23`
- `src/shared/lib/hooks/useFormProgress.ts:18`
- `src/shared/ui/ErrorBoundary.tsx:23`
- `src/shared/ui/SortPicker.tsx:74`
- `src/shared/ui/StoreBadges.tsx:18`

- [ ] **Step 1 (red): count**

Run: `npx eslint src 2>&1 | grep -c no-unused-vars` → Expected: `14`.

- [ ] **Step 2: fix each, reading the eslint message first**

Run `npx eslint src 2>&1 | grep -B1 no-unused-vars` to see what each unused symbol is. Then per location:
- **Unused import** → delete the import (or the one specifier from the import list).
- **Unused local variable / destructured value** → delete it; if it's a destructured value you must keep for positional reasons, rename to `_` or prefix `_`.
- **Unused function parameter** that can't be dropped (callback signature, type contract) → prefix `_` (e.g. `(_event) =>`). The config has `ignoreRestSiblings: true`, so `const { used, ...rest }` patterns are already fine.
- **Unused catch binding** → `catch { ... }` (omit the binding) where supported, else `catch (_e)`.
- Do NOT delete something that has a side-effectful initializer just because the binding is unused — read the line; if the RHS has effects, keep the call and drop only the binding.

- [ ] **Step 3 (green): count 0 + typecheck**

Run: `npx eslint src 2>&1 | grep no-unused-vars` → Expected: no output.
Run: `npm run typecheck` → Expected: exit 0 (no dangling references from deletions).

- [ ] **Step 4: run touched-area tests (safety)**

Run: `npx jest src/shared/api src/features/archetype` → Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add -A
git commit -m "chore(lint): remove unused imports and variables"
```

Note: if the pre-commit hook blocks because a touched file carries an unrelated `set-state-in-effect`/`react-hooks/*` error, add `// eslint-disable-next-line <rule> -- deferred to #124` and report which file.

---

### Task W3: exhaustive-deps fixes (6) — behavior-sensitive

Target rule: `react-hooks/exhaustive-deps` (6). Case-by-case: add the genuinely-missing dep, or `reasoned disable` for an intentional mount-once. Behavior MUST be preserved. (AC-W3.1 … AC-W3.3)

**Files:**
- `src/entities/notification/ui/NotificationItem.tsx:56`
- `src/features/recipe-create/model/hooks/useRecipeEditForm.ts:82`
- `src/features/recipe-create/model/hooks/useRecipeRemixForm.ts:71`
- `src/shared/hooks/useAICreditPrompt.ts:41`
- `src/shared/hooks/useYoutubeExtractionPrompt.ts:42`
- `src/shared/ui/article/hooks/useActiveSection.ts:95`

- [ ] **Step 1 (red): count + read each message**

Run: `npx eslint src 2>&1 | grep -A2 exhaustive-deps` → Expected: 6 warnings, each naming the missing dep(s).

- [ ] **Step 2: triage and fix each**

For each effect, read the whole effect body and decide:
- **Genuine stale-closure** (the effect reads a prop/state that can change and SHOULD re-run when it does) → add the dep to the array. Then verify the effect doesn't now fire too often (e.g. an object/function dep that changes identity every render — if so, stabilize it with `useCallback`/`useMemo` at its source or move it inside the effect, rather than leaving it out).
- **Intentional run-once / run-on-specific-trigger** (e.g. mount-only initialization, or "only when `id` changes, deliberately not when the handler identity does") → keep the array as-is and add `// eslint-disable-next-line react-hooks/exhaustive-deps -- <1-line reason>`.
- The `useRecipeEditForm`/`useRecipeRemixForm` cases are RHF `reset(...)`-on-load patterns — typically intentional "reset when the loaded data arrives, not when `reset` identity changes"; prefer the reasoned disable unless reading shows a real missing data dep.
- The prompt hooks (`useAICreditPrompt`, `useYoutubeExtractionPrompt`) and `useActiveSection` are observer/one-shot setups — read to confirm.
- No prose comments beyond the mechanical eslint-disable marker.

- [ ] **Step 3 (green): count 0 + typecheck + tests**

Run: `npx eslint src 2>&1 | grep exhaustive-deps` → Expected: no output (each resolved by added dep or reasoned disable).
Run: `npm run typecheck` → Expected: exit 0.
Run: `npx jest src/features/recipe-create src/shared/hooks src/entities/notification` → Expected: PASS (behavior preserved). For hooks with no test, state "no test coverage" and reason about behavior preservation in the report.

- [ ] **Step 4: commit**

```bash
git add -A
git commit -m "fix(hooks): resolve exhaustive-deps — add missing deps or document intent"
```

---

### Final gate

- [ ] **Verify warning count = 9**

Run: `npx eslint src 2>&1 | grep -E "warning" | grep -cE "incompatible-library|unsupported-syntax"` → Expected: `9`.
Run: `npx eslint src 2>&1 | grep "warning" | grep -vE "incompatible-library|unsupported-syntax"` → Expected: no output. (AC-FINAL.1)

- [ ] **Verify errors unchanged (only #124)**

Run: `npx eslint src 2>&1 | grep "error" | grep -v "set-state-in-effect"` → Expected: no output. (AC-FINAL.2)

- [ ] **typecheck**

Run: `npm run typecheck` → Expected: exit 0. (AC-FINAL.3)
