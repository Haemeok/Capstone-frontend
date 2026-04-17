# Recipe Book Follow-up #1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** QA에서 발견된 7개 개선사항을 적용한다 — 용어 통일, 카드 레이아웃 개선, 액션 버튼 디자인 폴리시, 레시피 그리드 컴포넌트 통일, 이동 sheet 안에서 신규 생성, 저장 토스트 신규 액션 variant.

**Architecture:** 기존 entities/recipe-book + features/* + widgets/* 구조 그대로. 새 컴포넌트 추가 최소화 (`ChangeBookSheet`는 `MoveRecipesSheet` 재사용 또는 작은 wrapper). 토스트 위젯에 `"action"` variant 추가.

**Tech Stack:** Next.js 15 App Router, TypeScript, TanStack Query v5, Zustand, react-hook-form + zod, Tailwind, lucide-react.

**Verification:** 프로젝트에 단위 테스트 인프라 없음. 각 task = `npx tsc --noEmit` + commit. 마지막에 dev server에서 수동 QA.

**Hygiene:** **`git add -A` / `git add .` 절대 금지.** 명시된 경로만 stage.

---

## Phase 0: 사전 준비

### Task 0.1: 브랜치 / 작업 위치 확인

- [ ] **Step 1: 현재 브랜치가 `feature/17`인지**

```bash
git branch --show-current
```

Expected: `feature/17`

- [ ] **Step 2: 직전 커밋 sha 기록 (rollback baseline)**

```bash
git log --oneline -1
```

기록: `<SHA>` (이 plan 시작 직전 커밋)

---

## Phase 1: 용어 통일 ("폴더" → "레시피북")

> **"폴더"** 라는 한국어 단어를 **모두 "레시피북"**으로 교체. 함수명/심볼은 그대로. UI 텍스트만 변경.

### Task 1.1: errorMessages 매핑 변경

**Files:**
- Modify: `src/entities/recipe-book/model/errorMessages.ts`

- [ ] **Step 1: 7개 메시지에서 "폴더" → "레시피북"**

Read the file first. Then replace the `RECIPE_BOOK_ERROR_MESSAGES` object with:

```ts
export const RECIPE_BOOK_ERROR_MESSAGES: Record<number, string> = {
  1101: "요청한 레시피북이 없어요.",
  1102: "이 레시피북에 접근할 수 없어요.",
  1103: "기본 레시피북은 삭제할 수 없어요.",
  1104: "기본 레시피북은 이름을 변경할 수 없어요.",
  1105: "이미 레시피북에 들어있는 레시피예요.",
  1106: "레시피북은 최대 20개까지 만들 수 있어요.",
  1107: "이미 같은 이름의 레시피북이 있어요.",
};
```

- [ ] **Step 2: type check + commit**

```bash
npx tsc --noEmit
git add src/entities/recipe-book/model/errorMessages.ts
git commit -m "feat(recipe-book): rename '폴더' to '레시피북' in error messages"
```

### Task 1.2: Sheets/Modals 카피 변경

**Files:**
- Modify: `src/features/recipe-book-create/ui/CreateRecipeBookSheet.tsx`
- Modify: `src/features/recipe-book-rename/ui/RenameRecipeBookSheet.tsx`
- Modify: `src/features/recipe-book-delete/ui/DeleteRecipeBookModal.tsx`
- Modify: `src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx`
- Modify: `src/features/recipe-book-edit-mode/ui/BulkDeleteConfirmModal.tsx`

- [ ] **Step 1: CreateRecipeBookSheet.tsx**

Read first. Replace text strings:
- 헤더 title: `"새 폴더 만들기"` → `"새 레시피북 만들기"`
- placeholder: `"폴더 이름"` → `"레시피북 이름"`
- duplicate error: `"이미 같은 이름의 폴더가 있어요"` → `"이미 같은 이름의 레시피북이 있어요"`
- toast success: `"폴더가 만들어졌어요"` → `"레시피북이 만들어졌어요"`

- [ ] **Step 2: RenameRecipeBookSheet.tsx**

- 헤더 title: `"폴더 이름 변경"` → `"레시피북 이름 변경"`
- placeholder: `"폴더 이름"` → `"레시피북 이름"`
- duplicate error: `"이미 같은 이름의 폴더가 있어요"` → `"이미 같은 이름의 레시피북이 있어요"`
- toast success: `"폴더 이름이 변경되었어요"` → `"레시피북 이름이 변경되었어요"`

- [ ] **Step 3: DeleteRecipeBookModal.tsx**

- title template: `` `"${bookName}" 폴더를 삭제할까요?` `` → `` `"${bookName}" 레시피북을 삭제할까요?` ``
- description: `"이 폴더에만 저장된 레시피는 저장 목록에서도 사라져요."` → `"이 레시피북에만 저장된 레시피는 저장 목록에서도 사라져요."`
- toast success: `` `"${bookName}" 폴더가 삭제되었어요` `` → `` `"${bookName}" 레시피북이 삭제되었어요` ``

- [ ] **Step 4: MoveRecipesSheet.tsx**

- 헤더 title: `"어느 폴더로 이동할까요?"` → `"어느 레시피북으로 이동할까요?"`
- empty state: `"이동할 다른 폴더가 없어요. 먼저 새 폴더를 만들어주세요."` → `"이동할 다른 레시피북이 없어요. 먼저 새 레시피북을 만들어주세요."`
- toast: `` `${count}개를 ${toBookName}으로 이동했어요` `` (이미 폴더 단어 없으니 그대로 유지)

- [ ] **Step 5: BulkDeleteConfirmModal.tsx**

- title template: `` `선택한 ${count}개 레시피를 폴더에서 뺄까요?` `` → `` `선택한 ${count}개 레시피를 레시피북에서 뺄까요?` ``
- description: `"다른 폴더에 저장돼 있다면 그곳에는 그대로 남아있어요."` → `"다른 레시피북에 저장돼 있다면 그곳에는 그대로 남아있어요."`
- confirm label: `"폴더에서 빼기"` → `"레시피북에서 빼기"`
- toast: `` `${count}개 레시피를 폴더에서 뺐어요` `` → `` `${count}개 레시피를 레시피북에서 뺐어요` ``

- [ ] **Step 6: type check + commit**

```bash
npx tsc --noEmit
git add src/features/recipe-book-create/ui/CreateRecipeBookSheet.tsx \
        src/features/recipe-book-rename/ui/RenameRecipeBookSheet.tsx \
        src/features/recipe-book-delete/ui/DeleteRecipeBookModal.tsx \
        src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx \
        src/features/recipe-book-edit-mode/ui/BulkDeleteConfirmModal.tsx
git commit -m "feat(recipe-book): rename '폴더' to '레시피북' in sheets and modals"
```

### Task 1.3: Widgets 카피 변경

**Files:**
- Modify: `src/widgets/RecipeBookGrid/CreateRecipeBookCard.tsx`
- Modify: `src/widgets/RecipeBookGrid/RecipeBookCardMenu.tsx`
- Modify: `src/widgets/RecipeBookGrid/RecipeBookGrid.tsx`

- [ ] **Step 1: CreateRecipeBookCard.tsx**

- aria-label: `"폴더 만들기"` → `"레시피북 만들기"`
- 텍스트: `"폴더 만들기"` → `"레시피북 만들기"`

- [ ] **Step 2: RecipeBookCardMenu.tsx**

- aria-label: `"폴더 메뉴"` → `"레시피북 메뉴"`

- [ ] **Step 3: RecipeBookGrid.tsx**

- error fallback message: `"폴더 목록을 불러올 수 없어요"` → `"레시피북 목록을 불러올 수 없어요"`
- error fallback message: `"폴더를 불러올 수 없어요"` → `"레시피북을 불러올 수 없어요"`

- [ ] **Step 4: type check + commit**

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookGrid/CreateRecipeBookCard.tsx \
        src/widgets/RecipeBookGrid/RecipeBookCardMenu.tsx \
        src/widgets/RecipeBookGrid/RecipeBookGrid.tsx
git commit -m "feat(recipe-book): rename '폴더' to '레시피북' in grid widgets"
```

### Task 1.4: 잔존 검증

**Files:** (없음 — 검증만)

- [ ] **Step 1: grep으로 누락된 "폴더" 잔존 확인**

```bash
grep -rn "폴더" src/ | grep -v "node_modules" | grep -v ".test."
```

Expected: 추가로 발견되는 위치는 모두 우리 신규 코드 외부 (예: 기존 admin/card-news, 기존 recipe-create 등). recipe-book / recipe-save / view-saved-recipes / RecipeBookGrid / RecipeBookDetail 디렉토리에서 "폴더" 잔존 0건이어야 함.

발견되면 추가로 수정해서 같은 commit message로 커밋:
```bash
git commit -m "feat(recipe-book): rename remaining '폴더' references"
```

발견 0건이면 이 step은 skip.

---

## Phase 2: RecipeBookCard 레이아웃 개선 (item 6 → item 4 자동 해결)

### Task 2.1: ... 메뉴를 카드 클릭 영역 밖으로 이동

**Files:**
- Modify: `src/widgets/RecipeBookGrid/RecipeBookCard.tsx`
- Modify: `src/widgets/RecipeBookGrid/RecipeBookCardMenu.tsx`

> **목표 레이아웃:**
> ```
> [2x2 썸네일 카드]    ← 클릭 영역 (router.push)
> [이름 ─────── 개수] [⋮]   ← 한 줄 flex justify-between, 클릭 영역 밖
> ```

- [ ] **Step 1: RecipeBookCardMenu.tsx — absolute 포지셔닝 제거**

Read first. The trigger is currently `absolute right-2 top-2 ... bg-white/80 backdrop-blur ...`. Replace the trigger styling with an inline-flex button suitable for a row layout:

```tsx
<DropdownMenuTrigger asChild>
  <button
    type="button"
    onClick={(e) => e.stopPropagation()}
    className="shrink-0 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100"
    aria-label="레시피북 메뉴"
  >
    <MoreVerticalIcon size={18} />
  </button>
</DropdownMenuTrigger>
```

(Removed `absolute`, removed positioning, removed `bg-white/80 backdrop-blur`.)

- [ ] **Step 2: RecipeBookCard.tsx — restructure layout**

Read first. Replace component body with:

```tsx
"use client";

import { useRouter } from "next/navigation";

import { useRecipeBookDetail } from "@/entities/recipe-book";

import { RecipeBookCardMenu } from "./RecipeBookCardMenu";
import { RecipeBookThumbnailGrid } from "./RecipeBookThumbnailGrid";

const PREVIEW_RECIPE_COUNT = 4;

type Props = {
  bookId: string;
  name: string;
  recipeCount: number;
  isDefault: boolean;
};

export const RecipeBookCard = ({
  bookId,
  name,
  recipeCount,
  isDefault,
}: Props) => {
  const router = useRouter();
  const { data } = useRecipeBookDetail(bookId);

  const previewRecipes = data?.recipes.slice(0, PREVIEW_RECIPE_COUNT) ?? [];

  const handleClick = () => {
    router.push(`/recipe-books/${bookId}`);
  };

  return (
    <div className="group">
      <button
        type="button"
        onClick={handleClick}
        className="block w-full cursor-pointer text-left"
      >
        <RecipeBookThumbnailGrid recipes={previewRecipes} />
      </button>
      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">저장된 레시피 {recipeCount}개</p>
        </div>
        {!isDefault && (
          <RecipeBookCardMenu bookId={bookId} bookName={name} />
        )}
      </div>
    </div>
  );
};
```

Key changes:
- Thumbnail wrapped in `<button>` (semantic, keyboard-focusable). Click fires navigation.
- Name + count + menu in one flex row. Menu sits OUTSIDE the navigation button → clicks on menu cannot bubble into navigation.
- `min-w-0 flex-1` on text container so long names truncate without pushing the menu.

- [ ] **Step 3: type check + commit**

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookGrid/RecipeBookCardMenu.tsx \
        src/widgets/RecipeBookGrid/RecipeBookCard.tsx
git commit -m "fix(widget): move recipe book menu out of card click target"
```

This single change fixes both QA item 4 (menu clicks navigating into book) and item 6 (layout request).

---

## Phase 3: EditModeBottomBar 버튼 디자인

### Task 3.1: 빨간 배경 제거 — 텍스트만 빨간색

**Files:**
- Modify: `src/features/recipe-book-edit-mode/ui/EditModeBottomBar.tsx`

> **변경:**
> - 삭제: `bg-red-500 text-white` → ghost 스타일, 텍스트만 `text-red-500`
> - 이동: 톤 다운 (가벼운 ghost)

- [ ] **Step 1: 버튼 클래스 교체**

Read first to confirm current shape. Replace the two action buttons (이동 / 삭제) sections. The new versions:

```tsx
<button
  type="button"
  disabled={!hasSelection}
  onClick={() => setMoveOpen(true)}
  className={cn(
    "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
    hasSelection
      ? "text-gray-700 hover:bg-gray-100"
      : "cursor-not-allowed text-gray-300"
  )}
>
  이동
</button>
<button
  type="button"
  disabled={!hasSelection}
  onClick={() => setDeleteOpen(true)}
  className={cn(
    "rounded-xl px-4 py-2 text-sm font-bold transition-colors",
    hasSelection
      ? "text-red-500 hover:bg-red-50"
      : "cursor-not-allowed text-gray-300"
  )}
>
  삭제
</button>
```

Active states: ghost-style. Disabled: muted gray text. Delete uses `text-red-500` as the only red signal; hover bg is light `bg-red-50` (Toss-style).

- [ ] **Step 2: type check + commit**

```bash
npx tsc --noEmit
git add src/features/recipe-book-edit-mode/ui/EditModeBottomBar.tsx
git commit -m "feat(edit-mode): tone down move/delete buttons (no red background)"
```

---

## Phase 4: 레시피북 상세 — 헤더 폰트 + 레시피 카드 통일

### Task 4.1: 헤더의 레시피북 이름 폰트 키우기

**Files:**
- Modify: `src/widgets/RecipeBookDetail/RecipeBookDetailHeader.tsx`

- [ ] **Step 1: 책 이름 텍스트 클래스 변경**

Read first. The book-name span currently uses `text-base font-bold text-gray-900`. Change to:

```tsx
<span className="truncate text-lg font-bold text-gray-900">
  {book.name}
</span>
```

(`text-base` → `text-lg`)

The "{count}개 선택" text in edit mode should also bump:

```tsx
<span className="text-lg font-bold text-gray-900">
  {selectedCount}개 선택
</span>
```

(이전 `text-base` → `text-lg` 통일)

Header height stays h-14 — `text-lg` (1.125rem) fits comfortably.

- [ ] **Step 2: type check + commit**

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookDetail/RecipeBookDetailHeader.tsx
git commit -m "feat(widget): increase recipe book detail header font size"
```

### Task 4.2: 레시피 그리드 카드 — SimpleRecipeGridItem 재사용

**Files:**
- Modify: `src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx`

> **목표:** 자체 `RecipeItem` 컴포넌트 대신 기존 `SimpleRecipeGridItem` 재사용. 비율은 기존 (4/5) 유지.
>
> `SimpleRecipeGridItem` props: `{ recipe: BaseRecipeGridItem, setIsDrawerOpen: (id: string) => void, priority?: boolean, prefetch?: boolean }`. `setIsDrawerOpen`은 자기 프로필 페이지에서만 액션 메뉴 띄울 때 쓰임. 우리 컨텍스트에서는 `params?.userId` 가 없어서 `showActionButton = false` → 메뉴 렌더 안 됨. **그러므로 no-op 함수만 넘기면 됨.**

- [ ] **Step 0: BookRecipe → BaseRecipeGridItem 매핑 확인**

Read these to know required fields:

```bash
cat src/entities/recipe/model/types.ts | head -80
```

Find `BaseRecipeGridItem` definition. Required fields likely: `id`, `title`, `imageUrl`, possibly `dishType`, `likedByCurrentUser`, `likeCount`, etc.

Our `BookRecipe` has: `recipeId`, `title`, `imageUrl`, `dishType`, `addedAt`. Some `BaseRecipeGridItem` fields may be missing (likedByCurrentUser, likeCount, isAiGenerated, etc.). Decide one of:
- **a.** Provide sensible defaults (`likedByCurrentUser: false`, `likeCount: 0`, etc.) — works but UI may show wrong state
- **b.** Use a *minimal* card variant if `SimpleRecipeGridItem` exposes a "lite" mode
- **c.** Map only what's needed and adapt at the type level

Likely **(a)** is fine — like/follow state isn't critical in the recipe book grid context. **Document the choice as a `// NOTE: ` comment in code.**

If `BaseRecipeGridItem` requires fields with no sensible default (e.g., user info for author display), STOP and report — we'll need to either extend the BookRecipe API response or build a thinner card.

- [ ] **Step 1: Replace internal RecipeItem with SimpleRecipeGridItem**

Read the current file to confirm current structure. Then:

1. Remove the entire local `RecipeItem` component (lines that define it)
2. Remove the `Image`, `Link`, `CheckIcon`, `cn` imports (no longer used by this file directly — `SimpleRecipeGridItem` handles them)
3. Add import:
   ```ts
   import SimpleRecipeGridItem from "@/widgets/RecipeGrid/ui/SimpleRecipeGridItem";
   import type { BaseRecipeGridItem } from "@/entities/recipe/model/types";
   ```
4. In the component body, map BookRecipe → BaseRecipeGridItem:
   ```ts
   const mappedRecipes: BaseRecipeGridItem[] = recipes.map((r) => ({
     id: r.recipeId,
     title: r.title,
     imageUrl: r.imageUrl,
     dishType: r.dishType,
     // Defaults for fields the recipe-book API doesn't return:
     likeCount: 0,
     likedByCurrentUser: false,
     isAiGenerated: false,
     // ... add whatever else BaseRecipeGridItem requires
   }));
   const noopOpenDrawer = () => {};
   ```
   **Adjust the default values to match the actual `BaseRecipeGridItem` shape after Step 0.**
5. Replace the `recipes.map((recipe) => (<RecipeItem ... />))` block with:
   ```tsx
   {mappedRecipes.map((recipe) => (
     <div key={recipe.id} className="relative">
       <SimpleRecipeGridItem
         recipe={recipe}
         setIsDrawerOpen={noopOpenDrawer}
         prefetch={false}
       />
       {isEditMode && (
         <SelectionOverlay
           recipeId={recipe.id}
         />
       )}
     </div>
   ))}
   ```
6. Add `SelectionOverlay` as a small local component (or inline) that:
   - Reads `useEditModeStore` for `isSelected` + `toggle`
   - Renders the circular check at top-left absolutely positioned
   - On click: `e.preventDefault(); e.stopPropagation(); toggle(recipeId);`
   - Wraps a transparent overlay over the entire card so clicks don't reach the underlying Link (which would navigate)

```tsx
const SelectionOverlay = ({ recipeId }: { recipeId: string }) => {
  const isSelected = useEditModeStore((s) => s.selectedIds.has(recipeId));
  const toggle = useEditModeStore((s) => s.toggle);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(recipeId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute inset-0 z-10"
      aria-label={isSelected ? "선택 해제" : "선택"}
    >
      <span
        className={cn(
          "absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
          isSelected
            ? "border-olive-light bg-olive-light"
            : "border-white bg-white/80"
        )}
      >
        {isSelected && <CheckIcon size={14} className="text-white" />}
      </span>
    </button>
  );
};
```

(Re-import `cn` and `CheckIcon` in this file since the overlay uses them.)

- [ ] **Step 2: type check**

```bash
npx tsc --noEmit
```

If type errors about missing fields on `BaseRecipeGridItem`, fix the mapping until clean.

- [ ] **Step 3: commit**

```bash
git add src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx
git commit -m "feat(widget): reuse SimpleRecipeGridItem in recipe book detail grid"
```

---

## Phase 5: MoveRecipesSheet — "+ 새 레시피북 만들기" 인라인 추가

### Task 5.1: 빈 상태 + 일반 상태 모두에서 신규 생성 가능

**Files:**
- Modify: `src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx`

> **목표:** sheet 안의 리스트 맨 위 (또는 빈 상태 안)에 "+ 새 레시피북 만들기" entry. 클릭 시 `<CreateRecipeBookSheet>` 오픈. 생성 성공 시 닫히고 새 레시피북이 리스트에 자동 추가됨 (useRecipeBooks invalidate 이미 처리됨).

- [ ] **Step 1: import 추가**

```ts
import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { CreateRecipeBookSheet } from "@/features/recipe-book-create";
```

- [ ] **Step 2: state 추가**

컴포넌트 본문에 `const [createOpen, setCreateOpen] = useState(false);` 추가.

- [ ] **Step 3: "신규 생성" entry 추가**

`Body`의 list 시작에 항목 추가:

```tsx
<button
  type="button"
  className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
  onClick={() => setCreateOpen(true)}
>
  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-olive-light/10 text-olive-light">
    <PlusIcon size={18} />
  </span>
  <span className="font-medium text-gray-900">새 레시피북 만들기</span>
</button>
```

- [ ] **Step 4: 빈 상태 통합**

기존:
```tsx
{targets.length === 0 ? (
  <p className="px-4 py-8 text-center text-sm text-gray-500">
    이동할 다른 레시피북이 없어요. 먼저 새 레시피북을 만들어주세요.
  </p>
) : (
  <ul>...</ul>
)}
```

변경 — 항상 신규 생성 entry는 보이고, 그 아래에 list 또는 helper text:

```tsx
<div className="px-2 pb-6">
  <button
    type="button"
    className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
    onClick={() => setCreateOpen(true)}
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-olive-light/10 text-olive-light">
      <PlusIcon size={18} />
    </span>
    <span className="font-medium text-gray-900">새 레시피북 만들기</span>
  </button>
  {targets.length === 0 ? (
    <p className="px-4 py-6 text-center text-sm text-gray-500">
      이동할 다른 레시피북이 없어요. 새로 만들어보세요.
    </p>
  ) : (
    <ul>
      {targets.map((b) => (
        <li key={b.id}>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl px-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
            onClick={() => handleSelect(b.id, b.name)}
            disabled={moveMutation.isPending}
          >
            <span className="font-medium text-gray-900">{b.name}</span>
            <span className="text-sm text-gray-500">{b.recipeCount}개</span>
          </button>
        </li>
      ))}
    </ul>
  )}
</div>
```

- [ ] **Step 5: nested CreateRecipeBookSheet 렌더**

컴포넌트 return의 마지막 (Drawer/Dialog 뒤, 같은 fragment 레벨)에 추가:

```tsx
<CreateRecipeBookSheet open={createOpen} onOpenChange={setCreateOpen} />
```

- [ ] **Step 6: type check + commit**

```bash
npx tsc --noEmit
git add src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx
git commit -m "feat(edit-mode): allow creating new recipe book from move sheet"
```

---

## Phase 6: 저장 토스트 신규 액션 variant + 레시피북 변경 sheet

### Task 6.1: Toast 위젯에 액션 variant 렌더링

**Files:**
- Modify: `src/widgets/Toast/model/types.ts`
- Modify: `src/widgets/Toast/ui/Toast.tsx`

> **목표:** 흰 배경 + 메시지 + 우측 텍스트 액션 버튼 (밑줄). 기존 `action: { label, onClick }` 필드는 이미 타입에 있음. UI에서 렌더하는 새 variant `"action"`만 추가.

- [ ] **Step 1: types.ts에 variant 추가**

Read first. Add `"action"` to the variant union:

```ts
variant:
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default"
  | "rich-youtube"
  | "action";
```

- [ ] **Step 2: Toast.tsx에 새 variant 스타일 매핑 + 액션 버튼 렌더링**

Read first. Add `"action"` entry to:
- `MOBILE_TOAST_STYLE`: `action: "bg-white text-gray-900 border border-gray-100 shadow-lg"`
- `DESKTOP_TOAST_STYLE`: `action: "bg-white border border-gray-100 shadow-md"`
- `ICON_STYLE`: `action: "text-olive-light"`
- `TOAST_ICON`: import `Bookmark` from `lucide-react`, `action: Bookmark`

Then in the Toast component body, look for where the message is rendered. Add an action-button block when `variant === "action" && action`:

```tsx
{variant === "action" && action && (
  <button
    type="button"
    onClick={() => {
      action.onClick();
      removeToast(id);
    }}
    className="ml-3 shrink-0 text-sm font-medium text-olive-light underline underline-offset-2"
  >
    {action.label ?? "변경"}
  </button>
)}
```

(Place it adjacent to the message inside the toast layout — read the file to find the exact slot. The action prop also needs to be destructured from `ToastProps` at the top of the component.)

Make sure `dismissible: "action"` semantics still work (toast removes itself when action is tapped).

- [ ] **Step 3: type check + commit**

```bash
npx tsc --noEmit
git add src/widgets/Toast/model/types.ts src/widgets/Toast/ui/Toast.tsx
git commit -m "feat(toast): add 'action' variant with white bg + underlined action button"
```

### Task 6.2: ChangeBookSheet — 저장된 레시피의 소속 레시피북 변경

**Files:**
- Create: `src/features/recipe-book-change/ui/ChangeBookSheet.tsx`
- Create: `src/features/recipe-book-change/index.ts`

> **목표:** "변경" 토스트 액션이 호출하는 sheet. MoveRecipesSheet와 거의 동일하지만 `recipeIds` 가 단일 + `from`이 기본 레시피북 ID. 별도 컴포넌트로 만들어서 `useEditModeStore`에 의존하지 않게 함.

- [ ] **Step 1: 디렉토리 + 컴포넌트**

```bash
mkdir -p src/features/recipe-book-change/ui
```

`src/features/recipe-book-change/ui/ChangeBookSheet.tsx`:

```tsx
"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import {
  useMoveRecipes,
  useRecipeBooks,
  getRecipeBookErrorMessage,
} from "@/entities/recipe-book";

import { CreateRecipeBookSheet } from "@/features/recipe-book-create";

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

import { useToastStore } from "@/widgets/Toast/model/store";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  fromBookId: string;
};

const DESKTOP_BREAKPOINT = "(min-width: 768px)";

export const ChangeBookSheet = ({
  open,
  onOpenChange,
  recipeId,
  fromBookId,
}: Props) => {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);
  const { data: books } = useRecipeBooks();
  const moveMutation = useMoveRecipes();
  const addToast = useToastStore((s) => s.addToast);
  const [createOpen, setCreateOpen] = useState(false);

  const targets = (books ?? []).filter((b) => b.id !== fromBookId);

  const handleSelect = async (toBookId: string, toBookName: string) => {
    try {
      await moveMutation.mutateAsync({
        fromBookId,
        toBookId,
        recipeIds: [recipeId],
      });
      addToast({
        message: `${toBookName}으로 이동했어요`,
        variant: "success",
      });
      onOpenChange(false);
    } catch (error) {
      addToast({
        message: getRecipeBookErrorMessage(error),
        variant: "error",
      });
    }
  };

  const Body = (
    <div className="px-2 pb-6">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
        onClick={() => setCreateOpen(true)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-olive-light/10 text-olive-light">
          <PlusIcon size={18} />
        </span>
        <span className="font-medium text-gray-900">새 레시피북 만들기</span>
      </button>
      {targets.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-gray-500">
          이동할 다른 레시피북이 없어요. 새로 만들어보세요.
        </p>
      ) : (
        <ul>
          {targets.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl px-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
                onClick={() => handleSelect(b.id, b.name)}
                disabled={moveMutation.isPending}
              >
                <span className="font-medium text-gray-900">{b.name}</span>
                <span className="text-sm text-gray-500">{b.recipeCount}개</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const sheet = isDesktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold text-gray-900">
            어느 레시피북으로 옮길까요?
          </DialogTitle>
        </DialogHeader>
        {Body}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="px-6 pt-6 pb-2 text-left">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            어느 레시피북으로 옮길까요?
          </DrawerTitle>
        </DrawerHeader>
        {Body}
      </DrawerContent>
    </Drawer>
  );

  return (
    <>
      {sheet}
      <CreateRecipeBookSheet open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
};
```

- [ ] **Step 2: index.ts**

`src/features/recipe-book-change/index.ts`:

```ts
export { ChangeBookSheet } from "./ui/ChangeBookSheet";
```

- [ ] **Step 3: type check + commit**

```bash
npx tsc --noEmit
git add src/features/recipe-book-change/
git commit -m "feat(recipe-book): add ChangeBookSheet for single-recipe move flow"
```

### Task 6.3: SaveButton — 액션 토스트 + ChangeBookSheet 트리거

**Files:**
- Modify: `src/shared/ui/SaveButton.tsx`

> **목표:** 저장 ON 시 (즐겨찾기 토글로 saved=true 가 됐을 때) 토스트 표시:
> `"{기본 레시피북 이름}에 저장되었습니다."` + "변경" 액션 버튼
> 액션 버튼 누르면 ChangeBookSheet 오픈 (해당 레시피 + 기본 레시피북 ID).
>
> ⚠️ `useToggleRecipeSave` 호출하는 곳이 여러 곳 (RecipeInteractionButtons, SlideShowCarousel, MyFridgeRecipeCard, DuplicateRecipeSection, SaveButton 등). 일단 **SaveButton만** 새 토스트로 변경. 나머지는 기존 토스트 그대로 둠 (추후 점진 이행).

- [ ] **Step 1: SaveButton.tsx 읽고 현재 구조 파악**

```bash
cat src/shared/ui/SaveButton.tsx
```

기존: `useToggleRecipeSave` mutation onSuccess에서 `addToast({ message: "저장했습니다." or "저장을 해제했습니다.", variant: "success" })` 같은 형태일 것.

- [ ] **Step 2: useRecipeBooks() 추가 → 기본 레시피북 식별**

```ts
import { useRecipeBooks } from "@/entities/recipe-book";

const { data: books } = useRecipeBooks();
const defaultBook = books?.find((b) => b.isDefault);
```

- [ ] **Step 3: ChangeBookSheet state + import**

```ts
import { useState } from "react";
import { ChangeBookSheet } from "@/features/recipe-book-change";

const [changeOpen, setChangeOpen] = useState(false);
```

- [ ] **Step 4: 저장 ON 시 토스트 변경**

mutation onSuccess (또는 `useToggleRecipeSave` mutate 후 콜백) 안에서:

```ts
// when save turned ON
const wasSaved = !initialIsFavorite; // becomes true after toggle
if (wasSaved && defaultBook) {
  addToast({
    message: `${defaultBook.name}에 저장되었습니다.`,
    variant: "action",
    action: {
      label: "변경",
      onClick: () => setChangeOpen(true),
    },
  });
} else if (wasSaved) {
  // fallback (default book 정보 못 가져온 케이스)
  addToast({ message: "저장되었습니다.", variant: "success" });
} else {
  // unsave
  addToast({ message: "저장을 해제했습니다.", variant: "success" });
}
```

(Adjust to match the existing onSuccess signature in SaveButton — the variable name `initialIsFavorite` may differ.)

- [ ] **Step 5: ChangeBookSheet 렌더**

컴포넌트 return JSX 끝에:

```tsx
{defaultBook && (
  <ChangeBookSheet
    open={changeOpen}
    onOpenChange={setChangeOpen}
    recipeId={recipeId}
    fromBookId={defaultBook.id}
  />
)}
```

(`recipeId` is the prop SaveButton already receives.)

- [ ] **Step 6: type check + commit**

```bash
npx tsc --noEmit
git add src/shared/ui/SaveButton.tsx
git commit -m "feat(save-button): show action toast with change shortcut on save"
```

---

## Phase 7: 검증

### Task 7.1: 전체 type check + lint

- [ ] **Step 1: type check**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 2: lint (ours만 — 전체 코드베이스 reformat 회피)**

```bash
npm run lint -- src/entities/recipe-book src/features/recipe-book-create src/features/recipe-book-rename src/features/recipe-book-delete src/features/recipe-book-edit-mode src/features/recipe-book-change src/widgets/RecipeBookGrid src/widgets/RecipeBookDetail src/widgets/Toast src/shared/ui/SaveButton.tsx 2>&1 | tail -30
```

오류 발생 시 **해당 파일만** 수정 후 commit.

### Task 7.2: dev server 수동 QA

- [ ] **Step 1: localhost 확인**

```bash
netstat -ano | findstr :3000
```

이미 떠있으면:
```bash
cmd //c "taskkill /PID <pid> /F"
```

- [ ] **Step 2: dev 시작 (background)**

```bash
npm run dev
```

- [ ] **Step 3: 7개 항목 수동 확인**

브라우저에서 차례로:

1. **이동 sheet 안에서 신규 생성** — 폴더가 1개일 때 편집모드 → 이동 → "새 레시피북 만들기" entry 보이고, 클릭 시 nested sheet → 만들기 → 이동 sheet로 돌아와서 새 레시피북 보임 → 탭 → 이동 성공
2. **용어 통일** — UI 어디에도 "폴더" 단어 없음 (모두 "레시피북")
3. **버튼 디자인** — 삭제 버튼 빨간 배경 사라지고 텍스트만 빨간색
4. **... 메뉴 클릭** — 카드 외 영역에 위치하므로 메뉴 클릭 시 책 안으로 진입 X. 수정/삭제 정상 동작
5. **헤더 폰트 + simple grid** — 레시피북 상세 헤더 책 이름이 더 큼. 그리드 카드는 `MyRecipesTabContent`와 동일한 모양 (4/5 비율)
6. **카드 레이아웃** — 썸네일 아래 [이름 + 개수 ─── ⋮] 한 줄. 메뉴는 우측 끝
7. **저장 토스트** — 저장 버튼 (SaveButton) 누르면 흰 배경 토스트 + "{기본 레시피북 이름}에 저장되었습니다." + 우측 "변경" 밑줄 텍스트. 변경 클릭 → sheet → 다른 레시피북 선택 → 이동

문제 발견 시 별도 fix commit 후 재확인.

---

## 비범위 (이번에도 미포함)

- 저장 버튼 토스트의 새 variant를 **다른 호출처** (RecipeInteractionButtons, SlideShowCarousel, MyFridgeRecipeCard, DuplicateRecipeSection)로 확산 — 추후 점진
- `useMoveRecipes` partial-failure 롤백
- 폴더 카드 N+1 fetch 최적화 (백엔드 thumbnail 응답 추가 시)
- `addedAt` sort key (백엔드 추가 시 `DEFAULT_BOOK_SORT` 한 줄만 되돌리면 됨)
- `radix-ui` umbrella → per-primitive 트리쉐이크
- (e) 저장 버튼 자체에서 폴더 선택 다이얼로그 — 이번 토스트 액션이 사실상 그 역할 일부 대체

---

## Self-Review

**Spec 커버리지** (사용자가 적은 7개 항목 vs plan tasks):

| QA 항목 | 커버하는 task |
|---|---|
| 1. 이동 sheet에서 새 레시피북 생성 | Task 5.1 |
| 2. "폴더" 용어 X → "레시피북" | Task 1.1 / 1.2 / 1.3 / 1.4 |
| 3. 빨간 배경 X (텍스트만) | Task 3.1 |
| 4. 액션 메뉴 클릭 시 카드 진입 X | Task 2.1 (item 6과 함께 해결) |
| 5. 헤더 폰트 + simple grid 재사용 | Task 4.1 + 4.2 |
| 6. 이름+개수+메뉴 한 줄 flex between | Task 2.1 |
| 7. 저장 토스트 흰 배경 + 변경 액션 | Task 6.1 + 6.2 + 6.3 |

**Placeholder 스캔:** TBD/TODO 없음. NOTE 안내는 의도적 (코드베이스에서 실제 시그니처 확인 필요한 곳).

**Type 일관성:** `ChangeBookSheet` props (`recipeId`, `fromBookId`) 일관 사용. `RECIPE_BOOK_QUERY_KEYS`, `useMoveRecipes`, `useRecipeBooks` 모두 entity barrel에서 import.

**남은 위험:**
- Task 4.2의 `BaseRecipeGridItem` 타입 매핑 — 실제 스키마 확인 후 추가 필드 필요 가능. STEP 0에서 처리하도록 안내.
- Task 6.1의 Toast.tsx 수정 시 기존 변종 (rich-youtube 등)과의 layout 충돌 주의.
