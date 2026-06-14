# 냉장고 재료 추가 i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/ingredients/new`(재료 추가) 페이지 전체를 ja/en 현지화하고 my-fridge의 조리시간 단위·빈상태 CTA를 마감한다.

**Architecture:** 기존 i18n 인프라(자가판정 사전 훅 + 표시 전용 오버레이) 답습. 페이지 본문을 `IngredientAddView` 위젯으로 추출해 ko/ja/en 3라우트가 공유. chrome는 신규 `ingredientAdd` 타입드 사전, 팩 이름/설명·재료명은 ko canonical 불변의 표시 전용 오버레이. 데이터 fetch는 이미 `lang` 전파 중이라 무변경.

**Tech Stack:** Next.js 15 App Router, TypeScript, FSD, TanStack Query, Jest + RTL, Radix.

**테스트 설계 매트릭스:** `docs/superpowers/specs/2026-06-14-fridge-ingredient-add-i18n-test-design.md` (T-01..T-24)

**Bash 규칙:** bare command (`npx jest ...`, `npx tsc --noEmit`). `cd && ` 접두사 금지.
**브랜치:** `feature/17` 위에서만. checkout/switch/branch 금지.

---

## File Structure

**생성:**
- `src/shared/i18n/messages/{ko,ja,en}/ingredientAdd.ts` — chrome 사전 3개
- `src/shared/i18n/ingredientAddMessages.ts` — `Record<Locale, IngredientAddDict>`
- `src/shared/i18n/useIngredientAddDict.ts` — 자가판정 훅
- `src/shared/i18n/ingredientPackMeta.ts` — 팩 이름/설명 오버레이 + `localizePack`
- `src/shared/i18n/ingredientNameOverlay.ts` — id→재료명 오버레이 + `localizeIngredientName`
- `src/widgets/IngredientAddPage/ui/IngredientAddView.tsx` — 추출된 페이지 본문
- `src/widgets/IngredientAddPage/index.ts` — barrel
- `src/app/ja/ingredients/new/page.tsx`, `src/app/en/ingredients/new/page.tsx` — 래퍼
- 테스트: `IngredientAddView.i18n.test.tsx`, `IngredientSearchDrawer.i18n.test.tsx`,
  `IngredientPackCard.i18n.test.tsx`, `IngredientPackDetailDrawer.i18n.test.tsx`,
  `localizePack.test.ts`, `localizeIngredientName.test.ts`,
  `MyFridgeRecipeCard.i18n.test.tsx`, `MyFridgeEmptyState.cta.test.tsx`

**수정:**
- `src/shared/i18n/types.ts` — `IngredientAddDict` + `Dictionary.ingredientAdd` + `FridgeDict.cookTimeMinutes`
- `src/shared/i18n/messages/{ko,ja,en}/index.ts` — `ingredientAdd` 추가
- `src/shared/i18n/messages/{ko,ja,en}/fridge.ts` — `cookTimeMinutes` 추가
- `src/shared/i18n/index.ts` — `useIngredientAddDict`, 오버레이 export
- `src/app/ingredients/new/page.tsx` — `IngredientAddView` 렌더
- `src/features/ingredient-add-fridge/ui/IngredientSearchDrawer.tsx` — 사전 + 택소노미
- `src/widgets/IngredientPackCard/IngredientPackCard.tsx` — 사전 + 팩 오버레이
- `src/features/ingredient-add-fridge/ui/IngredientPackDetailDrawer.tsx` — 사전 + 오버레이
- `src/widgets/MyFridgeRecipes/ui/MyFridgeRecipeCard.tsx` — `cookTimeMinutes`
- `src/widgets/MyFridgeRecipes/ui/MyFridgeEmptyState.tsx` — `LocalizedLink`

---

## Task 1: `IngredientAddView` 위젯 추출 (Slice 1 walking skeleton, T-03)

**Files:**
- Create: `src/widgets/IngredientAddPage/ui/IngredientAddView.tsx`
- Create: `src/widgets/IngredientAddPage/index.ts`
- Create: `src/widgets/IngredientAddPage/ui/__tests__/IngredientAddView.i18n.test.tsx`
- Modify: `src/app/ingredients/new/page.tsx`

- [ ] **Step 1: Write the failing test (T-03 ko 앵커)**

`src/widgets/IngredientAddPage/ui/__tests__/IngredientAddView.i18n.test.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { ingredientAddMessages } from "@/shared/i18n/ingredientAddMessages";

import { IngredientAddView } from "../IngredientAddView";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
jest.mock("@/shared/lib/hooks/useMediaQuery", () => ({
  useMediaQuery: () => false,
}));
jest.mock("@/entities/ingredient", () => ({
  useMyIngredientIds: () => ({ ingredientIdsSet: new Set<string>() }),
}));
jest.mock("@/features/ingredient-add-fridge", () => ({
  useAddIngredientBulkMutation: () => ({ mutate: jest.fn(), isPending: false }),
}));
jest.mock("@/features/ingredient-delete-fridge", () => ({
  useDeleteIngredientBulkMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

const renderView = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <IngredientAddView />
    </QueryClientProvider>
  );

describe("IngredientAddView i18n", () => {
  it("ko에서 페이지 chrome가 한글 canonical로 표시된다 (T-03)", () => {
    mockPathname.mockReturnValue("/ingredients/new");
    renderView();
    expect(
      screen.getByRole("heading", { name: ingredientAddMessages.ko.pageTitle })
    ).toBeInTheDocument();
    expect(
      screen.getByText(ingredientAddMessages.ko.packsHeading)
    ).toBeInTheDocument();
    expect(
      screen.getByText(ingredientAddMessages.ko.packsSubtitle)
    ).toBeInTheDocument();
  });
});
```

> 참고: 이 테스트는 Task 2에서 만드는 `ingredientAddMessages`를 import하므로 Step 1
> 시점엔 두 모듈(`IngredientAddView`, `ingredientAddMessages`) 모두 없어 실패한다.
> Task 1에서 위젯을 추출하고 ko 사전을 같이 만든다(아래 Step 3).

- [ ] **Step 2: Run test, verify it fails**

Run: `npx jest src/widgets/IngredientAddPage --watchAll=false`
Expected: FAIL ("Cannot find module '../IngredientAddView'" 또는 ingredientAddMessages 없음)

- [ ] **Step 3: 위젯 추출 + ko 사전 최소본**

먼저 ko 사전 골격만 만든다 (ja/en은 Task 2). `src/shared/i18n/messages/ko/ingredientAdd.ts`:

```ts
import type { IngredientAddDict } from "../../types";

export const ingredientAdd: IngredientAddDict = {
  pageTitle: "재료 추가",
  searchEntry: "재료를 검색해서 추가하세요",
  searchEntryAria: "재료 검색해서 추가하기",
  packsHeading: "추천 재료 모음",
  packsSubtitle: "필요한 묶음을 골라 한 번에 추가하세요",
  drawerTitle: "재료 추가",
  drawerDescription: "냉장고에 추가할 재료를 검색하세요",
  searchPlaceholder: "재료를 검색해서 추가하세요",
  searchAria: "검색",
  searchAction: "검색",
  loading: "재료 로딩 중...",
  errorPrefix: "오류가 발생했어요. {message}",
  added: "추가됨",
  add: "추가",
  allLoaded: "모든 재료를 불러왔어요",
  noResults: '"{query}"에 해당하는 재료가 없어요',
  close: "닫기",
  packCountLabel: "· 총 {count}개",
  selectedCount: "{count}개 선택됨",
  selectAll: "전체 선택",
  deselectAll: "선택 해제",
  owned: "보유중",
  deleting: "삭제 중...",
  adding: "추가 중...",
  deleteCount: "{count}개 삭제하기",
  addCount: "{count}개 추가하기",
  cardOwned: "보유 중",
  cardCount: "재료 {count}개",
  cardDetailAria: "{name} 상세 보기",
};
```

