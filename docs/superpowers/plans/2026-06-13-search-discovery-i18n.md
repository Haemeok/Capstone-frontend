# 검색 진입 페이지(`/search`) i18n 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/search` 디스커버리 페이지의 모든 노출 카피를 ja/en으로 제공하되, 직역이 아니라 ja-pm/en-pm 페르소나가 현지 레시피 앱 말투로 재작성한 자연스러운 카피로 채운다. ko 루트는 무변경.

**Architecture:** nav chrome 선례(접근법 A) 답습 — client 컴포넌트가 `usePathname`으로 locale 자가판단(`useSearchDiscoveryDict`), Provider/locale-prop 없음. `searchDiscovery` 사전 네임스페이스를 `Dictionary` 타입에 추가(타입 게이트가 ko/ja/en 누락 강제)하고, 번들 격리를 위해 client는 `searchDiscoveryMessages`(해당 슬라이스만 직접 import)로 접근. 카피가 상수에 박힌 `CONTENT_PAGES`(유일 소비자)는 title/subtitle을 사전으로 이전, 공유 상수 `NUTRITION_THEMES`는 구조 유지 + 사전에 label/description locale 맵 병렬 추가. 가격대 섹션은 ko에서만 렌더.

**Tech Stack:** Next.js 15 App Router, TypeScript, FSD, Jest + Testing-Library, 기존 `src/shared/i18n` 사전 시스템.

**참고 스펙:** `docs/superpowers/specs/2026-06-13-search-discovery-i18n-{design,slices,test-design}.md`

**PM 페르소나:** `docs/i18n/personas/ja-pm.md`, `docs/i18n/personas/en-pm.md` — 각 task의 ja/en 값은 해당 페르소나에 ko 객체 + 섹션 컨텍스트 노트를 넘겨 생성한다. 생성 카피의 자연스러움은 사용자(휴먼) 리뷰 항목(보드 §7 수동검증).

**Bash 규칙:** cwd 안에서는 bare command (`npx tsc --noEmit`, `npx jest <path>`). `cd` 접두사 금지.
**Git 규칙:** 현재 브랜치 `feature/17`에서만. checkout/switch/branch/rebase/merge 금지. 커밋은 `git add <경로>` 후 `git commit -m "..." -- <같은 경로>`(무인자 commit·`-A` 금지).

---

## File Structure

**사전(신규/수정):**
- Modify `src/shared/i18n/types.ts` — `SearchDiscoveryDict` 타입 추가 + `Dictionary`에 `searchDiscovery` 추가
- Create `src/shared/i18n/messages/ko/searchDiscovery.ts` — ko (현 문자열 추출)
- Create `src/shared/i18n/messages/ja/searchDiscovery.ts` — ja (ja-pm 생성)
- Create `src/shared/i18n/messages/en/searchDiscovery.ts` — en (en-pm 생성)
- Modify `src/shared/i18n/messages/{ko,ja,en}/index.ts` — `searchDiscovery` 등록
- Create `src/shared/i18n/searchDiscoveryMessages.ts` — client 번들 격리용 `Record<Locale, SearchDiscoveryDict>`
- Create `src/shared/i18n/useSearchDiscoveryDict.ts` — `useSearchDiscoveryLocale()` + `useSearchDiscoveryDict()`

**페이지 라우트(신규/수정):**
- Create `src/widgets/SearchDiscovery/server/SearchDiscoveryPage.tsx` — prefetch+render 공유 본문 + `searchDiscoveryMetadata`
- Modify `src/app/search/page.tsx` — 공유 본문 호출하는 얇은 래퍼로 축약
- Create `src/app/ja/search/page.tsx`, `src/app/en/search/page.tsx` — 얇은 래퍼

**위젯/feature(수정):**
- `src/widgets/SearchDiscovery/SearchDiscoveryDefault.tsx` — 헤딩 사전화 + 가격 섹션 ko-only
- `src/widgets/SearchDiscovery/SearchDiscoveryFocused.tsx` — (자가판단이라 prop 없음, 변경 최소)
- `src/widgets/SearchDiscovery/ui/LatestRecipesSlide.tsx` — title 사전화
- `src/widgets/SearchDiscovery/ui/NutritionThemeSection.tsx` — 헤딩 + label/description 사전화
- `src/widgets/SearchDiscovery/ui/ContentPageGrid.tsx` + `ContentPageCard.tsx` — title/subtitle 사전화
- `src/widgets/SearchDiscovery/ui/RecentSearchChips.tsx` + `RecentlyViewedRecipes.tsx` — 헤딩/지우기 사전화
- `src/widgets/SearchDiscovery/ui/SaveButton.tsx` — aria 사전화(`nav.savedBooksAria` 재사용)
- `src/features/search-input/ui/SearchInput.tsx` — placeholder/aria locale화
- `src/shared/config/constants/content-pages.ts` — `ContentPage`에서 title/subtitle 제거, `ContentPageId` union 추가

---

## Task 1: S0 — 로케일 디스커버리 셸 (walking skeleton)

래퍼 라우트 + 사전 + 자가판단 hook + 정적 헤딩/aria + 가격 섹션 숨김을 한 번에 증명한다.

**Files:**
- Modify: `src/shared/i18n/types.ts`
- Create: `src/shared/i18n/messages/{ko,ja,en}/searchDiscovery.ts`
- Modify: `src/shared/i18n/messages/{ko,ja,en}/index.ts`
- Create: `src/shared/i18n/searchDiscoveryMessages.ts`, `src/shared/i18n/useSearchDiscoveryDict.ts`
- Create: `src/widgets/SearchDiscovery/server/SearchDiscoveryPage.tsx`
- Modify: `src/app/search/page.tsx`
- Create: `src/app/ja/search/page.tsx`, `src/app/en/search/page.tsx`
- Modify: `src/widgets/SearchDiscovery/SearchDiscoveryDefault.tsx`, `ui/LatestRecipesSlide.tsx`, `src/features/search-input/ui/SearchInput.tsx`
- Test: `src/widgets/SearchDiscovery/__tests__/SearchDiscoveryDefault.i18n.test.tsx`, `src/app/ja/search/__tests__/metadata.test.ts`

