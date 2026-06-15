# 레시피북 상세 + 관리 플로우 국제화 (ja/en) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/recipe-books/[bookId]` 상세 페이지와 그 책 관리 플로우(편집모드·이동·빼기·이름변경·생성·삭제·저장픽커) 전부를 ja/en로 현지화하고, 책 안 레시피 데이터에 `lang`을 전파한다.

**Architecture:** 기존 §5 i18n 레시피. 미러 라우트(`/ja`,`/en`)는 이미 re-export 중이라 신규 라우트 없음. 모든 chrome은 pathname 자가판정 사전 `useUserPagesDict().recipeBooks`(Provider 불필요)로 현지화. 에러 메시지는 코드→`{code,message}` 헬퍼로 통일하고 substring 매칭 제거. zod는 locale-aware 팩토리. 데이터 `lang`은 요청 파라미터에만(queryKey 불변, §6 결정).

**Tech Stack:** Next.js App Router, TypeScript, TanStack Query, react-hook-form + zod, Radix Dialog, jest + @testing-library/react.

---

## 사전 컨텍스트 (구현 전 필독)

**Bash 실행 규칙:** cwd 안에서 `cd ... &&` 접두사 금지. bare command(`npx tsc --noEmit`, `npx jest <path>`)로 실행.
**Git 브랜치 규칙:** 현재 브랜치 `feature/17`에서만 작업. checkout/switch/branch/merge/rebase/pull 금지.

**테스트 패턴(레포 표준 — `IngredientPicker.i18n.test.tsx` 참고):**
```tsx
const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
// 컴포넌트 렌더 후:  mockPathname.mockReturnValue("/ja/recipe-books/b1");
// no-Hangul 게이트: expect(container.textContent).not.toMatch(/[가-힣]/)
```
**Radix portal 주의(보드 교훈):** Dialog/Sheet(=RenameSheet·CreateSheet·MoveSheet·BulkDeleteConfirmModal·DeleteRecipeBookModal·ChangeBookSheet)는 `document.body`로 portal됨 → no-Hangul 검사는 `container` 말고 **`baseElement.textContent`**로 읽는다. `const { baseElement } = render(...)`.

**번역 톤(보드 §0):** ja/en은 직역 금지, 현지 IT PM 톤(차분·실용). 아래 사전 값은 그 기준으로 작성됨.

**format/plural(`@/shared/i18n`):** `format(t, {count})` → `{count}` 치환. `plural(n, {one, other})` → en 복수.

**조사 처리:** ko 토스트는 `{count}개를 {name}으로` 받침 의존 조사 유지. ja/en은 `format`의 `{name}` 플레이스홀더라 조사 없음.

---

## 파일 구조

| 파일 | 책임 | 터치 task |
| --- | --- | --- |
| `src/shared/i18n/types.ts` | `UserPagesDict["recipeBooks"]` 타입 확장(누락 강제) | T1,T2,T3,T4,T5,T6 |
| `src/shared/i18n/messages/{ko,ja,en}/userPages.ts` | `recipeBooks` 사전 값 | T1~T6 |
| `src/entities/recipe-book/api/getRecipeBookDetail.ts` | `lang` 파라미터 추가 | T1 |
| `src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx` | queryFn `lang` 전파 + 빈상태/aria 현지화 | T1,T2 |
| `src/widgets/RecipeBookDetail/RecipeBookDetailHeader.tsx` | 헤더 현지화 | T2 |
| `src/features/recipe-book-edit-mode/ui/{EditModeBottomBar,MoveRecipesSheet,BulkDeleteConfirmModal}.tsx` | 편집모드 현지화 | T3 |
| `src/features/recipe-book-{rename,create,delete}/ui/*.tsx` | 시트/모달 현지화 + zod 팩토리 와이어 | T4 |
| `src/entities/recipe-book/model/schema.ts` | `buildRecipeBookFormSchema(validation)` 팩토리 | T4 |
| `src/entities/recipe-book/model/errorMessages.ts` | `getRecipeBookError(error, locale)` + `FIELD_ERROR_CODES` | T5 |
| `src/entities/recipe-book/index.ts` | export 교체 | T4,T5 |
| `src/features/recipe-book-change/ui/ChangeBookSheet.tsx` | 저장 픽커 현지화 | T6 |

**에러 헬퍼 마이그레이션 순서 주의:** T3·T4·T6은 자기 chrome만 현지화하고 **에러 catch는 기존 `getRecipeBookErrorMessage`(ko) 유지**. T5에서 시그니처를 한 번에 교체하며 전 호출부(rename·create·delete·move·bulkDelete·change)의 catch를 코드 분기로 마감. 동일 파일 순차 터치(충돌 없음, 각 task tsc green).

---

## Task 1: 책 안 레시피 데이터 lang 전파 (S2)

**Files:**
- Modify: `src/entities/recipe-book/api/getRecipeBookDetail.ts`
- Modify: `src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx`
- Test: `src/entities/recipe-book/api/__tests__/getRecipeBookDetail.test.ts` (create)
- Test: `src/entities/recipe-book/model/__tests__/queryKeys.test.ts` (create)

- [ ] **Step 1: 실패 테스트 작성 (T-05, T-06, T-07)**

`src/entities/recipe-book/api/__tests__/getRecipeBookDetail.test.ts`:
```ts
jest.mock("@/shared/api/client", () => ({
  api: {
    get: jest.fn().mockResolvedValue({
      id: "b1",
      name: "집밥",
      default: false,
      recipeCount: 0,
      recipes: [],
      hasNext: false,
    }),
  },
}));

import { api } from "@/shared/api/client";

import { getRecipeBookDetail } from "../getRecipeBookDetail";

describe("getRecipeBookDetail lang", () => {
  afterEach(() => jest.clearAllMocks());

  it("ja에서 lang=ja를 params로 전달한다 (T-05)", async () => {
    await getRecipeBookDetail("b1", { lang: "ja" });
    expect(api.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja" }),
      })
    );
  });

  it("ko에서 lang=ko를 params로 전달한다 (T-06)", async () => {
    await getRecipeBookDetail("b1", { lang: "ko" });
    expect(api.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ko" }),
      })
    );
  });
});
```

`src/entities/recipe-book/model/__tests__/queryKeys.test.ts`:
```ts
import { DEFAULT_BOOK_SORT, RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

describe("RECIPE_BOOK_QUERY_KEYS detail (T-07)", () => {
  it("detail/detailInfinite 키에 locale 세그먼트가 없다", () => {
    const detail = RECIPE_BOOK_QUERY_KEYS.detail("b1", DEFAULT_BOOK_SORT);
    const infinite = RECIPE_BOOK_QUERY_KEYS.detailInfinite("b1", DEFAULT_BOOK_SORT);
    expect(detail).toEqual(["recipe-books", "detail", "b1", DEFAULT_BOOK_SORT]);
    expect(infinite).toEqual(["recipe-books", "infinite", "b1", DEFAULT_BOOK_SORT]);
    expect(detail).not.toContain("ja");
    expect(infinite).not.toContain("ja");
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `npx jest src/entities/recipe-book/api/__tests__/getRecipeBookDetail.test.ts src/entities/recipe-book/model/__tests__/queryKeys.test.ts`
Expected: getRecipeBookDetail 테스트 FAIL(`lang` 미전달), queryKeys 테스트 PASS(키 이미 locale-free — 회귀 가드로 유지).

- [ ] **Step 3: `getRecipeBookDetail`에 lang 추가**

`src/entities/recipe-book/api/getRecipeBookDetail.ts` — `RecipeBookDetailParams`에 `lang`이 포함돼야 함. `types.ts`의 해당 타입 확인 후 없으면 추가. 함수 본문:
```ts
export const getRecipeBookDetail = async (
  bookId: string,
  params: RecipeBookDetailParams = {}
): Promise<RecipeBookDetail> => {
  const { page = 0, size = 20, sort = "addedAt,desc", lang } = params;
  const { default: isDefault, ...rest } = await api.get<RawRecipeBookDetail>(
    END_POINTS.RECIPE_BOOK(bookId),
    { params: { page, size, sort, lang } }
  );
  return { ...rest, isDefault };
};
```
`RecipeBookDetailParams` 타입(`src/entities/recipe-book/api/types.ts`)에 `lang?: Locale;` 추가. `import type { Locale } from "@/shared/i18n";`.

- [ ] **Step 4: 그리드 queryFn에 lang 전파 (T-08)**

`src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx`:
- import 추가: `import { useUserPagesLocale } from "@/shared/i18n";`
- 컴포넌트 상단: `const locale = useUserPagesLocale();`
- queryFn 수정:
```tsx
    queryFn: ({ pageParam }) =>
      getRecipeBookDetail(bookId, {
        page: pageParam,
        size: BOOK_DETAIL_PAGE_SIZE,
        sort: DEFAULT_BOOK_SORT,
        lang: locale,
      }),
