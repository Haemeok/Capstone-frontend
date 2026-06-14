# i18n B+C Implementation Plan — 에러 바운더리 · 로그인 · 알림 · 레시피 상세 콘텐츠

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** I18N-STATUS.md가 done으로 표시했지만 한글이 남은 영역(공유 에러 바운더리·카테고리 메타·레시피 상세 콘텐츠)과 미착수 유저 플로우(로그인·알림)를 ko/ja/en 사전 시스템에 연결한다.

**Architecture:** 기존 i18n 패턴 답습 — (1) Provider 밖 공유 client 컴포넌트는 `usePathname → resolveChromeLocale` self-detect 훅(`useChromeDict` 계열), (2) recipe detail은 이미 `getDictionary(locale)` + `DictionaryProvider` 안이라 키 확장만, (3) 서버 메타는 `getDictionary(locale)`. 번역은 ja/en 각각 네이티브 IT PM 톤(직역 금지).

**Tech Stack:** Next.js 15 App Router, TypeScript, Jest + Testing-Library, `@/shared/i18n` 사전 시스템, date-fns.

**상위 문서:** `specs/2026-06-14-i18n-error-auth-notifications-recipe-detail-{design,slices,test-design}.md`

**전 task 공통 검증:** 변경 후 `npx tsc --noEmit`. no-Hangul 렌더 테스트는 `const HANGUL = /[가-힣]/`로 `container.textContent` 검사(기존 `categoryChrome.ja.test.tsx` 패턴).

**Git 규칙:** 현재 브랜치 `feature/17`에서만. `git add <명시 경로>` 후 같은 경로 pathspec으로 `git commit -- <경로>`. 워킹트리에 광고슬롯 미커밋 변경(RecipeStepList/RecipeDetailView/adsense)이 있으니 절대 함께 staging 금지.

---

## Translation key reference (ja/en — 네이티브 톤 초안)

각 task 구현 시 아래 값을 사용하되, 어색하면 타깃 언어 프롬프트로 다듬는다. **번역 원칙:** 직역 금지, 레시피 앱 사용자에게 자연스러운 문장.

> 구현자에게: ja/en 값이 미세하게 어색하다고 느끼면, "당신은 일본/영어권 레시피 앱의 시니어 프로덕트 PM입니다. 다음 ko 문구를 해당 언어 사용자에게 자연스러운 한 문장으로 다듬어 주세요"라는 프롬프트로 재생성 후 교체. 의미·길이(UI 잘림) 유지.

---

## Task 1: 공유 에러 fallback locale 표시 (Walking Skeleton) — T-01, T-02, T-03

가장 얇은 end-to-end: `errors` 타입 확장 + self-detect `useErrorsDict` + `ErrorFallback` 전환 + recipe `error.tsx` 와이어. 이 task가 self-detect 에러 경로 전체를 증명한다.

**Files:**
- Modify: `src/shared/i18n/types.ts` (`ErrorsDict` 확장)
- Modify: `src/shared/i18n/messages/ko/search.ts` (errors 키 추가)
- Modify: `src/shared/i18n/messages/ja/search.ts`, `src/shared/i18n/messages/en/search.ts`
- Create: `src/shared/i18n/errorsMessages.ts`
- Create: `src/shared/i18n/useErrorsDict.ts`
- Modify: `src/shared/i18n/index.ts` (barrel export)
- Modify: `src/shared/ui/ErrorFallback.tsx`
- Modify: `src/app/recipes/[recipeId]/error.tsx`
- Test: `src/shared/ui/__tests__/ErrorFallback.i18n.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/shared/ui/__tests__/ErrorFallback.i18n.test.tsx
import { render, screen } from "@testing-library/react";

import { errorsMessages } from "@/shared/i18n/errorsMessages";

import ErrorFallback from "../ErrorFallback";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPath() }));

const ja = errorsMessages.ja;
const ko = errorsMessages.ko;

describe("ErrorFallback i18n", () => {
  it("T-01: ja path → ja chrome + context message, no Hangul", () => {
    mockPath.mockReturnValue("/ja/recipes/abc");
    const { container } = render(
      <ErrorFallback reset={() => {}} context="recipe" />
    );
    expect(screen.getByText(ja.heading)).toBeInTheDocument();
    expect(screen.getByText(ja.context.recipe)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ja.retry })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ja.goHome })).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-02: ko path → existing Korean preserved", () => {
    mockPath.mockReturnValue("/recipes/abc");
    render(<ErrorFallback reset={() => {}} context="recipe" />);
    expect(screen.getByText(ko.heading)).toBeInTheDocument();
    expect(screen.getByText(ko.context.recipe)).toBeInTheDocument();
  });

  it("T-03: no locale prefix → ko default", () => {
    mockPath.mockReturnValue("/search/results");
    render(<ErrorFallback reset={() => {}} context="generic" />);
    expect(screen.getByText(ko.context.generic)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/shared/ui/__tests__/ErrorFallback.i18n.test.tsx`
Expected: FAIL — `errorsMessages` 모듈 없음 / `context` prop 미지원.

- [ ] **Step 3: Extend `ErrorsDict` type**

`src/shared/i18n/types.ts`의 `ErrorsDict`를 교체:

```ts
export type ErrorsDict = {
  sectionGeneric: string;
  video: string;
  comments: string;
  ingredients: string;
  steps: string;
  searchResults: string;
  heading: string;
  retry: string;
  goHome: string;
  goBack: string;
  sectionMessage: string;
  sectionRetry: string;
  context: {
    recipe: string;
    search: string;
    ingredients: string;
    edit: string;
    generic: string;
  };
};
```

- [ ] **Step 4: Add ko/ja/en errors values**

`messages/ko/search.ts`의 `export const errors`에 병합(기존 6키 유지하고 아래 추가):

```ts
  heading: "문제가 발생했어요",
  retry: "다시 시도",
  goHome: "홈으로 가기",
  goBack: "뒤로 가기",
  sectionMessage: "이 영역을 불러올 수 없어요",
  sectionRetry: "재시도",
  context: {
    recipe: "레시피를 불러올 수 없어요",
    search: "검색 결과를 불러올 수 없어요",
    ingredients: "재료 정보를 불러올 수 없어요",
    edit: "레시피 수정 페이지를 불러올 수 없어요",
    generic: "잠시 후 다시 시도해주세요",
  },
```

`messages/ja/search.ts` errors에 추가:

```ts
  heading: "問題が発生しました",
  retry: "再試行",
  goHome: "ホームへ",
  goBack: "戻る",
  sectionMessage: "この部分を読み込めませんでした",
  sectionRetry: "再試行",
  context: {
    recipe: "レシピを読み込めませんでした",
    search: "検索結果を読み込めませんでした",
    ingredients: "食材情報を読み込めませんでした",
    edit: "レシピ編集ページを読み込めませんでした",
    generic: "しばらくしてからもう一度お試しください",
  },
```

`messages/en/search.ts` errors에 추가:

