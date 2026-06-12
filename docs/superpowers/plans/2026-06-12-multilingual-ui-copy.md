# 다국어 UI 문구 셋 (ko/ja/en) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ja/en 레시피 상세·검색 결과 2개 라우트의 read-path UI 문구를 ko/ja/en 사전으로 다국어화하고, en 라우트를 신설한다.

**Architecture:** `shared/i18n`에 경량 typed dictionary(서버 `getDictionary` + 클라 `DictionaryProvider`/`useT`)를 두고, read-path 컴포넌트가 inline 한국어 대신 dictionary를 읽는다. en 라우트는 ja 구조를 미러링하고 공유 본문을 추출해 `/ja`·`/en`을 얇은 wrapper로 만든다. 번역 카피는 PM 페르소나 프롬프트로 채운다.

**Tech Stack:** Next.js 15 App Router, TypeScript, FSD, Jest + Testing Library, ts-jest.

**참조 문서:** design `docs/superpowers/specs/2026-06-12-multilingual-ui-copy-design.md` · slices `…-slices.md` · test-design `…-test-design.md`. 모든 test ID는 test-design 매트릭스를 인용.

**Git 규칙:** 현재 브랜치 `feature/17`에서만 작업. checkout/switch/branch/rebase/merge 금지. 커밋은 특정 pathspec만 (`git add <files>` 후 `git commit -m "…" -- <files>`).

---

## File Structure

**신규 (`shared/i18n`):**
- `src/shared/i18n/types.ts` — `Locale`, `Plural`, `Dictionary` 타입.
- `src/shared/i18n/messages/ko.ts` — `export const ko: Dictionary` (현재 한국어 추출).
- `src/shared/i18n/messages/ja.ts` — `export const ja: Dictionary`.
- `src/shared/i18n/messages/en.ts` — `export const en: Dictionary`.
- `src/shared/i18n/getDictionary.ts` — `getDictionary(locale): Dictionary`.
- `src/shared/i18n/format.ts` — `format(template, vars)`, `plural(n, forms)`.
- `src/shared/i18n/DictionaryProvider.tsx` — `"use client"` context + `useT()`.
- `src/shared/i18n/index.ts` — barrel.

**수정:**
- `src/entities/recipe/model/api.server.ts:242` — `getLocalizedRecipeOnServer` locale `"ja"`→`"ja" | "en"`.
- `src/entities/recipe/lib/metadata/searchMeta.ts` — locale 인자 추가.
- `src/entities/recipe/lib/metadata/jaRecipeMetadata.ts` → `localizedRecipeMetadata.ts`로 일반화.
- `src/entities/recipe/lib/metadata/index.ts` — export 갱신.
- `src/widgets/RecipeDetailView/ui/RecipeDetailView.tsx` 외 read-path 컴포넌트 — dictionary 읽기.
- `src/widgets/SearchClient/index.tsx` 외 — dictionary 읽기, locale union 확장.
- `src/shared/ui/SectionErrorFallback.tsx` — default message 제거(호출부가 dict 주입).

**신규 라우트:**
- `src/app/en/recipes/[recipeId]/page.tsx`, `…/not-found.tsx`
- `src/app/en/search/results/page.tsx`
- `src/shared/i18n/server/renderLocalizedRecipePage.tsx` 또는 widget — 공유 본문 (Task에서 위치 확정).

---

## 사전 형태(Dictionary) — 전 슬라이스 공통 계약

슬라이스가 진행되며 namespace가 자란다. 최종 형태(참조용):

```ts
// src/shared/i18n/types.ts
export type Locale = "ko" | "ja" | "en";
export const LOCALES: readonly Locale[] = ["ko", "ja", "en"];

// count에 따라 갈리는 문구. ko/ja는 one===other로 채운다.
export type Plural = { one: string; other: string };

export type Dictionary = {
  errors: {
    sectionGeneric: string; // SectionErrorFallback 기본
    video: string;
    comments: string;
    ingredients: string;
    steps: string;
    searchResults: string;
  };
  common: {
    lastPage: string; // "모든 레시피를 불러왔습니다."
  };
  recipeDetail: {
    // Slice 1에서 read-path 키 추가 (섹션 헤더·CTA 등)
    [k: string]: string;
  };
  search: {
    // Slice 2/4에서 chrome 키 추가
    [k: string]: string;
  };
  meta: {
    search: {
      queryNoun: string; // ko "레시피", ja "レシピ", en "" (append 안 함)
      pageSuffix: string; // " ({page}페이지)" / " (page {page})"
      titleNoQuery: string; // "📌 레시피 검색 결과{page} - 레시피오"
      titleWithQuery: Plural; // "📌 {q} {count}선{page} - 레시피오"
      descNoQuery: string;
      descWithQuery: Plural;
    };
  };
};
```

> **주의:** `recipeDetail`/`search`를 `[k: string]: string` 인덱스 시그니처로 두면 키 누락 타입 차단이 약해진다. **실제 구현에서는 Slice 1·2에서 키를 확정하는 시점에 인덱스 시그니처를 명시 키 집합으로 교체**한다 (AC0.3/AC6 타입 게이트의 핵심). 이 교체는 각 슬라이스 첫 task에서 수행.

---

## Slice 0 — Walking skeleton: 사전 인프라 + ja 한 가닥

### Task 0.1: `format`/`plural` 순수 헬퍼 (TDD)

**Files:**
- Create: `src/shared/i18n/format.ts`
- Test: `src/shared/i18n/__tests__/format.test.ts`

- [ ] **Step 1: 실패 테스트 작성** — cites **T-42**(plural) + format 보간

```ts
// src/shared/i18n/__tests__/format.test.ts
import { format, plural } from "../format";

describe("format", () => {
  it("토큰을 vars로 치환한다", () => {
    expect(format("📌 {q} {count}선", { q: "라멘", count: 12 })).toBe(
      "📌 라멘 12선"
    );
  });
  it("동일 토큰 반복도 모두 치환한다", () => {
    expect(format("{x}-{x}", { x: "a" })).toBe("a-a");
  });
  it("매칭 안 되는 토큰은 빈 문자열로 둔다", () => {
    expect(format("a{missing}b", {})).toBe("ab");
  });
});

describe("plural (T-42)", () => {
  const forms = { one: "{count} recipe", other: "{count} recipes" };
  it("n=1 → one", () => {
    expect(plural(1, forms)).toBe("{count} recipe");
  });
  it("n=0 → other", () => {
    expect(plural(0, forms)).toBe("{count} recipes");
  });
  it("n=2 → other", () => {
    expect(plural(2, forms)).toBe("{count} recipes");
  });
});
```

- [ ] **Step 2: 실패 확인** — `npx jest src/shared/i18n/__tests__/format.test.ts` → FAIL("Cannot find module '../format'")