`src/shared/i18n/types.ts` — `FridgeDict` 위(또는 근처)에 타입 추가:

```ts
export type IngredientAddDict = {
  pageTitle: string;
  searchEntry: string;
  searchEntryAria: string;
  packsHeading: string;
  packsSubtitle: string;
  drawerTitle: string;
  drawerDescription: string;
  searchPlaceholder: string;
  searchAria: string;
  searchAction: string;
  loading: string;
  errorPrefix: string;
  added: string;
  add: string;
  allLoaded: string;
  noResults: string;
  close: string;
  packCountLabel: string;
  selectedCount: string;
  selectAll: string;
  deselectAll: string;
  owned: string;
  deleting: string;
  adding: string;
  deleteCount: string;
  addCount: string;
  cardOwned: string;
  cardCount: string;
  cardDetailAria: string;
};
```

`Dictionary` 타입에 `ingredientAdd: IngredientAddDict;` 추가 (예: `fridge` 줄 아래).

`src/shared/i18n/ingredientAddMessages.ts` — 이 시점엔 ja/en 파일이 없으므로 임시로
ko를 3로케일에 매핑(Task 2에서 교체):

```ts
import { ingredientAdd as ko } from "./messages/ko/ingredientAdd";
import type { IngredientAddDict, Locale } from "./types";

export const ingredientAddMessages: Record<Locale, IngredientAddDict> = {
  ko,
  ja: ko,
  en: ko,
};
```

`src/shared/i18n/messages/ko/index.ts` — import 추가 후 `ko` 객체에 `ingredientAdd`
프로퍼티 추가. ja/en `index.ts`도 동일하게 ko 파일을 임시 참조(Task 2에서 교체):

ko/index.ts:
```ts
import { ingredientAdd } from "./ingredientAdd";
// ... ko 객체에 ingredientAdd 추가
```
ja/index.ts, en/index.ts:
```ts
import { ingredientAdd } from "../ko/ingredientAdd";
// ... 각 객체에 ingredientAdd 추가 (Task 2에서 자국어 파일로 교체)
```

이제 위젯 추출. `src/widgets/IngredientAddPage/ui/IngredientAddView.tsx` — 현재
`src/app/ingredients/new/page.tsx`의 컴포넌트 본문을 **그대로 이동**하되 이름을
`IngredientAddView`, named export로:

```tsx
"use client";

import { useState } from "react";

import { Search } from "lucide-react";

import {
  INGREDIENT_PACKS,
  type IngredientPack,
} from "@/shared/config/constants/ingredientPacks";
import { INGREDIENT_CATEGORIES } from "@/shared/config/constants/recipe";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { useMyIngredientIds } from "@/entities/ingredient";
import { IngredientPicker } from "@/entities/ingredient/ui/IngredientPicker";

import { useAddIngredientBulkMutation } from "@/features/ingredient-add-fridge";
import IngredientPackDetailDrawer from "@/features/ingredient-add-fridge/ui/IngredientPackDetailDrawer";
import IngredientSearchDrawer from "@/features/ingredient-add-fridge/ui/IngredientSearchDrawer";
import { useDeleteIngredientBulkMutation } from "@/features/ingredient-delete-fridge";

import IngredientPackCard from "@/widgets/IngredientPackCard/IngredientPackCard";

export const IngredientAddView = () => {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<IngredientPack | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { ingredientIdsSet } = useMyIngredientIds();
  const { mutate: addIngredientBulk, isPending: isAdding } =
    useAddIngredientBulkMutation();
  const { mutate: deleteIngredientBulk, isPending: isDeleting } =
    useDeleteIngredientBulkMutation();

  const isPending = isAdding || isDeleting;

  const handlePackViewDetail = (pack: IngredientPack) => {
    setSelectedPack(pack);
    setIsDetailDrawerOpen(true);
  };

  const handlePackAddSelected = (ingredientIds: string[]) => {
    addIngredientBulk(ingredientIds);
  };

  const handlePackDeleteSelected = (ingredientIds: string[]) => {
    deleteIngredientBulk(ingredientIds);
  };

  return (
    <Container padding={false}>
      <div className="bg-white pb-10">
        <header className="z-sticky sticky-optimized sticky top-0 grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-gray-100 bg-white px-4 py-3 md:px-6">
          <PrevButton />
          <h1 className="text-ink text-center text-base font-semibold">
            재료 추가
          </h1>
          <span className="w-9" aria-hidden="true" />
        </header>

        <div className="px-4 pt-4 pb-2 md:px-6">
          <button
            type="button"
            onClick={() => setIsSearchDrawerOpen(true)}
            aria-label="재료 검색해서 추가하기"
            className="flex w-full items-center gap-3 rounded-full bg-gray-100 px-4 py-3.5 text-left transition-colors active:bg-gray-200"
          >
            <Search size={18} className="text-ink-muted" aria-hidden="true" />
            <span className="text-ink-muted text-sm">
              재료를 검색해서 추가하세요
            </span>
          </button>
        </div>

        <div className="px-4 pt-6 md:px-6">
          <div className="mb-3">
            <h2 className="text-ink text-base font-bold">추천 재료 모음</h2>
            <p className="text-ink-muted mt-1 text-sm">
              필요한 묶음을 골라 한 번에 추가하세요
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-5 lg:grid-cols-3">
            {INGREDIENT_PACKS.map((pack) => (
              <IngredientPackCard
                key={pack.name + pack.description}
                pack={pack}
                onViewDetail={handlePackViewDetail}
                ownedIngredientIds={ingredientIdsSet}
              />
            ))}
          </div>
        </div>
      </div>

      {isMobile ? (
        <IngredientPicker
          open={isSearchDrawerOpen}
          onOpenChange={setIsSearchDrawerOpen}
          categories={INGREDIENT_CATEGORIES}
          queryConfig={{
            keyBase: "fridgeIngredients",
            getParams: (category) => ({
              category: category === "전체" ? null : category,
              isMine: false,
              isFridge: true,
            }),
          }}
          isAlreadyAdded={(ingredient) => ingredient.inFridge}
          onComplete={(items) => addIngredientBulk(items.map((i) => i.id))}
        />
      ) : (
        <IngredientSearchDrawer
          open={isSearchDrawerOpen}
          onOpenChange={setIsSearchDrawerOpen}
        />
      )}

      <IngredientPackDetailDrawer
        pack={selectedPack}
        open={isDetailDrawerOpen}
        onOpenChange={setIsDetailDrawerOpen}
        onAddSelected={handlePackAddSelected}
        onDeleteSelected={handlePackDeleteSelected}
        isLoading={isPending}
        ownedIngredientIds={ingredientIdsSet}
      />
    </Container>
  );
};
```

`src/widgets/IngredientAddPage/index.ts`:
```ts
export { IngredientAddView } from "./ui/IngredientAddView";
```

`src/app/ingredients/new/page.tsx` 전체 교체:
```tsx
import { IngredientAddView } from "@/widgets/IngredientAddPage";

const NewIngredientsPage = () => <IngredientAddView />;

export default NewIngredientsPage;
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx jest src/widgets/IngredientAddPage --watchAll=false`
Expected: PASS (T-03 green)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: 에러 0 (Dictionary 3로케일 모두 ingredientAdd 보유)

