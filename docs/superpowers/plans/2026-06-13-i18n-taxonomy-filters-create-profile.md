# 택소노미 현지화 + 생성/프로필 페이지 i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Bash 규칙(필수):** cwd 안에서는 `cd "<path>" && ...` 금지, bare command 실행(`npx tsc --noEmit`, `git ...`). 다른 디렉터리는 `git -C <dir>` 등 네이티브 플래그.
> **Git 브랜치 규칙(필수):** 이 작업은 `feature/17`에서만. `checkout/switch/branch/worktree/pull/rebase/merge` 금지. 다른 브랜치 필요하면 BLOCKED 보고.

**Goal:** 사용자가 지목한 4개 미번역 표면(택소노미 라벨·검색 필터·생성 허브·프로필 편집·카테고리 상세)을 ja/en 현지화한다.

**Architecture:** 접근법 A — 기존 한글-키 상수는 불변, 안정적인 코드를 키로 한 새 택소노미 사전 + 렌더 지점 리졸버로 표시만 현지화(ko 회귀 구조상 0). 페이지는 기존 `/ja /en` 미러 라우트 패턴 + chrome 사전. 카테고리 상세만 데이터 `?lang` + 현지화 메타.

**Tech Stack:** Next.js 15 App Router, TS, FSD, TanStack Query, Jest + React Testing Library, 기존 `src/shared/i18n` 사전 시스템.

**Test matrix:** `docs/superpowers/specs/2026-06-13-i18n-taxonomy-filters-create-profile-test-design.md` (T-01~T-32). 모든 failing test는 T-xx를 인용한다.

**테스트 작성 원칙(이 플랜 전체):**
- 표시값은 하드코딩 카피가 아니라 `messages.ja.<...>` 사전 값과 일치로 검증(카피 결합 회피).
- pathname은 `next/navigation` `usePathname`을 모킹해 `/ja`·`/`로 주입(안 소유한 경계).
- 라벨 N개 등식 나열 금지 → 표면당 대표 1 + no-Hangul 스캔 + ko 앵커.
- `renderHook`/`render`에 인라인 배열·객체 리터럴 넘기지 말 것(불안정 참조 OOM). 상수로 추출.
- 변경 파일만 테스트: `npx jest <path> --watchAll=false`.

**no-Hangul 스캔 헬퍼(반복 사용):** 각 스캔 테스트는 `expect(container.textContent).not.toMatch(/[가-힣]/)` 사용. aria-label 등 속성까지 보려면 `container.innerHTML`도 함께 검사.

---

## File Structure

**Foundation (신규):**
- `src/shared/i18n/types.ts` — `TaxonomyDict` 추가, `Dictionary`에 `taxonomy` 추가
- `src/shared/i18n/messages/{ko,ja,en}/taxonomy.ts` — code→label 사전
- `src/shared/i18n/messages/{ko,ja,en}/index.ts` — `taxonomy` 합류
- `src/shared/i18n/taxonomyMessages.ts` — `Record<Locale, TaxonomyDict>` (번들 격리: taxonomy 슬라이스만 import)
- `src/shared/i18n/taxonomyLabel.ts` — 순수 리졸버 `taxonomyLabel` / `localizeTaxonomy`
- `src/shared/i18n/useTaxonomy.ts` — client 훅(pathname 자가판단, bound helpers)

**라벨 적용(수정):**
- `src/features/recipe-search/ui/RecipeTypeSelector.tsx` (S1)
- `src/features/filter-sort/ui/SortFilter.tsx` + `src/widgets/CategoryPicker/*` (S2 정렬 표시)
- `src/features/filter-dish-type/ui/DishTypeFilter.tsx` (S2)
- `src/features/filter-tags/...` (S2 태그) + `src/widgets/CategoryTabs/CateGoryItem.tsx` (S3)
- `src/features/recipe-search/ui/NutritionSliders.tsx` (S2 재료비 숨김) + 드로어 헤더 chrome
- `src/features/filter-ingredients/ui/IngredientCategoryTabs.tsx` (S4)

**페이지(신규 라우트 + 수정):**
- `src/app/{ja,en}/users/edit/page.tsx` (신규 래퍼) + `src/app/users/edit/page.tsx` (사전 와이어) — S5
- `src/app/{ja,en}/recipes/new/page.tsx`·`/manual/page.tsx` (신규) + `src/features/recipe-import-youtube/ui/CreationModeSelector.tsx` (locale prop) + `recipeCreate` 사전 — S6
- `src/app/{ja,en}/recipes/category/[id]/page.tsx` (신규) + 카테고리 상세 chrome/데이터/메타 — S7

**chrome 사전 신규 네임스페이스:** `recipeCreate`, `category` (S6/S7). `userPages.profile.edit`는 **이미 존재**(ja/en 작성 완료) — S5는 와이어만.

---

## Task 1: 택소노미 사전 타입 + ko/ja/en 사전 (S1 sliver — recipeType만)

walking skeleton의 foundation. `recipeType` 도메인만 먼저(코드를 손에 든 가장 단순한 경우). 나머지 도메인은 S2에서 같은 파일에 확장한다.