- [ ] **Step 1: 타입에 S0 키 추가** — `src/shared/i18n/types.ts`

`Dictionary` 정의 위에 추가:

```ts
export type SearchDiscoveryDict = {
  searchInputAria: string;
  searchClearAria: string;
  latestRecipesTitle: string;
  contentSectionTitle: string;
  nutritionSectionTitle: string;
};
```

`Dictionary`에 한 줄 추가:

```ts
export type Dictionary = {
  // ...기존
  home: HomeDict;
  searchDiscovery: SearchDiscoveryDict;
};
```

- [ ] **Step 2: ko/ja/en 슬라이스 파일 생성**

`src/shared/i18n/messages/ko/searchDiscovery.ts` (현 문자열 그대로 추출):

```ts
import type { SearchDiscoveryDict } from "../../types";

export const searchDiscovery: SearchDiscoveryDict = {
  searchInputAria: "레시피 검색",
  searchClearAria: "입력 지우기",
  latestRecipesTitle: "따끈따끈한 최신 레시피",
  contentSectionTitle: "이런 레시피 어때요?",
  nutritionSectionTitle: "오늘은 어떤 한 끼가 끌려요?",
};
```

`messages/ja/searchDiscovery.ts`, `messages/en/searchDiscovery.ts`: **ja-pm/en-pm 페르소나 디스패치**. 입력 = 위 ko 객체. 컨텍스트 노트: "검색 디스커버리 화면의 정적 라벨. `searchInputAria`/`searchClearAria`는 스크린리더 라벨(간결). `latestRecipesTitle`은 '갓 올라온 최신 레시피' 뉘앙스. `contentSectionTitle`은 추천 큐레이션 진입 헤딩. `nutritionSectionTitle`은 식단 테마 진입 헤딩(질문형). 차분한 톤, 같은 키." 출력을 동일 형식(`export const searchDiscovery: SearchDiscoveryDict = {...}`)으로 저장.

- [ ] **Step 3: 세 index.ts에 등록** — `messages/{ko,ja,en}/index.ts` 각각

import 추가 `import { searchDiscovery } from "./searchDiscovery";` 후 객체에 `searchDiscovery,` 추가.

- [ ] **Step 4: client 접근 모듈 2개 생성**

`src/shared/i18n/searchDiscoveryMessages.ts`:

```ts
import { searchDiscovery as en } from "./messages/en/searchDiscovery";
import { searchDiscovery as ja } from "./messages/ja/searchDiscovery";
import { searchDiscovery as ko } from "./messages/ko/searchDiscovery";
import type { Locale, SearchDiscoveryDict } from "./types";

export const searchDiscoveryMessages: Record<Locale, SearchDiscoveryDict> = {
  ko,
  ja,
  en,
};
```

`src/shared/i18n/useSearchDiscoveryDict.ts`:

```ts
"use client";

import { usePathname } from "next/navigation";

import { resolveChromeLocale } from "./resolveChromeLocale";
import { searchDiscoveryMessages } from "./searchDiscoveryMessages";
import type { Locale, SearchDiscoveryDict } from "./types";

export const useSearchDiscoveryLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useSearchDiscoveryDict = (): SearchDiscoveryDict =>
  searchDiscoveryMessages[useSearchDiscoveryLocale()];
```

- [ ] **Step 5: 페이지 공유 본문 추출** — `src/widgets/SearchDiscovery/server/SearchDiscoveryPage.tsx`

기존 `app/search/page.tsx` 본문을 그대로 옮긴다(서버 컴포넌트, prefetch 포함):

```tsx
import { Suspense } from "react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getNextPageParam } from "@/shared/lib/utils";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import { SearchDiscoveryClient } from "@/widgets/SearchDiscovery";

export const searchDiscoveryMetadata = {
  title: "레시피 탐색 - 레시피오",
  description: "다양한 레시피를 탐색하고 발견하세요.",
  robots: { index: false, follow: true },
};

type Props = { focused: boolean };

export const SearchDiscoveryPage = async ({ focused }: Props) => {
  const queryClient = new QueryClient();

  if (!focused) {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["recipes", "latest"],
      queryFn: () =>
        getRecipesOnServer({ key: "search", page: 0, sort: "createdAt,desc" }),
      initialPageParam: 0,
      getNextPageParam,
      pages: 1,
    });
  }

  return (
    <Suspense>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchDiscoveryClient focused={focused} />
      </HydrationBoundary>
    </Suspense>
  );
};
```

- [ ] **Step 6: ko 라우트를 래퍼로 축약** — `src/app/search/page.tsx` 전체 교체

```tsx
import {
  SearchDiscoveryPage,
  searchDiscoveryMetadata,
} from "@/widgets/SearchDiscovery/server/SearchDiscoveryPage";

export const metadata = searchDiscoveryMetadata;

type SearchPageProps = {
  searchParams: Promise<{ focused?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { focused } = await searchParams;
  return <SearchDiscoveryPage focused={focused === "1"} />;
}
```

- [ ] **Step 7: ja/en 래퍼 생성** — `src/app/ja/search/page.tsx` (en은 경로만 다르게 동일)

```tsx
import {
  SearchDiscoveryPage,
  searchDiscoveryMetadata,
} from "@/widgets/SearchDiscovery/server/SearchDiscoveryPage";

export const metadata = searchDiscoveryMetadata;

type SearchPageProps = {
  searchParams: Promise<{ focused?: string }>;
};

export default async function JaSearchPage({ searchParams }: SearchPageProps) {
  const { focused } = await searchParams;
  return <SearchDiscoveryPage focused={focused === "1"} />;
}
```

`src/app/en/search/page.tsx`: 위와 동일하되 함수명 `EnSearchPage`.