- [ ] **Step 3: 최소 구현**

```ts
// src/shared/i18n/format.ts
import type { Plural } from "./types";

export const format = (
  template: string,
  vars: Record<string, string | number>
): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : ""
  );

export const plural = (n: number, forms: Plural): string =>
  n === 1 ? forms.one : forms.other;
```

- [ ] **Step 4: 통과 확인** — 같은 jest 명령 → PASS

- [ ] **Step 5: 커밋**

```bash
git add src/shared/i18n/format.ts src/shared/i18n/__tests__/format.test.ts
git commit -m "feat(i18n): add format/plural string helpers" -- src/shared/i18n/format.ts src/shared/i18n/__tests__/format.test.ts
```

> `types.ts`의 `Plural`이 아직 없으면 Step 3에서 `src/shared/i18n/types.ts`에 `export type Plural = { one: string; other: string };`만 먼저 추가하고 같은 커밋에 포함.

---

### Task 0.2: `types.ts` Dictionary(skeleton) + ko/ja `errors` namespace + `getDictionary`

**Files:**
- Create/Modify: `src/shared/i18n/types.ts`
- Create: `src/shared/i18n/messages/ko.ts`, `messages/ja.ts`, `getDictionary.ts`
- Test: `src/shared/i18n/__tests__/getDictionary.test.ts`

- [ ] **Step 1: 실패 테스트** — cites **T-01**(locale 라우팅) + **T-02**(ko 무회귀 앵커)

```ts
// src/shared/i18n/__tests__/getDictionary.test.ts
import { getDictionary } from "../getDictionary";

describe("getDictionary", () => {
  it("T-01: locale별로 다른 dictionary를 반환한다", () => {
    const ko = getDictionary("ko");
    const ja = getDictionary("ja");
    expect(ko).not.toBe(ja);
    expect(ko.errors.video).not.toBe(ja.errors.video);
  });
  it("T-02: ko errors는 현재 한국어 문자열과 동일하다 (무회귀 앵커)", () => {
    const ko = getDictionary("ko");
    expect(ko.errors.video).toBe("비디오를 불러올 수 없어요");
    expect(ko.errors.comments).toBe("댓글을 불러올 수 없어요");
    expect(ko.errors.ingredients).toBe("재료 정보를 불러올 수 없어요");
    expect(ko.errors.steps).toBe("조리 순서를 불러올 수 없어요");
    expect(ko.errors.searchResults).toBe("검색 결과를 표시할 수 없어요");
    expect(ko.errors.sectionGeneric).toBe("이 영역을 불러올 수 없어요");
  });
});
```

- [ ] **Step 2: 실패 확인** — `npx jest src/shared/i18n/__tests__/getDictionary.test.ts` → FAIL

- [ ] **Step 3: 구현** — skeleton 단계에선 Dictionary에 `errors`/`common`/`meta`만, `recipeDetail`/`search`는 Slice 1/2에서 추가하므로 지금은 빈 객체 타입 `Record<string, never>`로 둔다.

```ts
// src/shared/i18n/types.ts  (Plural은 Task 0.1에서 추가됨)
export type Locale = "ko" | "ja" | "en";
export const LOCALES: readonly Locale[] = ["ko", "ja", "en"];
export type Plural = { one: string; other: string };

export type Dictionary = {
  errors: {
    sectionGeneric: string;
    video: string;
    comments: string;
    ingredients: string;
    steps: string;
    searchResults: string;
  };
};
```

```ts
// src/shared/i18n/messages/ko.ts
import type { Dictionary } from "../types";

export const ko: Dictionary = {
  errors: {
    sectionGeneric: "이 영역을 불러올 수 없어요",
    video: "비디오를 불러올 수 없어요",
    comments: "댓글을 불러올 수 없어요",
    ingredients: "재료 정보를 불러올 수 없어요",
    steps: "조리 순서를 불러올 수 없어요",
    searchResults: "검색 결과를 표시할 수 없어요",
  },
};
```

```ts
// src/shared/i18n/messages/ja.ts  (번역은 Step 3.5에서 PM 페르소나로 — 여기선 placeholder 아님, 실제 일본어)
import type { Dictionary } from "../types";

export const ja: Dictionary = {
  errors: {
    sectionGeneric: "（PM 페르소나 번역으로 채움）",
    video: "…",
    comments: "…",
    ingredients: "…",
    steps: "…",
    searchResults: "…",
  },
};
```

```ts
// src/shared/i18n/getDictionary.ts
import { ko } from "./messages/ko";
import { ja } from "./messages/ja";
import { en } from "./messages/en";
import type { Dictionary, Locale } from "./types";

const DICTIONARIES: Record<Locale, Dictionary> = { ko, ja, en };

export const getDictionary = (locale: Locale): Dictionary =>
  DICTIONARIES[locale];
```

> `en.ts`도 같은 형태로 생성(`export const en: Dictionary = { errors: {...} }`, 영어 문구는 Step 3.5에서).

- [ ] **Step 3.5: PM 페르소나 번역 (ja `errors`, en `errors`)** — 아래 "PM 페르소나 번역 워크플로" 절의 프롬프트로 ja.ts·en.ts의 `errors` 6개 문구를 자연스러운 일본어/영어로 채운다. T-01의 "ko≠ja" 불변식이 placeholder로는 통과해버리므로, **실제 번역을 채운 뒤** 진행.

- [ ] **Step 4: 통과 확인** — jest PASS + `npx tsc --noEmit` (ja/en이 Dictionary 미충족이면 여기서 실패 = AC0.3/AC6, **TC-type**)

- [ ] **Step 5: 커밋**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ src/shared/i18n/getDictionary.ts src/shared/i18n/__tests__/getDictionary.test.ts
git commit -m "feat(i18n): add typed dictionary + getDictionary (errors namespace)" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko.ts src/shared/i18n/messages/ja.ts src/shared/i18n/messages/en.ts src/shared/i18n/getDictionary.ts src/shared/i18n/__tests__/getDictionary.test.ts
```

---

### Task 0.3: `DictionaryProvider` + `useT` (클라 컨텍스트) + barrel

**Files:**
- Create: `src/shared/i18n/DictionaryProvider.tsx`, `src/shared/i18n/index.ts`
- Test: `src/shared/i18n/__tests__/DictionaryProvider.test.tsx`

- [ ] **Step 1: 실패 테스트** — 와이어링 인프라(클라 컴포넌트가 컨텍스트에서 dict를 읽는다). 매트릭스의 T-20/T-40 렌더가 의존하는 provider.

```tsx
// src/shared/i18n/__tests__/DictionaryProvider.test.tsx
import { render, screen } from "@testing-library/react";
import { DictionaryProvider, useT } from "../DictionaryProvider";
import { getDictionary } from "../getDictionary";