```ts
  heading: "Something went wrong",
  retry: "Try again",
  goHome: "Go home",
  goBack: "Go back",
  sectionMessage: "Couldn't load this section",
  sectionRetry: "Retry",
  context: {
    recipe: "Couldn't load this recipe",
    search: "Couldn't load search results",
    ingredients: "Couldn't load ingredients",
    edit: "Couldn't load the recipe editor",
    generic: "Please try again in a moment",
  },
```

- [ ] **Step 5: Create self-detect map + hook**

```ts
// src/shared/i18n/errorsMessages.ts
import { errors as en } from "./messages/en/search";
import { errors as ja } from "./messages/ja/search";
import { errors as ko } from "./messages/ko/search";
import type { ErrorsDict, Locale } from "./types";

export const errorsMessages: Record<Locale, ErrorsDict> = { ko, ja, en };
```

```ts
// src/shared/i18n/useErrorsDict.ts
"use client";

import { usePathname } from "next/navigation";

import { errorsMessages } from "./errorsMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { ErrorsDict } from "./types";

export const useErrorsDict = (): ErrorsDict =>
  errorsMessages[resolveChromeLocale(usePathname() ?? "/")];
```

`src/shared/i18n/index.ts`에 추가:

```ts
export { errorsMessages } from "./errorsMessages";
export { useErrorsDict } from "./useErrorsDict";
```

- [ ] **Step 6: Rewrite `ErrorFallback` self-detect**

`src/shared/ui/ErrorFallback.tsx` 전체 교체:

```tsx
"use client";

import { useErrorsDict } from "@/shared/i18n";

type ErrorContext = "recipe" | "search" | "ingredients" | "edit" | "generic";

type ErrorFallbackProps = {
  reset: () => void;
  context?: ErrorContext;
  message?: string;
};

const ErrorFallback = ({
  reset,
  context = "generic",
  message,
}: ErrorFallbackProps) => {
  const t = useErrorsDict();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
      <p className="text-ink text-lg font-bold">{t.heading}</p>
      <p className="text-ink-muted text-sm">{message ?? t.context[context]}</p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="bg-olive-light hover:bg-olive-dark h-12 rounded-xl px-6 font-medium text-white transition-colors"
        >
          {t.retry}
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="text-ink-sub h-12 rounded-xl bg-gray-100 px-6 font-medium transition-colors hover:bg-gray-200"
        >
          {t.goHome}
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
```

- [ ] **Step 7: Wire recipe error.tsx to context key**

`src/app/recipes/[recipeId]/error.tsx`의 `message="레시피를 불러올 수 없어요"`를 `context="recipe"`로 교체. 예:

```tsx
"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

export default function Error({ reset }: { reset: () => void }) {
  return <ErrorFallback reset={reset} context="recipe" />;
}
```

(기존 시그니처 유지 — `error` prop이 있으면 보존, `message` 줄만 `context`로 치환)

- [ ] **Step 8: Run tests + tsc**

Run: `npx jest src/shared/ui/__tests__/ErrorFallback.i18n.test.tsx && npx tsc --noEmit`
Expected: PASS, 타입 에러 없음.

- [ ] **Step 9: Commit**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ko/search.ts src/shared/i18n/messages/ja/search.ts src/shared/i18n/messages/en/search.ts src/shared/i18n/errorsMessages.ts src/shared/i18n/useErrorsDict.ts src/shared/i18n/index.ts src/shared/ui/ErrorFallback.tsx src/app/recipes/[recipeId]/error.tsx "src/shared/ui/__tests__/ErrorFallback.i18n.test.tsx"
git commit -m "feat(i18n): self-detect locale in shared ErrorFallback (T-01..03)" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko/search.ts src/shared/i18n/messages/ja/search.ts src/shared/i18n/messages/en/search.ts src/shared/i18n/errorsMessages.ts src/shared/i18n/useErrorsDict.ts src/shared/i18n/index.ts src/shared/ui/ErrorFallback.tsx src/app/recipes/[recipeId]/error.tsx "src/shared/ui/__tests__/ErrorFallback.i18n.test.tsx"
```

---

## Task 2: NotFound · SectionErrorFallback · 나머지 context + 주석 제거 — T-04..T-08

**Files:**
- Modify: `src/shared/i18n/types.ts` (`NotFoundDict` 확장)
- Modify: `messages/{ko,ja,en}/search.ts` (notFound 키 추가)
- Modify: `src/shared/ui/NotFound.tsx`, `src/shared/ui/SectionErrorFallback.tsx`
- Modify: `src/app/recipes/[recipeId]/not-found.tsx`, `.../edit/error.tsx`, `src/app/search/results/error.tsx`, `src/app/ingredients/error.tsx`
- Modify: `src/app/search/results/page.tsx` (한글 주석 제거)
- Test: `src/shared/ui/__tests__/NotFound.i18n.test.tsx`, `src/shared/ui/__tests__/SectionErrorFallback.i18n.test.tsx`, `src/app/search/results/__tests__/noHangulComments.test.ts`

- [ ] **Step 1: Write failing tests**

```tsx
// src/shared/ui/__tests__/NotFound.i18n.test.tsx
import { render, screen } from "@testing-library/react";

import { notFoundMessages } from "@/shared/i18n/notFoundMessages";

import NotFound from "../NotFound";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPath(),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("@/entities/notification", () => ({
  useDeleteNotification: () => ({ mutate: jest.fn() }),
}));

const ja = notFoundMessages.ja;

describe("NotFound i18n", () => {
  it("T-04: ja path → ja title/desc/buttons, no Hangul", () => {
    mockPath.mockReturnValue("/ja/recipes/x");
    const { container } = render(
      <NotFound titleKey="recipe" descriptionKey="recipe" />
    );
    expect(screen.getByRole("heading", { name: ja.recipe.title })).toBeInTheDocument();
    expect(screen.getByText(ja.recipe.description)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ja.goBack })).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-07: ko path → Korean preserved", () => {
    mockPath.mockReturnValue("/recipes/x");
    render(<NotFound titleKey="recipe" descriptionKey="recipe" />);
    expect(
      screen.getByRole("heading", { name: notFoundMessages.ko.recipe.title })
    ).toBeInTheDocument();
  });
});
```

```tsx
// src/shared/ui/__tests__/SectionErrorFallback.i18n.test.tsx
import { render, screen } from "@testing-library/react";

import { errorsMessages } from "@/shared/i18n/errorsMessages";

import SectionErrorFallback from "../SectionErrorFallback";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPath() }));

describe("SectionErrorFallback i18n", () => {
  it("T-05: ja section message + retry, no Hangul", () => {
    mockPath.mockReturnValue("/ja/recipes/x");
    const { container } = render(<SectionErrorFallback onRetry={() => {}} />);
    expect(screen.getByText(errorsMessages.ja.sectionMessage)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: errorsMessages.ja.sectionRetry })
    ).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-07: ko section preserved", () => {
    mockPath.mockReturnValue("/recipes/x");
    render(<SectionErrorFallback onRetry={() => {}} />);
    expect(
      screen.getByText(errorsMessages.ko.sectionMessage)
    ).toBeInTheDocument();
  });
});
```

```ts
// src/app/search/results/__tests__/noHangulComments.test.ts
import { readFileSync } from "fs";
import { join } from "path";