- [ ] **Step 8: 실패 테스트 작성** — `src/widgets/SearchDiscovery/__tests__/SearchDiscoveryDefault.i18n.test.tsx`

```tsx
import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import SearchDiscoveryDefault from "../SearchDiscoveryDefault";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("../ui/LatestRecipesSlide", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../ui/ContentPageGrid", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../ui/NutritionThemeSection", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/features/recipe-create/ui/FloatingCreateRecipeButton", () => ({
  __esModule: true,
  default: () => null,
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);
const ko = searchDiscoveryMessages.ko;
const ja = searchDiscoveryMessages.ja;
const en = searchDiscoveryMessages.en;

describe("SearchDiscoveryDefault i18n", () => {
  it("T-01: /ja·/en 경로에서 헤딩이 해당 locale 사전 값", () => {
    setPath("/ja/search");
    const { rerender } = render(<SearchDiscoveryDefault />);
    expect(screen.getByText(ja.contentSectionTitle)).toBeInTheDocument();
    expect(screen.getByText(ja.nutritionSectionTitle)).toBeInTheDocument();

    setPath("/en/search");
    rerender(<SearchDiscoveryDefault />);
    expect(screen.getByText(en.contentSectionTitle)).toBeInTheDocument();
  });

  it("T-02: 루트(ko)에서 ko 헤딩 + 가격대 섹션 존재(회귀)", () => {
    setPath("/search");
    render(<SearchDiscoveryDefault />);
    expect(screen.getByText(ko.contentSectionTitle)).toBeInTheDocument();
    expect(
      screen.getByText("지갑은 가볍게, 식탁은 든든하게")
    ).toBeInTheDocument();
  });

  it("T-03: /ja·/en에서 가격대 섹션이 렌더되지 않음", () => {
    setPath("/ja/search");
    const { rerender } = render(<SearchDiscoveryDefault />);
    expect(
      screen.queryByText("지갑은 가볍게, 식탁은 든든하게")
    ).not.toBeInTheDocument();

    setPath("/en/search");
    rerender(<SearchDiscoveryDefault />);
    expect(
      screen.queryByText("지갑은 가볍게, 식탁은 든든하게")
    ).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 9: 테스트 실패 확인** — Run: `npx jest src/widgets/SearchDiscovery/__tests__/SearchDiscoveryDefault.i18n.test.tsx`
Expected: FAIL (헤딩이 하드코딩 ko, 가격 섹션 항상 렌더).

- [ ] **Step 10: SearchDiscoveryDefault 사전화 + 가격 ko-only** — `SearchDiscoveryDefault.tsx`

상단에 import 추가:

```tsx
import {
  useSearchDiscoveryDict,
  useSearchDiscoveryLocale,
} from "@/shared/i18n/useSearchDiscoveryDict";
```

컴포넌트 본문에서 `const t = useSearchDiscoveryDict(); const locale = useSearchDiscoveryLocale();` 선언 후:
- `<h3 ...>이런 레시피 어때요?</h3>` → `{t.contentSectionTitle}`
- `<PriceRangeSection />` 를 `{locale === "ko" && <PriceRangeSection />}` 로 감쌈

(NutritionThemeSection 헤딩은 Task 4에서 사전화. 이 task에선 mock 처리됨.)

- [ ] **Step 11: LatestRecipesSlide title 사전화** — `ui/LatestRecipesSlide.tsx`

`useSearchDiscoveryDict` import 후 컴포넌트에서 `const t = useSearchDiscoveryDict();`, `title="따끈따끈한 최신 레시피"` → `title={t.latestRecipesTitle}`.

- [ ] **Step 12: SearchInput aria 사전화** — `features/search-input/ui/SearchInput.tsx`

`useSearchDiscoveryDict` import 후 `const t = useSearchDiscoveryDict();`:
- `aria-label="레시피 검색"` → `aria-label={t.searchInputAria}`
- `aria-label="입력 지우기"` → `aria-label={t.searchClearAria}`

(placeholder 배열은 Task 2에서.)

- [ ] **Step 13: 테스트 통과 확인** — Run: `npx jest src/widgets/SearchDiscovery/__tests__/SearchDiscoveryDefault.i18n.test.tsx`
Expected: PASS (T-01, T-02, T-03).

- [ ] **Step 14: 메타 테스트(T-06)** — `src/app/ja/search/__tests__/metadata.test.ts`

```ts
import { metadata } from "../page";

it("T-06: ja 디스커버리 메타 robots noindex,follow", () => {
  expect(metadata.robots).toEqual({ index: false, follow: true });
});
```

Run: `npx jest src/app/ja/search/__tests__/metadata.test.ts` → PASS.

- [ ] **Step 15: 타입 게이트 확인(T-05)** — Run: `npx tsc --noEmit`
Expected: PASS. (만약 ja/en searchDiscovery 키 누락 시 여기서 실패 — 타입 게이트 작동 증명.)

- [ ] **Step 16: 커밋**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ko/searchDiscovery.ts src/shared/i18n/messages/ja/searchDiscovery.ts src/shared/i18n/messages/en/searchDiscovery.ts src/shared/i18n/messages/ko/index.ts src/shared/i18n/messages/ja/index.ts src/shared/i18n/messages/en/index.ts src/shared/i18n/searchDiscoveryMessages.ts src/shared/i18n/useSearchDiscoveryDict.ts src/widgets/SearchDiscovery/server/SearchDiscoveryPage.tsx src/app/search/page.tsx src/app/ja/search/page.tsx src/app/en/search/page.tsx src/widgets/SearchDiscovery/SearchDiscoveryDefault.tsx src/widgets/SearchDiscovery/ui/LatestRecipesSlide.tsx src/features/search-input/ui/SearchInput.tsx src/widgets/SearchDiscovery/__tests__/SearchDiscoveryDefault.i18n.test.tsx src/app/ja/search/__tests__/metadata.test.ts
git commit -m "feat(i18n): localize /search discovery shell, hide price section in ja/en (T-01/02/03/05/06)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" -- <위 동일 경로들>
```