```

- [ ] **Step 5: 통과 확인**

Run: `npx jest src/entities/recipe-book/api/__tests__/getRecipeBookDetail.test.ts src/entities/recipe-book/model/__tests__/queryKeys.test.ts`
Expected: PASS. 이어 `npx tsc --noEmit` → 에러 없음.

- [ ] **Step 6: 커밋**

```bash
git add src/entities/recipe-book/api/getRecipeBookDetail.ts src/entities/recipe-book/api/types.ts src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx src/entities/recipe-book/api/__tests__/getRecipeBookDetail.test.ts src/entities/recipe-book/model/__tests__/queryKeys.test.ts
git commit -m "feat(i18n): propagate lang to recipe-book detail recipes (S2)" -- src/entities/recipe-book/api/getRecipeBookDetail.ts src/entities/recipe-book/api/types.ts src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx src/entities/recipe-book/api/__tests__/getRecipeBookDetail.test.ts src/entities/recipe-book/model/__tests__/queryKeys.test.ts
```

---

## Task 2: 상세 페이지 chrome (S1, walking skeleton)

**Files:**
- Modify: `src/shared/i18n/types.ts` (recipeBooks: `editButton`, `selectedCount`, `renameAria`, `grid`)
- Modify: `src/shared/i18n/messages/{ko,ja,en}/userPages.ts`
- Modify: `src/widgets/RecipeBookDetail/RecipeBookDetailHeader.tsx`
- Modify: `src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx`
- Test: `src/widgets/RecipeBookDetail/__tests__/RecipeBookDetailHeader.i18n.test.tsx` (create)
- Test: `src/widgets/RecipeBookDetail/__tests__/RecipeBookRecipeGrid.i18n.test.tsx` (create)

- [ ] **Step 1: 사전 타입 확장**

`src/shared/i18n/types.ts`의 `recipeBooks: { ... }` 안에 추가:
```ts
    editButton: string;
    selectedCount: string;
    renameAria: string;
    grid: {
      emptyTitle: string;
      emptyCta: string;
      selectAria: string;
      deselectAria: string;
    };
```

- [ ] **Step 2: 세 로케일 사전 값 작성**

`messages/ko/userPages.ts` `recipeBooks`에 추가:
```ts
    editButton: "편집",
    selectedCount: "{count}개 선택",
    renameAria: "이름 변경",
    grid: {
      emptyTitle: "아직 저장한 레시피가 없어요",
      emptyCta: "레시피 둘러보기 →",
      selectAria: "선택",
      deselectAria: "선택 해제",
    },
```
`messages/ja/userPages.ts`:
```ts
    editButton: "編集",
    selectedCount: "{count}件選択中",
    renameAria: "名前を変更",
    grid: {
      emptyTitle: "保存したレシピはまだありません",
      emptyCta: "レシピを見る →",
      selectAria: "選択",
      deselectAria: "選択を解除",
    },
```
`messages/en/userPages.ts`:
```ts
    editButton: "Edit",
    selectedCount: "{count} selected",
    renameAria: "Rename",
    grid: {
      emptyTitle: "No saved recipes yet",
      emptyCta: "Browse recipes →",
      selectAria: "Select",
      deselectAria: "Deselect",
    },
```

- [ ] **Step 3: 실패 테스트 작성 (T-01~T-04)**

`src/widgets/RecipeBookDetail/__tests__/RecipeBookDetailHeader.i18n.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import type { RecipeBook } from "@/entities/recipe-book";

import { RecipeBookDetailHeader } from "../RecipeBookDetailHeader";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

const book: RecipeBook = {
  id: "b1",
  name: "집밥",
  isDefault: false,
  displayOrder: 0,
  recipeCount: 3,
};

describe("RecipeBookDetailHeader i18n", () => {
  it("ja에서 편집 버튼과 이름변경 aria가 현지화된다 (T-01)", () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { container } = render(<RecipeBookDetailHeader book={book} />);
    expect(
      screen.getByText(userPagesMessages.ja.recipeBooks.editButton)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(userPagesMessages.ja.recipeBooks.renameAria)
    ).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/[가-힣]/);
  });

  it("en에서도 한글이 없다 (T-01)", () => {
    mockPathname.mockReturnValue("/en/recipe-books/b1");
    const { container } = render(<RecipeBookDetailHeader book={book} />);
    expect(container.textContent).not.toMatch(/[가-힣]/);
  });

  it("ko는 기존 '편집' 라벨 그대로 (T-04)", () => {
    mockPathname.mockReturnValue("/recipe-books/b1");
    render(<RecipeBookDetailHeader book={book} />);
    expect(screen.getByText("편집")).toBeInTheDocument();
  });
});
```
> 편집모드 카운트(T-02)는 `useEditModeStore` 진입 상태가 필요해 store를 통해 검증. selectedCount 포맷은 사전값+format로 충분 — 별도 store 셋업 비용 대비 가치 낮아 ko/ja 사전값 존재 + format 단위로 커버(아래 grid 테스트와 동일 수준). 카운트 렌더는 컴포넌트 수정 후 수동 1회 확인.

`src/widgets/RecipeBookDetail/__tests__/RecipeBookRecipeGrid.i18n.test.tsx`:
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { RecipeBookRecipeGrid } from "../RecipeBookRecipeGrid";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/entities/recipe-book/api/getRecipeBookDetail", () => ({
  getRecipeBookDetail: jest.fn().mockResolvedValue({
    id: "b1",
    name: "집밥",
    isDefault: false,
    recipeCount: 0,
    recipes: [],
    hasNext: false,
  }),
}));

const renderGrid = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RecipeBookRecipeGrid bookId="b1" />
    </QueryClientProvider>
  );

describe("RecipeBookRecipeGrid empty state i18n", () => {
  it("ja 빈상태 제목/CTA 현지화 + 한글 0 (T-03)", async () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { container, findByText } = renderGrid();
    await findByText(userPagesMessages.ja.recipeBooks.grid.emptyTitle);
    await findByText(userPagesMessages.ja.recipeBooks.grid.emptyCta);
    expect(container.textContent).not.toMatch(/[가-힣]/);
  });

  it("ko 빈상태 기존 문구 (T-04)", async () => {
    mockPathname.mockReturnValue("/recipe-books/b1");
    const { findByText } = renderGrid();
    await findByText("아직 저장한 레시피가 없어요");
  });
});
```

- [ ] **Step 4: 실패 확인**

Run: `npx jest src/widgets/RecipeBookDetail/__tests__`
Expected: FAIL(컴포넌트가 아직 하드코딩 한글 — ja 테스트에서 `getByText(일본어)` 실패 / 한글 잔존).

- [ ] **Step 5: 헤더 현지화**