**Files:**
- Modify: `src/shared/i18n/types.ts`
- Create: `src/shared/i18n/messages/ko/taxonomy.ts`, `.../ja/taxonomy.ts`, `.../en/taxonomy.ts`
- Modify: `src/shared/i18n/messages/{ko,ja,en}/index.ts`
- Create: `src/shared/i18n/taxonomyMessages.ts`

- [ ] **Step 1: `TaxonomyDict` 타입 추가 + `Dictionary`에 합류**

`src/shared/i18n/types.ts` 끝의 `Dictionary` 정의 위에 추가:

```ts
export type TaxonomyDict = {
  recipeType: Record<"USER" | "AI" | "YOUTUBE", string>;
};
```

`Dictionary` 타입에 `taxonomy: TaxonomyDict;` 한 줄 추가(`userPages` 아래).

- [ ] **Step 2: ko/ja/en taxonomy 사전 작성(recipeType)**

`src/shared/i18n/messages/ko/taxonomy.ts`:

```ts
import type { TaxonomyDict } from "../../types";

export const taxonomy: TaxonomyDict = {
  recipeType: {
    USER: "사용자 레시피",
    AI: "AI 레시피",
    YOUTUBE: "유튜브 레시피",
  },
};
```

`.../ja/taxonomy.ts`·`.../en/taxonomy.ts`: **같은 키, ja/en 값**. ja/en 값은 ja-pm/en-pm 페르소나(`docs/i18n/personas/*`)로 차분한 톤 번역(예 ja: ユーザーレシピ / AIレシピ / YouTubeレシピ, en: User recipe / AI recipe / YouTube recipe). 구조 계약(같은 키) 준수.

- [ ] **Step 3: 세 `index.ts`에 taxonomy 합류**

각 `messages/{ko,ja,en}/index.ts`에 `import { taxonomy } from "./taxonomy";` 추가하고 객체 리터럴에 `taxonomy,` 추가.

- [ ] **Step 4: `taxonomyMessages.ts` 생성(번들 격리)**

`src/shared/i18n/taxonomyMessages.ts`:

```ts
import { taxonomy as en } from "./messages/en/taxonomy";
import { taxonomy as ja } from "./messages/ja/taxonomy";
import { taxonomy as ko } from "./messages/ko/taxonomy";
import type { Locale, TaxonomyDict } from "./types";

export const taxonomyMessages: Record<Locale, TaxonomyDict> = { ko, ja, en };
```

- [ ] **Step 5: 타입 체크**

Run: `npx tsc --noEmit`
Expected: PASS (누락 키 있으면 여기서 잡힘).

- [ ] **Step 6: Commit**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ko/taxonomy.ts src/shared/i18n/messages/ja/taxonomy.ts src/shared/i18n/messages/en/taxonomy.ts src/shared/i18n/messages/ko/index.ts src/shared/i18n/messages/ja/index.ts src/shared/i18n/messages/en/index.ts src/shared/i18n/taxonomyMessages.ts
git commit -m "feat(i18n): taxonomy dict scaffold with recipeType domain" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko/taxonomy.ts src/shared/i18n/messages/ja/taxonomy.ts src/shared/i18n/messages/en/taxonomy.ts src/shared/i18n/messages/ko/index.ts src/shared/i18n/messages/ja/index.ts src/shared/i18n/messages/en/index.ts src/shared/i18n/taxonomyMessages.ts
```

---

## Task 2: 리졸버 + 훅 (T-04) — foundation 메커니즘

**Files:**
- Create: `src/shared/i18n/taxonomyLabel.ts`
- Create: `src/shared/i18n/__tests__/taxonomyLabel.test.ts`
- Create: `src/shared/i18n/useTaxonomy.ts`

- [ ] **Step 1: 실패 테스트 작성 (T-04)**

`src/shared/i18n/__tests__/taxonomyLabel.test.ts`:

```ts
import { taxonomyLabel, localizeTaxonomy } from "../taxonomyLabel";
import { taxonomyMessages } from "../taxonomyMessages";

const ja = taxonomyMessages.ja;
const ko = taxonomyMessages.ko;

describe("taxonomyLabel (code in hand)", () => {
  it("코드→locale 라벨을 반환한다", () => {
    expect(taxonomyLabel("USER", "recipeType", ja)).toBe(ja.recipeType.USER);
  });
  it("ko 사전이면 한글 라벨을 반환한다", () => {
    expect(taxonomyLabel("USER", "recipeType", ko)).toBe("사용자 레시피");
  });
  it("미지원 코드는 코드 자체로 fallback(throw 안 함)", () => {
    expect(taxonomyLabel("ZZZ", "recipeType", ja)).toBe("ZZZ");
  });
});