---

## Task 2: S1 — 시간대별 현지 요리 placeholder

**Files:**
- Modify: `src/shared/i18n/types.ts` (placeholders 키 추가)
- Modify: `src/shared/i18n/messages/{ko,ja,en}/searchDiscovery.ts`
- Modify: `src/features/search-input/ui/SearchInput.tsx`
- Test: `src/features/search-input/ui/__tests__/getPlaceholders.test.ts`

- [ ] **Step 1: 타입에 placeholders 추가** — `types.ts` `SearchDiscoveryDict`에:

```ts
  placeholders: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
```

- [ ] **Step 2: ko placeholders 채움** — `messages/ko/searchDiscovery.ts`에 현 배열 그대로 이전:

```ts
  placeholders: {
    breakfast: [
      '출근 전 든든한 "계란 레시피" 검색',
      '5분 완성 "토스트 레시피" 검색',
      '속 편한 "그릭요거트 레시피" 검색',
      '해장엔 따뜻한 "북엇국 레시피" 검색',
    ],
    lunch: [
      '혼밥엔 든든 "김치찌개 레시피" 검색',
      '매콤한 불맛 "제육덮밥 레시피" 검색',
      '냉장고 털어 "비빔밥 레시피" 검색',
      '오늘은 바삭한 "돈까스 레시피" 검색',
    ],
    dinner: [
      '달콤한 양념 "불고기 레시피" 검색',
      '퇴근 후 "된장찌개 레시피" 검색',
      '불금엔 역시 "삼겹살 레시피" 검색',
      '얼큰 매콤한 "닭볶음탕 레시피" 검색',
    ],
  },
```

- [ ] **Step 3: ja/en placeholders 생성** — ja-pm/en-pm 디스패치. 입력 = 위 ko `placeholders`. 컨텍스트 노트: "시간대별(아침/점심/저녁) 검색 유도 문구. **요리를 현지 가정식으로 교체**(직번역 금지 — ja에 '북엇국' 같은 한국요리 X). 패턴 `'…"○○ 레시피" 검색'` 유지. 모바일 1줄, 짧게. en은 단어폭 고려 더 짧게." 각 배열 4개씩 유지.

- [ ] **Step 4: 실패 테스트 작성** — `src/features/search-input/ui/__tests__/getPlaceholders.test.ts`

```ts
import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import { getPlaceholders, MAX_PLACEHOLDER_CHARS } from "../SearchInput";

describe("getPlaceholders", () => {
  it("T-07: locale·시간대 버킷 선택", () => {
    expect(getPlaceholders("ja", 8)).toBe(
      searchDiscoveryMessages.ja.placeholders.breakfast
    );
    expect(getPlaceholders("ja", 13)).toBe(
      searchDiscoveryMessages.ja.placeholders.lunch
    );
    expect(getPlaceholders("ja", 20)).toBe(
      searchDiscoveryMessages.ja.placeholders.dinner
    );
    // 경계
    expect(getPlaceholders("ko", 5)).toBe(
      searchDiscoveryMessages.ko.placeholders.breakfast
    );
    expect(getPlaceholders("ko", 11)).toBe(
      searchDiscoveryMessages.ko.placeholders.lunch
    );
    expect(getPlaceholders("ko", 17)).toBe(
      searchDiscoveryMessages.ko.placeholders.dinner
    );
  });

  it("T-08: ja·en placeholder에 한글 없음, ko엔 있음", () => {
    const hangul = /[가-힣]/;
    const all = (l: "ja" | "en") => [
      ...searchDiscoveryMessages[l].placeholders.breakfast,
      ...searchDiscoveryMessages[l].placeholders.lunch,
      ...searchDiscoveryMessages[l].placeholders.dinner,
    ];
    expect(all("ja").some((s) => hangul.test(s))).toBe(false);
    expect(all("en").some((s) => hangul.test(s))).toBe(false);
    expect(
      searchDiscoveryMessages.ko.placeholders.breakfast.some((s) =>
        hangul.test(s)
      )
    ).toBe(true);
  });

  it("T-09: 모든 locale placeholder가 글자수 예산 내", () => {
    (["ko", "ja", "en"] as const).forEach((l) => {
      const all = [
        ...searchDiscoveryMessages[l].placeholders.breakfast,
        ...searchDiscoveryMessages[l].placeholders.lunch,
        ...searchDiscoveryMessages[l].placeholders.dinner,
      ];
      const over = all.filter((s) => s.length > MAX_PLACEHOLDER_CHARS[l]);
      expect(over).toEqual([]);
    });
  });
});
```

- [ ] **Step 5: 테스트 실패 확인** — Run: `npx jest src/features/search-input/ui/__tests__/getPlaceholders.test.ts`
Expected: FAIL (`getPlaceholders`/`MAX_PLACEHOLDER_CHARS` export 없음).

- [ ] **Step 6: SearchInput placeholder locale화** — `SearchInput.tsx`

- 파일 상단 하드코딩 `BREAKFAST_PLACEHOLDERS`/`LUNCH_PLACEHOLDERS`/`DINNER_PLACEHOLDERS` 배열과 `MAX_PLACEHOLDER_CHARS = 20` 상수, dev 오버플로 warn 블록 삭제.
- 다음으로 교체(`MAX_PLACEHOLDER_CHARS`는 locale별 예산 객체로):

```ts
import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";
import { useSearchDiscoveryLocale } from "@/shared/i18n/useSearchDiscoveryDict";
import type { Locale } from "@/shared/i18n/types";

export const MAX_PLACEHOLDER_CHARS: Record<Locale, number> = {
  ko: 20,
  ja: 20,
  en: 34,
};

const MORNING_HOUR_START = 5;
const LUNCH_HOUR_START = 11;
const DINNER_HOUR_START = 17;

export const getPlaceholders = (locale: Locale, hour: number): string[] => {
  const p = searchDiscoveryMessages[locale].placeholders;
  if (hour >= MORNING_HOUR_START && hour < LUNCH_HOUR_START) return p.breakfast;
  if (hour >= LUNCH_HOUR_START && hour < DINNER_HOUR_START) return p.lunch;
  return p.dinner;
};
```