`RecipeBookDetailHeader.tsx`:
- import: `import { useUserPagesDict } from "@/shared/i18n";` + `import { format } from "@/shared/i18n";`
- 본문 상단: `const t = useUserPagesDict().recipeBooks;`
- `{selectedCount}개 선택` → `{format(t.selectedCount, { count: selectedCount })}`
- `aria-label="이름 변경"` → `aria-label={t.renameAria}`
- `편집` → `{t.editButton}`

- [ ] **Step 6: 그리드 빈상태 현지화**

`RecipeBookRecipeGrid.tsx` — `EmptyState`와 `SelectionOverlay`가 `t`를 써야 함. 둘 다 `useUserPagesDict().recipeBooks`를 자체 호출(자가판정 훅이라 prop drilling 불필요):
- `EmptyState`:
```tsx
const EmptyState = () => {
  const router = useRouter();
  const t = useUserPagesDict().recipeBooks.grid;
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 text-5xl" aria-hidden>🍳</div>
      <p className="text-ink-muted mb-6 text-base">{t.emptyTitle}</p>
      <button
        type="button"
        onClick={() => router.push("/search/results")}
        className="bg-olive-light rounded-xl px-5 py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
      >
        {t.emptyCta}
      </button>
    </div>
  );
};
```
- `SelectionOverlay`의 `aria-label`:
```tsx
  const t = useUserPagesDict().recipeBooks.grid;
  ...
  aria-label={isSelected ? t.deselectAria : t.selectAria}
```
import에 `useUserPagesDict` 추가.

- [ ] **Step 7: 통과 확인**

Run: `npx jest src/widgets/RecipeBookDetail/__tests__` → PASS. 이어 `npx tsc --noEmit`.

- [ ] **Step 8: 커밋**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages src/widgets/RecipeBookDetail
git commit -m "feat(i18n): localize recipe-book detail header + empty grid (S1)" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko/userPages.ts src/shared/i18n/messages/ja/userPages.ts src/shared/i18n/messages/en/userPages.ts src/widgets/RecipeBookDetail/RecipeBookDetailHeader.tsx src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx src/widgets/RecipeBookDetail/__tests__/RecipeBookDetailHeader.i18n.test.tsx src/widgets/RecipeBookDetail/__tests__/RecipeBookRecipeGrid.i18n.test.tsx
```

---

## Task 3: 편집 모드 플로우 (S3)

**Files:**
- Modify: `src/shared/i18n/types.ts` (`editMode`, `move`, `bulkDelete`)
- Modify: `src/shared/i18n/messages/{ko,ja,en}/userPages.ts`
- Modify: `src/features/recipe-book-edit-mode/ui/EditModeBottomBar.tsx`
- Modify: `src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx`
- Modify: `src/features/recipe-book-edit-mode/ui/BulkDeleteConfirmModal.tsx`
- Test: `src/features/recipe-book-edit-mode/ui/__tests__/EditModeBottomBar.i18n.test.tsx`
- Test: `src/features/recipe-book-edit-mode/ui/__tests__/MoveRecipesSheet.i18n.test.tsx`
- Test: `src/features/recipe-book-edit-mode/ui/__tests__/BulkDeleteConfirmModal.i18n.test.tsx`

- [ ] **Step 1: 사전 타입 확장**

`types.ts` `recipeBooks`에 추가:
```ts
    editMode: {
      selectAll: string;
      deselectAll: string;
      move: string;
      remove: string;
    };
    move: {
      heading: string;
      createNew: string;
      empty: string;
      emptyWithCreate: string;
      countSuffix: string;
      toast: string;
    };
    bulkDelete: {
      title: string;
      description: string;
      confirm: string;
      cancel: string;
      toast: string;
    };
```

- [ ] **Step 2: 세 로케일 값**

ko:
```ts
    editMode: { selectAll: "모두 선택", deselectAll: "선택 해제", move: "이동", remove: "삭제" },
    move: {
      heading: "어느 레시피북으로 이동할까요?",
      createNew: "새 레시피북 만들기",
      empty: "이동할 다른 레시피북이 없어요.",
      emptyWithCreate: "이동할 다른 레시피북이 없어요. 새로 만들어보세요.",
      countSuffix: "{count}개",
      toast: "{count}개를 {name}으로 이동했어요",
    },
    bulkDelete: {
      title: "선택한 {count}개 레시피를 레시피북에서 뺄까요?",
      description: "다른 레시피북에 저장돼 있다면 그곳에는 그대로 남아있어요.",
      confirm: "레시피북에서 빼기",
      cancel: "취소",
      toast: "{count}개 레시피를 레시피북에서 뺐어요",
    },
```
ja:
```ts
    editMode: { selectAll: "すべて選択", deselectAll: "選択を解除", move: "移動", remove: "削除" },
    move: {
      heading: "どのレシピブックに移動しますか？",
      createNew: "新しいレシピブックを作成",
      empty: "移動できる他のレシピブックがありません。",
      emptyWithCreate: "移動できる他のレシピブックがありません。新しく作成しましょう。",
      countSuffix: "{count}件",
      toast: "{count}件を「{name}」に移動しました",
    },
    bulkDelete: {
      title: "選択した{count}件のレシピをレシピブックから外しますか？",
      description: "他のレシピブックに保存されている場合は、そちらに残ります。",
      confirm: "レシピブックから外す",
      cancel: "キャンセル",
      toast: "{count}件のレシピをレシピブックから外しました",
    },
```
en:
```ts
    editMode: { selectAll: "Select all", deselectAll: "Deselect all", move: "Move", remove: "Remove" },
    move: {
      heading: "Move to which recipe book?",
      createNew: "Create new recipe book",
      empty: "No other recipe books to move to.",
      emptyWithCreate: "No other recipe books to move to. Create one.",
      countSuffix: "{count}",
      toast: "Moved {count} to “{name}”",
    },
    bulkDelete: {
      title: "Remove {count} selected recipes from this book?",
      description: "If they’re saved in other books, they’ll stay there.",
      confirm: "Remove from book",
      cancel: "Cancel",
      toast: "Removed {count} recipes from the book",
    },
```

- [ ] **Step 3: 실패 테스트 작성 (T-09, T-10, T-11, T-12, T-13, T-14)**

`EditModeBottomBar.i18n.test.tsx` — 바는 편집모드 진입 시만 렌더. store를 실제로 진입시킴:
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { useEditModeStore } from "../../model/useEditModeStore";
import { EditModeBottomBar } from "../EditModeBottomBar";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
jest.mock("@/entities/recipe-book", () => ({
  ...jest.requireActual("@/entities/recipe-book"),
  useBookRecipeIds: () => [],
  useRecipeBooks: () => ({ data: [] }),
}));

const renderBar = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <EditModeBottomBar bookId="b1" />
    </QueryClientProvider>
  );

describe("EditModeBottomBar i18n (T-09)", () => {
  beforeEach(() => useEditModeStore.getState().enter());
  afterEach(() => useEditModeStore.getState().exit());

  it("ja 바 라벨 현지화 + 한글 0", () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { container } = renderBar();
    expect(screen.getByText(userPagesMessages.ja.recipeBooks.editMode.move)).toBeInTheDocument();
    expect(screen.getByText(userPagesMessages.ja.recipeBooks.editMode.remove)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/[가-힣]/);
  });

  it("ko 바 라벨 그대로 (T-14)", () => {
    mockPathname.mockReturnValue("/recipe-books/b1");
    renderBar();
    expect(screen.getByText("이동")).toBeInTheDocument();
    expect(screen.getByText("삭제")).toBeInTheDocument();
  });
});
```
> `useEditModeStore` 실제 store 사용. `enter()`/`exit()` 메서드명은 `EditModeBottomBar.tsx`의 `s.enter`/`s.exit` 기준. store 파일에서 정확한 시그니처 확인.