const Probe = () => {
  const t = useT();
  return <span>{t.errors.searchResults}</span>;
};

it("provider가 준 locale dict를 useT로 노출한다", () => {
  render(
    <DictionaryProvider dict={getDictionary("ko")}>
      <Probe />
    </DictionaryProvider>
  );
  expect(screen.getByText("검색 결과를 표시할 수 없어요")).toBeInTheDocument();
});
```

- [ ] **Step 2: 실패 확인** — `npx jest src/shared/i18n/__tests__/DictionaryProvider.test.tsx` → FAIL

- [ ] **Step 3: 구현**

```tsx
// src/shared/i18n/DictionaryProvider.tsx
"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "./types";

const DictionaryContext = createContext<Dictionary | null>(null);

export const DictionaryProvider = ({
  dict,
  children,
}: {
  dict: Dictionary;
  children: React.ReactNode;
}) => (
  <DictionaryContext.Provider value={dict}>
    {children}
  </DictionaryContext.Provider>
);

export const useT = (): Dictionary => {
  const dict = useContext(DictionaryContext);
  if (!dict) {
    throw new Error("useT must be used within a DictionaryProvider");
  }
  return dict;
};
```

```ts
// src/shared/i18n/index.ts
export { getDictionary } from "./getDictionary";
export { DictionaryProvider, useT } from "./DictionaryProvider";
export { format, plural } from "./format";
export type { Locale, Dictionary, Plural } from "./types";
export { LOCALES } from "./types";
```

- [ ] **Step 4: 통과 확인** — jest PASS

- [ ] **Step 5: 커밋**

```bash
git add src/shared/i18n/DictionaryProvider.tsx src/shared/i18n/index.ts src/shared/i18n/__tests__/DictionaryProvider.test.tsx
git commit -m "feat(i18n): add DictionaryProvider + useT client context" -- src/shared/i18n/DictionaryProvider.tsx src/shared/i18n/index.ts src/shared/i18n/__tests__/DictionaryProvider.test.tsx
```

---

### Task 0.4: skeleton 와이어 — RecipeDetailView 에러 폴백을 dict로 (ja에서 일본어 노출)

**Files:**
- Modify: `src/shared/ui/SectionErrorFallback.tsx` (default message 제거)
- Modify: `src/widgets/RecipeDetailView/ui/RecipeDetailView.tsx` (locale → getDictionary, 폴백 message를 dict에서)

- [ ] **Step 1:** `SectionErrorFallback`의 default를 dict 주입으로 옮긴다. default를 `errors.sectionGeneric`로 대체할 것이므로 호출부가 항상 message를 준다.

```tsx
// src/shared/ui/SectionErrorFallback.tsx
"use client";

type SectionErrorFallbackProps = {
  message: string;
};

const SectionErrorFallback = ({ message }: SectionErrorFallbackProps) => (
  <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-6">
    <p className="text-ink-muted text-sm">{message}</p>
  </div>
);

export default SectionErrorFallback;
```

- [ ] **Step 2:** `RecipeDetailView.tsx`에서 `getDictionary(locale)`로 폴백 4곳을 교체. RecipeDetailView는 서버 컴포넌트(‘use client’ 없음)이므로 직접 호출 가능.

```tsx
// RecipeDetailView.tsx 상단 import 추가
import { getDictionary } from "@/shared/i18n";

// 컴포넌트 본문 시작부
const t = getDictionary(locale);