- [ ] **Step 6: Commit**

```bash
git add src/widgets/IngredientAddPage src/app/ingredients/new/page.tsx src/shared/i18n/types.ts src/shared/i18n/messages/ko/ingredientAdd.ts src/shared/i18n/messages/ko/index.ts src/shared/i18n/messages/ja/index.ts src/shared/i18n/messages/en/index.ts src/shared/i18n/ingredientAddMessages.ts
git commit -m "refactor(i18n): extract IngredientAddView widget + ingredientAdd ko dict" -- src/widgets/IngredientAddPage src/app/ingredients/new/page.tsx src/shared/i18n/types.ts src/shared/i18n/messages/ko/ingredientAdd.ts src/shared/i18n/messages/ko/index.ts src/shared/i18n/messages/ja/index.ts src/shared/i18n/messages/en/index.ts src/shared/i18n/ingredientAddMessages.ts
```

---

## Task 2: `ingredientAdd` ja/en 사전 + 셸 현지화 + ja/en 라우트 (Slice 1, T-01/T-02)

**Files:**
- Create: `src/shared/i18n/messages/ja/ingredientAdd.ts`, `src/shared/i18n/messages/en/ingredientAdd.ts`
- Create: `src/shared/i18n/useIngredientAddDict.ts`
- Create: `src/app/ja/ingredients/new/page.tsx`, `src/app/en/ingredients/new/page.tsx`
- Modify: `src/shared/i18n/ingredientAddMessages.ts`, `src/shared/i18n/messages/ja/index.ts`, `src/shared/i18n/messages/en/index.ts`, `src/shared/i18n/index.ts`
- Modify: `src/widgets/IngredientAddPage/ui/IngredientAddView.tsx`
- Modify: `src/widgets/IngredientAddPage/ui/__tests__/IngredientAddView.i18n.test.tsx`

- [ ] **Step 1: Write the failing tests (T-01 ja, T-02 en)**

위 테스트 파일의 `describe` 안에 추가:

```tsx
  it.each([
    ["/ja/ingredients/new", "ja"] as const,
    ["/en/ingredients/new", "en"] as const,
  ])("%s 에서 페이지 chrome가 현지 언어로 표시된다 (T-01/T-02)", (path, loc) => {
    mockPathname.mockReturnValue(path);
    const m = ingredientAddMessages[loc];
    renderView();
    expect(
      screen.getByRole("heading", { name: m.pageTitle })
    ).toBeInTheDocument();
    expect(screen.getByText(m.packsHeading)).toBeInTheDocument();
    expect(screen.getByText(m.packsSubtitle)).toBeInTheDocument();
    expect(screen.getByLabelText(m.searchEntryAria)).toBeInTheDocument();
    expect(screen.queryByText("추천 재료 모음")).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx jest src/widgets/IngredientAddPage --watchAll=false`
Expected: FAIL (ja 헤더가 아직 "재료 추가"; ja 사전이 ko와 동일)

- [ ] **Step 3: ja/en 사전 + 훅 + 셸 와이어 + 라우트**

`src/shared/i18n/messages/ja/ingredientAdd.ts`:
```ts
import type { IngredientAddDict } from "../../types";

export const ingredientAdd: IngredientAddDict = {
  pageTitle: "食材を追加",
  searchEntry: "食材を検索して追加",
  searchEntryAria: "食材を検索して追加する",
  packsHeading: "おすすめ食材セット",
  packsSubtitle: "必要なセットを選んでまとめて追加",
  drawerTitle: "食材を追加",
  drawerDescription: "冷蔵庫に追加する食材を検索しましょう",
  searchPlaceholder: "食材名で検索",
  searchAria: "検索",
  searchAction: "検索",
  loading: "食材を読み込み中...",
  errorPrefix: "エラーが発生しました。{message}",
  added: "追加済み",
  add: "追加",
  allLoaded: "すべての食材を読み込みました",
  noResults: "「{query}」に一致する食材がありません",
  close: "閉じる",
  packCountLabel: "· 全{count}品",
  selectedCount: "{count}件選択中",
  selectAll: "すべて選択",
  deselectAll: "選択を解除",
  owned: "追加済み",
  deleting: "削除中...",
  adding: "追加中...",
  deleteCount: "{count}件を削除",
  addCount: "{count}件を追加",
  cardOwned: "追加済み",
  cardCount: "食材{count}品",
  cardDetailAria: "{name}の詳細を見る",
};
```

`src/shared/i18n/messages/en/ingredientAdd.ts`:
```ts
import type { IngredientAddDict } from "../../types";

export const ingredientAdd: IngredientAddDict = {
  pageTitle: "Add ingredients",
  searchEntry: "Search and add ingredients",
  searchEntryAria: "Search and add ingredients",
  packsHeading: "Recommended sets",
  packsSubtitle: "Pick a set and add everything at once",
  drawerTitle: "Add ingredients",
  drawerDescription: "Search for ingredients to add to your fridge",
  searchPlaceholder: "Search ingredients",
  searchAria: "Search",
  searchAction: "Search",
  loading: "Loading ingredients...",
  errorPrefix: "Something went wrong. {message}",
  added: "Added",
  add: "Add",
  allLoaded: "You've reached the end",
  noResults: 'No ingredients match "{query}"',
  close: "Close",
  packCountLabel: "· {count} total",
  selectedCount: "{count} selected",
  selectAll: "Select all",
  deselectAll: "Clear",
  owned: "Added",
  deleting: "Removing...",
  adding: "Adding...",
  deleteCount: "Remove {count}",
  addCount: "Add {count}",
  cardOwned: "Added",
  cardCount: "{count} ingredients",
  cardDetailAria: "View {name}",
};
```

`src/shared/i18n/ingredientAddMessages.ts` 교체:
```ts
import { ingredientAdd as en } from "./messages/en/ingredientAdd";
import { ingredientAdd as ja } from "./messages/ja/ingredientAdd";
import { ingredientAdd as ko } from "./messages/ko/ingredientAdd";
import type { IngredientAddDict, Locale } from "./types";

export const ingredientAddMessages: Record<Locale, IngredientAddDict> = {
  ko,
  ja,
  en,
};
```

`src/shared/i18n/messages/ja/index.ts`·`en/index.ts` — 임시 `../ko/ingredientAdd`
import를 각 자국어 파일로 교체:
```ts
import { ingredientAdd } from "./ingredientAdd";
```

`src/shared/i18n/useIngredientAddDict.ts`:
```ts
"use client";

import { usePathname } from "next/navigation";

import { ingredientAddMessages } from "./ingredientAddMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { IngredientAddDict } from "./types";

export const useIngredientAddDict = (): IngredientAddDict =>
  ingredientAddMessages[resolveChromeLocale(usePathname() ?? "/")];
```

`src/shared/i18n/index.ts` — export 추가(알파벳 위치 유지):
```ts
export { useIngredientAddDict } from "./useIngredientAddDict";
```
그리고 타입 export 블록에 `IngredientAddDict` 추가.

`IngredientAddView.tsx` 셸 chrome를 사전으로:
```tsx
// import 추가
import { useIngredientAddDict } from "@/shared/i18n";
// 컴포넌트 본문 최상단
const dict = useIngredientAddDict();
```
그리고 하드코딩 4곳 교체:
- `<h1 ...>재료 추가</h1>` → `<h1 ...>{dict.pageTitle}</h1>`
- `aria-label="재료 검색해서 추가하기"` → `aria-label={dict.searchEntryAria}`
- `<span ...>재료를 검색해서 추가하세요</span>` → `{dict.searchEntry}`
- `<h2 ...>추천 재료 모음</h2>` → `{dict.packsHeading}`
- `<p ...>필요한 묶음을 골라 한 번에 추가하세요</p>` → `{dict.packsSubtitle}`