`MoveRecipesSheet.i18n.test.tsx` (Radix portal → `baseElement`):
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { format } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { MoveRecipesSheet } from "../MoveRecipesSheet";
import { useEditModeStore } from "../../model/useEditModeStore";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const addToast = jest.fn();
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: (sel: (s: { addToast: typeof addToast }) => unknown) =>
    sel({ addToast }),
}));

const mutateAsync = jest.fn().mockResolvedValue(undefined);
jest.mock("@/entities/recipe-book", () => ({
  ...jest.requireActual("@/entities/recipe-book"),
  useRecipeBooks: () => ({
    data: [
      { id: "b1", name: "집밥", isDefault: true, displayOrder: 0, recipeCount: 2 },
      { id: "b2", name: "집밥상", isDefault: false, displayOrder: 1, recipeCount: 5 },
    ],
  }),
  useMoveRecipes: () => ({ mutateAsync, isPending: false }),
}));

const renderSheet = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MoveRecipesSheet open onOpenChange={() => {}} fromBookId="b1" />
    </QueryClientProvider>
  );

describe("MoveRecipesSheet i18n", () => {
  beforeEach(() => {
    addToast.mockClear();
    mutateAsync.mockClear();
    useEditModeStore.setState({ selectedIds: new Set(["r1", "r2"]) });
  });

  it("ja 시트 portal 내 한글 0 (T-10)", () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { baseElement } = renderSheet();
    expect(
      screen.getByText(userPagesMessages.ja.recipeBooks.move.heading)
    ).toBeInTheDocument();
    expect(baseElement.textContent).not.toMatch(/[가-힣]/);
  });

  it("ja 이동 토스트가 {name} 보간 + 조사 없음 (T-11)", async () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    renderSheet();
    fireEvent.click(screen.getByText("집밥상"));
    await waitFor(() =>
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: format(userPagesMessages.ja.recipeBooks.move.toast, {
            count: 2,
            name: "집밥상",
          }),
        })
      )
    );
    const msg = addToast.mock.calls[0][0].message as string;
    expect(msg).not.toContain("으로");
    expect(msg).toContain("集");
  });

  it("ko 토스트는 기존 조사 포함 (T-14)", async () => {
    mockPathname.mockReturnValue("/recipe-books/b1");
    renderSheet();
    fireEvent.click(screen.getByText("집밥상"));
    await waitFor(() =>
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({ message: "2개를 집밥상으로 이동했어요" })
      )
    );
  });
});
```
> `b.name` "집밥상"은 한글 데이터(유저 책 이름) — no-Hangul 게이트는 chrome만 봐야 하므로 T-10 테스트의 books는 한글 이름이 portal에 노출됨에 주의. **데이터 책 이름은 비목표**라 no-Hangul 단언이 데이터에 걸린다. 따라서 T-10 시트 렌더 테스트는 books를 라틴 이름으로(`name: "Home"`, `"Daily"`) 두고 chrome만 검사하고, T-11/T-14 보간 테스트는 한글 이름으로 둔다. → T-10 mock books를 `[{id:"b1",name:"Home",...},{id:"b2",name:"Daily",...}]`로 분리.

`BulkDeleteConfirmModal.i18n.test.tsx` (DeleteModal=Radix Dialog → `baseElement`):
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { format } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { BulkDeleteConfirmModal } from "../BulkDeleteConfirmModal";
import { useEditModeStore } from "../../model/useEditModeStore";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const addToast = jest.fn();
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: (sel: (s: { addToast: typeof addToast }) => unknown) => sel({ addToast }),
}));

const mutateAsync = jest.fn().mockResolvedValue(undefined);
jest.mock("@/entities/recipe-book", () => ({
  ...jest.requireActual("@/entities/recipe-book"),
  useRemoveRecipesFromBook: () => ({ mutateAsync, isPending: false }),
}));

describe("BulkDeleteConfirmModal i18n", () => {
  beforeEach(() => {
    addToast.mockClear();
    mutateAsync.mockClear();
    useEditModeStore.setState({ selectedIds: new Set(["r1", "r2"]) });
  });

  it("ja 모달 title {count} 보간 + 한글 0 (T-12)", () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { baseElement } = render(
      <BulkDeleteConfirmModal open onOpenChange={() => {}} bookId="b1" />
    );
    expect(
      screen.getByText(format(userPagesMessages.ja.recipeBooks.bulkDelete.title, { count: 2 }))
    ).toBeInTheDocument();
    expect(baseElement.textContent).not.toMatch(/[가-힣]/);
  });

  it("ja 빼기 토스트 {count} 보간 (T-13)", async () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    render(<BulkDeleteConfirmModal open onOpenChange={() => {}} bookId="b1" />);
    fireEvent.click(
      screen.getByText(userPagesMessages.ja.recipeBooks.bulkDelete.confirm)
    );
    await waitFor(() =>
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: format(userPagesMessages.ja.recipeBooks.bulkDelete.toast, { count: 2 }),
        })
      )
    );
  });
});
```

- [ ] **Step 4: 실패 확인**

Run: `npx jest src/features/recipe-book-edit-mode` → FAIL.

- [ ] **Step 5: 컴포넌트 현지화**

`EditModeBottomBar.tsx`:
- import `useUserPagesDict`. `const t = useUserPagesDict().recipeBooks.editMode;`
- `{isAllSelected ? "선택 해제" : "모두 선택"}` → `{isAllSelected ? t.deselectAll : t.selectAll}`
- `이동` → `{t.move}`, `삭제` → `{t.remove}`

`MoveRecipesSheet.tsx`:
- import `useUserPagesDict`, `format`. `const t = useUserPagesDict().recipeBooks;`
- 토스트: `` `${count}개를 ${toBookName}으로 이동했어요` `` → `format(t.move.toast, { count, name: toBookName })`
- 에러 catch는 **그대로 `getRecipeBookErrorMessage(error)` 유지(T5에서 교체)**
- `새 레시피북 만들기` → `{t.move.createNew}`
- empty 삼항 → `{canCreateMore ? t.move.emptyWithCreate : t.move.empty}`
- `{b.recipeCount}개` → `{format(t.move.countSuffix, { count: b.recipeCount })}`
- heading `어느 레시피북으로 이동할까요?` → `{t.move.heading}`

`BulkDeleteConfirmModal.tsx`:
- import `useUserPagesDict`, `format`. `const t = useUserPagesDict().recipeBooks.bulkDelete;`
- 토스트 → `format(t.toast, { count })`
- 에러 catch 그대로 유지(T5)
- `title={...}` → `title={format(t.title, { count })}`
- `description=` → `{t.description}`, `confirmLabel={t.confirm}`, `cancelLabel={t.cancel}`

- [ ] **Step 6: 통과 확인**

Run: `npx jest src/features/recipe-book-edit-mode` → PASS. `npx tsc --noEmit`.

- [ ] **Step 7: 커밋**

```bash
git add src/shared/i18n src/features/recipe-book-edit-mode
git commit -m "feat(i18n): localize recipe-book edit-mode (bar/move/remove) (S3)" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko/userPages.ts src/shared/i18n/messages/ja/userPages.ts src/shared/i18n/messages/en/userPages.ts src/features/recipe-book-edit-mode/ui/EditModeBottomBar.tsx src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx src/features/recipe-book-edit-mode/ui/BulkDeleteConfirmModal.tsx src/features/recipe-book-edit-mode/ui/__tests__/EditModeBottomBar.i18n.test.tsx src/features/recipe-book-edit-mode/ui/__tests__/MoveRecipesSheet.i18n.test.tsx src/features/recipe-book-edit-mode/ui/__tests__/BulkDeleteConfirmModal.i18n.test.tsx
```

---

## Task 4: 책 관리 시트 (S4) — 이름변경·생성·삭제 + zod 팩토리