// 교체 (예시 1곳 — 나머지 3곳 동일 패턴):
//  <SectionErrorFallback message="비디오를 불러올 수 없어요" />
//   → <SectionErrorFallback message={t.errors.video} />
//  "댓글을 불러올 수 없어요"      → {t.errors.comments}
//  "재료 정보를 불러올 수 없어요"  → {t.errors.ingredients}
//  "조리 순서를 불러올 수 없어요"  → {t.errors.steps}
```

- [ ] **Step 3: 회귀 확인** — 기존 `RecipeDetailView.test.tsx` 재실행 PASS (ko/ja 본문). `npx jest src/widgets/RecipeDetailView`
- [ ] **Step 4:** `npx tsc --noEmit` PASS
- [ ] **Step 5: 커밋**

```bash
git add src/shared/ui/SectionErrorFallback.tsx src/widgets/RecipeDetailView/ui/RecipeDetailView.tsx
git commit -m "feat(i18n): drive recipe detail section fallbacks via dictionary" -- src/shared/ui/SectionErrorFallback.tsx src/widgets/RecipeDetailView/ui/RecipeDetailView.tsx
```

> 이 시점에서 `/ja/recipes/{id}`의 섹션 폴백이 일본어로 나온다 = **AC0.1 시연 가능** (walking skeleton 완성).

---

## Slice 1 — /ja 레시피 상세 읽기 경로 전부 일본어

### Task 1.1: `recipeDetail`/`common` namespace 키 확정 + 인덱스 시그니처 제거

**Files:** `src/shared/i18n/types.ts`, `messages/ko.ts`, `messages/ja.ts`, `messages/en.ts`

- [ ] **Step 1:** read-path 컴포넌트들의 한국어 문자열을 전수 수집. 대상 파일(폴백 제외, read-path만):
  - `RecipeNavbar`, `RecipeInfoSection`, `RecipeCookingInfoSection`, `IngredientsSectionHeader`, `RecipeIngredientsSection`(헤더·라벨), `NutritionTable`(컬럼 라벨), `RecipeCookingTipsSection`, `RecipePlatingSection`, `RecipeTagsSection`(헤더), `RecipeComponentsSection`, `RecipeCompleteButton`(CTA), `RecommendedRecipeSlide`/`RemixesSlide`(섹션 제목), `CoupangDisclosure`, `RecipeCommentsSection`(헤더·빈상태), 빈/로딩 라벨.
  - **제외(non-goal, AC1.3):** `IngredientCopySheet/*`, `IngredientReportSheet/*`, `RecipeRatingButton`, 댓글 작성 폼, `ChatLauncher`.
  - 수집 방법: `git grep -nP "[\x{AC00}-\x{D7A3}]" -- src/widgets/RecipeDetailView/ui` 후 read-path만 선별.
- [ ] **Step 2:** `Dictionary`의 `recipeDetail`·`common`을 **명시 키 집합**으로 정의(인덱스 시그니처 제거). 각 키 = 수집한 한국어 1개. `ko.ts`에 한국어 그대로 채움.
- [ ] **Step 3: PM 페르소나 번역** — "PM 페르소나 번역 워크플로" 절 프롬프트로 ja.ts의 `recipeDetail`·`common`을 자연스러운 일본어로. (en.ts는 Slice 3에서 채우므로 지금은 영어 placeholder 두되 **tsc 통과를 위해 빈 문자열 금지** → 임시로 ko 값 복사 후 Slice 3에서 교체, 또는 en도 지금 함께 번역. 권장: en도 지금 함께 번역해 한 번에 끝냄.)
- [ ] **Step 4:** `npx tsc --noEmit` PASS (키 누락 시 실패 = TC-type)
- [ ] **Step 5: 커밋**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/
git commit -m "feat(i18n): add recipeDetail/common namespace (ko/ja/en)" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko.ts src/shared/i18n/messages/ja.ts src/shared/i18n/messages/en.ts
```

### Task 1.2: read-path 컴포넌트 와이어링 (서버 컴포넌트군)

**Files:** Task 1.1에서 선별한 read-path 컴포넌트들 (`src/widgets/RecipeDetailView/ui/*`).

각 컴포넌트가 `locale`을 받지 않으면 prop으로 추가(부모 RecipeDetailView가 `locale` 보유). 서버 컴포넌트는 `getDictionary(locale)` 직접 호출, 클라 컴포넌트(‘use client’)는 `useT()` 사용.

- [ ] **Step 1: 실패 테스트** — cites **T-10**(AC1.1 와이어링 + AC1.4 ko 앵커). 대표 always-visible 헤더 1곳으로 불변식 검증.

```tsx
// src/widgets/RecipeDetailView/ui/__tests__/RecipeDetailView.locale.test.tsx
import { render } from "@testing-library/react";
import { RecipeDetailView } from "../RecipeDetailView";
import { makeRecipe } from "./fixtures"; // 기존 fixture 재사용 (없으면 RecipeDetailView.test의 것 차용)

const getIngredientsHeader = (container: HTMLElement) =>
  container.querySelector("[data-testid='ingredients-section-header']")
    ?.textContent ?? "";

it("T-10: ingredients 헤더가 locale=ja에서 ko와 다르고 비어있지 않다", () => {
  const recipe = makeRecipe();
  const ko = render(
    <RecipeDetailView recipe={recipe} recipeId="r1" locale="ko" />
  );
  const koText = getIngredientsHeader(ko.container);
  ko.unmount();
  const ja = render(
    <RecipeDetailView recipe={recipe} recipeId="r1" locale="ja" />
  );
  const jaText = getIngredientsHeader(ja.container);
  expect(jaText).not.toBe("");
  expect(jaText).not.toBe(koText);
  expect(koText).toBe("재료"); // AC1.4 무회귀 앵커 (실제 현재 헤더 문자열로 교체)
});
```

> `data-testid='ingredients-section-header'`가 없으면 `IngredientsSectionHeader`에 추가(테스트 seam). 앵커 문자열 `"재료"`는 실제 현재 헤더로 교체.

- [ ] **Step 2: 실패 확인** — `npx jest RecipeDetailView.locale` → FAIL (아직 ja=ko)
- [ ] **Step 3: 와이어링** — 선별 컴포넌트 전부 inline 한국어 → dict 읽기로 교체. **패턴 (서버 컴포넌트 예시):**

```tsx
// 예: IngredientsSectionHeader.tsx (서버 컴포넌트)
import { getDictionary } from "@/shared/i18n";
import type { Locale } from "@/shared/i18n";

export const IngredientsSectionHeader = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale);
  return <h2 data-testid="ingredients-section-header">{t.recipeDetail.ingredientsHeader}</h2>;
};
```

클라 컴포넌트라면 `const t = useT();` 사용 + 부모가 `DictionaryProvider`로 감쌈(RecipeDetailView가 클라 자식들을 감싸도록 provider 삽입; 또는 해당 클라 자식만 감쌈).

**교체 대상 enumerated** (파일 : 현재 문자열 → dict 키):
- `RecipeNavbar.tsx` : (네비 라벨들) → `t.recipeDetail.*`
- `RecipeCookingInfoSection.tsx` : "조리시간"·"인분"·"도구" 등 → `t.recipeDetail.*`
- `IngredientsSectionHeader.tsx` : "재료" → `t.recipeDetail.ingredientsHeader`
- `NutritionTable.tsx` : 컬럼 라벨 → `t.recipeDetail.*`
- `RecipeCookingTipsSection.tsx` : 헤더 → `t.recipeDetail.tipsHeader`
- `RecipeTagsSection.tsx` : 헤더 → `t.recipeDetail.tagsHeader`
- `RecipePlatingSection.tsx` : 라벨 → `t.recipeDetail.*`
- `RecipeComponentsSection.tsx` : 헤더 → `t.recipeDetail.*`
- `RecipeCompleteButton`(features/recipe-complete) : CTA → `t.recipeDetail.completeCta` (※ feature 컴포넌트면 locale prop 전달)
- `Lazy/RecommendedRecipeSlide`·`RemixesSlide` : 섹션 제목 → `t.recipeDetail.*`
- `CoupangDisclosure.tsx` : 고지 문구 → `t.recipeDetail.coupangDisclosure`
- `RecipeCommentsSection.tsx` : 헤더·빈 상태 → `t.recipeDetail.*`
- `RecipeInfoSection.tsx` : (있다면) 라벨 → `t.recipeDetail.*`

각 컴포넌트에 `locale: Locale` prop을 추가하고 RecipeDetailView에서 `locale={locale}` 전달.

- [ ] **Step 4: 통과 확인** — `npx jest src/widgets/RecipeDetailView` PASS + `npx tsc --noEmit` PASS
- [ ] **Step 5: 커밋**

```bash
git add src/widgets/RecipeDetailView/ src/features/recipe-complete/
git commit -m "feat(i18n): localize recipe detail read-path chrome via dictionary" -- <위 수정 파일들 경로 나열>
```

### Task 1.3: notTranslated 배너 통과 테스트 (AC1.2)

**Files:** Test only — `src/widgets/RecipeDetailView/ui/__tests__/RecipeDetailView.locale.test.tsx` (추가)

- [ ] **Step 1: 테스트** — cites **T-11**

```tsx
it("T-11: notTranslatedMessage가 있으면 role=status 배너로 렌더한다", () => {
  const { getByRole } = render(
    <RecipeDetailView
      recipe={makeRecipe()}
      recipeId="r1"
      locale="ja"
      notTranslatedMessage="この レシピ は まだ 翻訳 されていません"
    />
  );
  expect(getByRole("status")).toHaveTextContent("翻訳");
});
```

- [ ] **Step 2: 실패/통과 확인** — 기존 `NotTranslatedBanner`/RecipeDetailView 와이어링이 이미 통과시킬 수 있음. FAIL이면 RecipeDetailView가 배너를 안 거는 것 → 수정. PASS면 그대로.
- [ ] **Step 3~5:** (구현 불필요 시) 테스트만 커밋.

```bash
git add src/widgets/RecipeDetailView/ui/__tests__/RecipeDetailView.locale.test.tsx
git commit -m "test(i18n): assert notTranslated banner renders (T-11)" -- src/widgets/RecipeDetailView/ui/__tests__/RecipeDetailView.locale.test.tsx
```

---

## Slice 2 — /ja 검색 결과 읽기 경로 + SEO 메타 일본어

### Task 2.1: `search`/`meta.search` namespace + `buildSearchTitle`/`Description` locale화 (TDD)

**Files:**
- Modify: `src/shared/i18n/types.ts`, `messages/{ko,ja,en}.ts`
- Modify: `src/entities/recipe/lib/metadata/searchMeta.ts`
- Modify 호출부: `src/app/ja/search/results/page.tsx` (이미 `buildSearchTitle(q, total, page)` 호출 → locale 인자 추가)
- Test: `src/entities/recipe/lib/metadata/__tests__/searchMeta.test.ts`

- [ ] **Step 1: 실패 테스트** — cites **T-21, T-22, T-23** (그리고 Slice 4의 **T-41** en 복수형 일부 선반영)

```ts
// src/entities/recipe/lib/metadata/__tests__/searchMeta.test.ts
import { buildSearchTitle, buildSearchDescription } from "../searchMeta";

describe("buildSearchTitle", () => {
  it("T-23: ko는 리팩터 전 출력과 동일 (무회귀 앵커)", () => {
    expect(buildSearchTitle("라멘", 12, 0, "ko")).toBe(
      "📌 라멘 레시피 12선 - 레시피오"
    );
    expect(buildSearchTitle("", 0, 0, "ko")).toBe(
      "📌 레시피 검색 결과 - 레시피오"
    );
    expect(buildSearchTitle("라멘", 12, 1, "ko")).toBe(
      "📌 라멘 레시피 12선 (2페이지) - 레시피오"
    );
  });
  it("T-21: ja는 q와 건수를 보간하고 ko와 다르다", () => {
    const ja = buildSearchTitle("ラーメン", 12, 0, "ja");
    expect(ja).toContain("ラーメン");
    expect(ja).toContain("12");
    expect(ja).not.toBe(buildSearchTitle("ラーメン", 12, 0, "ko"));
  });
  it("T-22: q 없으면 각 locale의 no-query 기본 제목", () => {
    expect(buildSearchTitle("", 0, 0, "ja")).not.toContain("undefined");
    expect(buildSearchTitle("", 0, 0, "en")).not.toContain("undefined");
  });
  it("T-41: en은 n=1 단수 'recipe', n=2 복수 'recipes'", () => {
    expect(buildSearchTitle("ramen", 1, 0, "en")).toContain("recipe");
    expect(buildSearchTitle("ramen", 1, 0, "en")).not.toMatch(/recipes/);
    expect(buildSearchTitle("ramen", 2, 0, "en")).toContain("recipes");
  });
});
```

- [ ] **Step 2: 실패 확인** — `npx jest searchMeta` → FAIL (현재 시그니처 3인자, ko 출력도 다름: 현재는 "📌 {q} {count}선" 인데 앵커는 "레시피 12선" → 현재 코드의 정확 출력으로 앵커 교체. **현재 `buildSearchTitle("라멘",12,0)` 실제 출력을 먼저 확인해 앵커를 그 값으로 고정**.)

> **앵커 정확화:** 현재 코드는 `q.includes("레시피")?q:`${q} 레시피`` 이므로 `"라멘"` → `"라멘 레시피"`, 결과 `"📌 라멘 레시피 12선 - 레시피오"`. 위 앵커가 이 값과 일치하는지 Step 2에서 실측 확인 후 확정.

- [ ] **Step 3: 구현** — `meta.search` namespace를 Dictionary에 추가(명시 키), searchMeta를 locale-aware로.

```ts
// searchMeta.ts
import { getDictionary, format, plural } from "@/shared/i18n";
import type { Locale } from "@/shared/i18n";

export const buildSearchTitle = (
  q: string,
  totalElements: number,
  page: number,
  locale: Locale
): string => {
  const d = getDictionary(locale).meta.search;
  const pageLabel = page > 0 ? format(d.pageSuffix, { page: page + 1 }) : "";
  if (!q) return format(d.titleNoQuery, { page: pageLabel });
  const qText =
    d.queryNoun && !q.includes(d.queryNoun) ? `${q} ${d.queryNoun}` : q;
  return format(plural(totalElements, d.titleWithQuery), {
    q: qText,
    count: totalElements,
    page: pageLabel,
  });
};

export const buildSearchDescription = (
  q: string,
  totalElements: number,
  locale: Locale
): string => {
  const d = getDictionary(locale).meta.search;
  if (!q) return d.descNoQuery;
  const qText =
    d.queryNoun && !q.includes(d.queryNoun) ? `${q} ${d.queryNoun}` : q;
  return format(plural(totalElements, d.descWithQuery), {
    q: qText,
    count: totalElements,
  });
};
```

ko.ts `meta.search` (현재 문자열을 템플릿화 — **무회귀 정확**):

```ts
meta: {
  search: {
    queryNoun: "레시피",
    pageSuffix: " ({page}페이지)",
    titleNoQuery: "📌 레시피 검색 결과{page} - 레시피오",
    titleWithQuery: {
      one: "📌 {q} {count}선{page} - 레시피오",
      other: "📌 {q} {count}선{page} - 레시피오",
    },
    descNoQuery:
      "다양한 필터로 원하는 레시피를 찾아보세요. 재료비, 칼로리, 조리시간까지 한눈에 비교!",
    descWithQuery: {
      one: "{q} {count}개를 한눈에 비교하세요. 재료비부터 영양성분까지 다 나옵니다.",
      other: "{q} {count}개를 한눈에 비교하세요. 재료비부터 영양성분까지 다 나옵니다.",
    },
  },
},
```

ja/en `meta.search` = PM 페르소나 번역(Step 3.5). en은 `titleWithQuery.one`에 "recipe", `.other`에 "recipes" 단/복수 구분.

- [ ] **Step 3.5: PM 페르소나 번역** — ja·en `meta.search`. SERP 잘림 예산(seo-metadata 스킬) 준수.
- [ ] **Step 4: 호출부 갱신** — `src/app/ja/search/results/page.tsx:98-99` `buildSearchTitle(q, totalElements, page)` → `buildSearchTitle(q, totalElements, page, "ja")`, description 동일. `npx jest searchMeta` PASS + `npx tsc --noEmit` PASS.
- [ ] **Step 5: 커밋**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ src/entities/recipe/lib/metadata/searchMeta.ts src/entities/recipe/lib/metadata/__tests__/searchMeta.test.ts src/app/ja/search/results/page.tsx
git commit -m "feat(i18n): locale-aware search title/description with plural" -- <경로 나열>
```

### Task 2.2: SearchClient chrome 와이어링 (ja 렌더) — locale union 확장 + DictionaryProvider

**Files:**
- Modify: `src/widgets/SearchClient/index.tsx` (locale `"ko"|"ja"`→`Locale`, "모든 레시피를…"·폴백 dict화, DictionaryProvider로 감쌈)
- Modify: `src/widgets/SearchClient/ui/SearchFilters.tsx` 외 chrome 문자열
- Test: `src/widgets/SearchClient/__tests__/SearchClient.locale.test.tsx`

- [ ] **Step 1: 실패 테스트** — cites **T-20**

```tsx
// SearchClient.locale.test.tsx
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchClient } from "../index";

const renderAt = (locale: "ko" | "ja") =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <SearchClient initialPage={0} locale={locale} />
    </QueryClientProvider>
  );

it("T-20: 빈 상태 chrome가 locale=ja에서 ko와 다르다", () => {
  const ko = renderAt("ko");
  const koText = ko.container.querySelector("[data-testid='search-empty']")?.textContent ?? "";
  ko.unmount();
  const ja = renderAt("ja");
  const jaText = ja.container.querySelector("[data-testid='search-empty']")?.textContent ?? "";
  expect(jaText).not.toBe("");
  expect(jaText).not.toBe(koText);
});
```

> noResults 빈 상태가 `data-testid='search-empty'`로 렌더되도록 RecipeGrid 빈 상태에 testid 부여(seam). 빈 상태를 강제하려면 useSearchResults가 빈 결과를 반환하도록 QueryClient에 빈 데이터 seed — 복잡하면 빈 상태 컴포넌트를 직접 렌더하는 더 낮은 단위 테스트로 owner 이동(T-20 owner를 빈상태 컴포넌트로).

- [ ] **Step 2: 실패 확인** — FAIL
- [ ] **Step 3: 와이어링** — `SearchClient`를 `DictionaryProvider`로 감싸고 chrome 문자열 dict화:

```tsx
// SearchClient/index.tsx
import { DictionaryProvider, getDictionary, useT } from "@/shared/i18n";
import type { Locale } from "@/shared/i18n";

type SearchClientProps = {
  initialPage?: number;
  nextPageHref?: string;
  locale?: Locale;
};

export const SearchClient = ({ initialPage = 0, nextPageHref, locale = "ko" }: SearchClientProps) => (
  <DictionaryProvider dict={getDictionary(locale)}>
    <SearchClientInner initialPage={initialPage} nextPageHref={nextPageHref} locale={locale} />
  </DictionaryProvider>
);

const SearchClientInner = ({ initialPage = 0, nextPageHref, locale }: Required<Pick<SearchClientProps,"locale">> & SearchClientProps) => {
  const t = useT();
  // ... 기존 본문, "모든 레시피를 불러왔습니다." → t.search.lastPage,
  //     SectionErrorFallback message → t.errors.searchResults
};
```

chrome 문자열 enumerated: `SearchFilters.tsx`(정렬 라벨·필터 라벨), RecipeGrid 빈 상태/리셋 버튼(`onResetFilters` 라벨), `lastPageMessage`, 폴백.

- [ ] **Step 4: 통과 확인** — `npx jest SearchClient` PASS + `npx tsc --noEmit`
- [ ] **Step 5: 커밋**

```bash
git add src/widgets/SearchClient/ src/widgets/RecipeGrid/
git commit -m "feat(i18n): localize search chrome via dictionary provider" -- <경로 나열>
```

---

## Slice 3 — /en 레시피 상세 (라우트 신설 + 메타 일반화)

### Task 3.1: `generateLocalizedRecipeMetadata` 일반화 (TDD)

**Files:**
- Rename/Create: `src/entities/recipe/lib/metadata/localizedRecipeMetadata.ts`
- Modify: `src/entities/recipe/lib/metadata/index.ts`
- Test: `src/entities/recipe/lib/metadata/__tests__/localizedRecipeMetadata.test.ts`

- [ ] **Step 1: 실패 테스트** — cites **T-30, T-31** (+ ja 회귀)

```ts
/**
 * @jest-environment node
 */