describe("search/results/page.tsx hygiene — T-08", () => {
  it("has no Hangul in comment lines", () => {
    const src = readFileSync(
      join(process.cwd(), "src/app/search/results/page.tsx"),
      "utf8"
    );
    const commentLines = src
      .split("\n")
      .filter((l) => l.trim().startsWith("//") || l.trim().startsWith("*"));
    const offending = commentLines.filter((l) => /[가-힣]/.test(l));
    expect(offending).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx jest src/shared/ui/__tests__/NotFound.i18n.test.tsx src/shared/ui/__tests__/SectionErrorFallback.i18n.test.tsx src/app/search/results/__tests__/noHangulComments.test.ts`
Expected: FAIL — `notFoundMessages` 없음, `titleKey` 미지원, 주석에 한글 존재.

- [ ] **Step 3: Extend `NotFoundDict` type**

`src/shared/i18n/types.ts`의 `NotFoundDict` 교체:

```ts
export type NotFoundDict = {
  message: string;
  searchCta: string;
  goBack: string;
  goHome: string;
  recipe: { title: string; description: string };
  generic: { title: string; description: string };
};
```

- [ ] **Step 4: Add ko/ja/en notFound values**

`messages/ko/search.ts` notFound에 추가:

```ts
  goBack: "뒤로 가기",
  goHome: "홈으로 가기",
  recipe: {
    title: "존재하지 않는 레시피입니다",
    description: "레시피가 삭제되었거나 존재하지 않습니다. 다른 레시피를 찾아보시겠어요?",
  },
  generic: {
    title: "페이지를 찾을 수 없어요",
    description: "요청하신 페이지가 존재하지 않습니다.",
  },
```

`messages/ja/search.ts` notFound에 추가:

```ts
  goBack: "戻る",
  goHome: "ホームへ",
  recipe: {
    title: "存在しないレシピです",
    description: "レシピが削除されたか、存在しません。別のレシピを探してみませんか？",
  },
  generic: {
    title: "ページが見つかりません",
    description: "お探しのページは存在しません。",
  },
```

`messages/en/search.ts` notFound에 추가:

```ts
  goBack: "Go back",
  goHome: "Go home",
  recipe: {
    title: "Recipe not found",
    description: "This recipe was deleted or doesn't exist. Want to find another?",
  },
  generic: {
    title: "Page not found",
    description: "The page you're looking for doesn't exist.",
  },
```

- [ ] **Step 5: Create notFound self-detect map + hook**

```ts
// src/shared/i18n/notFoundMessages.ts
import { notFound as en } from "./messages/en/search";
import { notFound as ja } from "./messages/ja/search";
import { notFound as ko } from "./messages/ko/search";
import type { Locale, NotFoundDict } from "./types";

export const notFoundMessages: Record<Locale, NotFoundDict> = { ko, ja, en };
```

```ts
// src/shared/i18n/useNotFoundDict.ts
"use client";

import { usePathname } from "next/navigation";

import { notFoundMessages } from "./notFoundMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { NotFoundDict } from "./types";

export const useNotFoundDict = (): NotFoundDict =>
  notFoundMessages[resolveChromeLocale(usePathname() ?? "/")];
```

`index.ts`에 두 export 추가.

- [ ] **Step 6: Rewrite NotFound + SectionErrorFallback**

`src/shared/ui/NotFound.tsx`: prop을 `title`/`description` 문자열에서 `titleKey`/`descriptionKey` (`"recipe" | "generic"`)로 변경, `useNotFoundDict()`로 chrome("뒤로 가기"/"홈으로 가기")과 본문을 읽도록 수정. 기존 `emoji` prop 유지. 버튼 라벨을 `t.goBack`/`t.goHome`로.

```tsx
// 핵심 diff — 시그니처와 본문만
type NotFoundProps = {
  titleKey?: "recipe" | "generic";
  descriptionKey?: "recipe" | "generic";
  emoji?: string;
};

const NotFound = ({
  titleKey = "generic",
  descriptionKey = "generic",
  emoji = "🚫",
}: NotFoundProps) => {
  const t = useNotFoundDict();
  // ...기존 router/searchParams/deleteNotification useEffect 유지...
  // <h1>{t[titleKey].title}</h1>
  // <p>{t[descriptionKey].description}</p>
  // 뒤로 가기 버튼 → {t.goBack}, 홈으로 가기 버튼 → {t.goHome}
};
```

`src/shared/ui/SectionErrorFallback.tsx`: `useErrorsDict()`로 `sectionMessage`/`sectionRetry` 사용 (하드코딩 "이 영역을 불러올 수 없어요"/"재시도" 교체).

- [ ] **Step 7: Wire call sites**

- `src/app/recipes/[recipeId]/not-found.tsx`: `<NotFound title="존재하지..." description="..." />` → `<NotFound titleKey="recipe" descriptionKey="recipe" />`
- `src/app/recipes/[recipeId]/edit/error.tsx`: `message="레시피 수정..."` → `context="edit"`
- `src/app/search/results/error.tsx`: `message="검색 결과를..."` → `context="search"`
- `src/app/ingredients/error.tsx`: `message="..."` → `context="ingredients"`
- `src/app/search/results/page.tsx`: 한글 주석 4줄(`// tags → 한글명`, `// ingredientIds → 재료명`, `// dishType → 한글명`, `// nutrition params → 테마 SEO 라벨 매칭`, `// 구조화된 파라미터에서 향상된 검색어 생성`) 전부 삭제(코드 동작 무변경, 식별자가 설명함 — CLAUDE.md 주석 금지). 가격라벨(`만원 이하`/`원 이하`)은 ko 전용 의도라 유지.

- [ ] **Step 8: Run tests + tsc**

Run: `npx jest src/shared/ui/__tests__/NotFound.i18n.test.tsx src/shared/ui/__tests__/SectionErrorFallback.i18n.test.tsx src/app/search/results/__tests__/noHangulComments.test.ts && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 9: Commit** (명시 경로 add + 같은 경로 commit -- )

```
feat(i18n): localize NotFound/SectionErrorFallback + error context keys (T-04..08)
```

---

## Task 3: 카테고리 메타데이터 locale — T-09, T-10

**Files:**
- Modify: `src/shared/i18n/types.ts` (`CategoryDict`에 `meta` 추가)
- Modify: `messages/{ko,ja,en}/category.ts`
- Create: `src/entities/recipe/model/buildCategoryMetadata.ts`
- Modify: `src/app/recipes/category/[id]/layout.tsx` (빌더 호출, locale="ko")
- Create: `src/app/ja/recipes/category/[id]/layout.tsx`, `src/app/en/recipes/category/[id]/layout.tsx`
- Test: `src/entities/recipe/model/__tests__/buildCategoryMetadata.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/entities/recipe/model/__tests__/buildCategoryMetadata.test.ts
import { buildCategoryMetadata } from "../buildCategoryMetadata";

describe("buildCategoryMetadata", () => {
  it("T-09: ja → ja title + noindex", async () => {
    const meta = await buildCategoryMetadata(
      Promise.resolve({ id: "CHEF_RECIPE" }),
      "ja"
    );
    expect(meta.title).toEqual(expect.stringMatching(/[ぁ-んァ-ヶ一-龠]/));
    expect(/[가-힣]/.test(String(meta.title))).toBe(false);
    expect(meta.robots).toMatchObject({ index: false });
  });

  it("T-10: ko → Korean title preserved, indexable", async () => {
    const meta = await buildCategoryMetadata(
      Promise.resolve({ id: "CHEF_RECIPE" }),
      "ko"
    );
    expect(/[가-힣]/.test(String(meta.title))).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify fail** — `npx jest .../buildCategoryMetadata.test.ts` → FAIL (모듈 없음).

- [ ] **Step 3: Add `CategoryDict.meta` keys (format 템플릿)**

`types.ts` `CategoryDict`에 추가:

```ts
  meta: {
    fallbackTitle: string;
    titleTemplate: string; // "{emoji} {name} ..." 형태
    descriptionTemplate: string;
    keywordRecipe: string;
    keywordRecipeMethod: string;
    keywordByCategory: string;
    imageAltTemplate: string;
  };
```

ko 값(기존 layout 문구 이전):

```ts
  meta: {
    fallbackTitle: "카테고리 - 레시피오",
    titleTemplate: "{emoji} {name} 레시피 모음",
    descriptionTemplate:
      "{name} 카테고리의 인기 레시피를 확인하세요. AI가 추천하는 맞춤형 {name} 요리법으로 집에서 맛있게 해먹어보세요!",
    keywordRecipe: "{name} 레시피",
    keywordRecipeMethod: "{name} 요리법",
    keywordByCategory: "카테고리별 레시피",
    imageAltTemplate: "{name} 레시피 모음",
  },
```

ja 값:

```ts
  meta: {
    fallbackTitle: "カテゴリ - Recipio",
    titleTemplate: "{emoji} {name}のレシピ集",
    descriptionTemplate:
      "{name}カテゴリの人気レシピをチェック。AIがおすすめする{name}料理を、おうちで手軽に作ってみましょう。",
    keywordRecipe: "{name} レシピ",
    keywordRecipeMethod: "{name} 作り方",
    keywordByCategory: "カテゴリ別レシピ",
    imageAltTemplate: "{name}のレシピ集",
  },
```

en 값:

```ts
  meta: {
    fallbackTitle: "Category - Recipio",
    titleTemplate: "{emoji} {name} recipes",
    descriptionTemplate:
      "Browse popular {name} recipes. Cook delicious {name} dishes at home with AI-recommended ideas.",
    keywordRecipe: "{name} recipe",
    keywordRecipeMethod: "{name} cooking",
    keywordByCategory: "recipes by category",
    imageAltTemplate: "{name} recipes",
  },
```

> 카테고리 **이름**(`tagDef.name`)은 ko canonical. ja/en 이름은 `taxonomy.tags`에서 현지화하여 주입(아래 빌더 참조). 즉 title의 `{name}`은 `getDictionary(locale).taxonomy.tags[tagCode] ?? tagDef.name`.

- [ ] **Step 4: Create `buildCategoryMetadata`**

기존 layout.tsx 로직을 그대로 옮기되 `getDictionary(locale)` + `format()` 사용. `taxonomy.tags[tagCode]`로 이름 현지화, ja/en `robots: { index: false, follow: true }`(보드 noindex 결정).

```ts
// src/entities/recipe/model/buildCategoryMetadata.ts
import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { TagCode, TAGS_BY_CODE } from "@/shared/config/constants/recipe";
import { format, getDictionary, type Locale } from "@/shared/i18n";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

export const buildCategoryMetadata = async (
  params: Promise<{ id: string }>,
  locale: Locale
): Promise<Metadata> => {
  const { id } = await params;
  const tagCode = id as TagCode;
  const tagDef = TAGS_BY_CODE[tagCode];
  const t = getDictionary(locale);

  if (!tagDef) {
    return {
      title: t.category.meta.fallbackTitle,
      description: SEO_CONSTANTS.SITE_DESCRIPTION,
    };
  }

  const name = t.taxonomy.tags[tagCode] ?? tagDef.name;
  const emoji = tagDef.emoji;
  const m = t.category.meta;
  const title = `${format(m.titleTemplate, { emoji, name })} - ${SEO_CONSTANTS.SITE_NAME}`;
  const description = format(m.descriptionTemplate, { name });
  const url = absoluteUrl(`recipes/category/${tagCode}`);
  const imageUrl = SEO_CONSTANTS.DEFAULT_IMAGE;

  return {
    title,
    description,
    keywords: [
      ...SEO_CONSTANTS.DEFAULT_KEYWORDS,
      name,
      format(m.keywordRecipe, { name }),
      format(m.keywordRecipeMethod, { name }),
      m.keywordByCategory,
    ],
    openGraph: {
      title,
      description,
      url,
      type: SEO_CONSTANTS.OG_TYPE.WEBSITE,
      locale: SEO_CONSTANTS.LOCALE,
      siteName: SEO_CONSTANTS.SITE_NAME,
      images: [
        { url: imageUrl, alt: format(m.imageAltTemplate, { name }), width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: url },
    ...(locale === "ko" ? {} : { robots: { index: false, follow: true } }),
  };
};
```

- [ ] **Step 5: Rewrite ko layout + create ja/en layouts**

`src/app/recipes/category/[id]/layout.tsx`:

```tsx
import type { Metadata } from "next";

import { buildCategoryMetadata } from "@/entities/recipe/model/buildCategoryMetadata";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  buildCategoryMetadata(params, "ko");

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>;
}
```

`src/app/ja/recipes/category/[id]/layout.tsx` (en은 `"en"`):

```tsx
import type { Metadata } from "next";

import { buildCategoryMetadata } from "@/entities/recipe/model/buildCategoryMetadata";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  buildCategoryMetadata(params, "ja");

export default function JaCategoryLayout({ children }: Props) {
  return <>{children}</>;
}
```

- [ ] **Step 6: Run test + tsc** → PASS.
- [ ] **Step 7: Commit** — `feat(i18n): locale-aware category metadata (T-09,10)`

---

## Task 4: 레시피 상세 단위·숫자·절약 카피 — T-11, T-12, T-13

`recipeDetail` 사전 확장. `RecipeCookingInfoSection`(서버, getDictionary)·`RecipeIngredientsSection`(client, useT).

**Files:**
- Modify: `src/shared/i18n/types.ts` (`RecipeDetailDict`)
- Modify: `messages/{ko,ja,en}/recipeDetail.ts`
- Modify: `src/widgets/RecipeDetailView/ui/RecipeCookingInfoSection.tsx`
- Modify: `src/widgets/RecipeDetailView/ui/RecipeIngredientsSection.tsx`
- Test: `src/widgets/RecipeDetailView/ui/__tests__/RecipeCookingInfoSection.i18n.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// RecipeCookingInfoSection.i18n.test.tsx
import { render, screen } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

import RecipeCookingInfoSection from "../RecipeCookingInfoSection";

const HANGUL = /[가-힣]/;

describe("RecipeCookingInfoSection i18n", () => {
  it("T-11: ja → localized cooking time/servings unit, no Hangul", () => {
    const t = getDictionary("ja");
    const { container } = render(
      <RecipeCookingInfoSection cookingTime={40} servings={2} cookingTools={[]} locale="ja" />
    );
    // ja unit template applied (e.g. "40分", "2人前")
    expect(screen.getByText(t.recipeDetail.cookingTimeValue.replace("{n}", "40"))).toBeInTheDocument();
    expect(screen.getByText(t.recipeDetail.servingsValue.replace("{n}", "2"))).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-13: ko → Korean units preserved", () => {
    render(
      <RecipeCookingInfoSection cookingTime={40} servings={2} cookingTools={[]} locale="ko" />
    );
    expect(screen.getByText("40분")).toBeInTheDocument();
    expect(screen.getByText("2인분")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL** (`cookingTimeValue` 키 없음).

- [ ] **Step 3: Add `RecipeDetailDict` unit/savings keys**

`types.ts` `RecipeDetailDict`에 추가:

```ts
  cookingTimeValue: string; // "{n}분"
  servingsValue: string;    // "{n}인분"
  caloriePrefix: string;
  calorieSuffix: string;
  activityPrefix: string;
  activitySuffix: string;
  costPrefix: string;
  costSuffix: string;
  savingsPrefix: string;
  savingsSuffix: string;
```

ko (기존 RecipeIngredientsSection 리터럴 이전):

```ts
  cookingTimeValue: "{n}분",
  servingsValue: "{n}인분",
  caloriePrefix: "이 레시피는 약",
  calorieSuffix: "예요!",
  activityPrefix: "이 칼로리는",
  activitySuffix: "으로 소모 가능해요!",
  costPrefix: "이 레시피에 약",
  costSuffix: "필요해요!",
  savingsPrefix: "배달 물가 대비",
  savingsSuffix: "절약해요!",
```

ja:

```ts
  cookingTimeValue: "{n}分",
  servingsValue: "{n}人前",
  caloriePrefix: "このレシピは約",
  calorieSuffix: "です！",
  activityPrefix: "このカロリーは",
  activitySuffix: "で消費できます！",
  costPrefix: "このレシピに約",
  costSuffix: "かかります！",
  savingsPrefix: "デリバリー相場と比べて",
  savingsSuffix: "お得！",
```

en:

```ts
  cookingTimeValue: "{n} min",
  servingsValue: "{n} servings",
  caloriePrefix: "About",
  calorieSuffix: "in this recipe",
  activityPrefix: "Burn it off with",
  activitySuffix: "",
  costPrefix: "About",
  costSuffix: "for this recipe",
  savingsPrefix: "Versus delivery prices,",
  savingsSuffix: "saved",
```

- [ ] **Step 4: Use unit templates in RecipeCookingInfoSection**

`${cookingTime}분` → `format(t.recipeDetail.cookingTimeValue, { n: cookingTime })`,
`${servings}인분` → `format(t.recipeDetail.servingsValue, { n: servings })`. `format` import 추가.

- [ ] **Step 5: Use savings keys in RecipeIngredientsSection**

`useT()`로 `const t = useT()` 추가, 81~104줄 prefix/pointText/suffix 리터럴을 `t.recipeDetail.*`로 치환. `formatNumber(x, "원")`의 통화 단위는 **ko-origin 유지**(통화 plumbing은 비목표 — 중간상태 수용).

- [ ] **Step 6: Run test + tsc → PASS.**
- [ ] **Step 7: Commit** — `feat(i18n): localize recipe detail units + savings copy (T-11..13)`

---

## Task 5: 레시피 상세 액션버튼 — T-14, T-15

**Files:**
- Modify: `src/shared/i18n/types.ts` (`RecipeDetailDict` 액션 키), `messages/{ko,ja,en}/recipeDetail.ts`
- Modify: `src/features/recipe-complete/ui/RecipeCompleteButton.tsx`
- Modify: `src/shared/i18n/types.ts` `NavDict` (`shareAria`), `messages/{ko,ja,en}/nav.ts`
- Modify: `src/widgets/Header/RecipeNavBarButtons.tsx`
- Test: `src/features/recipe-complete/ui/__tests__/RecipeCompleteButton.i18n.test.tsx`

- [ ] **Step 1: Write failing test** (RecipeCompleteButton은 provider 안 → `DictionaryProvider`로 감싸 렌더)

```tsx
import { render, screen } from "@testing-library/react";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";

import RecipeCompleteButton from "../RecipeCompleteButton";

const HANGUL = /[가-힣]/;

jest.mock("../../model/hooks", () => ({
  useRecipeComplete: () => ({
    completeRecipe: jest.fn(), isCompleted: false, isLoading: false,
    showReward: false, setShowReward: jest.fn(),
  }),
}));
jest.mock("@/features/recipe-status", () => ({ useRecipeStatus: () => ({ recipeId: "x" }) }));
jest.mock("@/features/notification-permission", () => ({
  useNotificationPermissionTrigger: () => ({ checkAndTrigger: () => true }),
}));

const renderWith = (locale: "ja" | "ko") =>
  render(
    <DictionaryProvider dict={getDictionary(locale)}>
      <RecipeCompleteButton saveAmount={3000} />
    </DictionaryProvider>
  );

describe("RecipeCompleteButton i18n", () => {
  it("T-14: ja → localized complete CTA, no Hangul", () => {
    const t = getDictionary("ja");
    const { container } = renderWith("ja");
    expect(screen.getByRole("button")).toHaveTextContent(
      t.recipeDetail.completeCta.split("{")[0].trim()
    );
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-15: ko preserved", () => {
    renderWith("ko");
    expect(screen.getByRole("button")).toHaveTextContent("요리 완료");
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Add action keys**

`RecipeDetailDict`에:

```ts
  completeRecording: string; // "기록 중..."
  completeAlready: string;
  completeCta: string;       // "✅ 요리 완료! ({amount} 절약)"
```

ko:

```ts
  completeRecording: "기록 중...",
  completeAlready: "이미 요리를 완료한 레시피예요",
  completeCta: "✅ 요리 완료! ({amount} 절약)",
```

ja:

```ts
  completeRecording: "記録中...",
  completeAlready: "すでに作った記録があります",
  completeCta: "✅ 料理完了！（{amount} お得）",
```

en:

```ts
  completeRecording: "Saving...",
  completeAlready: "You've already cooked this",
  completeCta: "✅ Done cooking! ({amount} saved)",
```

`NavDict`에 `shareAria: string` 추가 — ko "공유하기", ja "シェア", en "Share".

- [ ] **Step 4: Wire RecipeCompleteButton**

`const t = useT()` 추가(import `useT`). `"기록 중..."`/`"이미..."`/`` `✅ 요리 완료! (${formatNumber(saveAmount,"원")} 절약)` ``를 각각 `t.recipeDetail.completeRecording`, `t.recipeDetail.completeAlready`, `format(t.recipeDetail.completeCta, { amount: formatNumber(saveAmount, "원") })`로. (통화 "원"은 ko-origin 유지 — 비목표)

- [ ] **Step 5: Wire RecipeNavBarButtons** — `aria-label="공유하기"` → `useChromeDict().shareAria` (이미 self-detect 가능한 Header chrome).

- [ ] **Step 6: Run + tsc → PASS.**
- [ ] **Step 7: Commit** — `feat(i18n): localize recipe detail action buttons (T-14,15)`

---

## Task 6: Ratings 요약(코멘트 요약) — T-16, T-17, T-18

`Ratings`의 `ratingMessage`가 `<p>` 분할 + count/value 중간 삽입이라 ja/en 어순 불가 → format 템플릿 + self-detect `ratings` 네임스페이스.

**Files:**
- Modify: `src/shared/i18n/types.ts` (`RatingsDict`, `Dictionary`)
- Create: `messages/{ko,ja,en}/ratings.ts`; Modify `messages/{ko,ja,en}/index.ts`
- Create: `src/shared/i18n/ratingsMessages.ts`, `src/shared/i18n/useRatingsDict.ts`; Modify `index.ts`
- Modify: `src/shared/ui/Ratings.tsx`
- Test: `src/shared/ui/__tests__/Ratings.i18n.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from "@testing-library/react";

import { ratingsMessages } from "@/shared/i18n/ratingsMessages";

import Ratings from "../Ratings";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPath() }));

describe("Ratings summary i18n", () => {
  it("T-16: ja, count=12 → '12' substituted, no Hangul", () => {
    mockPath.mockReturnValue("/ja/recipes/x");
    const { container } = render(<Ratings value={4.5} ratingCount={12} readOnly showValue />);
    expect(container.textContent).toContain("12");
    expect(container.textContent).toContain("4.5");
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-17: count=0 → empty-state message (ja)", () => {
    mockPath.mockReturnValue("/ja/recipes/x");
    render(<Ratings value={0} ratingCount={0} readOnly showValue />);
    expect(screen.getByText(ratingsMessages.ja.empty)).toBeInTheDocument();
  });

  it("T-18: ko preserved", () => {
    mockPath.mockReturnValue("/recipes/x");
    const { container } = render(<Ratings value={4.5} ratingCount={12} readOnly showValue />);
    expect(container.textContent).toContain("명");
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Add `RatingsDict` + register namespace**

`types.ts`:

```ts
export type RatingsDict = {
  empty: string;
  summary: string; // "{count}명의 사람들이 평균 {value}점을 줬어요 !"
};
```

`Dictionary`에 `ratings: RatingsDict;` 추가. `messages/{ko,ja,en}/ratings.ts` 생성 + 각 `index.ts`에 import/등록.

ko:

```ts
import type { RatingsDict } from "../../types";
export const ratings: RatingsDict = {
  empty: "아직 평가가 적어요. 평가를 남겨보세요 !",
  summary: "{count}명의 사람들이 평균 {value}점을 줬어요 !",
};
```

ja:

```ts
export const ratings: RatingsDict = {
  empty: "まだ評価が少なめです。評価を残してみませんか？",
  summary: "{count}人が平均 {value} 点をつけました！",
};
```

en:

```ts
export const ratings: RatingsDict = {
  empty: "Not many ratings yet. Be the first to rate!",
  summary: "{count} people rated this {value} on average!",
};
```

- [ ] **Step 4: self-detect map + hook**

`ratingsMessages.ts`(ko/ja/en import from `./messages/{locale}/ratings`) + `useRatingsDict.ts`(usePathname→resolveChromeLocale). `index.ts` export.

- [ ] **Step 5: Rewrite `ratingMessage` in Ratings.tsx**

`formatNumber(count,"명")` 분할 렌더를 단일 `format(t.summary, { count: formatNumber(count, ""), value })`로 교체, count<1이면 `t.empty`. `const t = useRatingsDict()`를 컴포넌트 상단에 추가(import `useRatingsDict`, `format`). 숫자 천단위 콤마는 `formatNumber(count, "")` 유지.

- [ ] **Step 6: Run + tsc → PASS.**
- [ ] **Step 7: Commit** — `feat(i18n): localize Ratings summary via template (T-16..18)`

---

## Task 7: 로그인 화면 locale — T-19, T-20, T-21

신규 `auth` self-detect 네임스페이스 + ja/en 라우트 래퍼. LoginContent/소셜버튼/에러페이지가 self-detect하므로 래퍼는 re-export.

**Files:**
- Modify: `types.ts` (`AuthDict`, `Dictionary`); Create `messages/{ko,ja,en}/auth.ts`; Modify `messages/{ko,ja,en}/index.ts`
- Create: `src/shared/i18n/authMessages.ts`, `useAuthDict.ts`; Modify `index.ts`
- Modify: `src/app/login/components/LoginContent.tsx`, `src/app/login/error/page.tsx`, `src/app/login/page.tsx`
- Modify: social buttons `src/features/auth/ui/{Google,Kakao,Naver,Apple}LoginButton.tsx` ("최근 로그인")
- Create: `src/app/ja/login/page.tsx`, `.../ja/login/error/page.tsx`, en 동일
- Test: `src/app/login/components/__tests__/LoginContent.i18n.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from "@testing-library/react";

import { authMessages } from "@/shared/i18n/authMessages";

import LoginContent from "../LoginContent";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPath(),
  useRouter: () => ({ replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("LoginContent i18n", () => {
  it("T-19: ja → '로그인 없이' localized, no Hangul", () => {
    mockPath.mockReturnValue("/ja/login");
    const { container } = render(<LoginContent />);
    expect(screen.getByText(authMessages.ja.browseWithoutLogin)).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-21: ko preserved", () => {
    mockPath.mockReturnValue("/login");
    render(<LoginContent />);
    expect(screen.getByText("로그인 없이 볼게요")).toBeInTheDocument();
  });
});
```

> T-20(제공자명 비번역)은 소셜버튼 테스트에서 `recentLogin` 배지만 현지화되고 "Kakao"/"Naver" 텍스트가 그대로인지 확인(버튼 컴포넌트별 1 assert).

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Add `AuthDict`**

```ts
export type AuthDict = {
  browseWithoutLogin: string;
  recentLogin: string;
  loading: string;
  error: { title: string; description: string };
};
```

ko:

```ts
export const auth: AuthDict = {
  browseWithoutLogin: "로그인 없이 볼게요",
  recentLogin: "최근 로그인",
  loading: "로딩 중...",
  error: {
    title: "로그인 실패",
    description: "소셜 로그인 인증 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  },
};
```

ja:

```ts
export const auth: AuthDict = {
  browseWithoutLogin: "ログインせずに見る",
  recentLogin: "前回ログイン",
  loading: "読み込み中...",
  error: {
    title: "ログインに失敗しました",
    description: "ソーシャルログインの認証中に問題が発生しました。しばらくしてからもう一度お試しください。",
  },
};
```

en:

```ts
export const auth: AuthDict = {
  browseWithoutLogin: "Browse without signing in",
  recentLogin: "Recently used",
  loading: "Loading...",
  error: {
    title: "Sign-in failed",
    description: "Something went wrong during social sign-in. Please try again in a moment.",
  },
};
```

`Dictionary`에 `auth: AuthDict;`, 각 `messages/{locale}/index.ts` 등록.

- [ ] **Step 4: self-detect map + hook** — `authMessages.ts` + `useAuthDict.ts`, `index.ts` export.

- [ ] **Step 5: Wire components**

- `LoginContent.tsx`: `const t = useAuthDict()`, "로그인 없이 볼게요" → `t.browseWithoutLogin`.
- 소셜버튼 4종: "최근 로그인" → `useAuthDict().recentLogin`. "Kakao"/"Naver" 등 제공자명은 변경 금지.
- `login/error/page.tsx`: 이 컴포넌트가 server면 self-detect 불가 → `"use client"` 전환 후 `useAuthDict()`로 title/description, 또는 ja/en 래퍼에서 locale prop. **간단히:** `login/error/page.tsx`를 client로 만들고 `useAuthDict()` 사용.
- `login/page.tsx`: Suspense fallback `<div>로딩 중...</div>` → 텍스트 없는 스피너 또는 client 전환 후 `t.loading`. (간단히 스피너만)

- [ ] **Step 6: Create ja/en route wrappers**

```tsx
// src/app/ja/login/page.tsx
export { default } from "../../login/page";
```
error도 동일 re-export(`../../../login/error/page`). en 동일. (컴포넌트 self-detect라 re-export로 충분.)

- [ ] **Step 7: Run + tsc → PASS.**
- [ ] **Step 8: Commit** — `feat(i18n): localize login flow + ja/en wrappers (T-19..21)`

---

## Task 8: 알림 페이지 chrome — T-22, T-23

신규 `notifications` self-detect 네임스페이스 + ja/en 래퍼.

**Files:**
- Modify: `types.ts` (`NotificationsDict`, `Dictionary`); Create `messages/{ko,ja,en}/notifications.ts`; Modify index들
- Create: `notificationsMessages.ts`, `useNotificationsDict.ts`; Modify `index.ts`
- Modify: `src/app/notifications/page.tsx`
- Create: `src/app/ja/notifications/page.tsx`, en 동일
- Test: `src/app/notifications/__tests__/NotificationsPage.i18n.test.tsx`

- [ ] **Step 1: Write failing test** (page는 query 훅 mock 필요)

```tsx
import { render, screen } from "@testing-library/react";

import { notificationsMessages } from "@/shared/i18n/notificationsMessages";

import NotificationsPage from "../page";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPath(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/entities/notification", () => ({
  NotificationItem: () => null,
  NotificationSkeleton: () => null,
  useDeleteAllNotifications: () => ({ mutate: jest.fn() }),
  useDeleteNotification: () => ({ mutate: jest.fn() }),
  useMarkNotificationAsRead: () => ({ mutate: jest.fn() }),
  useInfiniteNotificationsQuery: () => ({
    notifications: [], hasNextPage: false, isFetching: false,
    isFetchingNextPage: false, ref: jest.fn(),
  }),
}));

describe("NotificationsPage chrome i18n", () => {
  it("T-22: ja → header/empty localized, no Hangul", () => {
    mockPath.mockReturnValue("/ja/notifications");
    const { container } = render(<NotificationsPage />);
    expect(screen.getByText(notificationsMessages.ja.title)).toBeInTheDocument();
    expect(screen.getByText(notificationsMessages.ja.empty)).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-23: ko preserved", () => {
    mockPath.mockReturnValue("/notifications");
    render(<NotificationsPage />);
    expect(screen.getByText("알림")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Add `NotificationsDict`**

```ts
export type NotificationsDict = {
  title: string;
  deleteAll: string;
  empty: string;
  allLoaded: string;
  loadingMore: string;
  deleteAria: string;
  profileAlt: string; // "{name} 프로필"
};
```

ko: `{ title:"알림", deleteAll:"모두 삭제", empty:"알림이 없습니다.", allLoaded:"모든 알림을 불러왔습니다.", loadingMore:"Loading more...", deleteAria:"알림 삭제", profileAlt:"{name} 프로필" }`

ja: `{ title:"お知らせ", deleteAll:"すべて削除", empty:"お知らせはありません。", allLoaded:"すべてのお知らせを読み込みました。", loadingMore:"Loading more...", deleteAria:"お知らせを削除", profileAlt:"{name} のプロフィール" }`

en: `{ title:"Notifications", deleteAll:"Delete all", empty:"No notifications.", allLoaded:"You're all caught up.", loadingMore:"Loading more...", deleteAria:"Delete notification", profileAlt:"{name}'s profile" }`

`Dictionary` + index 등록.

- [ ] **Step 4: self-detect map + hook** — `notificationsMessages.ts` + `useNotificationsDict.ts`, export.

- [ ] **Step 5: Wire `notifications/page.tsx`** — `const t = useNotificationsDict()`, "알림"/"모두 삭제"/"알림이 없습니다."/"모든 알림을 불러왔습니다."/"Loading more..." 치환.

- [ ] **Step 6: ja/en wrappers** — `export { default } from "../../notifications/page";` (self-detect라 re-export).

- [ ] **Step 7: Run + tsc → PASS.**
- [ ] **Step 8: Commit** — `feat(i18n): localize notifications page chrome + ja/en wrappers (T-22,23)`

---

## Task 9: 알림 타입별 메시지 템플릿 — T-24, T-25, T-26

`NotificationItem`의 `NOTIFICATION_MESSAGES`(suffix 구조)를 `{actor}` format 템플릿으로, date-fns locale 분기, 미지 타입 generic 폴백.

**Files:**
- Modify: `types.ts` (`NotificationsDict`에 `templates` + `genericMessage`)
- Modify: `messages/{ko,ja,en}/notifications.ts`
- Modify: `src/entities/notification/ui/NotificationItem.tsx`
- Test: `src/entities/notification/ui/__tests__/NotificationItem.i18n.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from "@testing-library/react";

import { notificationsMessages } from "@/shared/i18n/notificationsMessages";

import { NotificationItem } from "../NotificationItem";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPath() }));

const base = {
  id: 1, userId: 1, actorId: 2, actorNickname: "Yuki",
  imageUrl: "", relatedType: "RECIPE" as const, relatedId: 1,
  relatedUrl: "/", createdAt: new Date().toISOString(), read: true,
};

describe("NotificationItem template i18n", () => {
  it("T-24: ja NEW_COMMENT → actor substituted, ja template, no Hangul", () => {
    mockPath.mockReturnValue("/ja/notifications");
    const { container } = render(
      <NotificationItem notification={{ ...base, type: "NEW_COMMENT" }} showActions={false} />
    );
    expect(container.textContent).toContain("Yuki");
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-25: unknown type → generic fallback, no crash", () => {
    mockPath.mockReturnValue("/ja/notifications");
    expect(() =>
      render(
        // @ts-expect-error runtime unknown type
        <NotificationItem notification={{ ...base, type: "__NEW__" }} showActions={false} />
      )
    ).not.toThrow();
    expect(screen.getByText(notificationsMessages.ja.genericMessage)).toBeInTheDocument();
  });

  it("T-26: ko NEW_COMMENT preserved", () => {
    mockPath.mockReturnValue("/notifications");
    const { container } = render(
      <NotificationItem notification={{ ...base, type: "NEW_COMMENT" }} showActions={false} />
    );
    expect(container.textContent).toContain("댓글");
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Add templates to `NotificationsDict`**

```ts
  templates: Record<
    "NEW_COMMENT" | "NEW_REPLY" | "AI_RECIPE_DONE" | "NEW_FAVORITE"
    | "NEW_RECIPE_LIKE" | "NEW_COMMENT_LIKE" | "NEW_RECIPE_RATING"
    | "REFERRAL_REWARD_GRANTED",
    string
  >;
  genericMessage: string;
```

ko templates ({actor} = actorNickname; actor 없는 2종은 평문):

```ts
  templates: {
    NEW_COMMENT: "{actor}님이 댓글을 남겼습니다.",
    NEW_REPLY: "{actor}님이 답글을 남겼습니다.",
    AI_RECIPE_DONE: "AI 레시피 생성이 완료되었습니다.",
    NEW_FAVORITE: "{actor}님이 저장했습니다.",
    NEW_RECIPE_LIKE: "{actor}님이 레시피를 좋아합니다.",
    NEW_COMMENT_LIKE: "{actor}님이 댓글을 좋아합니다.",
    NEW_RECIPE_RATING: "{actor}님이 레시피에 평점을 남겼습니다.",
    REFERRAL_REWARD_GRANTED: "추천 보상으로 광고 제거 혜택이 추가됐어요.",
  },
  genericMessage: "새로운 알림이 있습니다.",
```

ja:

```ts
  templates: {
    NEW_COMMENT: "{actor}さんがコメントしました。",
    NEW_REPLY: "{actor}さんが返信しました。",
    AI_RECIPE_DONE: "AIレシピの生成が完了しました。",
    NEW_FAVORITE: "{actor}さんが保存しました。",
    NEW_RECIPE_LIKE: "{actor}さんがレシピにいいねしました。",
    NEW_COMMENT_LIKE: "{actor}さんがコメントにいいねしました。",
    NEW_RECIPE_RATING: "{actor}さんがレシピを評価しました。",
    REFERRAL_REWARD_GRANTED: "紹介特典として広告非表示が追加されました。",
  },
  genericMessage: "新しいお知らせがあります。",
```

en:

```ts
  templates: {
    NEW_COMMENT: "{actor} commented on your recipe.",
    NEW_REPLY: "{actor} replied to your comment.",
    AI_RECIPE_DONE: "Your AI recipe is ready.",
    NEW_FAVORITE: "{actor} saved your recipe.",
    NEW_RECIPE_LIKE: "{actor} liked your recipe.",
    NEW_COMMENT_LIKE: "{actor} liked your comment.",
    NEW_RECIPE_RATING: "{actor} rated your recipe.",
    REFERRAL_REWARD_GRANTED: "You earned ad-free time from a referral.",
  },
  genericMessage: "You have a new notification.",
```

- [ ] **Step 4: Rewrite NotificationItem message + date locale**

```tsx
// 상단
import { enUS, ja as jaDate, ko as koDate } from "date-fns/locale";
import { format as fmt, useNotificationsDict, useChromeLocale } from "@/shared/i18n";
// 본문
const t = useNotificationsDict();
const locale = useChromeLocale();
const dateLocale = locale === "ja" ? jaDate : locale === "en" ? enUS : koDate;
const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
  addSuffix: true, locale: dateLocale,
});
const template = t.templates[notification.type] ?? t.genericMessage;
const text =
  notification.type === "AI_RECIPE_DONE" || notification.type === "REFERRAL_REWARD_GRANTED"
    ? (notification.message ?? template)
    : fmt(template, { actor: notification.actorNickname });
```

본문 렌더를 `<span>{actorNickname}</span>{MSG}` 분할에서 단일 `{text}`로 교체(actor가 템플릿 내부에 들어가므로 bold span 제거 — 또는 actor만 bold 원하면 split-render 유지하되 template에 `{actor}` 위치로 분할). **간단/안전:** 단일 `{text}`. `alt={...프로필}` → `fmt(t.profileAlt, { name: notification.actorNickname })`, `aria-label="알림 삭제"` → `t.deleteAria`. `useChromeLocale` import는 barrel에 존재.

> 주의: `format`은 `@/shared/i18n` barrel에서 export됨. NotificationItem 내 기존 `format` 식별자 충돌 없으면 그대로, 충돌 시 `fmt` 별칭.

- [ ] **Step 5: Run + tsc → PASS.**
- [ ] **Step 6: Commit** — `feat(i18n): localize notification type templates + date locale (T-24..26)`

---

## Self-Review (작성자 체크 — 실행 전 확인됨)

**1. Requirement→test→task traceability:** 매트릭스 T-01~T-26 전부 Task 1~9에 failing test로 배치됨. 각 test는 T-xx 인용. 누락 없음.
**2. Placeholder scan:** TBD/TODO 없음. 모든 dict 값(ko/ja/en) 명시. 번역은 네이티브 초안 제공 + 다듬기 프롬프트 안내(값 자체는 존재).
**3. Type consistency:** `errorsMessages`/`notFoundMessages`/`ratingsMessages`/`authMessages`/`notificationsMessages` 명명 일관. `useErrorsDict`/`useNotFoundDict`/`useRatingsDict`/`useAuthDict`/`useNotificationsDict` 일관. `ErrorFallback` `context`, `NotFound` `titleKey`/`descriptionKey` 시그니처 task 간 일치.

## 알려진 리스크 / 중간상태 (실행자 인지)

- **통화("원"):** RecipeIngredientsSection·RecipeCompleteButton의 절약액은 ko-origin `원` 유지(통화 plumbing 비목표). ja/en에서 숫자+`원` 혼재는 수용된 중간상태(보드 기존 DEFER와 동일).
- **워킹트리 광고슬롯 미커밋:** RecipeDetailView/RecipeStepList/adsense 변경과 staging 분리 필수.
- **`login/error`·`login` server→client 전환:** self-detect 위해 client 필요. 전환 시 metadata export 있으면 분리.