- 컴포넌트 본문: `const locale = useSearchDiscoveryLocale();` 추가 후 초기 state를
  `useState<string[]>(() => getPlaceholders(locale, new Date().getHours()))` 로 교체.
  (기존 `getPlaceholdersForHour` 호출 제거.)

- [ ] **Step 7: 테스트 통과 확인** — Run: `npx jest src/features/search-input/ui/__tests__/getPlaceholders.test.ts`
Expected: PASS (T-07, T-08, T-09).

- [ ] **Step 8: 타입 체크** — Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 9: 커밋**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ko/searchDiscovery.ts src/shared/i18n/messages/ja/searchDiscovery.ts src/shared/i18n/messages/en/searchDiscovery.ts src/features/search-input/ui/SearchInput.tsx src/features/search-input/ui/__tests__/getPlaceholders.test.ts
git commit -m "feat(i18n): localize search placeholders with native dishes per time-of-day (T-07/08/09)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" -- <위 동일 경로들>
```

---

## Task 3: S2 — 큐레이션 카드 현지 재작성

**Files:**
- Modify: `src/shared/config/constants/content-pages.ts` (title/subtitle 제거, `ContentPageId` 추가)
- Modify: `src/shared/i18n/types.ts` (`contentPages` 키 추가)
- Modify: `src/shared/i18n/messages/{ko,ja,en}/searchDiscovery.ts`
- Modify: `src/widgets/SearchDiscovery/ui/ContentPageGrid.tsx`, `ui/ContentPageCard.tsx`
- Test: `src/widgets/SearchDiscovery/ui/__tests__/ContentPageGrid.i18n.test.tsx`

- [ ] **Step 1: 상수에서 카피 분리** — `content-pages.ts`

`ContentPageId` union export 추가:

```ts
export type ContentPageId =
  | "diet-healthy"
  | "ai-creative"
  | "chef-secret"
  | "solo-drink"
  | "budget-gourmet"
  | "late-night-guilty"
  | "youtube-mukbang"
  | "hangover-soup"
  | "air-fryer-legend"
  | "kids-snack"
  | "home-party-flex"
  | "protein-bulk";
```

`ContentPage` 타입에서 `title`/`subtitle` 제거, `id: ContentPageId`로:

```ts
export type ContentPage = {
  id: ContentPageId;
  imageUrl: string;
  searchParams: ContentPageSearchParams;
};
```

`CONTENT_PAGES` 배열 각 항목에서 `title`/`subtitle` 줄 삭제(나머지 유지).

- [ ] **Step 2: 타입에 contentPages 추가** — `types.ts`

상단에 `import type { ContentPageId } from "@/shared/config/constants/content-pages";` 추가, `SearchDiscoveryDict`에:

```ts
  contentPages: Record<ContentPageId, { title: string; subtitle: string }>;
```

- [ ] **Step 3: ko contentPages 채움** — `messages/ko/searchDiscovery.ts` (현 상수 값 그대로):

```ts
  contentPages: {
    "diet-healthy": { title: "🚨 입터짐 방지", subtitle: "살 빠지는 게 죄면 무기징역" },
    "ai-creative": { title: "🤖 AI가 만든 신박한 조합", subtitle: "사람은 절대 못 떠올린 레시피" },
    "chef-secret": { title: "🤫 셰프 유튜버 시크릿", subtitle: "구독자 100만 채널 시그니처" },
    "solo-drink": { title: "☔️ 비 오는 날 이자카야 왜 가요?", subtitle: "퇴근 후 10분컷 혼술 안주" },
    "budget-gourmet": { title: "💰 5천원으로 오마카세 기분", subtitle: "가성비 끝판왕 레시피" },
    "late-night-guilty": { title: "🌙 새벽 2시 배고프면 지는 거야", subtitle: "죄책감 없는 야식 레시피" },
    "youtube-mukbang": { title: "📺 먹방 유튜버가 숨긴", subtitle: "영상 속 그 음식 직접 만들기" },
    "hangover-soup": { title: "🍲 어젯밤 기억이 없다면", subtitle: "속풀이 국물 레시피 모음" },
    "air-fryer-legend": { title: "🔥 에어프라이어 레전드", subtitle: "유튜브 1억뷰 돌파 레시피" },
    "kids-snack": { title: "🥺 엄마 이거 또 해줘!", subtitle: "아이들이 직접 고른 간식" },
    "home-party-flex": { title: "🏠 손님 왔는데 요리 못한다고?", subtitle: "있어보이는 홈파티 메뉴" },
    "protein-bulk": { title: "💪 헬창들의 찐 식단 공개", subtitle: "단백질 30g 이상 벌크업" },
  },
```

- [ ] **Step 4: ja/en contentPages 생성** — ja-pm/en-pm 디스패치. 입력 = 위 ko `contentPages`. 컨텍스트 노트: "레시피 앱 큐레이션 카드 12장(title은 짧은 훅, subtitle은 보조 설명). **한국 밈·드립을 직번역하지 말고 같은 의도를 현지 레시피 앱이 쓸 차분한 말투로 재창작.** 과장·감탄사·마케팅 카피 금지. 이모지는 현 1개 톤 유지하거나 생략 가능(절제). 같은 12개 id 키." 출력 = `Record<ContentPageId, {title, subtitle}>`.

- [ ] **Step 5: 실패 테스트 작성** — `src/widgets/SearchDiscovery/ui/__tests__/ContentPageGrid.i18n.test.tsx`

```tsx
import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import ContentPageGrid from "../ContentPageGrid";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/ui/shadcn/carousel", () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselNext: () => null,
  CarouselPrevious: () => null,
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