describe("localizeTaxonomy (ko canonical in hand)", () => {
  it("ko 라벨을 코드 경유로 locale 라벨로 변환", () => {
    // recipeType은 코드=값 도메인이 아니므로 reverse-map 도메인(S2에서 확장)으로 검증 예정.
    // 지금은 recipeType만 있으므로 ko passthrough만 확인.
    expect(localizeTaxonomy("사용자 레시피", "recipeType", ko)).toBe("사용자 레시피");
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx jest src/shared/i18n/__tests__/taxonomyLabel.test.ts --watchAll=false`
Expected: FAIL ("Cannot find module '../taxonomyLabel'").

- [ ] **Step 3: 리졸버 구현**

`src/shared/i18n/taxonomyLabel.ts`:

```ts
import {
  DISH_TYPE_CODES,
  INGREDIENT_CATEGORY_CODES,
  SORT_TYPE_CODES,
  TAG_CODES,
} from "@/shared/config/constants/recipe";

import type { TaxonomyDict } from "./types";

export type TaxonomyDomain = keyof TaxonomyDict;

const KO_TO_CODE: Partial<Record<TaxonomyDomain, Record<string, unknown>>> = {
  sort: SORT_TYPE_CODES,
  dishType: DISH_TYPE_CODES,
  tags: TAG_CODES,
  ingredientCategory: INGREDIENT_CATEGORY_CODES,
};

export const taxonomyLabel = (
  code: string,
  domain: TaxonomyDomain,
  dict: TaxonomyDict
): string => {
  const table = dict[domain] as Record<string, string>;
  return table[code] ?? code;
};

export const localizeTaxonomy = (
  koValue: string,
  domain: TaxonomyDomain,
  dict: TaxonomyDict
): string => {
  const reverse = KO_TO_CODE[domain];
  const code = reverse ? String(reverse[koValue] ?? koValue) : koValue;
  const table = dict[domain] as Record<string, string>;
  return table[code] ?? koValue;
};
```

> 주의: `DISH_TYPE_CODES["전체"]` 는 `null` → `String(null)` = "null". `dishType` 사전에 `전체`는 코드 키 대신 별도 처리(S2 Task에서 dishType 사전 키를 코드로 두되 "전체"는 `"ALL"` 코드로 매핑하는 보정 포함). recipeType만 있는 현재 Task에서는 미발현.

- [ ] **Step 4: 통과 확인**

Run: `npx jest src/shared/i18n/__tests__/taxonomyLabel.test.ts --watchAll=false`
Expected: PASS.

- [ ] **Step 5: 훅 작성**

`src/shared/i18n/useTaxonomy.ts`:

```ts
"use client";

import { usePathname } from "next/navigation";

import { resolveChromeLocale } from "./resolveChromeLocale";
import { localizeTaxonomy, taxonomyLabel, type TaxonomyDomain } from "./taxonomyLabel";
import { taxonomyMessages } from "./taxonomyMessages";

export const useTaxonomy = () => {
  const dict = taxonomyMessages[resolveChromeLocale(usePathname() ?? "/")];
  return {
    dict,
    label: (code: string, domain: TaxonomyDomain) =>
      taxonomyLabel(code, domain, dict),
    localize: (koValue: string, domain: TaxonomyDomain) =>
      localizeTaxonomy(koValue, domain, dict),
  };
};
```

- [ ] **Step 6: 타입체크 + Commit**

Run: `npx tsc --noEmit` → PASS

```bash
git add src/shared/i18n/taxonomyLabel.ts src/shared/i18n/__tests__/taxonomyLabel.test.ts src/shared/i18n/useTaxonomy.ts
git commit -m "feat(i18n): taxonomy resolver + useTaxonomy hook (T-04)" -- src/shared/i18n/taxonomyLabel.ts src/shared/i18n/__tests__/taxonomyLabel.test.ts src/shared/i18n/useTaxonomy.ts
```

---

## Task 3: RecipeTypeSelector 현지화 (S1 — T-01/02/03)

**Files:**
- Modify: `src/features/recipe-search/ui/RecipeTypeSelector.tsx`
- Create: `src/features/recipe-search/ui/__tests__/RecipeTypeSelector.i18n.test.tsx`

- [ ] **Step 1: 실패 테스트 (T-01/02/03)**

`__tests__/RecipeTypeSelector.i18n.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import { RecipeTypeSelector } from "../RecipeTypeSelector";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const NOOP = () => {};
const EMPTY: string[] = [];

describe("RecipeTypeSelector i18n", () => {
  it("T-01: /ja에서 USER 라벨이 ja 사전값", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    render(<RecipeTypeSelector selectedTypes={EMPTY} onTypesChange={NOOP} />);
    expect(screen.getByText(taxonomyMessages.ja.recipeType.USER)).toBeInTheDocument();
    expect(screen.queryByText("사용자 레시피")).not.toBeInTheDocument();
  });

  it("T-02: ko에서 한글 라벨 유지", () => {
    mockPathname.mockReturnValue("/search/results");
    render(<RecipeTypeSelector selectedTypes={EMPTY} onTypesChange={NOOP} />);
    expect(screen.getByText("사용자 레시피")).toBeInTheDocument();
  });

  it("T-03: /ja에서 클릭해도 코드 USER가 전달된다", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    const onChange = jest.fn();
    render(<RecipeTypeSelector selectedTypes={EMPTY} onTypesChange={onChange} />);
    fireEvent.click(screen.getByText(taxonomyMessages.ja.recipeType.USER));
    expect(onChange).toHaveBeenCalledWith(["USER"]);
  });
});
```

- [ ] **Step 2: 실패 확인** — Run: `npx jest src/features/recipe-search/ui/__tests__/RecipeTypeSelector.i18n.test.tsx --watchAll=false` → FAIL

- [ ] **Step 3: 컴포넌트 수정**

`RecipeTypeSelector.tsx`에서 `RECIPE_TYPES`의 `label` 필드를 제거하고 표시를 훅으로 대체. 상단에 `import { useTaxonomy } from "@/shared/i18n/useTaxonomy";`. `RECIPE_TYPES` 배열은 `{ value, badge }`만 남기고, 컴포넌트 본문에서:

```tsx
const { label } = useTaxonomy();
// ...
<span className="...">{label(value, "recipeType")}</span>
```

(기존 `label` 상수 표시 줄을 `{label(value, "recipeType")}`로 교체. `value`는 이미 `"USER"|"AI"|"YOUTUBE"` 코드.)

- [ ] **Step 4: 통과 확인** — Run: 위 jest 명령 → PASS

- [ ] **Step 5: 타입체크 + Commit**

Run: `npx tsc --noEmit` → PASS

```bash
git add src/features/recipe-search/ui/RecipeTypeSelector.tsx src/features/recipe-search/ui/__tests__/RecipeTypeSelector.i18n.test.tsx
git commit -m "feat(i18n): localize recipe-type filter labels (T-01/02/03)" -- src/features/recipe-search/ui/RecipeTypeSelector.tsx src/features/recipe-search/ui/__tests__/RecipeTypeSelector.i18n.test.tsx
```

---

## Task 4: 택소노미 사전 확장 (sort·dishType·tags·ingredientCategory·nutrition) — S2 foundation

S2~S4가 쓸 도메인을 taxonomy 사전에 추가한다. 키는 **코드**. `전체`는 `"ALL"` 가상 코드로 통일(reverse map의 `null`/`""` 보정).

**Files:**
- Modify: `src/shared/i18n/types.ts`, `messages/{ko,ja,en}/taxonomy.ts`, `src/shared/i18n/taxonomyLabel.ts`

- [ ] **Step 1: `TaxonomyDict` 확장**

```ts
import type {
  NutritionFilterKey,
  NutritionThemeKey,
  TagCode,
} from "@/shared/config/constants/recipe";

export type TaxonomyDict = {
  recipeType: Record<"USER" | "AI" | "YOUTUBE", string>;
  sort: Record<"popularityScore,DESC" | "createdAt,DESC" | "createdAt,ASC", string>;
  dishType: Record<string, string>;          // code 키 + "ALL"
  tags: Record<TagCode, string>;
  ingredientCategory: Record<string, string>; // code 키 + "ALL"
  nutritionTheme: Record<NutritionThemeKey, string>;
  nutritionLabel: Record<NutritionFilterKey, string>;
};
```

- [ ] **Step 2: ko 사전 값 채우기(기존 한글 상수 그대로 lift)**

`messages/ko/taxonomy.ts`에 도메인 추가. 값 출처(그대로 복사):
- `sort`: popularityScore,DESC="인기순" / createdAt,DESC="최신순" / createdAt,ASC="오래된순"
- `dishType`: `DISH_TYPE_CODES` 역방향(FRYING="볶음"…) + `ALL="전체"`
- `tags`: `TAGS_BY_CODE[code].name` (CHEF_RECIPE="셰프 레시피"…)
- `ingredientCategory`: `INGREDIENT_CATEGORY_CODES` 역방향(meat="고기"…) + `ALL="전체"`
- `nutritionTheme`: `NUTRITION_THEMES[key].label` (KETO="키토"…)
- `nutritionLabel`: `NUTRITION_RANGES[key].label` (cost="재료비", calories="칼로리"…)

- [ ] **Step 3: ja/en 사전 값**

ja/en `taxonomy.ts`에 동일 키, ja-pm/en-pm 페르소나로 번역(요리·식문화 용어 자연스럽게). 구조 계약 준수.

- [ ] **Step 4: 리졸버 `전체`/`null` 보정**

`taxonomyLabel.ts`의 `localizeTaxonomy`에서 dishType/ingredientCategory의 ko `"전체"`는 코드가 `null`/`""`이므로 `"ALL"`로 매핑:

```ts
export const localizeTaxonomy = (koValue, domain, dict) => {
  const reverse = KO_TO_CODE[domain];
  let code = reverse ? reverse[koValue] : koValue;
  if (code === null || code === "" || code === undefined) {
    code = koValue === "전체" ? "ALL" : koValue;
  }
  const table = dict[domain] as Record<string, string>;
  return table[String(code)] ?? koValue;
};
```

- [ ] **Step 5: 리졸버 테스트 확장 (T-04 보강)**

`taxonomyLabel.test.ts`에 추가:

```ts
it("ko 라벨(태그) → ja 라벨", () => {
  expect(localizeTaxonomy("야식", "tags", taxonomyMessages.ja))
    .toBe(taxonomyMessages.ja.tags.LATE_NIGHT);
});
it("ko locale 태그는 입력 그대로", () => {
  expect(localizeTaxonomy("야식", "tags", taxonomyMessages.ko)).toBe("야식");
});
it("전체는 ALL 코드로 매핑", () => {
  expect(localizeTaxonomy("전체", "dishType", taxonomyMessages.ja))
    .toBe(taxonomyMessages.ja.dishType.ALL);
});
it("미지원 ko 라벨은 입력 그대로 fallback", () => {
  expect(localizeTaxonomy("없는라벨", "tags", taxonomyMessages.ja)).toBe("없는라벨");
});
```

- [ ] **Step 6: 테스트 + 타입체크 + Commit**

Run: `npx jest src/shared/i18n/__tests__/taxonomyLabel.test.ts --watchAll=false` → PASS
Run: `npx tsc --noEmit` → PASS

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ko/taxonomy.ts src/shared/i18n/messages/ja/taxonomy.ts src/shared/i18n/messages/en/taxonomy.ts src/shared/i18n/taxonomyLabel.ts src/shared/i18n/__tests__/taxonomyLabel.test.ts
git commit -m "feat(i18n): extend taxonomy dict (sort/dish/tags/ingredient/nutrition) (T-04)" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko/taxonomy.ts src/shared/i18n/messages/ja/taxonomy.ts src/shared/i18n/messages/en/taxonomy.ts src/shared/i18n/taxonomyLabel.ts src/shared/i18n/__tests__/taxonomyLabel.test.ts
```

---

## Task 5: 검색 필터 라벨 현지화 + 재료비 숨김 (S2 — T-05/06/07/08/09)

표시 라벨을 `localize`로 감싼다. 상태·코드 매핑은 불변.

**Files (수정):**
- `src/features/filter-sort/ui/SortFilter.tsx` — `FilterChip header={sort}` → `header={localize(sort, "sort")}`, `isDirty`는 ko canonical 비교 유지(`sort !== "인기순"`).
- `src/features/filter-dish-type/ui/DishTypeFilter.tsx` — `header={dishType}` → `header={localize(dishType, "dishType")}`, `isDirty={dishType !== "전체"}` 유지.
- `src/features/filter-tags/...` (TagsFilter) — 표시 칩 라벨을 `localize(name, "tags")`로. 선택 코드 매핑 불변.
- `src/widgets/CategoryPicker/CategoryItem.tsx` — 드로어 항목 표시 라벨에 도메인별 `localize` 적용(트리거가 넘기는 `availableValues`는 ko canonical 유지). **주의:** CategoryPicker는 sort/dishType/tags 공용 → 표시만 변환하고 `setValue`는 ko canonical 그대로 emit해야 기존 코드 매핑이 안 깨짐.
- 드로어 헤더/설명: `BASE_DRAWER_CONFIGS`의 한글(`정렬 방식 선택` 등)은 표시 시 chrome로 변환 필요 → `DRAWER_HEADERS`를 코드 키로 `taxonomy`가 아닌 **새 chrome**으로 다루기보다, 본 Task 범위에선 드로어 헤더도 taxonomy 사전에 `drawerHeader` 작은 맵으로 추가하거나 `searchDiscovery`류 chrome 훅 사용. → **결정:** 드로어 헤더/설명은 `recipeCreate`/`category`와 무관하므로 `taxonomy` 사전에 `drawer: { sortHeader, dishTypeHeader, tagsHeader, ... }` 추가하고 CategoryPicker 트리거 호출부에서 변환.
- `src/features/recipe-search/ui/NutritionSliders.tsx` — `cost` 슬라이더를 `locale !== "ko"`일 때 렌더 제외. locale은 `useTaxonomy().dict`가 아니라 `resolveChromeLocale(usePathname())` 직접 사용 또는 `useChromeLocale()`.

- [ ] **Step 1: 실패 테스트 (T-05~09)**

`src/widgets/SearchClient/ui/__tests__/SearchFilters.i18n.test.tsx`(스캔 T-05) + 각 필터 단위 테스트. 예 — SortFilter:

```tsx
// T-06: /ja 정렬 칩은 ja 라벨, 상태/코드는 불변
import { render, screen } from "@testing-library/react";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";
import { SortFilter } from "../SortFilter";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
// useSortFilter가 기본 "인기순" 반환 가정
it("T-06: /ja 정렬 칩이 ja 사전값", () => {
  mockPathname.mockReturnValue("/ja/search/results");
  render(<SortFilter />);
  expect(screen.getByText(taxonomyMessages.ja.sort["popularityScore,DESC"]))
    .toBeInTheDocument();
});
```

재료비 숨김(T-08):

```tsx
// NutritionSliders: /ja에 cost 라벨 부재, ko에 존재
it("T-08: /ja 영양 슬라이더에 재료비 없음", () => {
  mockPathname.mockReturnValue("/ja/search/results");
  render(<NutritionSliders values={BASE_VALUES} onValueChange={NOOP} />);
  expect(screen.queryByText(taxonomyMessages.ja.nutritionLabel.cost)).not.toBeInTheDocument();
  expect(screen.getByText(taxonomyMessages.ja.nutritionLabel.calories)).toBeInTheDocument();
});
it("T-08b: ko 영양 슬라이더에 재료비 존재", () => {
  mockPathname.mockReturnValue("/search/results");
  render(<NutritionSliders values={BASE_VALUES} onValueChange={NOOP} />);
  expect(screen.getByText("재료비")).toBeInTheDocument();
});
```

(`BASE_VALUES`·`NOOP`은 파일 상단 상수로 추출 — 인라인 리터럴 금지.)

- [ ] **Step 2: 실패 확인** — 각 jest 파일 → FAIL

- [ ] **Step 3: 구현** — 위 File 목록대로 표시 라벨을 `localize(...)`로 감싸고, NutritionSliders에서 cost를 locale 가드로 제외. 각 컴포넌트 상단에 `useTaxonomy` 또는 `useChromeLocale` import.

- [ ] **Step 4: 통과 확인** — 각 jest → PASS

- [ ] **Step 5: 타입체크 + Commit** — `npx tsc --noEmit` → PASS

```bash
git commit -m "feat(i18n): localize search filter labels, hide cost in ja/en (T-05~09)" -- <위 수정/테스트 파일들>
```

---

## Task 6: 카테고리 칩 CategoryTabs 현지화 (S3 — T-10/11/12)

CategoryTabs는 이미 `/ja /en` 홈에서 렌더된다(`app/{ja,en}/page.tsx`). 내부 `CateGoryItem`의 표시 이름·링크만 현지화.

**Files:**
- Modify: `src/widgets/CategoryTabs/CateGoryItem.tsx` — 표시 `name`을 `label(code, "tags")`로(현재 `name` prop은 ko). `id`/`code`로 라벨 해석하려면 `CategoryTabs/index.tsx`가 `item.code`도 넘기게 수정. 링크 href를 `localizedHref(/recipes/category/${code}, locale)`로.
- Modify: `src/widgets/CategoryTabs/index.tsx` — `CateGoryItem`에 `code={item.code}` 전달.
- Create: `src/widgets/CategoryTabs/__tests__/CategoryTabs.i18n.test.tsx` (기존 동명 테스트 있으면 케이스 추가).

- [ ] **Step 1: 실패 테스트 (T-10/11/12)** — `/ja` 렌더 시 대표 칩 = `taxonomyMessages.ja.tags.CHEF_RECIPE`, href=`/ja/recipes/category/CHEF_RECIPE`; ko 렌더 시 한글 + `/recipes/category/CHEF_RECIPE`. no-Hangul 스캔.
- [ ] **Step 2~5:** 실패 확인 → 구현(`useTaxonomy().label` + `localizedHref` import from `@/shared/i18n`) → 통과 → `npx tsc --noEmit` → Commit `feat(i18n): localize category tab chips + sticky links (T-10/11/12)`.

---

## Task 7: 재료 카테고리 탭 현지화 (S4 — T-13/14/15)

**Files:**
- Modify: `src/features/filter-ingredients/ui/IngredientCategoryTabs.tsx` — 표시 `{category}` → `{localize(category, "ingredientCategory")}`. `selected === category` 비교·`onSelect(category)`는 ko canonical 그대로(불변).
- Create: `__tests__/IngredientCategoryTabs.i18n.test.tsx`.

- [ ] **Step 1: 실패 테스트 (T-13/14/15)** — `/ja` 대표 탭("고기") = `taxonomyMessages.ja.ingredientCategory.meat`; 클릭 시 `onSelect("고기")`(ko canonical); no-Hangul 스캔; ko 앵커. 상수 `INGREDIENT_PROPS` 추출.
- [ ] **Step 2~5:** 실패 → 구현(`useTaxonomy().localize`) → 통과 → 타입체크 → Commit `feat(i18n): localize ingredient category tabs (T-13/14/15)`.

---

## Task 8: 프로필 편집 `/users/edit` 와이어 + 미러 라우트 (S5 — T-16~21)

`userPages.profile.edit` 사전은 **이미 ko/ja/en 작성 완료**. 컴포넌트 와이어 + 라우트만.

**Files:**
- Modify: `src/app/users/edit/page.tsx` — 하드코딩 한글을 `useUserPagesDict().profile.edit`로 교체. `{max}` 치환은 `format(dict.nicknameTooLong, { max: MAX_NICKNAME_LENGTH })`(`format` from `@/shared/i18n`).
- Create: `src/app/ja/users/edit/page.tsx`, `src/app/en/users/edit/page.tsx` — 루트 페이지 재노출 래퍼.
- Create: `src/app/users/edit/__tests__/UserEdit.i18n.test.tsx`.

- [ ] **Step 1: 실패 테스트 (T-16~21)**

핵심 케이스(각 1개):
- T-16: `/ja` 렌더 → 헤더/라벨/placeholder = `dict.ja...edit.*`, no-Hangul 스캔.
- T-17: 닉네임 빈값 blur → `dict.ja...nicknameRequired`; 13자 초과 → `format(dict.ja...nicknameTooLong,{max:12})`.
- T-18: `image/gif` 업로드 → `dict.ja...imageFormatError`.
- T-19: apiClient 모킹 code 102 → 필드 에러; 기타 실패 → toast `dict.ja...updateError`. (실제 mutation 훅 사용 — `apiClient` 경계만 모킹.)
- T-20: 닉네임 `"홍길동"` 초기값이 `/ja`에서도 그대로 렌더(자유텍스트 불변).
- T-21: ko 렌더 → 한글 chrome 앵커.

`useUserStore`/`useToastStore`는 자기 모듈이므로 모킹 대신 실제 store에 초기값 주입(테스트 setup). 네트워크는 `@/shared/api/client` 모킹.

- [ ] **Step 2: 실패 확인** → FAIL
- [ ] **Step 3: 와이어 구현** — `useUserPagesDict` import, 11개 하드코딩 문자열 교체, `format` 사용. 래퍼 라우트 2개 생성(루트 page 컴포넌트 재export):

```tsx
// src/app/ja/users/edit/page.tsx
export { default } from "@/app/users/edit/page";
```

> 단, 루트 `page.tsx`가 `"use client"`라 직접 재export 가능. 불가 시 동일 트리 렌더 래퍼로.

- [ ] **Step 4: 통과 확인** → PASS
- [ ] **Step 5: 타입체크 + Commit** — `npx tsc --noEmit` → PASS

```bash
git commit -m "feat(i18n): wire /users/edit to userPages dict + ja/en routes (T-16~21)" -- src/app/users/edit/page.tsx src/app/ja/users/edit/page.tsx src/app/en/users/edit/page.tsx src/app/users/edit/__tests__/UserEdit.i18n.test.tsx
```

---

## Task 9: 생성 허브 `/recipes/new` + manual 현지화 (S6 — T-22~25)

**Files:**
- Modify: `src/shared/i18n/types.ts` — `RecipeCreateDict` 추가 + `Dictionary`에 `recipeCreate`.
- Create: `src/shared/i18n/messages/{ko,ja,en}/recipeCreate.ts` + 세 `index.ts` 합류.
- Modify: `src/features/recipe-import-youtube/ui/CreationModeSelector.tsx` — `locale` prop 받아 `getDictionary(locale).recipeCreate` 사용, `Link` href를 `localizedHref(..., locale)`로. (서버 컴포넌트.)
- Modify: `src/app/recipes/new/page.tsx` — `<CreationModeSelector locale="ko" />`.
- Create: `src/app/{ja,en}/recipes/new/page.tsx` — `<CreationModeSelector locale="ja|en" />` + `BottomAnchorAdSlot`.
- Modify: `src/app/recipes/new/manual/page.tsx` + create `src/app/{ja,en}/recipes/new/manual/page.tsx` — manual chrome 현지화(파일 읽고 하드코딩 한글을 `recipeCreate.manual.*`로).
- Create: 테스트 `__tests__/CreationModeSelector.i18n.test.tsx`.

`RecipeCreateDict` 최소 형태:

```ts
export type RecipeCreateDict = {
  hubTitle: string;
  hubSubtitle: string;
  manualCardTitle: string;
  manualCardBody: string;
  manualCardImageAlt: string;
  youtubeCardTitle: string;
  youtubeCardBody: string;
  youtubeCardImageAlt: string;
  manual: {
    // manual/page.tsx 읽고 실제 키 채움
    [k: string]: string;
  };
};
```

- [ ] **Step 1: 실패 테스트 (T-22~25)** — 허브를 `locale="ja"`로 렌더(서버 컴포넌트는 RTL `render`로 직접) → 제목/카드/alt = ja 사전, 카드 href `/ja/recipes/new/manual`·`/ja/recipes/new/youtube`, no-Hangul; ko 앵커. manual 렌더 스캔.
- [ ] **Step 2~5:** 실패 → 사전 작성(ko lift + ja/en 페르소나) → 컴포넌트 locale prop화 + 래퍼 라우트 → 통과 → `npx tsc --noEmit` → Commit `feat(i18n): localize /recipes/new hub + manual + ja/en routes (T-22~25)`.

---

## Task 10: 카테고리 상세 `/recipes/category/[id]` 현지화 (S7 — T-26~32)

가장 큰 슬라이스. chrome + 택소노미 라벨 + 데이터 lang + 메타/hreflang/noindex.

**Files:**
- Modify: `src/shared/i18n/types.ts` — `CategoryDict` + `Dictionary.category`.
- Create: `messages/{ko,ja,en}/category.ts` + index 합류.
- Modify: `src/app/recipes/category/[id]/page.tsx` — `locale` 인지 버전 분리(루트=ko). 데이터 호출 `getRecipesOnServer({..., lang})`. `generateMetadata`를 locale 분기(ja/en: 현지화 템플릿, hreflang via `buildHreflangAlternates`, `robots.index=false`, CHEF 셀럽 키워드 제외). JSON-LD `inLanguage`.
- Create: `src/app/{ja,en}/recipes/category/[id]/page.tsx` — locale 넘기는 래퍼 + 자체 `generateMetadata(locale)`.
- Modify: `CategoryDetailClient.tsx` + `components/{CategoryHero,CategoryChips,CategoryCount,CategoryEmptyState}.tsx` — chrome/라벨을 `useTaxonomy().label`(tagCode→라벨) + `category` chrome 훅으로. queryKey에 locale 추가(`["recipes", tagCode, sortParam, locale]`). `getRecipeItems`에 lang 전파.
- Create: 테스트 — 렌더 스캔(T-26) + `generateMetadata` unit(T-29/30/31) + queryKey unit(T-28) + 데이터 lang(T-27, network mock) + ko 앵커(T-32).

> **데이터 lang 출처:** 서버 컴포넌트는 route locale(`"ja"`), 클라이언트(`CategoryDetailClient`)는 `resolveChromeLocale(usePathname())`로 `getRecipeItems` lang 전파. `useApiLocale` 패턴(create-flows-data) 있으면 재사용.
> **noindex 결정:** availableLocales 미도착 → ja/en `robots:{index:false}`. ko는 기존 `index:true` 유지.

- [ ] **Step 1: 실패 테스트 (T-26~32)** — 분리된 케이스로:
  - T-29: `import { generateMetadata } from ".../ja/recipes/category/[id]/page"`(또는 locale 인자 헬퍼) → ja title이 ko "모음" 미포함, `alternates.languages` 존재, robots.index false.
  - T-30: ja CHEF_RECIPE keywords에 "흑백요리사"·"안성재" 없음.
  - T-28: `buildCategoryQueryKey(code, sort, "ja") !== (..., "ko")`(순수 함수로 추출).
  - T-27: ja 라우트 데이터 경로가 `getRecipesOnServer`/`getRecipeItems`를 `lang:"ja"`로 호출(network mock 인자 검증).
  - T-26: `/ja` CategoryDetailClient 렌더 → chrome/라벨 ja, no-Hangul.
  - T-32: ko 메타/렌더 앵커(CHEF 특수 카피 유지).
- [ ] **Step 2: 실패 확인** → FAIL
- [ ] **Step 3: 구현** — queryKey 순수 함수 추출 → 메타 locale 분기 → chrome 사전 + 택소노미 라벨 적용 → 데이터 lang 전파 → 래퍼 라우트.
- [ ] **Step 4: 통과 확인** → PASS
- [ ] **Step 5: 타입체크 + Commit**

```bash
git commit -m "feat(i18n): localize /recipes/category detail (chrome+data+SEO) (T-26~32)" -- <파일들>
```

---

## Task 11: 마무리 — 전체 타입체크 + 상태 보드 갱신

- [ ] **Step 1:** `npx tsc --noEmit` → PASS
- [ ] **Step 2:** 변경 테스트 전부 재실행: `npx jest src/shared/i18n src/features/recipe-search src/features/filter-sort src/features/filter-dish-type src/features/filter-ingredients src/widgets/CategoryTabs src/app/users/edit src/features/recipe-import-youtube src/app/recipes/category --watchAll=false`
- [ ] **Step 3:** `I18N-STATUS.md` §3 행 갱신: 생성 허브·프로필 편집·카테고리(칩/요리유형/상세)·재료 카테고리·검색 필터 → 🟢, §6에 작업 로그 1줄(날짜/담당/요약) append.
- [ ] **Step 4: Commit** `docs(i18n): mark taxonomy + create/profile pages done on status board`
- [ ] **Step 5:** (사용자) dev `:3000`에서 `/ja`·`/en` 4표면 수동 카피 검증 — §7 보드에 기록.

---

## Self-Review (작성자 체크 완료)

- **추적성:** T-01~32 전부 Task 3~10에 failing test로 매핑. T-04(리졸버)=Task2/4, S1=Task3, S2=Task5, S3=Task6, S4=Task7, S5=Task8, S6=Task9, S7=Task10. 누락 없음.
- **Non-goals:** 공개프로필/북/캘린더, AI추출 본문데이터, 접근법B, 자동리다이렉트, 재료명 데이터, ai/* chrome → 테스트·Task 없음(의도적).
- **타입 일관성:** `taxonomyLabel(code,domain,dict)`/`localizeTaxonomy(koValue,domain,dict)`/`useTaxonomy().{label,localize,dict}` 전 Task 동일 시그니처. `TaxonomyDomain = keyof TaxonomyDict`.
- **placeholder:** ja/en 사전 값은 "페르소나로 작성"이 유일한 위임(코드 아님, 번역 산출물). 테스트는 사전 값 참조라 카피 미확정에도 통과. 그 외 placeholder 없음.
- **읽기 필요(실행자):** Task5의 TagsFilter/CategoryPicker 내부, Task9 manual/page.tsx, Task10 Category 서브컴포넌트는 실행 시 파일 read 후 동일 패턴 적용(타깃 표현·도메인 명시됨).