import {
  generateLocalizedRecipeMetadata,
  generateLocalizedRecipeJsonLd,
} from "../localizedRecipeMetadata";
import { makeJpRecipe } from "./fixtures/recipeFactory";

const recipe = makeJpRecipe({ title: "Oyakodon", description: "egg rice bowl" });

it("T-30: en translated → og:locale en_US, inLanguage en, indexable", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "en",
    translated: true,
  });
  expect((meta.openGraph as { locale?: string })?.locale).toBe("en_US");
  expect(meta.robots).toEqual({ index: true, follow: true });
  const jsonLd = generateLocalizedRecipeJsonLd(recipe, "abc123", "en");
  const node = jsonLd["@graph"].find((n: { "@type"?: string }) => n["@type"] === "Recipe");
  expect(node?.inLanguage).toBe("en");
  expect(meta.alternates?.canonical).toBe("https://www.recipio.kr/en/recipes/abc123");
});

it("T-31: en not translated → noindex,nofollow + canonical 미출력", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "en",
    translated: false,
  });
  expect(meta.robots).toEqual({ index: false, follow: false });
  expect(meta.alternates?.canonical).toBeUndefined();
});

it("T-30(ja 회귀): ja translated → og:locale ja_JP", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "ja",
    translated: true,
  });
  expect((meta.openGraph as { locale?: string })?.locale).toBe("ja_JP");
});
```

- [ ] **Step 2: 실패 확인** — FAIL (모듈 없음)
- [ ] **Step 3: 구현** — `jaRecipeMetadata.ts` 로직을 locale 파라미터화.

```ts
// localizedRecipeMetadata.ts
import type { Metadata } from "next";
import { absoluteUrl } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";
import type { StaticRecipe } from "@/entities/recipe/model/types";
import { SEO_CONSTANTS } from "./constants";
import { generateRecipeJsonLd } from "./recipeMetadata";