it("T-10: /ja에서 첫 카드 title이 ja 사전 값", () => {
  setPath("/ja/search");
  render(<ContentPageGrid />);
  expect(
    screen.getByText(searchDiscoveryMessages.ja.contentPages["diet-healthy"].title)
  ).toBeInTheDocument();
});

it("T-02b(ko 회귀): 루트에서 ko 카드 title", () => {
  setPath("/search");
  render(<ContentPageGrid />);
  expect(
    screen.getByText(searchDiscoveryMessages.ko.contentPages["diet-healthy"].title)
  ).toBeInTheDocument();
});
```

- [ ] **Step 6: 테스트 실패 확인** — Run: `npx jest src/widgets/SearchDiscovery/ui/__tests__/ContentPageGrid.i18n.test.tsx`
Expected: FAIL (카드가 사전 안 읽음 / 타입 에러).

- [ ] **Step 7: ContentPageGrid·Card 사전화**

`ContentPageGrid.tsx`: `useSearchDiscoveryDict` import. 본문에서 `const t = useSearchDiscoveryDict();`, 카드 렌더를 `<ContentPageCard page={page} copy={t.contentPages[page.id]} />` 로 변경.

`ContentPageCard.tsx`: props에 `copy: { title: string; subtitle: string }` 추가. `page.title`→`copy.title`(Image alt 포함), `page.subtitle`→`copy.subtitle`.

```tsx
type ContentPageCardProps = {
  page: ContentPage;
  copy: { title: string; subtitle: string };
};

const ContentPageCard = ({ page, copy }: ContentPageCardProps) => {
  // ...alt={copy.title}, {copy.title}, copy.subtitle && ... {copy.subtitle}
};
```

- [ ] **Step 8: 테스트 통과 확인** — Run: `npx jest src/widgets/SearchDiscovery/ui/__tests__/ContentPageGrid.i18n.test.tsx` → PASS.

- [ ] **Step 9: 타입 체크** — Run: `npx tsc --noEmit` → PASS (CONTENT_PAGES 소비자는 ContentPageGrid 단독이라 타입 변경 안전).

- [ ] **Step 10: 커밋**

```bash
git add src/shared/config/constants/content-pages.ts src/shared/i18n/types.ts src/shared/i18n/messages/ko/searchDiscovery.ts src/shared/i18n/messages/ja/searchDiscovery.ts src/shared/i18n/messages/en/searchDiscovery.ts src/widgets/SearchDiscovery/ui/ContentPageGrid.tsx src/widgets/SearchDiscovery/ui/ContentPageCard.tsx src/widgets/SearchDiscovery/ui/__tests__/ContentPageGrid.i18n.test.tsx
git commit -m "feat(i18n): re-author curation cards in native calm tone, lift copy out of constant (T-10)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" -- <위 동일 경로들>
```

---

## Task 4: S3 — 현지 식단 테마

**Files:**
- Modify: `src/shared/i18n/types.ts` (`nutritionThemes` 키 추가)
- Modify: `src/shared/i18n/messages/{ko,ja,en}/searchDiscovery.ts`
- Modify: `src/widgets/SearchDiscovery/ui/NutritionThemeSection.tsx`
- Test: `src/widgets/SearchDiscovery/ui/__tests__/NutritionThemeSection.i18n.test.tsx`

- [ ] **Step 1: 타입에 nutritionThemes 추가** — `types.ts`

상단에 `import type { NutritionThemeKey } from "@/shared/config/constants/recipe";` 추가, `SearchDiscoveryDict`에:

```ts
  nutritionThemes: Record<
    NutritionThemeKey,
    { label: string; description: string }
  >;
```

- [ ] **Step 2: ko nutritionThemes 채움** — `messages/ko/searchDiscovery.ts`

`src/shared/config/constants/recipe.ts`의 `NUTRITION_THEMES`를 열어 각 key의 `label`/`description`을 **그대로** 복사(ko 동일). 모든 key(keyof NUTRITION_THEMES) 포함. 예:

```ts
  nutritionThemes: {
    keto: { label: "키토", description: "저탄수 고지방, 케토시스 유도" },
    // ...NUTRITION_THEMES의 나머지 key 전부 동일하게
  },
```

- [ ] **Step 3: ja/en nutritionThemes 생성** — ja-pm/en-pm 디스패치. 입력 = 위 ko `nutritionThemes`. 컨텍스트 노트: "식단 테마 칩(label 짧게, description 한 줄). **현지에서 통용되는 식단/영양 용어** 사용: 키토→keto/ケト, 위고비 친화→GLP-1/Wegovy系, 저당→low-sugar/低糖質, 항노화→anti-aging/エイジングケア 등. 같은 key 전부."

- [ ] **Step 4: 실패 테스트 작성** — `src/widgets/SearchDiscovery/ui/__tests__/NutritionThemeSection.i18n.test.tsx`

```tsx
import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { NUTRITION_THEMES } from "@/shared/config/constants/recipe";
import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import NutritionThemeSection from "../NutritionThemeSection";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/ui/image/Image", () => ({
  Image: () => null,
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);
const firstKey = Object.keys(NUTRITION_THEMES)[0] as keyof typeof NUTRITION_THEMES;

it("T-11: /ja에서 첫 테마 label이 ja 사전 값", () => {
  setPath("/ja/search");
  render(<NutritionThemeSection />);
  expect(
    screen.getByText(searchDiscoveryMessages.ja.nutritionThemes[firstKey].label)
  ).toBeInTheDocument();
});

