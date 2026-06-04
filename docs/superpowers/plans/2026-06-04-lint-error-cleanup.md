# Lint Error Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drive the 128 in-scope lint errors (cosmetic + `no-explicit-any` + React Compiler correctness) to zero without changing runtime behavior.

**Architecture:** Mechanical cleanup cut by **rule × area** (one slice = one commit). The **red→green oracle is the linter itself**, not new unit tests — test design was explicitly waived (this is a refactor; behavior is guarded by the existing test suite + `tsc` + `build`). Each task's "failing test" is the current `npx eslint` error count for its target rules; "passing" is 0. Requirement traceability is the AC word (AC-S0.1 …), per the slices doc — no T-xx matrix exists by design.

**Tech Stack:** ESLint 9 flat config (`next/core-web-vitals`, `next/typescript`, `eslint-plugin-react-hooks` flat recommended), TypeScript, Jest.

**Out of scope (do NOT touch):** all warnings (`no-img-element` 33 / `no-unused-vars` 15 / `exhaustive-deps` 10 / `incompatible-library` 8); `set-state-in-effect` (28, tracked in #124); `no-img-element` config.

**Per-task discipline:** run only on the current branch `feature/17`. Never `--fix` the whole repo blindly across rules — each task scopes its rule(s). After every task: `npx eslint src` (target rule = 0), `npm run typecheck` (green), and run any existing tests that touch the changed files.

---

### Task S0: Cosmetic clean (walking skeleton)

Target rules: `react/no-unescaped-entities` (20), `@typescript-eslint/no-require-imports` (4), `@next/next/no-assign-module-variable` (1). Proves the fix→clean→typecheck→commit loop on the lowest-risk area first. (AC-S0.1, AC-S0.2, AC-S0.3)

**Files:**
- Modify (unescaped entities): `src/app/admin/grok-batch/page.tsx:298`, `src/app/admin/grok-parse/page.tsx:268`, `src/app/admin/recipe-blog-test/components/CurationBlogMode.tsx:129,164`, `src/app/recipes/[recipeId]/components/RecipeCookingTipsSection.tsx:23`, `src/features/landing/ui/TestimonialCarousel.tsx:240,267`, `src/features/recipe-create/ui/IngredientSelector.tsx:167`, `src/features/review-gate/ui/ReviewGateDrawer.tsx:49`, `src/widgets/CalendarTabContent/FirstSavingsQuestPanel.tsx:20`, `src/widgets/Header/DesktopHeader.tsx:49`, `src/widgets/LoginEncourageDrawer/GlobalLoginEncourageDrawer.tsx:53`, `src/widgets/LoginEncourageDrawer/index.tsx:60`
- Modify (assign-module-variable): `src/features/landing/ui/RecipeCarousel.tsx:27`
- Modify (require-imports, CARE — jest semantics): `src/shared/api/__tests__/auth-contract.test.ts:25,347,370`, `src/shared/api/__tests__/auth.test.ts:50`

- [ ] **Step 1 (red): capture current counts**

Run: `npx eslint src --format json | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d),r={};for(const f of j)for(const m of f.messages)if(['react/no-unescaped-entities','@typescript-eslint/no-require-imports','@next/next/no-assign-module-variable'].includes(m.ruleId))r[m.ruleId]=(r[m.ruleId]||0)+1;console.log(r)})"`
Expected: `{ 'react/no-unescaped-entities': 20, '@typescript-eslint/no-require-imports': 4, '@next/next/no-assign-module-variable': 1 }`

- [ ] **Step 2: auto-fix the unescaped entities**

Run: `npx eslint src --rule '{"react/no-unescaped-entities":"error"}' --fix` — this rule is auto-fixable; it replaces bare `'`/`"` in JSX text with `&apos;`/`&quot;`. Review the diff: it must only touch JSX text nodes, nothing else.

- [ ] **Step 3: rename the `module` variable**

In `src/features/landing/ui/RecipeCarousel.tsx:27`, a local variable is named `module` (shadows the CommonJS global, which is what the rule flags). Read the line, rename it to a domain noun (e.g. `carouselModule` or whatever it holds — read context) and update its references in that file.

- [ ] **Step 4: convert `require()` in tests, preserving jest semantics**

For each `require(...)` at the cited lines: if it is a plain module import, hoist to a top-level `import`. If it is a post-`jest.mock` re-require or `jest.requireActual` used to read the mocked/actual module *after* mocking, do NOT hoist (that would break mock timing) — convert to `const x = jest.requireActual<typeof import('...')>('...')` or add `// eslint-disable-next-line @typescript-eslint/no-require-imports` with reason `jest mock isolation needs runtime require`. Decide per line by reading the surrounding mock setup.

- [ ] **Step 5 (green): verify rules at 0 + typecheck**

Run: `npx eslint src 2>&1 | grep -E "no-unescaped-entities|no-require-imports|no-assign-module-variable"` → Expected: no output.
Run: `npm run typecheck` → Expected: exit 0.

- [ ] **Step 6: run touched tests**

Run: `npx jest src/shared/api/__tests__/auth.test.ts src/shared/api/__tests__/auth-contract.test.ts` → Expected: PASS (behavior preserved).

- [ ] **Step 7: commit**

```bash
git add -A
git commit -m "fix(lint): escape JSX entities, rename module var, fix require imports"
```

---

### Task S1: `no-explicit-any` clean — shared/api boundary (36)

Target rule: `@typescript-eslint/no-explicit-any` in the API/auth boundary. Type properly (`unknown` + narrowing, or interfaces); only genuine network/3rd-party boundaries get a 1-line **boundary disable**. (AC-S1.1 … AC-S1.4)

**Files:**
- Modify: `src/shared/api/client.ts` (10), `src/shared/api/serverApiClient.server.ts` (6), `src/shared/api/types.ts` (3), `src/shared/api/errors.ts` (2)
- Modify (test harness/contract): `src/shared/api/__tests__/_auth-harness.ts` (9), `src/shared/api/__tests__/auth-contract.test.ts` (3), `src/shared/api/__tests__/auth.test.ts` (3)

- [ ] **Step 1 (red): count**

Run: `npx eslint src/shared/api 2>&1 | grep -c no-explicit-any` → Expected: `36`.

- [ ] **Step 2: type the client generics + response types**

Read `client.ts`, `types.ts`, `errors.ts`. Replace `any` using these patterns:
- request/response payloads → generic type params (`apiClient<TResponse>(...)`) or the existing domain response types.
- caught errors → `catch (e: unknown)` then narrow (`e instanceof Error`, or a `isApiError(e)` guard in `errors.ts`).
- truly opaque JSON at the fetch boundary only → `unknown` and narrow at the call site (never leave `any`).
- a genuine 3rd-party boundary with no usable type → `// eslint-disable-next-line @typescript-eslint/no-explicit-any -- <reason>`.

- [ ] **Step 3: type the auth test harness**

Read `_auth-harness.ts` and the two auth test files. Replace mock-shape `any` with explicit mock types (`jest.Mock<...>`, or a typed fixture). Test-only opaque values → `unknown`.

- [ ] **Step 4 (green): verify + typecheck + tests**

Run: `npx eslint src/shared/api 2>&1 | grep no-explicit-any` → Expected: no output (any remaining lines must be `eslint-disable`d with a reason — verify each).
Run: `npm run typecheck` → Expected: exit 0.
Run: `npx jest src/shared/api` → Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add src/shared/api
git commit -m "refactor(api): replace any with proper types at the api/auth boundary"
```

---

### Task S2: `no-explicit-any` clean — socket layer (20)

Target rule: `@typescript-eslint/no-explicit-any` in the SockJS/STOMP layer. (AC-S2.1 … AC-S2.3)

**Files:**
- Modify: `src/shared/lib/sockjs-websocket.ts` (16), `src/shared/types/sockjs-stomp.d.ts` (4)

- [ ] **Step 1 (red): count**

Run: `npx eslint src/shared/lib/sockjs-websocket.ts src/shared/types/sockjs-stomp.d.ts 2>&1 | grep -c no-explicit-any` → Expected: `20`.

- [ ] **Step 2: define STOMP/sockjs types**

Check Context7/`@types/sockjs-client` and `@stomp/stompjs` for existing types first. In `sockjs-stomp.d.ts`, replace `any` in the ambient declarations with the real frame/message/subscription shapes (e.g. `IFrame`, `IMessage` from `@stomp/stompjs`). In `sockjs-websocket.ts`, type handlers against those. The raw socket transport object, if genuinely untyped by the lib, gets one **boundary disable** with reason `sockjs transport has no upstream types`.

- [ ] **Step 3 (green): verify + typecheck**

Run: `npx eslint src/shared/lib/sockjs-websocket.ts src/shared/types/sockjs-stomp.d.ts 2>&1 | grep no-explicit-any` → Expected: no output (or only reasoned disables).
Run: `npm run typecheck` → Expected: exit 0.

- [ ] **Step 4: commit**

```bash
git add src/shared/lib/sockjs-websocket.ts src/shared/types/sockjs-stomp.d.ts
git commit -m "refactor(socket): type STOMP/sockjs frames, drop any"
```

---

### Task S3: `no-explicit-any` clean — scattered (29)

Target rule: `@typescript-eslint/no-explicit-any` everywhere else. After this, src-wide `no-explicit-any` = 0. (AC-S3.1 … AC-S3.3)

**Files (any-count):**
- `src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts` (4)
- `src/widgets/CalendarTabContent/index.tsx` (3)
- `src/app/admin/grok-batch/page.tsx` (2), `src/features/recipe-batch-update/model/types.ts` (2), `src/features/recipe-batch-update/model/useBatchUpdateReactions.ts` (2), `src/features/recipe-create/model/hooks/__tests__/useSubmitRecipe.test.tsx` (2)
- 1 each: `src/app/recipes/admin/image-test/page.tsx`, `src/app/recipes/category/[id]/CategoryDetailClient.tsx`, `src/app/search/results/__tests__/seo.generateMetadata.test.ts`, `src/entities/notification/model/type.ts`, `src/entities/user/model/hooks.ts`, `src/features/recipe-complete/model/hooks.ts`, `src/features/recipe-create/model/config.ts`, `src/features/recipe-create/model/hooks/__tests__/useSubmitRemix.test.tsx`, `src/shared/hooks/useScrollAnimate.ts`, `src/shared/hooks/useWakeLock.ts`, `src/shared/lib/hooks/useFormProgress.ts`, `src/shared/ui/form/FormProgressButton.tsx`, `src/widgets/IngredientsPage/hooks/useGridAnimation.ts`, `src/widgets/OnboardingSurveryModal/SurveyContent.tsx`

- [ ] **Step 1 (red): count**

Run: `npx eslint src 2>&1 | grep -c no-explicit-any` → Expected: `29` (S1+S2 already done).

- [ ] **Step 2: fix file by file**

For each file, read it and apply the matching pattern (same catalog as S1): domain type if one exists in `entities`/`features`, generic param for hook payloads, `unknown`+narrow for opaque values, typed mocks in `__tests__`. `useGridAnimation.ts`/`useScrollAnimate.ts`/`useWakeLock.ts`: type the DOM/animation refs (`HTMLElement`, `WakeLockSentinel`) instead of `any`. Reasoned **boundary disable** only where a 3rd-party value is genuinely untyped.

- [ ] **Step 3 (green): src-wide any = 0 + typecheck + tests**

Run: `npx eslint src 2>&1 | grep no-explicit-any` → Expected: no output (only reasoned disables remain).
Run: `npm run typecheck` → Expected: exit 0.
Run: `npx jest src/entities/recipe/lib/metadata src/features/recipe-create src/app/search/results` → Expected: PASS.

- [ ] **Step 4: commit**

```bash
git add -A
git commit -m "refactor: replace remaining explicit any across features/widgets/app"
```

---

### Task S4: React Compiler correctness clean (18)

Target rules: `react-hooks/refs` (7), `static-components` (4), `purity` (3), `use-memo` (2), `immutability` (1), `preserve-manual-memoization` (1). Case-by-case real fixes; behavior preserved. (AC-S4.1 … AC-S4.3)

**Files:**
- `static-components`: `src/shared/ui/SortPicker.tsx:86,100`, `src/widgets/CategoryDrawer/CategoryDrawer.tsx:146,183` — a component is defined inside another component's render. Move it to module scope (or extract to its own file), passing what it needs via props.
- `refs`: `src/shared/hooks/useInfiniteScroll.ts:80` (6×), `src/features/recipe-import-youtube/lib/useSmoothProgress.ts:28` — a ref is read/written during render. Move the access into an effect/event handler, or read `.current` only inside callbacks.
- `purity`: `src/features/recipe-import-youtube/ui/PendingRecipeCard.tsx:64`, `src/shared/lib/hooks/useKeyboardSource.ts:80`, `src/widgets/HomeBannerCarousel/ProgressBar.tsx:30` — impure work (mutation / side value) during render. Move into effect or compute purely.
- `use-memo`: `src/features/recipe-search/model/useNutritionParams.ts:22,27` — `useMemo` misuse; either correct deps or drop the memo if the compiler handles it.
- `immutability`: `src/shared/lib/hooks/useKeyboardHeight.ts:30` — mutating a value that must be immutable; clone or restructure.
- `preserve-manual-memoization`: `src/widgets/Toast/ui/RichToast.tsx:49` — `useMemo` deps `[richContent?.thumbnail]` are less specific than inferred (`richContent`). Align deps to what the body reads, or remove the manual memo (React Compiler memoizes it).

- [ ] **Step 1 (red): count**

Run: `npx eslint src 2>&1 | grep -cE "react-hooks/(refs|static-components|purity|use-memo|immutability|preserve-manual-memoization)"` → Expected: `18`.

- [ ] **Step 2: fix each rule group**

Apply the per-file fix described above. For `static-components`, after moving the inner component out, verify props cover everything it closed over. For `RichToast`, prefer removing the manual `useMemo` (the React Compiler is on) unless profiling justified it.

- [ ] **Step 3 (green): rules = 0 + typecheck + build + touched tests**

Run: `npx eslint src 2>&1 | grep -E "react-hooks/(refs|static-components|purity|use-memo|immutability|preserve-manual-memoization)"` → Expected: no output.
Run: `npm run typecheck` → Expected: exit 0.
Run: `npx jest src/shared/hooks src/features/recipe-search` → Expected: PASS (behavior preserved). If no test covers a touched component, smoke it in the running app.

- [ ] **Step 4: commit**

```bash
git add -A
git commit -m "fix(react-compiler): hoist static components, fix ref/purity/memo violations"
```

---

### Final gate

- [ ] **Verify in-scope errors are zero**

Run: `npx eslint src 2>&1 | grep -E "error" | grep -v "set-state-in-effect"` → Expected: no output (only the 28 deferred `set-state-in-effect` errors remain, tracked in #124). (AC-FINAL.1)

- [ ] **Verify warnings did not grow**

Run: `npx eslint src 2>&1 | tail -1` → Expected: warning count ≤ 67. (AC-FINAL.2)

- [ ] **typecheck + build**

Run: `npm run typecheck` then `npm run build` → Expected: both exit 0. (AC-FINAL.3)