**Files:**
- Modify: `src/shared/i18n/types.ts` (`rename`, `create`, `deleteBook`, `validation`)
- Modify: `src/shared/i18n/messages/{ko,ja,en}/userPages.ts`
- Modify: `src/entities/recipe-book/model/schema.ts` (팩토리)
- Modify: `src/entities/recipe-book/index.ts` (export `buildRecipeBookFormSchema`)
- Modify: `src/features/recipe-book-rename/ui/RenameRecipeBookSheet.tsx`
- Modify: `src/features/recipe-book-create/ui/CreateRecipeBookSheet.tsx`
- Modify: `src/features/recipe-book-delete/ui/DeleteRecipeBookModal.tsx`
- Test: `src/entities/recipe-book/model/__tests__/schema.test.ts`
- Test: `src/features/recipe-book-rename/ui/__tests__/RenameRecipeBookSheet.i18n.test.tsx`
- Test: `src/features/recipe-book-delete/ui/__tests__/DeleteRecipeBookModal.i18n.test.tsx`

- [ ] **Step 1: 사전 타입 + 값**

`types.ts` `recipeBooks`에:
```ts
    rename: {
      title: string; placeholder: string; cancel: string;
      submit: string; submitting: string; toast: string;
    };
    create: {
      title: string; placeholder: string; cancel: string;
      submit: string; submitting: string; toast: string;
    };
    deleteBook: {
      title: string; description: string; confirm: string; cancel: string; toast: string;
    };
    validation: { nameRequired: string; nameMax: string };
```
ko:
```ts
    rename: { title: "레시피북 이름 변경", placeholder: "레시피북 이름", cancel: "취소", submit: "변경", submitting: "변경 중...", toast: "레시피북 이름이 변경되었어요" },
    create: { title: "새 레시피북 만들기", placeholder: "레시피북 이름", cancel: "취소", submit: "만들기", submitting: "만드는 중...", toast: "레시피북이 만들어졌어요" },
    deleteBook: { title: "\"{name}\" 레시피북을 삭제할까요?", description: "이 레시피북에만 저장된 레시피는 저장 목록에서도 사라져요.", confirm: "삭제", cancel: "취소", toast: "\"{name}\" 레시피북이 삭제되었어요" },
    validation: { nameRequired: "레시피북 이름을 입력해주세요", nameMax: "50자 이내로 입력해주세요" },
```
ja:
```ts
    rename: { title: "レシピブック名を変更", placeholder: "レシピブック名", cancel: "キャンセル", submit: "変更", submitting: "変更中...", toast: "レシピブック名を変更しました" },
    create: { title: "新しいレシピブックを作成", placeholder: "レシピブック名", cancel: "キャンセル", submit: "作成", submitting: "作成中...", toast: "レシピブックを作成しました" },
    deleteBook: { title: "「{name}」を削除しますか？", description: "このレシピブックにのみ保存されたレシピは、保存リストからもなくなります。", confirm: "削除", cancel: "キャンセル", toast: "「{name}」を削除しました" },
    validation: { nameRequired: "レシピブック名を入力してください", nameMax: "50文字以内で入力してください" },
```
en:
```ts
    rename: { title: "Rename recipe book", placeholder: "Recipe book name", cancel: "Cancel", submit: "Save", submitting: "Saving...", toast: "Recipe book renamed" },
    create: { title: "Create recipe book", placeholder: "Recipe book name", cancel: "Cancel", submit: "Create", submitting: "Creating...", toast: "Recipe book created" },
    deleteBook: { title: "Delete “{name}”?", description: "Recipes saved only in this book will disappear from your saved list.", confirm: "Delete", cancel: "Cancel", toast: "Deleted “{name}”" },
    validation: { nameRequired: "Enter a recipe book name", nameMax: "Use 50 characters or fewer" },
```

- [ ] **Step 2: 실패 테스트 — zod 팩토리 (T-16)**

`src/entities/recipe-book/model/__tests__/schema.test.ts`:
```ts
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { buildRecipeBookFormSchema } from "../schema";

describe("buildRecipeBookFormSchema (T-16)", () => {
  const v = userPagesMessages.ja.recipeBooks.validation;
  const schema = buildRecipeBookFormSchema(v);

  it("빈 이름 → ja nameRequired", () => {
    const r = schema.safeParse({ name: "" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toBe(v.nameRequired);
  });

  it("51자 → ja nameMax", () => {
    const r = schema.safeParse({ name: "a".repeat(51) });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toBe(v.nameMax);
  });
});
```

- [ ] **Step 3: 실패 확인** — Run: `npx jest src/entities/recipe-book/model/__tests__/schema.test.ts` → FAIL(`buildRecipeBookFormSchema` 없음).

- [ ] **Step 4: zod 팩토리 구현**

`src/entities/recipe-book/model/schema.ts` 전체 교체:
```ts
import { z } from "zod";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";
import type { UserPagesDict } from "@/shared/i18n/types";

type Validation = UserPagesDict["recipeBooks"]["validation"];

export const buildRecipeBookFormSchema = (v: Validation) =>
  z.object({
    name: z.string().trim().min(1, v.nameRequired).max(50, v.nameMax),
  });

export const recipeBookFormSchema = buildRecipeBookFormSchema(
  userPagesMessages.ko.recipeBooks.validation
);

export type RecipeBookFormValues = z.infer<typeof recipeBookFormSchema>;
```
`src/entities/recipe-book/index.ts` schema export 블록에 `buildRecipeBookFormSchema` 추가:
```ts
export {
  buildRecipeBookFormSchema,
  recipeBookFormSchema,
  type RecipeBookFormValues,
} from "./model/schema";
```

- [ ] **Step 5: 통과 확인** — `npx jest src/entities/recipe-book/model/__tests__/schema.test.ts` → PASS.

- [ ] **Step 6: 실패 테스트 — 시트 i18n (T-15, T-17, T-18, T-19, T-21)**

`RenameRecipeBookSheet.i18n.test.tsx`:
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { RenameRecipeBookSheet } from "../RenameRecipeBookSheet";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
jest.mock("@/entities/recipe-book", () => ({
  ...jest.requireActual("@/entities/recipe-book"),
  useRecipeBooks: () => ({ data: [] }),
  useUpdateRecipeBookName: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

const renderSheet = (currentName = "Home") =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RenameRecipeBookSheet open onOpenChange={() => {}} bookId="b1" currentName={currentName} />
    </QueryClientProvider>
  );

describe("RenameRecipeBookSheet i18n", () => {
  it("ja chrome 현지화 + portal 한글 0 (T-15)", () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { baseElement } = renderSheet();
    expect(screen.getByText(userPagesMessages.ja.recipeBooks.rename.title)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(userPagesMessages.ja.recipeBooks.rename.placeholder)
    ).toBeInTheDocument();
    expect(baseElement.textContent).not.toMatch(/[가-힣]/);
  });

  it("ja 빈값 제출 → ja validation 메시지 (T-17)", async () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    renderSheet("Home");
    const input = screen.getByPlaceholderText(
      userPagesMessages.ja.recipeBooks.rename.placeholder
    );
    fireEvent.change(input, { target: { value: "  " } });
    fireEvent.click(screen.getByText(userPagesMessages.ja.recipeBooks.rename.submit));
    await waitFor(() =>
      expect(
        screen.getByText(userPagesMessages.ja.recipeBooks.validation.nameRequired)
      ).toBeInTheDocument()
    );
  });

  it("ko title 그대로 (T-21)", () => {
    mockPathname.mockReturnValue("/recipe-books/b1");
    renderSheet();
    expect(screen.getByText("레시피북 이름 변경")).toBeInTheDocument();
  });
});
```
> `useUpdateRecipeBookName(bookId)` 시그니처는 RenameSheet의 `useUpdateRecipeBookName(bookId)` 호출 기준. 실제 export 확인 후 mock 시그니처 맞출 것.

`DeleteRecipeBookModal.i18n.test.tsx`:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { format } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { DeleteRecipeBookModal } from "../DeleteRecipeBookModal";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
const addToast = jest.fn();
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: (sel: (s: { addToast: typeof addToast }) => unknown) => sel({ addToast }),
}));
const mutateAsync = jest.fn().mockResolvedValue(undefined);
jest.mock("@/entities/recipe-book", () => ({
  ...jest.requireActual("@/entities/recipe-book"),
  useDeleteRecipeBook: () => ({ mutateAsync, isPending: false }),
}));

describe("DeleteRecipeBookModal i18n", () => {
  beforeEach(() => { addToast.mockClear(); mutateAsync.mockClear(); });

  it("ja title {name} 보간 + 한글 0 (T-19)", () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { baseElement } = render(
      <DeleteRecipeBookModal open onOpenChange={() => {}} bookId="b1" bookName="Home" />
    );
    expect(
      screen.getByText(format(userPagesMessages.ja.recipeBooks.deleteBook.title, { name: "Home" }))
    ).toBeInTheDocument();
    expect(baseElement.textContent).not.toMatch(/[가-힣]/);
  });

  it("ja 삭제 토스트 {name} 보간 (T-18)", async () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    render(<DeleteRecipeBookModal open onOpenChange={() => {}} bookId="b1" bookName="Home" />);
    fireEvent.click(screen.getByText(userPagesMessages.ja.recipeBooks.deleteBook.confirm));
    await waitFor(() =>
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: format(userPagesMessages.ja.recipeBooks.deleteBook.toast, { name: "Home" }),
        })
      )
    );
  });
});
```