ja/en 라우트 래퍼. `src/app/ja/ingredients/new/page.tsx`:
```tsx
import { IngredientAddView } from "@/widgets/IngredientAddPage";

const JaNewIngredientsPage = () => <IngredientAddView />;

export default JaNewIngredientsPage;
```
`src/app/en/ingredients/new/page.tsx`:
```tsx
import { IngredientAddView } from "@/widgets/IngredientAddPage";

const EnNewIngredientsPage = () => <IngredientAddView />;

export default EnNewIngredientsPage;
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx jest src/widgets/IngredientAddPage --watchAll=false`
Expected: PASS (T-01, T-02, T-03)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: 에러 0

- [ ] **Step 6: Commit**

```bash
git add src/shared/i18n/messages/ja/ingredientAdd.ts src/shared/i18n/messages/en/ingredientAdd.ts src/shared/i18n/messages/ja/index.ts src/shared/i18n/messages/en/index.ts src/shared/i18n/ingredientAddMessages.ts src/shared/i18n/useIngredientAddDict.ts src/shared/i18n/index.ts src/widgets/IngredientAddPage/ui/IngredientAddView.tsx src/widgets/IngredientAddPage/ui/__tests__/IngredientAddView.i18n.test.tsx src/app/ja/ingredients/new/page.tsx src/app/en/ingredients/new/page.tsx
git commit -m "feat(i18n): localize ingredient-add page shell (ja/en) + mirror routes" -- src/shared/i18n/messages/ja/ingredientAdd.ts src/shared/i18n/messages/en/ingredientAdd.ts src/shared/i18n/messages/ja/index.ts src/shared/i18n/messages/en/index.ts src/shared/i18n/ingredientAddMessages.ts src/shared/i18n/useIngredientAddDict.ts src/shared/i18n/index.ts src/widgets/IngredientAddPage/ui/IngredientAddView.tsx src/widgets/IngredientAddPage/ui/__tests__/IngredientAddView.i18n.test.tsx src/app/ja/ingredients/new/page.tsx src/app/en/ingredients/new/page.tsx
```

---

## Task 3: 데스크톱 검색 드로어 현지화 (Slice 2, T-04..T-09)

**Files:**
- Modify: `src/features/ingredient-add-fridge/ui/IngredientSearchDrawer.tsx`
- Create: `src/features/ingredient-add-fridge/ui/__tests__/IngredientSearchDrawer.i18n.test.tsx`

- [ ] **Step 1: Write failing tests**

`IngredientSearchDrawer.i18n.test.tsx`:
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

import { ingredientAddMessages } from "@/shared/i18n/ingredientAddMessages";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";
import type { IngredientsApiResponse } from "@/entities/ingredient/model/types";

import IngredientSearchDrawer from "../IngredientSearchDrawer";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const getIngredientsMock = jest.fn();
jest.mock("@/entities/ingredient", () => ({
  getIngredients: (p: unknown) => getIngredientsMock(p),
}));
jest.mock("@/features/ingredient-add-fridge/model/hooks", () => ({
  useAddIngredientMutation: () => ({ mutate: jest.fn() }),
}));
jest.mock("@/features/ingredient-delete-fridge", () => ({
  useDeleteIngredientMutation: () => ({ mutate: jest.fn() }),
}));

const page = (content: IngredientsApiResponse["content"]): IngredientsApiResponse => ({
  content,
  page: { size: 20, number: 0, totalElements: content.length, totalPages: 1 },
});

const renderDrawer = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <IngredientSearchDrawer open onOpenChange={() => {}} />
    </QueryClientProvider>
  );

const hangul = /[가-힣]/;

beforeEach(() => getIngredientsMock.mockReset());

describe("IngredientSearchDrawer i18n", () => {
  it.each(["ja", "en"] as const)(
    "%s 드로어 chrome에 한글 0 + 추가 버튼 현지화 (T-04/T-05)",
    async (loc) => {
      mockPathname.mockReturnValue(`/${loc}/ingredients/new`);
      getIngredientsMock.mockResolvedValue(
        page([{ id: "x", name: "tomato", imageUrl: "", inFridge: false }])
      );
      const { container } = renderDrawer();
      expect(
        await screen.findByText(ingredientAddMessages[loc].add)
      ).toBeInTheDocument();
      expect(hangul.test(container.textContent ?? "")).toBe(false);
    }
  );

  it("ja 카테고리 칩이 택소노미로 현지화된다, 전체→すべて (T-06)", async () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    getIngredientsMock.mockResolvedValue(page([]));
    renderDrawer();
    expect(
      screen.getByRole("button", {
        name: taxonomyMessages.ja.ingredientCategory.ALL,
      })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "전체" })).toBeNull();
  });

  it("ja 결과 0건이면 noResults에 query가 치환된다 (T-07)", async () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    getIngredientsMock.mockResolvedValue(page([]));
    renderDrawer();
    const input = screen.getByPlaceholderText(
      ingredientAddMessages.ja.searchPlaceholder
    );
    fireEvent.change(input, { target: { value: "존在しない食材xyz" } });
    fireEvent.submit(input.closest("form")!);
    expect(
      await screen.findByText(/存在しない食材xyz/)
    ).toBeInTheDocument();
  });

  it("ja 페치 에러 시 에러 문구가 현지어(한글 0) (T-08)", async () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    getIngredientsMock.mockRejectedValue(new Error("boom"));
    const { container } = renderDrawer();
    await screen.findByText(/エラー/);
    expect(hangul.test(container.textContent ?? "")).toBe(false);
  });

  it("ko 드로어는 한글 canonical 유지 (T-09)", async () => {
    mockPathname.mockReturnValue("/ingredients/new");
    getIngredientsMock.mockResolvedValue(page([]));
    renderDrawer();
    expect(
      screen.getByText(ingredientAddMessages.ko.drawerDescription)
    ).toBeInTheDocument();
    expect(screen.getByText(ingredientAddMessages.ko.close)).toBeInTheDocument();
  });
});
```

> 주: `errorPrefix`에 `{message}`(영문 "boom")가 들어가도 한글은 없다 — T-08 통과.

- [ ] **Step 2: Run, verify fail**

Run: `npx jest IngredientSearchDrawer.i18n --watchAll=false`
Expected: FAIL (현재 하드코딩 한글)

- [ ] **Step 3: 드로어 현지화**

`IngredientSearchDrawer.tsx` 수정:

import 추가:
```tsx
import { useIngredientAddDict } from "@/shared/i18n";
import { format } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
```
컴포넌트 본문 상단:
```tsx
const dict = useIngredientAddDict();
const { localize } = useTaxonomy();
```
교체 매핑(문자열 → 사전):
- `<Title ...>재료 추가</Title>` → `{dict.drawerTitle}`
- `<Description ...>냉장고에 추가할 재료를 검색하세요</Description>` → `{dict.drawerDescription}`
- `placeholder="재료를 검색해서 추가하세요"` → `placeholder={dict.searchPlaceholder}`
- `aria-label="검색"` → `aria-label={dict.searchAria}`, sr 버튼 텍스트 `검색` → `{dict.searchAction}`
- 카테고리 버튼 `{category}` → `{localize(category, "ingredientCategory")}`
- `재료 로딩 중...` → `{dict.loading}`
- `오류가 발생했어요. {error ...}` 줄 →
  `{format(dict.errorPrefix, { message: error instanceof Error ? error.message : "" })}`
- `{isAdded ? "추가됨" : "추가"}` → `{isAdded ? dict.added : dict.add}`
- `모든 재료를 불러왔어요` → `{dict.allLoaded}`
- noResults 블록 →
  ```tsx
  {format(dict.noResults, {
    query: searchQuery || localize(selectedCategory, "ingredientCategory"),
  })}
  ```
  (기존 `&quot;...&quot;에 해당하는 재료가 없어요` 전체를 이 한 줄로 대체)
- 닫기 버튼 2곳 `닫기` → `{dict.close}`

- [ ] **Step 4: Run, verify pass**

Run: `npx jest IngredientSearchDrawer.i18n --watchAll=false`
Expected: PASS (T-04..T-09)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: 에러 0

- [ ] **Step 6: Commit**

```bash
git add src/features/ingredient-add-fridge/ui/IngredientSearchDrawer.tsx src/features/ingredient-add-fridge/ui/__tests__/IngredientSearchDrawer.i18n.test.tsx
git commit -m "feat(i18n): localize desktop ingredient search drawer (ja/en)" -- src/features/ingredient-add-fridge/ui/IngredientSearchDrawer.tsx src/features/ingredient-add-fridge/ui/__tests__/IngredientSearchDrawer.i18n.test.tsx
```

---

## Task 4: 팩 메타 오버레이 + 팩 카드 현지화 (Slice 3, T-10..T-14)

**Files:**
- Create: `src/shared/i18n/ingredientPackMeta.ts`
- Create: `src/shared/i18n/__tests__/localizePack.test.ts`
- Modify: `src/shared/i18n/index.ts` (export)
- Modify: `src/widgets/IngredientPackCard/IngredientPackCard.tsx`
- Create: `src/widgets/IngredientPackCard/__tests__/IngredientPackCard.i18n.test.tsx`

- [ ] **Step 1: Write failing unit test (T-10)**

`src/shared/i18n/__tests__/localizePack.test.ts`:
```ts
import { localizePack } from "../ingredientPackMeta";