const OG_LOCALE: Record<Exclude<Locale, "ko">, string> = {
  ja: "ja_JP",
  en: "en_US",
};

export const generateLocalizedRecipeMetadata = (
  recipe: StaticRecipe,
  recipeId: string,
  { locale, translated }: { locale: Exclude<Locale, "ko">; translated: boolean }
): Metadata => {
  const url = absoluteUrl(`${locale}/recipes/${recipeId}`);
  const description = recipe.description || recipe.title;
  const image = recipe.imageUrl || SEO_CONSTANTS.DEFAULT_IMAGE;
  return {
    title: `${recipe.title} | ${SEO_CONSTANTS.SITE_NAME}`,
    description,
    robots: translated
      ? { index: true, follow: true }
      : { index: false, follow: false },
    ...(translated ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title: recipe.title,
      description,
      url,
      siteName: SEO_CONSTANTS.SITE_NAME,
      type: SEO_CONSTANTS.OG_TYPE.ARTICLE,
      locale: OG_LOCALE[locale],
      images: [{ url: image, width: 1200, height: 630, alt: recipe.title }],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title: recipe.title,
      description,
      images: [image],
    },
  };
};

type GraphNode = { "@type"?: string } & Record<string, unknown>;

export const generateLocalizedRecipeJsonLd = (
  recipe: StaticRecipe,
  recipeId: string,
  locale: Exclude<Locale, "ko">
) => {
  const base = generateRecipeJsonLd(recipe, recipeId);
  return {
    ...base,
    "@graph": base["@graph"].map((node: GraphNode) =>
      node["@type"] === "Recipe" ? { ...node, inLanguage: locale } : node
    ),
  };
};
```

- [ ] **Step 4: 기존 호출부 마이그레이션** — `jaRecipeMetadata.ts`를 삭제하고 `generateJaRecipeMetadata`/`generateJaRecipeJsonLd` 사용처(`src/app/ja/recipes/[recipeId]/page.tsx`)를 새 함수로 교체(`locale:"ja"`). `index.ts` export 갱신. 기존 `jaRecipeMetadata.test.ts`는 새 테스트로 대체(삭제). `npx jest metadata` 전체 PASS + `npx tsc --noEmit`.
- [ ] **Step 5: 커밋**

```bash
git add src/entities/recipe/lib/metadata/ src/app/ja/recipes/
git commit -m "refactor(i18n): generalize ja recipe metadata to locale param" -- <경로 나열>
```

### Task 3.2: 공유 본문 추출 + /en 레시피 라우트 신설

**Files:**
- Create: `src/widgets/RecipeDetailView/server/renderLocalizedRecipePage.tsx` (또는 적절 위치) — `/ja/recipes/page.tsx`의 본문을 `{recipeId, locale}` 함수로.
- Modify: `src/app/ja/recipes/[recipeId]/page.tsx`, `not-found.tsx` → 얇은 wrapper.
- Create: `src/app/en/recipes/[recipeId]/page.tsx`, `not-found.tsx`.
- Modify: `src/entities/recipe/model/api.server.ts:242-244` — `locale: "ja"` → `locale: "ja" | "en"`.

- [ ] **Step 1:** `getLocalizedRecipeOnServer` 시그니처 widen (`"ja" | "en"`), `url.searchParams.set("lang", locale)` 그대로.
- [ ] **Step 2:** `/ja/recipes/page.tsx`의 `generateMetadata`+default를 공유 함수 2개로 추출(`buildLocalizedRecipeMetadata({recipeId, locale})`, `LocalizedRecipePage({recipeId, locale})`). ja page는 `locale="ja"`로, en page는 `locale="en"`로 호출하는 wrapper.

```tsx
// src/app/en/recipes/[recipeId]/page.tsx
import type { Metadata } from "next";
import {
  buildLocalizedRecipeMetadata,
  LocalizedRecipePage,
} from "@/widgets/RecipeDetailView/server/renderLocalizedRecipePage";