- [ ] **Step 7: 실패 확인** — `npx jest src/features/recipe-book-rename src/features/recipe-book-delete` → FAIL.

- [ ] **Step 8: 시트 현지화 구현**

세 컴포넌트 공통: import `useUserPagesDict`(+`format`/`buildRecipeBookFormSchema`/`useMemo` 필요시), `const t = useUserPagesDict().recipeBooks;`. **에러 catch는 기존 `getRecipeBookErrorMessage` 유지(T5 교체)**.

`RenameRecipeBookSheet.tsx`:
- `DUPLICATE_ERROR_HINT`/`DEFAULT_BOOK_HINT` 상수와 substring 분기는 **T5에서 제거**. 이 task에선 chrome/검증만:
- resolver: 상단에 `const schema = useMemo(() => buildRecipeBookFormSchema(t.validation), [t.validation]);` → `useForm({ resolver: zodResolver(schema), ... })`
- 클라 중복 사전체크 메시지 `"이미 같은 이름의 레시피북이 있어요"` → `t.errors[1107]` (errors 키는 T5에서 추가되므로, **이 task에선 임시로 `t.rename.toast` 아님** — 순서 충돌 회피: 클라 중복체크 메시지 교체도 T5로 미룬다. 이 task에선 그대로 ko 문자열 둠). ✅ 결정: 클라 중복 메시지·에러 catch = T5. 이 task = title/placeholder/cancel/submit/submitting/성공토스트/validation만.
- `placeholder="레시피북 이름"` → `placeholder={t.rename.placeholder}`
- 성공 토스트 → `t.rename.toast`
- `취소` → `{t.rename.cancel}`
- `{updateMutation.isPending ? "변경 중..." : "변경"}` → `{updateMutation.isPending ? t.rename.submitting : t.rename.submit}`
- title `레시피북 이름 변경` → `{t.rename.title}`

`CreateRecipeBookSheet.tsx`: 동일 패턴으로 `t.create.*`. 클라 중복체크/`DUPLICATE_ERROR_HINT`·catch = T5.

`DeleteRecipeBookModal.tsx`:
- `title={...}` → `title={format(t.deleteBook.title, { name: bookName })}`
- `description` → `{t.deleteBook.description}`, `confirmLabel={t.deleteBook.confirm}`, `cancelLabel={t.deleteBook.cancel}`
- 성공 토스트 → `format(t.deleteBook.toast, { name: bookName })`
- 에러 catch 유지(T5)

- [ ] **Step 9: 통과 확인** — `npx jest src/features/recipe-book-rename src/features/recipe-book-delete src/entities/recipe-book/model/__tests__/schema.test.ts` → PASS. `npx tsc --noEmit`.

- [ ] **Step 10: 커밋**

```bash
git add src/shared/i18n src/entities/recipe-book/model/schema.ts src/entities/recipe-book/index.ts src/features/recipe-book-rename src/features/recipe-book-create src/features/recipe-book-delete
git commit -m "feat(i18n): localize recipe-book rename/create/delete sheets + locale-aware zod (S4)" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko/userPages.ts src/shared/i18n/messages/ja/userPages.ts src/shared/i18n/messages/en/userPages.ts src/entities/recipe-book/model/schema.ts src/entities/recipe-book/index.ts src/features/recipe-book-rename/ui/RenameRecipeBookSheet.tsx src/features/recipe-book-create/ui/CreateRecipeBookSheet.tsx src/features/recipe-book-delete/ui/DeleteRecipeBookModal.tsx src/entities/recipe-book/model/__tests__/schema.test.ts src/features/recipe-book-rename/ui/__tests__/RenameRecipeBookSheet.i18n.test.tsx src/features/recipe-book-delete/ui/__tests__/DeleteRecipeBookModal.i18n.test.tsx
```

---

## Task 5: 에러 코드 분기 현지화 (S5, edge)

**Files:**
- Modify: `src/shared/i18n/types.ts` (`errors`)
- Modify: `src/shared/i18n/messages/{ko,ja,en}/userPages.ts`
- Modify: `src/entities/recipe-book/model/errorMessages.ts`
- Modify: `src/entities/recipe-book/index.ts`
- Modify: 호출부 6개 — `recipe-book-{rename,create,delete}/ui/*`, `recipe-book-edit-mode/ui/{MoveRecipesSheet,BulkDeleteConfirmModal}`, `recipe-book-change/ui/ChangeBookSheet`
- Test: `src/entities/recipe-book/model/__tests__/getRecipeBookError.test.ts`
- Test: `RenameRecipeBookSheet.i18n.test.tsx`에 분기 테스트 추가(T-25, T-26)

- [ ] **Step 1: 사전 errors 타입 + 값**

`types.ts` `recipeBooks`에:
```ts
    errors: {
      1101: string; 1102: string; 1103: string; 1104: string;
      1105: string; 1106: string; 1107: string;
      fallback: string;
    };
```
ko:
```ts
    errors: {
      1101: "요청한 레시피북이 없어요.",
      1102: "이 레시피북에 접근할 수 없어요.",
      1103: "기본 레시피북은 삭제할 수 없어요.",
      1104: "기본 레시피북은 이름을 변경할 수 없어요.",
      1105: "이미 레시피북에 들어있는 레시피예요.",
      1106: "레시피북은 최대 20개까지 만들 수 있어요.",
      1107: "이미 같은 이름의 레시피북이 있어요.",
      fallback: "잠시 후 다시 시도해주세요.",
    },
```
ja:
```ts
    errors: {
      1101: "リクエストしたレシピブックが見つかりません。",
      1102: "このレシピブックにはアクセスできません。",
      1103: "デフォルトのレシピブックは削除できません。",
      1104: "デフォルトのレシピブックは名前を変更できません。",
      1105: "すでにレシピブックに入っているレシピです。",
      1106: "レシピブックは最大20個まで作成できます。",
      1107: "同じ名前のレシピブックがすでにあります。",
      fallback: "しばらくしてからもう一度お試しください。",
    },
```
en:
```ts
    errors: {
      1101: "Recipe book not found.",
      1102: "You can’t access this recipe book.",
      1103: "The default recipe book can’t be deleted.",
      1104: "The default recipe book can’t be renamed.",
      1105: "This recipe is already in the book.",
      1106: "You can create up to 20 recipe books.",
      1107: "A recipe book with this name already exists.",
      fallback: "Please try again in a moment.",
    },
```