it("T-12: NUTRITION_THEMES 상수 label은 여전히 ko (공유 소비자 무영향)", () => {
  expect(NUTRITION_THEMES[firstKey].label).toBe(
    searchDiscoveryMessages.ko.nutritionThemes[firstKey].label
  );
});
```

- [ ] **Step 5: 테스트 실패 확인** — Run: `npx jest src/widgets/SearchDiscovery/ui/__tests__/NutritionThemeSection.i18n.test.tsx`
Expected: FAIL (T-11 — 섹션이 `theme.label`(ko 상수) 렌더).

- [ ] **Step 6: NutritionThemeSection 사전화** — `NutritionThemeSection.tsx`

`useSearchDiscoveryDict` import. 본문에서 `const t = useSearchDiscoveryDict();`:
- `<h3 ...>오늘은 어떤 한 끼가 끌려요?</h3>` → `{t.nutritionSectionTitle}`
- `<span ...>{theme.label}</span>` → `{t.nutritionThemes[key].label}`
- `alt={theme.label}` → `alt={t.nutritionThemes[key].label}`
- (description을 노출하는 자리가 있으면 `t.nutritionThemes[key].description`. 없으면 label만.)
- `NUTRITION_THEMES` 상수는 icon/values/href용으로 **그대로 유지**(label만 사전에서 읽음).

- [ ] **Step 7: 테스트 통과 확인** — Run: `npx jest src/widgets/SearchDiscovery/ui/__tests__/NutritionThemeSection.i18n.test.tsx` → PASS (T-11, T-12).

- [ ] **Step 8: 타입 체크** — Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 9: 커밋**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ko/searchDiscovery.ts src/shared/i18n/messages/ja/searchDiscovery.ts src/shared/i18n/messages/en/searchDiscovery.ts src/widgets/SearchDiscovery/ui/NutritionThemeSection.tsx src/widgets/SearchDiscovery/ui/__tests__/NutritionThemeSection.i18n.test.tsx
git commit -m "feat(i18n): localize nutrition theme labels, keep shared constant intact (T-11/12)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" -- <위 동일 경로들>
```

---

## Task 5: S4 — focused 모드 현지화

**Files:**
- Modify: `src/shared/i18n/types.ts` (recentSearchTitle/recentViewedTitle/clearAction 추가)
- Modify: `src/shared/i18n/messages/{ko,ja,en}/searchDiscovery.ts`
- Modify: `ui/RecentSearchChips.tsx`, `ui/RecentlyViewedRecipes.tsx`, `ui/SaveButton.tsx`
- Test: `src/widgets/SearchDiscovery/ui/__tests__/RecentSections.i18n.test.tsx`

- [ ] **Step 1: 타입 추가** — `types.ts` `SearchDiscoveryDict`에:

```ts
  recentSearchTitle: string;
  recentViewedTitle: string;
  clearAction: string;
```

- [ ] **Step 2: ko 채움** — `messages/ko/searchDiscovery.ts`:

```ts
  recentSearchTitle: "최근 검색어",
  recentViewedTitle: "최근 본 레시피",
  clearAction: "지우기",
```

- [ ] **Step 3: ja/en 생성** — ja-pm/en-pm 디스패치. 컨텍스트 노트: "검색창 포커스 시 최근 활동 섹션. `recentSearchTitle`=최근 검색어 헤딩, `recentViewedTitle`=최근 본 레시피 헤딩, `clearAction`=목록 비우기 버튼(짧게)."

- [ ] **Step 4: 실패 테스트 작성** — `src/widgets/SearchDiscovery/ui/__tests__/RecentSections.i18n.test.tsx`

```tsx
import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import RecentSearchChips from "../RecentSearchChips";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/shared/hooks/useRecentSearches", () => ({
  useRecentSearches: () => ({
    searches: ["a"],
    isLoaded: true,
    removeSearch: jest.fn(),
    clearAll: jest.fn(),
  }),
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

it("T-13: /ja focused 헤딩·지우기가 ja 사전 값", () => {
  setPath("/ja/search");
  render(<RecentSearchChips />);
  expect(
    screen.getByText(searchDiscoveryMessages.ja.recentSearchTitle)
  ).toBeInTheDocument();
  expect(
    screen.getByText(searchDiscoveryMessages.ja.clearAction)
  ).toBeInTheDocument();
});

it("T-14(ko 회귀): 루트에서 ko 헤딩", () => {
  setPath("/search");
  render(<RecentSearchChips />);
  expect(
    screen.getByText(searchDiscoveryMessages.ko.recentSearchTitle)
  ).toBeInTheDocument();
});
```

- [ ] **Step 5: 테스트 실패 확인** — Run: `npx jest src/widgets/SearchDiscovery/ui/__tests__/RecentSections.i18n.test.tsx`
Expected: FAIL.

- [ ] **Step 6: 세 컴포넌트 사전화**

`RecentSearchChips.tsx`: `useSearchDiscoveryDict` import, `const t = useSearchDiscoveryDict();`. `최근 검색어`→`{t.recentSearchTitle}`, `지우기`→`{t.clearAction}`.

`RecentlyViewedRecipes.tsx`: 동일 import. `최근 본 레시피`→`{t.recentViewedTitle}`, `지우기`→`{t.clearAction}`.

`SaveButton.tsx`: `import { useChromeDict } from "@/shared/i18n/useChromeDict";` 추가, `const nav = useChromeDict();`, `aria-label="저장한 레시피북"`→`aria-label={nav.savedBooksAria}`.

- [ ] **Step 7: 테스트 통과 확인** — Run: `npx jest src/widgets/SearchDiscovery/ui/__tests__/RecentSections.i18n.test.tsx` → PASS.

- [ ] **Step 8: 타입 체크** — Run: `npx tsc --noEmit` → PASS.

- [ ] **Step 9: 커밋**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ko/searchDiscovery.ts src/shared/i18n/messages/ja/searchDiscovery.ts src/shared/i18n/messages/en/searchDiscovery.ts src/widgets/SearchDiscovery/ui/RecentSearchChips.tsx src/widgets/SearchDiscovery/ui/RecentlyViewedRecipes.tsx src/widgets/SearchDiscovery/ui/SaveButton.tsx src/widgets/SearchDiscovery/ui/__tests__/RecentSections.i18n.test.tsx
git commit -m "feat(i18n): localize focused-mode recent sections and save aria (T-13/14)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" -- <위 동일 경로들>
```

---

## Task 6: 한글 누락 가드 (false-comfort killer)

모든 영역이 사전화된 지금, ja/en 렌더 전체에 한글 잔존이 없음을 확정한다(타입 게이트가 못 잡는 미추출 inline 문자열 차단).

**Files:**
- Test: `src/widgets/SearchDiscovery/__tests__/noHangulLeak.i18n.test.tsx`

- [ ] **Step 1: 실패/통과 가드 테스트 작성**

```tsx
import { usePathname } from "next/navigation";