const pack = {
  name: "한식 기본 베이스",
  description: "한식 요리를 위한 필수 조미료와 재료",
  ingredients: [],
};

describe("localizePack", () => {
  it("ja 오버레이가 있으면 현지 name/description 반환 (T-10)", () => {
    const r = localizePack(pack, "ja");
    expect(r.name).not.toBe(pack.name);
    expect(/[가-힣]/.test(r.name + r.description)).toBe(false);
  });
  it("ko 또는 미등록은 입력값 fallback (T-10)", () => {
    expect(localizePack(pack, "ko")).toEqual({
      name: pack.name,
      description: pack.description,
    });
    const unknown = { ...pack, name: "없는팩", description: "x" };
    expect(localizePack(unknown, "ja")).toEqual({
      name: "없는팩",
      description: "x",
    });
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npx jest localizePack --watchAll=false`
Expected: FAIL (모듈 없음)

- [ ] **Step 3: 오버레이 + 리졸버**

`src/shared/i18n/ingredientPackMeta.ts`:
```ts
import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";

import type { Locale } from "./types";

type PackMeta = { name: string; description: string };

const OVERLAY: Partial<Record<Locale, Record<string, PackMeta>>> = {
  ja: {
    "조미료/양념 모음": {
      name: "調味料・薬味セット",
      description: "どんな料理にも欠かせない基本の調味料",
    },
    "육류 기본 모음": {
      name: "基本の肉セット",
      description: "いろいろな料理に使える基本の肉",
    },
    "채소 기본 재료": {
      name: "基本の野菜セット",
      description: "いろいろな料理に使える基本の野菜",
    },
    "자취 기본 재료 모음": {
      name: "一人暮らしの常備食材",
      description: "一人暮らしの冷蔵庫に欠かせない必需食材",
    },
    "베이킹 기본 재료": {
      name: "基本のベーキング材料",
      description: "おうちベーキングに必要な基本材料",
    },
    "유제품 모음": {
      name: "乳製品セット",
      description: "料理にも飲み物にも使える乳製品",
    },
    "한식 기본 베이스": {
      name: "韓国料理の基本ベース",
      description: "韓国料理に欠かせない調味料と食材",
    },
    "양식 기본 베이스": {
      name: "洋食の基本ベース",
      description: "洋食づくりに欠かせない調味料と食材",
    },
  },
  en: {
    "조미료/양념 모음": {
      name: "Seasonings & sauces",
      description: "Everyday seasonings every dish starts with",
    },
    "육류 기본 모음": {
      name: "Basic meats",
      description: "Everyday cuts for all kinds of cooking",
    },
    "채소 기본 재료": {
      name: "Basic vegetables",
      description: "Everyday vegetables for all kinds of cooking",
    },
    "자취 기본 재료 모음": {
      name: "Solo-living staples",
      description: "Fridge essentials for living on your own",
    },
    "베이킹 기본 재료": {
      name: "Baking basics",
      description: "Core ingredients for home baking",
    },
    "유제품 모음": {
      name: "Dairy set",
      description: "Dairy for cooking and drinks alike",
    },
    "한식 기본 베이스": {
      name: "Korean cooking base",
      description: "Must-have seasonings and ingredients for Korean food",
    },
    "양식 기본 베이스": {
      name: "Western cooking base",
      description: "Must-have seasonings and ingredients for Western food",
    },
  },
};

export const localizePack = (
  pack: Pick<IngredientPack, "name" | "description">,
  locale: Locale
): PackMeta =>
  OVERLAY[locale]?.[pack.name] ?? {
    name: pack.name,
    description: pack.description,
  };
```

`src/shared/i18n/index.ts`에 `export { localizePack } from "./ingredientPackMeta";` 추가.

- [ ] **Step 4: Run unit test, verify pass**

Run: `npx jest localizePack --watchAll=false`
Expected: PASS (T-10)

- [ ] **Step 5: Write failing component tests (T-11..T-14)**

`src/widgets/IngredientPackCard/__tests__/IngredientPackCard.i18n.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";

import { localizePack } from "@/shared/i18n";
import { ingredientAddMessages } from "@/shared/i18n/ingredientAddMessages";
import { format } from "@/shared/i18n";

import IngredientPackCard from "../IngredientPackCard";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const pack = {
  name: "한식 기본 베이스",
  description: "한식 요리를 위한 필수 조미료와 재료",
  ingredients: [
    { id: "a", name: "국간장", imageUrl: "" },
    { id: "b", name: "고추장", imageUrl: "" },
  ],
};

const renderCard = (owned: Set<string>) =>
  render(
    <IngredientPackCard
      pack={pack}
      onViewDetail={() => {}}
      ownedIngredientIds={owned}
    />
  );

const hangul = /[가-힣]/;

describe("IngredientPackCard i18n", () => {
  it("ja 카드 이름/설명이 오버레이 현지값, 카드 한글 0 (T-11)", () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    const { container } = renderCard(new Set());
    const meta = localizePack(pack, "ja");
    expect(screen.getByText(meta.name)).toBeInTheDocument();
    expect(screen.getByText(meta.description)).toBeInTheDocument();
    expect(hangul.test(container.textContent ?? "")).toBe(false);
  });

  it("ja 재료 카운트가 치환 표시 (T-12)", () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    renderCard(new Set());
    expect(
      screen.getByText(
        format(ingredientAddMessages.ja.cardCount, { count: 2 })
      )
    ).toBeInTheDocument();
  });

  it("ja 전부 보유 시 보유 배지 현지어 (T-13)", () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    renderCard(new Set(["a", "b"]));
    expect(
      screen.getByText(ingredientAddMessages.ja.cardOwned)
    ).toBeInTheDocument();
  });

  it("ko 카드는 한글 팩명 + aria 유지 (T-14)", () => {
    mockPathname.mockReturnValue("/ingredients/new");
    renderCard(new Set());
    expect(screen.getByText("한식 기본 베이스")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /한식 기본 베이스 상세 보기/ })
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run, verify fail**

Run: `npx jest IngredientPackCard.i18n --watchAll=false`
Expected: FAIL (현재 하드코딩)

- [ ] **Step 7: 팩 카드 현지화**

`IngredientPackCard.tsx` 수정. import 추가:
```tsx
import { format, localizePack } from "@/shared/i18n";
import { useChromeLocale } from "@/shared/i18n/useChromeDict";
import { useIngredientAddDict } from "@/shared/i18n";
```
본문 상단:
```tsx
const dict = useIngredientAddDict();
const locale = useChromeLocale();
const meta = localizePack(pack, locale);
```
교체:
- `aria-label={`${pack.name} 상세 보기`}` →
  `aria-label={format(dict.cardDetailAria, { name: meta.name })}`
- `<h3 ...>{pack.name}</h3>` → `{meta.name}`
- `보유 중` 배지 → `{dict.cardOwned}`
- `<p ...>{pack.description}</p>` → `{meta.description}`
- `재료 {pack.ingredients.length}개` →
  `{format(dict.cardCount, { count: pack.ingredients.length })}`

- [ ] **Step 8: Run, verify pass**

Run: `npx jest IngredientPackCard.i18n localizePack -- --watchAll=false`
Expected: PASS (T-10..T-14)

- [ ] **Step 9: Typecheck**

Run: `npx tsc --noEmit`
Expected: 에러 0

- [ ] **Step 10: Commit**

```bash
git add src/shared/i18n/ingredientPackMeta.ts src/shared/i18n/__tests__/localizePack.test.ts src/shared/i18n/index.ts src/widgets/IngredientPackCard/IngredientPackCard.tsx src/widgets/IngredientPackCard/__tests__/IngredientPackCard.i18n.test.tsx
git commit -m "feat(i18n): localize ingredient pack card via pack-meta overlay" -- src/shared/i18n/ingredientPackMeta.ts src/shared/i18n/__tests__/localizePack.test.ts src/shared/i18n/index.ts src/widgets/IngredientPackCard/IngredientPackCard.tsx src/widgets/IngredientPackCard/__tests__/IngredientPackCard.i18n.test.tsx
```

---

## Task 5: 재료명 오버레이 + 팩 상세 드로어 현지화 (Slice 4, T-15..T-20)

**Files:**
- Create: `src/shared/i18n/ingredientNameOverlay.ts`
- Create: `src/shared/i18n/__tests__/localizeIngredientName.test.ts`
- Modify: `src/shared/i18n/index.ts` (export)
- Modify: `src/features/ingredient-add-fridge/ui/IngredientPackDetailDrawer.tsx`
- Create: `src/features/ingredient-add-fridge/ui/__tests__/IngredientPackDetailDrawer.i18n.test.tsx`

- [ ] **Step 1: Write failing unit test (T-15)**

`src/shared/i18n/__tests__/localizeIngredientName.test.ts`:
```ts
import { localizeIngredientName } from "../ingredientNameOverlay";

describe("localizeIngredientName", () => {
  it("등록 id는 현지명, 미등록은 koName fallback (T-15)", () => {
    // "OAeLoBLq" = 김치 (INGREDIENT_PACKS의 실제 id)
    const ja = localizeIngredientName("OAeLoBLq", "김치", "ja");
    expect(/[가-힣]/.test(ja)).toBe(false);
    expect(localizeIngredientName("___none___", "김치", "ja")).toBe("김치");
    expect(localizeIngredientName("OAeLoBLq", "김치", "ko")).toBe("김치");
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npx jest localizeIngredientName -- --watchAll=false`
Expected: FAIL (모듈 없음)

- [ ] **Step 3: 재료명 오버레이 + 리졸버 (완전 커버)**

먼저 고유 (id, koName) 목록을 추출한다. INGREDIENT_PACKS(`src/shared/config/constants/ingredientPacks.ts`)의 모든 ingredient를 id 기준 dedupe — 약 120개. 추출 보조:

Run (목록 확인용, 커밋 대상 아님):
```bash
node -e "const {INGREDIENT_PACKS}=require('./src/shared/config/constants/ingredientPacks.ts');" 2>/dev/null || npx tsx -e "import {INGREDIENT_PACKS} from './src/shared/config/constants/ingredientPacks';const m=new Map();INGREDIENT_PACKS.forEach(p=>p.ingredients.forEach(i=>m.set(i.id,i.name)));console.log(JSON.stringify(Object.fromEntries(m),null,0))"
```
(tsx 없으면 파일을 직접 읽어 id→name 쌍을 수기로 수집)

`src/shared/i18n/ingredientNameOverlay.ts` — **모든** 고유 id에 대해 ja/en 작성.
각 언어 모국어 PM 톤(§0): 외래어는 가타카나/영문 표기, 한식 고유재료는 통용 표기.
스타일 샘플(대표 15개, 나머지는 동일 규칙으로 전부 채움):

```ts
import type { Locale } from "./types";

const JA: Record<string, string> = {
  OAeLoBLq: "キムチ",       // 김치
  "5Gez4wA9": "卵",        // 계란
  vKBpozwN: "牛乳",        // 우유
  blJxKOeA: "バター",      // 버터
  mKe607w9: "チーズ",      // 치즈
  "8LB17Jkg": "うすくち醤油", // 국간장
  gLe7j1Bx: "こいくち醤油", // 진간장
  gXwPmBKl: "コチュジャン", // 고추장
  mKe6x0w9: "テンジャン",   // 된장
  Eqeq2JG5: "唐辛子粉",    // 고춧가루
  MzwvZbwQ: "玉ねぎ",      // 양파
  G0J8ZDBv: "長ねぎ",      // 대파
  "3zejjZe4": "にんにく",  // 마늘
  "7Kellbea": "牛肉",      // 소고기
  jzw59yw4: "豚肉",        // 돼지고기
  // … INGREDIENT_PACKS의 모든 고유 id (약 120개) 빠짐없이 채운다
};

const EN: Record<string, string> = {
  OAeLoBLq: "Kimchi",
  "5Gez4wA9": "Egg",
  vKBpozwN: "Milk",
  blJxKOeA: "Butter",
  mKe607w9: "Cheese",
  "8LB17Jkg": "Soup soy sauce",
  gLe7j1Bx: "Dark soy sauce",
  gXwPmBKl: "Gochujang",
  mKe6x0w9: "Doenjang",
  Eqeq2JG5: "Chili powder",
  MzwvZbwQ: "Onion",
  G0J8ZDBv: "Green onion",
  "3zejjZe4": "Garlic",
  "7Kellbea": "Beef",
  jzw59yw4: "Pork",
  // … 모든 고유 id 빠짐없이 채운다
};

const OVERLAY: Partial<Record<Locale, Record<string, string>>> = { ja: JA, en: EN };

export const localizeIngredientName = (
  id: string,
  koName: string,
  locale: Locale
): string => OVERLAY[locale]?.[id] ?? koName;
```

`src/shared/i18n/index.ts`에 `export { localizeIngredientName } from "./ingredientNameOverlay";` 추가.

> **완전성 게이트:** 한 개라도 빠지면 Step 8의 T-16/T-17(no-Hangul)이 실패한다.
> 즉 "전부 채웠는가"는 눈대중이 아니라 테스트가 강제한다. 빠진 id는 그 팩 상세
> 드로어 ja/en 렌더에서 koName(한글)이 새어 가드가 잡는다.

- [ ] **Step 4: Run unit test, verify pass**

Run: `npx jest localizeIngredientName -- --watchAll=false`
Expected: PASS (T-15) — 단, "OAeLoBLq" ja 엔트리가 채워져 있어야 함

- [ ] **Step 5: Write failing component tests (T-16..T-20)**

`src/features/ingredient-add-fridge/ui/__tests__/IngredientPackDetailDrawer.i18n.test.tsx`:
```tsx
import { fireEvent, render, screen } from "@testing-library/react";

import { INGREDIENT_PACKS } from "@/shared/config/constants/ingredientPacks";
import { ingredientAddMessages } from "@/shared/i18n/ingredientAddMessages";
import { format } from "@/shared/i18n";

import IngredientPackDetailDrawer from "../IngredientPackDetailDrawer";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const packA = INGREDIENT_PACKS[0];
const hangul = /[가-힣]/;

const renderDrawer = (owned: Set<string> = new Set()) =>
  render(
    <IngredientPackDetailDrawer
      pack={packA}
      open
      onOpenChange={() => {}}
      onAddSelected={() => {}}
      onDeleteSelected={() => {}}
      ownedIngredientIds={owned}
    />
  );

describe("IngredientPackDetailDrawer i18n", () => {
  it.each(["ja", "en"] as const)(
    "%s 팩 상세 전체 렌더에 한글 0 (재료명 누락 포착) (T-16/T-17)",
    (loc) => {
      mockPathname.mockReturnValue(`/${loc}/ingredients/new`);
      const { container } = renderDrawer();
      expect(hangul.test(container.textContent ?? "")).toBe(false);
    }
  );

  it("ja 헤더 총 개수 + 선택 카운트 치환 (T-18)", () => {
    mockPathname.mockReturnValue("/ja/ingredients/new");
    renderDrawer();
    expect(
      screen.getByText((t) =>
        t.includes(
          format(ingredientAddMessages.ja.packCountLabel, {
            count: packA.ingredients.length,
          })
        )
      )
    ).toBeInTheDocument();
  });

  it("ja 제출 CTA가 선택 개수로 치환된 현지어 (T-19)", () => {
    // 주: selectedIds 초기화는 open false→true 전환 시 발생(prevSync) →
    //     처음부터 open=true로 렌더하면 빈 선택이라 전환을 재현한다.
    mockPathname.mockReturnValue("/ja/ingredients/new");
    const common = {
      pack: packA,
      onOpenChange: () => {},
      onAddSelected: () => {},
      onDeleteSelected: () => {},
      ownedIngredientIds: new Set<string>(),
    };
    const utils = render(<IngredientPackDetailDrawer {...common} open={false} />);
    utils.rerender(<IngredientPackDetailDrawer {...common} open />);
    expect(
      screen.getByRole("button", {
        name: format(ingredientAddMessages.ja.addCount, {
          count: packA.ingredients.length,
        }),
      })
    ).toBeInTheDocument();
  });

  it("ko 드로어는 한글 재료명/chrome 유지 (T-20)", () => {
    mockPathname.mockReturnValue("/ingredients/new");
    renderDrawer();
    expect(screen.getByText(ingredientAddMessages.ko.selectAll)).toBeInTheDocument();
    expect(screen.getByText(packA.ingredients[0].name)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run, verify fail**

Run: `npx jest IngredientPackDetailDrawer.i18n -- --watchAll=false`
Expected: FAIL (현재 하드코딩)

- [ ] **Step 7: 팩 상세 드로어 현지화**

`IngredientPackDetailDrawer.tsx` 수정. import 추가:
```tsx
import { format, localizePack, localizeIngredientName } from "@/shared/i18n";
import { useChromeLocale } from "@/shared/i18n/useChromeDict";
import { useIngredientAddDict } from "@/shared/i18n";
```
본문 상단(`if (!pack) return null;` 위, 단 훅은 early-return 전에):
```tsx
const dict = useIngredientAddDict();
const locale = useChromeLocale();
```
> 주의: 훅(`useIngredientAddDict`, `useChromeLocale`)은 컴포넌트 최상단에 둔다 —
> 기존 `useResponsiveSheet()` 호출부와 같은 위치(early-return 이전).

`if (!pack) return null;` 이후 `const meta = localizePack(pack, locale);` 추가.

교체:
- 헤더 `<Title ...>{pack.name}</Title>` → `{meta.name}`
- `<Description ...>{pack.description} · 총 {pack.ingredients.length}개</Description>` →
  ```tsx
  {meta.description}{" "}
  {format(dict.packCountLabel, { count: pack.ingredients.length })}
  ```
- `{selectedIds.size}개 선택됨` → `{format(dict.selectedCount, { count: selectedIds.size })}`
- `전체 선택` → `{dict.selectAll}`
- `선택 해제` → `{dict.deselectAll}`
- 재료명 `<span ...>{ingredient.name}</span>` →
  `{localizeIngredientName(ingredient.id, ingredient.name, locale)}`
- `보유중` 배지 → `{dict.owned}`
- 제출 버튼 라벨 블록 →
  ```tsx
  {isLoading
    ? allOwned
      ? dict.deleting
      : dict.adding
    : allOwned
      ? format(dict.deleteCount, { count: selectedIds.size })
      : format(dict.addCount, { count: selectedIds.size })}
  ```

- [ ] **Step 8: Run, verify pass**

Run: `npx jest IngredientPackDetailDrawer.i18n localizeIngredientName -- --watchAll=false`
Expected: PASS (T-15..T-20). T-16/T-17 실패 시 → 빠진 재료명 id를 오버레이에 추가하고 재실행.

- [ ] **Step 9: Typecheck + 전체 팩 no-Hangul 보강 확인**

Run: `npx tsc --noEmit`
Expected: 에러 0

추가 안전: 모든 팩(8개)을 도는 no-Hangul도 한번 확인(선택, 위 T-16은 packA만).
필요시 테스트의 `packA`를 `INGREDIENT_PACKS`로 `it.each`하여 8팩 전부 가드.

- [ ] **Step 10: Commit**

```bash
git add src/shared/i18n/ingredientNameOverlay.ts src/shared/i18n/__tests__/localizeIngredientName.test.ts src/shared/i18n/index.ts src/features/ingredient-add-fridge/ui/IngredientPackDetailDrawer.tsx src/features/ingredient-add-fridge/ui/__tests__/IngredientPackDetailDrawer.i18n.test.tsx
git commit -m "feat(i18n): localize pack detail drawer + ingredient-name overlay (ja/en)" -- src/shared/i18n/ingredientNameOverlay.ts src/shared/i18n/__tests__/localizeIngredientName.test.ts src/shared/i18n/index.ts src/features/ingredient-add-fridge/ui/IngredientPackDetailDrawer.tsx src/features/ingredient-add-fridge/ui/__tests__/IngredientPackDetailDrawer.i18n.test.tsx
```

---

## Task 6: my-fridge 조리시간 단위 (Slice 5, T-21/T-22)

**Files:**
- Modify: `src/shared/i18n/types.ts` (`FridgeDict.cookTimeMinutes`)
- Modify: `src/shared/i18n/messages/{ko,ja,en}/fridge.ts`
- Modify: `src/widgets/MyFridgeRecipes/ui/MyFridgeRecipeCard.tsx`
- Create: `src/widgets/MyFridgeRecipes/ui/__tests__/MyFridgeRecipeCard.i18n.test.tsx`

- [ ] **Step 1: Write failing test (T-21/T-22)**

`MyFridgeRecipeCard.i18n.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";

import type { MyFridgeRecipeItem } from "@/entities/recipe/model/types";

import MyFridgeRecipeCard from "../MyFridgeRecipeCard";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/features/recipe-save", () => ({
  RecipeSaveButton: () => null,
}));

const recipe = {
  id: "r1",
  title: "테스트",
  cookingTime: 40,
  missingIngredients: [],
  recipeType: "USER",
} as unknown as MyFridgeRecipeItem;

describe("MyFridgeRecipeCard 조리시간 단위 i18n", () => {
  it.each([
    ["/ja/recipes/my-fridge", "40分"],
    ["/en/recipes/my-fridge", "40 min"],
    ["/recipes/my-fridge", "40분"],
  ])("%s → %s (T-21/T-22)", (path, expected) => {
    mockPathname.mockReturnValue(path);
    render(<MyFridgeRecipeCard recipe={recipe} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
```

> 주: `recipe` 캐스팅은 카드 렌더에 필요한 최소 필드만 채운 테스트 픽스처(`as` 사유:
> MyFridgeRecipeItem 전체 필드 불필요, 렌더 경로만 검증).

- [ ] **Step 2: Run, verify fail**

Run: `npx jest MyFridgeRecipeCard.i18n -- --watchAll=false`
Expected: FAIL (ja에서 "40분"이 떠 "40分" 없음 / 타입에 cookTimeMinutes 없음)

- [ ] **Step 3: 사전 키 + 렌더 교체**

`src/shared/i18n/types.ts` `FridgeDict`에 추가:
```ts
  cookTimeMinutes: string;
```
`messages/ko/fridge.ts`: `cookTimeMinutes: "{min}분",`
`messages/ja/fridge.ts`: `cookTimeMinutes: "{min}分",`
`messages/en/fridge.ts`: `cookTimeMinutes: "{min} min",`

`MyFridgeRecipeCard.tsx` — `format` import 추가(`@/shared/i18n`), `dict`는 이미 존재
(`useFridgeDict`). 교체:
```tsx
<span>{format(dict.cookTimeMinutes, { min: recipe.cookingTime })}</span>
```
> `dict` 변수명이 다르면 `useFridgeDict()` 반환 변수에 맞춘다(파일 상단 확인).

- [ ] **Step 4: Run, verify pass**

Run: `npx jest MyFridgeRecipeCard.i18n -- --watchAll=false`
Expected: PASS (T-21, T-22, ko 회귀)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: 에러 0

- [ ] **Step 6: Commit**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ko/fridge.ts src/shared/i18n/messages/ja/fridge.ts src/shared/i18n/messages/en/fridge.ts src/widgets/MyFridgeRecipes/ui/MyFridgeRecipeCard.tsx src/widgets/MyFridgeRecipes/ui/__tests__/MyFridgeRecipeCard.i18n.test.tsx
git commit -m "feat(i18n): localize my-fridge recipe card cook-time unit" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko/fridge.ts src/shared/i18n/messages/ja/fridge.ts src/shared/i18n/messages/en/fridge.ts src/widgets/MyFridgeRecipes/ui/MyFridgeRecipeCard.tsx src/widgets/MyFridgeRecipes/ui/__tests__/MyFridgeRecipeCard.i18n.test.tsx
```

---

## Task 7: 빈상태 CTA locale-sticky (Slice 6, T-23/T-24)

**Files:**
- Modify: `src/widgets/MyFridgeRecipes/ui/MyFridgeEmptyState.tsx`
- Create: `src/widgets/MyFridgeRecipes/ui/__tests__/MyFridgeEmptyState.cta.test.tsx`

- [ ] **Step 1: Write failing test (T-23/T-24)**

`MyFridgeEmptyState.cta.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";

import MyFridgeEmptyState from "../MyFridgeEmptyState";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

describe("MyFridgeEmptyState CTA locale-sticky", () => {
  it.each([
    ["/ja/recipes/my-fridge", "/ja/ingredients/new"],
    ["/en/recipes/my-fridge", "/en/ingredients/new"],
    ["/recipes/my-fridge", "/ingredients/new"],
  ])("%s CTA href → %s (T-23/T-24)", (path, href) => {
    mockPathname.mockReturnValue(path);
    render(<MyFridgeEmptyState />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", href);
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npx jest MyFridgeEmptyState.cta -- --watchAll=false`
Expected: FAIL (ja에서도 href가 `/ingredients/new`)

- [ ] **Step 3: LocalizedLink로 교체**

`MyFridgeEmptyState.tsx`:
- import 교체: `import Link from "next/link";` 제거,
  `import { LocalizedLink } from "@/shared/i18n";` 추가
- `<Link href="/ingredients/new">` → `<LocalizedLink href="/ingredients/new">`
  및 닫는 태그 `</Link>` → `</LocalizedLink>`

- [ ] **Step 4: Run, verify pass**

Run: `npx jest MyFridgeEmptyState.cta -- --watchAll=false`
Expected: PASS (T-23, T-24)

- [ ] **Step 5: 회귀 — 냉장고 위젯 전체 스위트**

Run: `npx jest src/widgets/MyFridgeRecipes -- --watchAll=false`
Expected: 기존 `fridgeNoHangulLeak` 포함 전부 PASS

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: 에러 0

- [ ] **Step 7: Commit**

```bash
git add src/widgets/MyFridgeRecipes/ui/MyFridgeEmptyState.tsx src/widgets/MyFridgeRecipes/ui/__tests__/MyFridgeEmptyState.cta.test.tsx
git commit -m "feat(i18n): make my-fridge empty-state CTA locale-sticky" -- src/widgets/MyFridgeRecipes/ui/MyFridgeEmptyState.tsx src/widgets/MyFridgeRecipes/ui/__tests__/MyFridgeEmptyState.cta.test.tsx
```

---

## 최종 검증 (전 Task 후)

- [ ] `npx tsc --noEmit` — 에러 0
- [ ] `npx jest src/widgets/IngredientAddPage src/features/ingredient-add-fridge src/widgets/IngredientPackCard src/widgets/MyFridgeRecipes src/shared/i18n -- --watchAll=false` — 전부 PASS
- [ ] `I18N-STATUS.md` §3 냉장고/재료추가 행 + §6 append 갱신(재료 추가 페이지 ja/en 완료, 팩 오버레이 결정 기록)
- [ ] finishing-a-development-branch → compounding-lessons

---

## 트레이서빌리티 (Self-Review 결과)

| Test ID | Task | 상태 |
| --- | --- | --- |
| T-01,02 | 2 | ✅ 셸 ja/en chrome |
| T-03 | 1 | ✅ ko 앵커(추출) |
| T-04..09 | 3 | ✅ 검색 드로어 |
| T-10 | 4 | ✅ localizePack unit |
| T-11..14 | 4 | ✅ 팩 카드 |
| T-15 | 5 | ✅ localizeIngredientName unit |
| T-16..20 | 5 | ✅ 팩 상세(no-Hangul 게이트) |
| T-21,22 | 6 | ✅ 조리시간 단위 |
| T-23,24 | 7 | ✅ CTA locale-sticky |

비목표(테스트 없음): `/ingredients` 목록·SEO·통화·`<html lang>`·백엔드 재료번역·
모바일 IngredientPicker·lang 전파 — 전부 의도적 부재.