- [ ] **Step 2: 실패 테스트 — 헬퍼 (T-22, T-23, T-24, T-28)**

`src/entities/recipe-book/model/__tests__/getRecipeBookError.test.ts`:
```ts
import { ApiError } from "@/shared/api/client";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { getRecipeBookError } from "../errorMessages";

const apiError = (code: number) =>
  new ApiError({ status: 400, data: { code } } as never);

describe("getRecipeBookError", () => {
  it("1107 → {code, ja 중복메시지} (T-22)", () => {
    const r = getRecipeBookError(apiError(1107), "ja");
    expect(r.code).toBe(1107);
    expect(r.message).toBe(userPagesMessages.ja.recipeBooks.errors[1107]);
  });

  it("1104 → {code, ja 기본책메시지} (T-23)", () => {
    const r = getRecipeBookError(apiError(1104), "ja");
    expect(r).toEqual({ code: 1104, message: userPagesMessages.ja.recipeBooks.errors[1104] });
  });

  it("미매핑/비ApiError → ja fallback (T-24)", () => {
    expect(getRecipeBookError(apiError(9999), "ja").message).toBe(
      userPagesMessages.ja.recipeBooks.errors.fallback
    );
    expect(getRecipeBookError(new Error("x"), "ja")).toEqual({
      code: null,
      message: userPagesMessages.ja.recipeBooks.errors.fallback,
    });
  });

  it("ko: 1107 한국어 메시지 (T-28)", () => {
    expect(getRecipeBookError(apiError(1107), "ko").message).toBe(
      userPagesMessages.ko.recipeBooks.errors[1107]
    );
  });
});
```
> `ApiError` 생성자 시그니처는 `@/shared/api/client` 실제 구현 확인 후 맞출 것(`getErrorData(error)`가 `{code}`를 반환하도록 구성).

- [ ] **Step 3: 실패 확인** — `npx jest src/entities/recipe-book/model/__tests__/getRecipeBookError.test.ts` → FAIL.

- [ ] **Step 4: 헬퍼 구현 + export 교체**

`src/entities/recipe-book/model/errorMessages.ts` 전체 교체:
```ts
import { ApiError } from "@/shared/api/client";
import { getErrorData } from "@/shared/api/errors";
import type { Locale } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

export type RecipeBookError = { code: number | null; message: string };

export const FIELD_ERROR_CODES = new Set<number>([1104, 1107]);

export const getRecipeBookError = (
  error: unknown,
  locale: Locale
): RecipeBookError => {
  const errors = userPagesMessages[locale].recipeBooks.errors;
  if (error instanceof ApiError) {
    const code = getErrorData(error)?.code;
    if (typeof code === "number") {
      const message =
        code in errors
          ? // numeric literal 키 객체를 런타임 코드값으로 인덱싱하기 위한 단언
            (errors as Record<number, string>)[code]
          : errors.fallback;
      return { code, message };
    }
  }
  return { code: null, message: errors.fallback };
};
```
`src/entities/recipe-book/index.ts` — 기존 errorMessages export 블록 교체:
```ts
export {
  FIELD_ERROR_CODES,
  getRecipeBookError,
  type RecipeBookError,
} from "./model/errorMessages";
```
(`getRecipeBookErrorMessage`/`RECIPE_BOOK_ERROR_MESSAGES`/`FALLBACK_ERROR_MESSAGE` export 삭제.)

- [ ] **Step 5: 통과 확인** — `npx jest src/entities/recipe-book/model/__tests__/getRecipeBookError.test.ts` → PASS. (이 시점 `npx tsc --noEmit`는 호출부 미마이그레이션으로 FAIL 예상 — Step 6에서 해소.)

- [ ] **Step 6: 호출부 6개 마이그레이션**

각 컴포넌트: `const locale = useUserPagesLocale();` 추가(import `useUserPagesLocale`). `getRecipeBookErrorMessage(error)` 호출 제거.

`MoveRecipesSheet.tsx` / `BulkDeleteConfirmModal.tsx` / `DeleteRecipeBookModal.tsx` (단순 토스트):
```tsx
} catch (error) {
  addToast({ message: getRecipeBookError(error, locale).message, variant: "error" });
}
```

`RenameRecipeBookSheet.tsx`:
- 상수 `DUPLICATE_ERROR_HINT`/`DEFAULT_BOOK_HINT` 삭제.
- 클라 중복 사전체크: `form.setError("name", { message: t.errors[1107] })`
- catch:
```tsx
} catch (error) {
  const { code, message } = getRecipeBookError(error, locale);
  if (code !== null && FIELD_ERROR_CODES.has(code)) {
    form.setError("name", { message });
  } else {
    addToast({ message, variant: "error" });
  }
}
```

`CreateRecipeBookSheet.tsx`:
- 상수 `DUPLICATE_ERROR_HINT` 삭제.
- 클라 중복: `form.setError("name", { message: t.errors[1107] })`
- catch: rename과 동일 코드 분기.

`ChangeBookSheet.tsx`: 단순 토스트 catch만 동일 교체(나머지 chrome은 T6).

import 정리: 각 파일에서 `getRecipeBookErrorMessage` 제거, `getRecipeBookError`(+필요시 `FIELD_ERROR_CODES`) 추가.

- [ ] **Step 7: 실패 테스트 — 분기(T-25, T-26)** `RenameRecipeBookSheet.i18n.test.tsx`에 추가

mock에 `useUpdateRecipeBookName`가 reject하도록:
```tsx
import { ApiError } from "@/shared/api/client";
// ...상단 mock의 useUpdateRecipeBookName를 테스트별로 제어 가능하게 변수화
const updateMock = jest.fn();
jest.mock("@/entities/recipe-book", () => ({
  ...jest.requireActual("@/entities/recipe-book"),
  useRecipeBooks: () => ({ data: [] }),
  useUpdateRecipeBookName: () => ({ mutateAsync: updateMock, isPending: false }),
}));

it("1107 → 인라인 필드 에러(ja), 토스트 아님 (T-25)", async () => {
  mockPathname.mockReturnValue("/ja/recipe-books/b1");
  updateMock.mockRejectedValueOnce(new ApiError({ status: 400, data: { code: 1107 } } as never));
  renderSheet("Home");
  const input = screen.getByPlaceholderText(userPagesMessages.ja.recipeBooks.rename.placeholder);
  fireEvent.change(input, { target: { value: "New" } });
  fireEvent.click(screen.getByText(userPagesMessages.ja.recipeBooks.rename.submit));
  await waitFor(() =>
    expect(screen.getByText(userPagesMessages.ja.recipeBooks.errors[1107])).toBeInTheDocument()
  );
  expect(addToast).not.toHaveBeenCalled();
});

it("1102 → 토스트(ja), 필드 에러 아님 (T-26)", async () => {
  mockPathname.mockReturnValue("/ja/recipe-books/b1");
  updateMock.mockRejectedValueOnce(new ApiError({ status: 400, data: { code: 1102 } } as never));
  renderSheet("Home");
  const input = screen.getByPlaceholderText(userPagesMessages.ja.recipeBooks.rename.placeholder);
  fireEvent.change(input, { target: { value: "New" } });
  fireEvent.click(screen.getByText(userPagesMessages.ja.recipeBooks.rename.submit));
  await waitFor(() =>
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: userPagesMessages.ja.recipeBooks.errors[1102] })
    )
  );
});
```
> `addToast`는 이 파일 상단에 toast store mock 추가 필요(Move 테스트 패턴 복붙). RenameSheet 기존 i18n 테스트의 toast mock 정비.