import { render } from "@testing-library/react";

import SearchDiscoveryDefault from "../SearchDiscoveryDefault";
import SearchDiscoveryFocused from "../SearchDiscoveryFocused";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));
// 백엔드 데이터 경계만 mock — 카드/슬라이드는 빈 배열
jest.mock("@/shared/hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: () => ({ data: undefined, isPending: false, error: null }),
}));
jest.mock("@/shared/hooks/useRecentSearches", () => ({
  useRecentSearches: () => ({
    searches: [],
    isLoaded: true,
    removeSearch: jest.fn(),
    clearAll: jest.fn(),
  }),
}));
jest.mock("@/shared/hooks/useRecentlyViewedRecipes", () => ({
  useRecentlyViewedRecipes: () => ({ recipes: [], isLoaded: true, clearAll: jest.fn() }),
}));
jest.mock("@/shared/ui/image/Image", () => ({ Image: () => null }));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);
const hangul = /[가-힣]/;

describe("디스커버리 한글 누락 가드", () => {
  it("T-04: ja·en Default 렌더에 한글 0", () => {
    setPath("/ja/search");
    const { container, rerender, unmount } = render(<SearchDiscoveryDefault />);
    expect(hangul.test(container.textContent ?? "")).toBe(false);
    setPath("/en/search");
    rerender(<SearchDiscoveryDefault />);
    expect(hangul.test(container.textContent ?? "")).toBe(false);
    unmount();
  });

  it("T-14: ja·en Focused 렌더에 한글 0", () => {
    setPath("/ja/search");
    const { container, rerender } = render(<SearchDiscoveryFocused />);
    expect(hangul.test(container.textContent ?? "")).toBe(false);
    setPath("/en/search");
    rerender(<SearchDiscoveryFocused />);
    expect(hangul.test(container.textContent ?? "")).toBe(false);
  });
});
```

- [ ] **Step 2: 실행** — Run: `npx jest src/widgets/SearchDiscovery/__tests__/noHangulLeak.i18n.test.tsx`
Expected: PASS. **만약 FAIL이면** container.textContent에서 한글 조각을 grep해 미추출 inline 문자열을 찾아 해당 컴포넌트를 사전화(놓친 surface). 통과까지 반복.

- [ ] **Step 3: 전체 스위트 회귀 확인** — Run: `npx jest src/widgets/SearchDiscovery src/features/search-input`
Expected: 전부 PASS (ko 회귀 포함).

- [ ] **Step 4: 커밋**

```bash
git add src/widgets/SearchDiscovery/__tests__/noHangulLeak.i18n.test.tsx
git commit -m "test(i18n): assert no Korean leaks in ja/en discovery render (T-04/14)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" -- src/widgets/SearchDiscovery/__tests__/noHangulLeak.i18n.test.tsx
```

- [ ] **Step 5: 상태 보드 갱신** — `I18N-STATUS.md` §3 "검색 진입 `/search`" 행 🔴→🟢, §6에 `- [2026-06-13][i18n] /search 디스커버리 ja/en 완료(셸·placeholder 현지요리·큐레이션카드 현지톤·식단테마·focused). 가격대 섹션 ja/en 숨김(통화 후속). 카피 자연성 사용자 수동검증 대기.` 추가. (별도 docs 커밋)

---

## Self-Review (작성자 점검 완료)

**1. 요구사항→테스트→task 추적성 (매트릭스 워크):**
- AC0.1/0.2 → T-01 (Task1 S8/S13) ✓ · AC0.3 → T-03 (Task1) ✓ · AC0.4·AC2.3 → T-02 (Task1) + ContentPageGrid ko 회귀 (Task3 S5) ✓ · AC0.5 → T-05 (Task1 S15 tsc) ✓ · AC0.1 meta → T-06 (Task1 S14) ✓
- AC1.1/1.2 → T-07,T-08 (Task2) ✓ · AC1.3 → T-09 (Task2) ✓
- AC2.1 → T-10 (Task3) ✓ · AC2.2 → 기존 `buildSearchResultsUrl.test` (카드 href 빌더 미변경) ✓
- AC3.1 → T-11 (Task4) ✓ · AC3.2 → T-12 (Task4) ✓ · AC3.3 → 기존 url 테스트(href 미변경) ✓
- AC4.1 → T-13 (Task5) ✓ · AC4.2 → T-14 ko (Task5) ✓
- 누락 가드 T-04/T-14(no-Hangul) → Task6 ✓ (전 영역 사전화 후 실행이 맞아 순서를 매트릭스 TDD순서에서 끝으로 이동 — 사유: 부분 사전화 상태에선 카드/테마/placeholder ko 잔존으로 필연 FAIL)
- 모든 비목표는 test-design "Non-goals(no test)"에 명시 ✓

**2. Placeholder scan:** ja/en 카피 값은 페르소나 디스패치 step으로 완전 명세(입력 ko 객체 + 컨텍스트 노트 + 출력 형식) — "TBD" 아님. nutritionThemes ko는 "NUTRITION_THEMES key 전부 복사"로 도출 명세. 그 외 모든 코드 블록 실제 내용 포함 ✓

**3. 타입/시그니처 일관성:** `useSearchDiscoveryDict`/`useSearchDiscoveryLocale`(Task1 정의) ↔ 이후 task 사용 일치. `getPlaceholders(locale, hour)`·`MAX_PLACEHOLDER_CHARS: Record<Locale, number>`(Task2) 일치. `ContentPageCard` props `{page, copy}`(Task3) 일치. `ContentPageId`(Task3 정의) ↔ types.ts import 일치 ✓