type Props = { params: Promise<{ recipeId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { recipeId } = await params;
  return buildLocalizedRecipeMetadata({ recipeId, locale: "en" });
}

export default async function EnRecipeDetailPage({ params }: Props) {
  const { recipeId } = await params;
  return <LocalizedRecipePage recipeId={recipeId} locale="en" />;
}
```

`not-found.tsx`는 ja의 것을 dict 기반으로 공유(또는 locale별 wrapper). en not-found 카피는 dict `errors`/전용 키.

- [ ] **Step 3: 실패 테스트** — cites **T-32** (en not-found 렌더 영어)

```tsx
// src/app/en/recipes/[recipeId]/__tests__/notFound.test.tsx
import { render } from "@testing-library/react";
import EnNotFound from "../not-found";
it("T-32: en not-found가 영어 카피를 렌더한다", () => {
  const { container } = render(<EnNotFound />);
  expect(container.textContent ?? "").not.toBe("");
  // ko not-found와 다른 문구임을 확인(앵커 비교 가능 시)
});
```

- [ ] **Step 4:** PM 페르소나로 en `recipeDetail` namespace 영어 채움(Slice 1에서 임시 ko복사 했다면 교체). `npx tsc --noEmit` + `npx jest` PASS. `/en/recipes/{id}` 수동 확인 = **AC3.1/3.2 시연**.
- [ ] **Step 5: 커밋**

```bash
git add src/widgets/RecipeDetailView/server/ src/app/ja/recipes/ src/app/en/ src/entities/recipe/model/api.server.ts src/shared/i18n/messages/en.ts
git commit -m "feat(i18n): add /en recipe detail route mirroring ja" -- <경로 나열>
```

---

## Slice 4 — /en 검색 결과 (복수형 포함)

### Task 4.1: 검색 페이지 공유 본문 추출 + /en 검색 라우트

**Files:**
- Create: `src/widgets/SearchClient/server/renderLocalizedSearchPage.tsx` — `/ja/search/results/page.tsx` 본문을 `{searchParams, locale}` 함수로 (`JA_SEARCH_BASE_PATH`를 `${locale}/search/results`로 일반화, `buildSearchQueryKey(base9, locale)`, `getRecipesOnServer({...query, lang: locale})`, `og:locale` 일반화).
- Modify: `src/app/ja/search/results/page.tsx` → 얇은 wrapper.
- Create: `src/app/en/search/results/page.tsx`.

- [ ] **Step 1:** ja search page 본문을 locale 파라미터 함수로 추출. `lang: "ja"` → `lang: locale`, og locale 일반화, canonical `absoluteUrl(\`${locale}/search/results\`)`.
- [ ] **Step 2:** ja/en wrapper 작성 (en = `locale="en"`).
- [ ] **Step 3: 실패 테스트** — cites **T-40, T-41**(en plural). T-41은 Task 2.1에 이미 작성됨(searchMeta) → 여기선 **T-40 SearchClient en 렌더**만 신규.

```tsx
// SearchClient.locale.test.tsx 에 추가
it("T-40: 검색 chrome가 locale=en에서 ko와 다르고 비어있지 않다", () => {
  const ko = renderAt("ko");
  const koText = ko.container.querySelector("[data-testid='search-empty']")?.textContent ?? "";
  ko.unmount();
  const en = render(
    <QueryClientProvider client={new QueryClient()}>
      <SearchClient initialPage={0} locale="en" />
    </QueryClientProvider>
  );
  const enText = en.container.querySelector("[data-testid='search-empty']")?.textContent ?? "";
  expect(enText).not.toBe("");
  expect(enText).not.toBe(koText);
});
```

- [ ] **Step 4:** PM 페르소나로 en `search` namespace 채움(Slice 2에서 임시였다면 교체). `buildSearchTitle(q,total,page,"en")` 호출. `npx jest` PASS(T-40,T-41) + `npx tsc --noEmit`. `/en/search/results?q=ramen` 수동 확인 = **AC4.1/4.2 시연**.
- [ ] **Step 5: 커밋**

```bash
git add src/widgets/SearchClient/server/ src/app/ja/search/ src/app/en/search/ src/shared/i18n/messages/en.ts
git commit -m "feat(i18n): add /en search results route with plural copy" -- <경로 나열>
```

---

## Slice 5 — hreflang alternates (edges, 마지막)

### Task 5.1: hreflang languages 추가 (TDD)

**Files:**
- Modify: `src/entities/recipe/lib/metadata/localizedRecipeMetadata.ts` (+ 검색 메타가 있으면 동일)
- Create: `src/shared/i18n/hreflang.ts` — `buildHreflangAlternates(path)` (ko/ja/en + x-default 맵)
- Test: `src/entities/recipe/lib/metadata/__tests__/localizedRecipeMetadata.test.ts` (추가)

- [ ] **Step 1: 실패 테스트** — cites **T-50, T-51**

```ts
it("T-50: translated면 alternates.languages에 ko·ja·en·x-default", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "en",
    translated: true,
  });
  const langs = meta.alternates?.languages ?? {};
  expect(Object.keys(langs)).toEqual(
    expect.arrayContaining(["ko", "ja", "en", "x-default"])
  );
});

it("T-51: not translated(noindex)면 languages를 광고하지 않는다", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "en",
    translated: false,
  });
  expect(meta.alternates?.languages).toBeUndefined();
});
```

- [ ] **Step 2: 실패 확인** — FAIL
- [ ] **Step 3: 구현** — `buildHreflangAlternates`:

```ts
// src/shared/i18n/hreflang.ts
import { absoluteUrl } from "@/shared/config/constants/api";

// ko는 prefix 없는 루트, ja/en은 prefix
export const buildHreflangAlternates = (
  pathWithoutLocale: string
): Record<string, string> => ({
  ko: absoluteUrl(pathWithoutLocale),
  ja: absoluteUrl(`ja/${pathWithoutLocale}`),
  en: absoluteUrl(`en/${pathWithoutLocale}`),
  "x-default": absoluteUrl(pathWithoutLocale),
});
```

`localizedRecipeMetadata.ts`의 translated 분기에 `alternates: { canonical: url, languages: buildHreflangAlternates(\`recipes/${recipeId}\`) }` 추가. not-translated는 그대로(languages 없음).

- [ ] **Step 4: 통과 확인** — `npx jest metadata` PASS + `npx tsc --noEmit`
- [ ] **Step 5: 커밋**

```bash
git add src/shared/i18n/hreflang.ts src/entities/recipe/lib/metadata/localizedRecipeMetadata.ts src/entities/recipe/lib/metadata/__tests__/localizedRecipeMetadata.test.ts
git commit -m "feat(i18n): emit hreflang alternates on indexable localized pages" -- <경로 나열>
```

---

## PM 페르소나 번역 워크플로 (각 Step "3.5"에서 실행)

번역은 직역이 아니라 **현지 PM이 쓴 자연스러운 마이크로카피**여야 한다. namespace 단위로 아래를 1회씩 실행.

**ja 프롬프트 (일본어로 작성):**

```
あなたはレシピアプリ「recipio」の日本担当プロダクトマネージャーです。
韓国語UIの文言を、日本のユーザーに自然で温かみのある日本語マイクロコピーに翻訳してください。
直訳ではなく、各文言が表示される文脈・文字数の制約・トーン（오늘의집のように清潔で親しみやすい）を踏まえること。

制約:
- ラベル=送信メッセージは1:1（キーワードの羅列ではなく人間の言葉で）
- ボタン/見出しは簡潔に。SERP用タイトル/説明は表示の切れ目を意識
- アイコンの装飾的・マーケティング的な誇張表現は禁止

入力（韓国語ソース、キー: 文脈）:
<namespace의 각 키 + UI 맥락(어디 노출/글자수 예산)>

出力: 同じキー構造のTypeScriptオブジェクト（値のみ日本語）。
```

**en 프롬프트 (영어로 작성):**

```
You are the US-market Product Manager for the recipe app "recipio".
Translate the Korean UI strings into natural, warm American-English microcopy.
Not literal — respect where each string appears, character budgets, and a clean,
friendly tone (no marketing hype, no decorative exclamation). Use correct plural
forms; for count-bearing strings provide singular (one) and plural (other).

Constraints:
- Label == the action/message it triggers, 1:1, in human words
- Buttons/headings concise; SERP title/description mindful of truncation
- en queryNoun is "" (do NOT append a noun like Korean "레시피")

Input (Korean source, key: context):
<each key of the namespace + UI context>

Output: a TypeScript object with the same key structure (English values only).
```

검수: 산출물을 ko 키 구조와 대조(누락=tsc가 잡음), SERP 잘림 예산(seo-metadata 스킬), 라벨=동작 1:1.

---

## Self-Review (작성자 체크)

**1. Requirement→test→task 추적:** 매트릭스 전 ID가 task에 등장하는지 —
- TC-type → 각 namespace task Step 4 `tsc`. ✅
- T-01,T-02 → Task 0.2. ✅ T-42,format → 0.1. ✅
- T-10 → 1.2, T-11 → 1.3. ✅ (AC1.3 non-goal: Task 1.1 Step1 제외 목록에 명시)
- T-20 → 2.2, T-21/22/23/41(부분) → 2.1. ✅
- T-30,T-31 → 3.1, T-32 → 3.2. ✅ AC3.4 회귀 → 3.1 Step4 기존 테스트 재실행. ✅
- T-40 → 4.1, T-41 → 2.1(작성)·4.1(en 적용). ✅
- T-50,T-51 → 5.1. ✅ AC5.3 → T-10/T-20 앵커(본문 무회귀). ✅

**2. 플레이스홀더:** ja/en 사전의 "…"는 **PM 페르소나 Step 3.5에서 실제 번역으로 교체** — 실행 시점 산출물(정의된 입력/출력 보유)이지 미정 placeholder 아님. 그 외 TBD/TODO 없음.

**3. 타입 일관성:** `getDictionary`·`useT`·`format`·`plural`·`Locale`·`Dictionary` 시그니처가 전 task에서 일관. `generateLocalizedRecipeMetadata({locale, translated})` 시그니처가 3.1/5.1에서 동일. `buildSearchTitle(q,total,page,locale)` 2.1/4.1 동일.

**주의(실행자):** Dictionary의 `recipeDetail`/`search`는 Slice 1/2 첫 task에서 **인덱스 시그니처를 명시 키로 교체**해야 TC-type(키 누락 차단)이 실제로 작동한다. 인덱스 시그니처로 남기면 AC0.3/AC6가 무력화됨.