- [ ] **Step 8: 통과 확인 + substring 제거 검증 (T-27)**

Run: `npx jest src/features/recipe-book-rename src/features/recipe-book-create src/features/recipe-book-edit-mode src/features/recipe-book-delete src/features/recipe-book-change src/entities/recipe-book`
Expected: PASS.
Run (T-27 구조 검증): `git grep -n "같은 이름\|기본 레시피북\|getRecipeBookErrorMessage\|DUPLICATE_ERROR_HINT\|DEFAULT_BOOK_HINT" -- src/features src/entities`
Expected: **매치 0건**. 이어 `npx tsc --noEmit` → 에러 없음.

- [ ] **Step 9: 커밋**

```bash
git add src/shared/i18n src/entities/recipe-book/model/errorMessages.ts src/entities/recipe-book/index.ts src/features/recipe-book-rename src/features/recipe-book-create src/features/recipe-book-delete src/features/recipe-book-edit-mode src/features/recipe-book-change src/entities/recipe-book/model/__tests__/getRecipeBookError.test.ts
git commit -m "feat(i18n): localize recipe-book errors via code branching, drop substring matching (S5)" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko/userPages.ts src/shared/i18n/messages/ja/userPages.ts src/shared/i18n/messages/en/userPages.ts src/entities/recipe-book/model/errorMessages.ts src/entities/recipe-book/index.ts src/features/recipe-book-rename/ui/RenameRecipeBookSheet.tsx src/features/recipe-book-create/ui/CreateRecipeBookSheet.tsx src/features/recipe-book-delete/ui/DeleteRecipeBookModal.tsx src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx src/features/recipe-book-edit-mode/ui/BulkDeleteConfirmModal.tsx src/features/recipe-book-change/ui/ChangeBookSheet.tsx src/entities/recipe-book/model/__tests__/getRecipeBookError.test.ts src/features/recipe-book-rename/ui/__tests__/RenameRecipeBookSheet.i18n.test.tsx
```

---

## Task 6: 저장-to-책 픽커 ChangeBookSheet (S6)

**Files:**
- Modify: `src/shared/i18n/types.ts` (`change`)
- Modify: `src/shared/i18n/messages/{ko,ja,en}/userPages.ts`
- Modify: `src/features/recipe-book-change/ui/ChangeBookSheet.tsx`
- Test: `src/features/recipe-book-change/ui/__tests__/ChangeBookSheet.i18n.test.tsx`

- [ ] **Step 1: 사전 타입 + 값**

`types.ts` `recipeBooks`에:
```ts
    change: { heading: string; toast: string; notFound: string };
```
ko: `change: { heading: "어느 레시피북으로 옮길까요?", toast: "{name}으로 이동했어요", notFound: "현재 레시피북을 찾을 수 없어요. 새로고침해주세요." },`
ja: `change: { heading: "どのレシピブックに移動しますか？", toast: "「{name}」に移動しました", notFound: "現在のレシピブックが見つかりません。再読み込みしてください。" },`
en: `change: { heading: "Move to which recipe book?", toast: "Moved to “{name}”", notFound: "Couldn’t find the current recipe book. Please refresh." },`

> `createNew`/`empty`/`emptyWithCreate`/`countSuffix`는 `t.move.*` 재사용(동일 개념, 같은 namespace).

- [ ] **Step 2: 실패 테스트 (T-29, T-30, T-31, T-32)**

`ChangeBookSheet.i18n.test.tsx` — MoveRecipesSheet 테스트 패턴 복붙 후 props `recipeId="r1"`, mock `useMoveRecipes`:
```tsx
// (상단 mock: next/navigation usePathname, Toast store addToast, @/entities/recipe-book useRecipeBooks/useMoveRecipes)
// T-29: ja heading + t.move.createNew 노출 + baseElement 한글 0 (books는 라틴 이름)
// T-30: "Daily" 책 클릭 → addToast message === format(change.toast,{name:"Daily"}), "으로" 미포함
// T-31: fromBookId 미해결(books=[]) → addToast message === change.notFound(ja)
// T-32: ko heading "어느 레시피북으로 옮길까요?" 노출
```
구체 코드는 `MoveRecipesSheet.i18n.test.tsx`의 구조를 그대로 따르되: 헤더 단언 `userPagesMessages.ja.recipeBooks.change.heading`, 토스트 단언 `format(userPagesMessages.ja.recipeBooks.change.toast, { name })`. T-31은 `useRecipeBooks: () => ({ data: [] })`로 `fromBookId` undefined 유도(단, `onMoveComplete` prop 없이 렌더).

- [ ] **Step 3: 실패 확인** — `npx jest src/features/recipe-book-change` → FAIL.

- [ ] **Step 4: 구현**

`ChangeBookSheet.tsx`: import `useUserPagesDict`, `format`. `const t = useUserPagesDict().recipeBooks;`
- `notFound` 토스트 → `t.change.notFound`
- 성공 토스트(`onMoveComplete` 없을 때) → `format(t.change.toast, { name: toBookName })`
- `새 레시피북 만들기` → `{t.move.createNew}`
- empty 삼항 → `{canCreateMore ? t.move.emptyWithCreate : t.move.empty}`
- `{b.recipeCount}개` → `{format(t.move.countSuffix, { count: b.recipeCount })}`
- heading `어느 레시피북으로 옮길까요?` → `{t.change.heading}`
- 에러 catch는 T5에서 이미 `getRecipeBookError(error, locale).message`로 교체됨 — `locale` 이미 선언돼 있으니 재사용.

- [ ] **Step 5: 통과 확인** — `npx jest src/features/recipe-book-change` → PASS. `npx tsc --noEmit`.

- [ ] **Step 6: 전체 회귀** — `npx jest src/features/recipe-book-edit-mode src/features/recipe-book-rename src/features/recipe-book-create src/features/recipe-book-delete src/features/recipe-book-change src/widgets/RecipeBookDetail src/entities/recipe-book` → 전부 PASS.

- [ ] **Step 7: 커밋**

```bash
git add src/shared/i18n src/features/recipe-book-change
git commit -m "feat(i18n): localize save-to-book picker (ChangeBookSheet) (S6)" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko/userPages.ts src/shared/i18n/messages/ja/userPages.ts src/shared/i18n/messages/en/userPages.ts src/features/recipe-book-change/ui/ChangeBookSheet.tsx src/features/recipe-book-change/ui/__tests__/ChangeBookSheet.i18n.test.tsx
```

---

## 마감: 보드 갱신

- [ ] `I18N-STATUS.md` §3 레시피북 행 🟡 → 🟢, §6에 완료 노트 append([날짜][i18n] 6 슬라이스 완료 + 교훈). 커밋.

---

## Self-Review (작성자 체크 — 완료)

**1. 요구사항→테스트→task 추적:** 매트릭스 T-01~T-32 전부 task에 배치 — T-05/06/07/08(T1), T-01~04(T2), T-09~14(T3), T-15~21+T16(T4), T-22~28(T5, T-27은 grep 스텝), T-29~32(T6). 누락 없음. 각 테스트가 매트릭스 ID 인용.
**2. Placeholder 스캔:** 코드 블록 실제 값. "확인 후 맞출 것"은 mock 시그니처 정합 지시(실제 export 시그니처는 구현 시점 파일 확인 필요 — `useUpdateRecipeBookName`/`ApiError` 생성자). placeholder 아님.
**3. 타입 일관성:** `getRecipeBookError(error, locale)`·`FIELD_ERROR_CODES`·`buildRecipeBookFormSchema(validation)`·`t.move.toast`/`t.change.toast`·`t.errors[1107]` 명칭 전 task 일치. 사전 키는 글로서리 단어(`move`/`remove`/`deleteBook`/`change`) 준수.
