# Recipe Book Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 레시피 저장 기능을 폴더(레시피북) 기반으로 개편하고 `favorited → saved` 마이그레이션을 완료한다.

**Architecture:** FSD 레이어를 따라 `entities/recipe-book` (API + 훅 + 스키마), 6개의 `features/*` (생성/이름변경/삭제/편집모드 + rename된 save/view-saved), 2개의 `widgets/*` (RecipeBookGrid, RecipeBookDetail), 1개 신규 페이지 (`/recipe-books/[bookId]`). 폴더 카드 자체가 자기 썸네일을 fetch하고 동일 query key로 진입 시 cache hit.

**Tech Stack:** Next.js 15 App Router, TypeScript, TanStack Query, Zustand, react-hook-form + zod, Tailwind CSS, Radix UI / shadcn (Drawer/Dialog), framer-motion, Lucide icons.

**Verification model:** 이 프로젝트에는 단위 테스트가 없다. 각 task는 `npx tsc --noEmit`로 타입 검증 후 commit. 마지막 task에서 dev server 띄워 spec의 QA checklist 수동 확인.

---

## Phase 0: Worktree & 사전 준비

### Task 0.1: 작업 브랜치 확인

**Files:** (없음)

- [ ] **Step 1: 현재 브랜치가 `feature/17`인지 확인**

```bash
git branch --show-current
```

Expected: `feature/17`

- [ ] **Step 2: spec 파일 존재 확인**

```bash
ls docs/superpowers/specs/2026-04-17-recipe-book-redesign-design.md
```

Expected: 파일 출력. spec이 정의이고 plan이 이를 구현함.

---

## Phase 1: Foundation (entities/recipe-book)

### Task 1.1: 엔드포인트 상수 추가

**Files:**
- Modify: `src/shared/config/constants/api.ts`

- [ ] **Step 1: `END_POINTS`에 레시피북 관련 엔드포인트 + `RECIPE_SAVE` alias 추가**

`src/shared/config/constants/api.ts`의 `END_POINTS` 객체 안, `RECIPE_FAVORITE` 라인 다음에 추가:

```ts
  RECIPE_FAVORITE: (id: string) => `/recipes/${id}/favorite`,
  RECIPE_SAVE: (id: string) => `/recipes/${id}/favorite`, // 동일 endpoint, 마이그레이션용 alias
  RECIPE_SAVED_BOOKS: (recipeId: string) => `/recipes/${recipeId}/saved-books`,
  RECIPE_BOOKS: "/me/recipe-books",
  RECIPE_BOOK: (bookId: string) => `/me/recipe-books/${bookId}`,
  RECIPE_BOOK_RECIPES: (bookId: string) => `/me/recipe-books/${bookId}/recipes`,
  RECIPE_BOOK_ORDER: "/me/recipe-books/order",
```

> `RECIPE_FAVORITE`은 Phase 2에서 제거. 지금은 둘 다 유지하여 마이그레이션 중간 상태에서도 컴파일 가능.

- [ ] **Step 2: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음.

- [ ] **Step 3: Commit**

```bash
git add src/shared/config/constants/api.ts
git commit -m "feat(api): add recipe book endpoint constants"
```

---

### Task 1.2: entities/recipe-book 디렉토리 + types

**Files:**
- Create: `src/entities/recipe-book/api/types.ts`

- [ ] **Step 1: 디렉토리 생성 + types.ts 작성**

```bash
mkdir -p src/entities/recipe-book/api src/entities/recipe-book/model/hooks
```

`src/entities/recipe-book/api/types.ts`:

```ts
export type RecipeBook = {
  id: string;
  name: string;
  isDefault: boolean;
  displayOrder: number;
  recipeCount: number;
};

export type BookRecipe = {
  recipeId: string;
  title: string;
  imageUrl: string;
  dishType: string;
  addedAt: string;
};

export type RecipeBookDetail = {
  id: string;
  name: string;
  isDefault: boolean;
  recipeCount: number;
  recipes: BookRecipe[];
  hasNext: boolean;
};

export type RecipeBookDetailParams = {
  page?: number;
  size?: number;
  sort?: string;
};

export type CreateRecipeBookRequest = {
  name: string;
};

export type UpdateRecipeBookNameRequest = {
  name: string;
};

export type AddRecipesToBookRequest = {
  recipeIds: string[];
};

export type AddRecipesToBookResponse = {
  addedCount: number;
  skippedCount: number;
};

export type RemoveRecipesFromBookRequest = {
  recipeIds: string[];
};

export type SavedBookSummary = {
  id: string;
  name: string;
  isDefault: boolean;
};

export type SavedBooksResponse = {
  saved: boolean;
  savedBookCount: number;
  books: SavedBookSummary[];
};

export type SaveToggleResponse = {
  saved: boolean;
  message: string;
};
```

- [ ] **Step 2: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음.

- [ ] **Step 3: Commit**

```bash
git add src/entities/recipe-book/api/types.ts
git commit -m "feat(recipe-book): add API type definitions"
```

---

### Task 1.3: API 함수들 (조회 3종)

**Files:**
- Create: `src/entities/recipe-book/api/getRecipeBooks.ts`
- Create: `src/entities/recipe-book/api/getRecipeBookDetail.ts`
- Create: `src/entities/recipe-book/api/getSavedBooks.ts`

- [ ] **Step 1: getRecipeBooks.ts**

```ts
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RecipeBook } from "./types";

export const getRecipeBooks = async (): Promise<RecipeBook[]> => {
  return api.get<RecipeBook[]>(END_POINTS.RECIPE_BOOKS);
};
```

- [ ] **Step 2: getRecipeBookDetail.ts**

```ts
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RecipeBookDetail, RecipeBookDetailParams } from "./types";

export const getRecipeBookDetail = async (
  bookId: string,
  params: RecipeBookDetailParams = {}
): Promise<RecipeBookDetail> => {
  const { page = 0, size = 20, sort = "addedAt,desc" } = params;
  return api.get<RecipeBookDetail>(END_POINTS.RECIPE_BOOK(bookId), {
    params: { page, size, sort },
  });
};
```

- [ ] **Step 3: getSavedBooks.ts**

```ts
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { SavedBooksResponse } from "./types";

export const getSavedBooks = async (
  recipeId: string
): Promise<SavedBooksResponse> => {
  return api.get<SavedBooksResponse>(END_POINTS.RECIPE_SAVED_BOOKS(recipeId));
};
```

- [ ] **Step 4: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/entities/recipe-book/api/
git commit -m "feat(recipe-book): add query API functions"
```

---

### Task 1.4: API 함수들 (mutation 5종)

**Files:**
- Create: `src/entities/recipe-book/api/createRecipeBook.ts`
- Create: `src/entities/recipe-book/api/updateRecipeBookName.ts`
- Create: `src/entities/recipe-book/api/deleteRecipeBook.ts`
- Create: `src/entities/recipe-book/api/addRecipesToBook.ts`
- Create: `src/entities/recipe-book/api/removeRecipesFromBook.ts`

- [ ] **Step 1: createRecipeBook.ts**

```ts
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { CreateRecipeBookRequest, RecipeBook } from "./types";

export const createRecipeBook = async (
  body: CreateRecipeBookRequest
): Promise<RecipeBook> => {
  return api.post<RecipeBook>(END_POINTS.RECIPE_BOOKS, body);
};
```

- [ ] **Step 2: updateRecipeBookName.ts**

```ts
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RecipeBook, UpdateRecipeBookNameRequest } from "./types";

export const updateRecipeBookName = async (
  bookId: string,
  body: UpdateRecipeBookNameRequest
): Promise<RecipeBook> => {
  return api.patch<RecipeBook>(END_POINTS.RECIPE_BOOK(bookId), body);
};
```

- [ ] **Step 3: deleteRecipeBook.ts**

```ts
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteRecipeBook = async (
  bookId: string
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(END_POINTS.RECIPE_BOOK(bookId));
};
```

- [ ] **Step 4: addRecipesToBook.ts**

```ts
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { AddRecipesToBookRequest, AddRecipesToBookResponse } from "./types";

export const addRecipesToBook = async (
  bookId: string,
  body: AddRecipesToBookRequest
): Promise<AddRecipesToBookResponse> => {
  return api.post<AddRecipesToBookResponse>(
    END_POINTS.RECIPE_BOOK_RECIPES(bookId),
    body
  );
};
```

- [ ] **Step 5: removeRecipesFromBook.ts**

```ts
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RemoveRecipesFromBookRequest } from "./types";

export const removeRecipesFromBook = async (
  bookId: string,
  body: RemoveRecipesFromBookRequest
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(
    END_POINTS.RECIPE_BOOK_RECIPES(bookId),
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
};
```

> NOTE: `apiClient`의 `delete` 메서드는 body를 직접 받지 않으므로 `options`로 `body`를 명시 전달.

- [ ] **Step 6: api/index.ts (barrel)**

`src/entities/recipe-book/api/index.ts`:

```ts
export * from "./types";
export { getRecipeBooks } from "./getRecipeBooks";
export { getRecipeBookDetail } from "./getRecipeBookDetail";
export { getSavedBooks } from "./getSavedBooks";
export { createRecipeBook } from "./createRecipeBook";
export { updateRecipeBookName } from "./updateRecipeBookName";
export { deleteRecipeBook } from "./deleteRecipeBook";
export { addRecipesToBook } from "./addRecipesToBook";
export { removeRecipesFromBook } from "./removeRecipesFromBook";
```

- [ ] **Step 7: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/entities/recipe-book/api/
git commit -m "feat(recipe-book): add mutation API functions"
```

---

### Task 1.5: Query Keys + Error Messages + Schema

**Files:**
- Create: `src/entities/recipe-book/model/queryKeys.ts`
- Create: `src/entities/recipe-book/model/errorMessages.ts`
- Create: `src/entities/recipe-book/model/schema.ts`

- [ ] **Step 1: queryKeys.ts**

```ts
export const RECIPE_BOOK_QUERY_KEYS = {
  all: ["recipe-books"] as const,
  list: () => [...RECIPE_BOOK_QUERY_KEYS.all, "list"] as const,
  detail: (bookId: string, sort: string = "addedAt,desc") =>
    [...RECIPE_BOOK_QUERY_KEYS.all, "detail", bookId, sort] as const,
  detailInfinite: (bookId: string, sort: string = "addedAt,desc") =>
    [...RECIPE_BOOK_QUERY_KEYS.all, "infinite", bookId, sort] as const,
  savedBooks: (recipeId: string) =>
    ["recipe-status", recipeId, "saved-books"] as const,
};
```

- [ ] **Step 2: errorMessages.ts**

```ts
import { ApiError } from "@/shared/api/client";

export const RECIPE_BOOK_ERROR_MESSAGES: Record<number, string> = {
  1101: "요청한 폴더가 없어요.",
  1102: "이 폴더에 접근할 수 없어요.",
  1103: "기본 폴더는 삭제할 수 없어요.",
  1104: "기본 폴더는 이름을 변경할 수 없어요.",
  1105: "이미 폴더에 들어있는 레시피예요.",
  1106: "폴더는 최대 20개까지 만들 수 있어요.",
  1107: "이미 같은 이름의 폴더가 있어요.",
};

export const FALLBACK_ERROR_MESSAGE = "잠시 후 다시 시도해주세요.";

export const getRecipeBookErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    const data = (error as any).data ?? (error as any).response;
    const code = data?.code;
    if (typeof code === "number" && RECIPE_BOOK_ERROR_MESSAGES[code]) {
      return RECIPE_BOOK_ERROR_MESSAGES[code];
    }
  }
  return FALLBACK_ERROR_MESSAGE;
};
```

> NOTE: `ApiError`의 정확한 에러 페이로드 접근 방법은 `src/shared/api/errors.ts`에 정의된 `getErrorData(apiError)`를 사용하는 게 안전. 만약 위 코드의 `data` 접근이 컴파일 에러를 내면 다음으로 교체:
>
> ```ts
> import { getErrorData } from "@/shared/api/errors";
> // ...
> const data = getErrorData(error);
> const code = data?.code;
> ```

- [ ] **Step 3: schema.ts**

```ts
import { z } from "zod";

export const recipeBookFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "폴더 이름을 입력해주세요")
    .max(50, "50자 이내로 입력해주세요"),
});

export type RecipeBookFormValues = z.infer<typeof recipeBookFormSchema>;
```

- [ ] **Step 4: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/entities/recipe-book/model/queryKeys.ts src/entities/recipe-book/model/errorMessages.ts src/entities/recipe-book/model/schema.ts
git commit -m "feat(recipe-book): add query keys, error mapping, zod schema"
```

---

### Task 1.6: 조회 훅 4종

**Files:**
- Create: `src/entities/recipe-book/model/hooks/useRecipeBooks.ts`
- Create: `src/entities/recipe-book/model/hooks/useRecipeBookDetail.ts`
- Create: `src/entities/recipe-book/model/hooks/useRecipeBookDetailInfinite.ts`
- Create: `src/entities/recipe-book/model/hooks/useSavedBooks.ts`

- [ ] **Step 1: useRecipeBooks.ts**

```ts
import { useQuery } from "@tanstack/react-query";

import { getRecipeBooks } from "@/entities/recipe-book/api";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useRecipeBooks = () => {
  return useQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.list(),
    queryFn: getRecipeBooks,
  });
};
```

- [ ] **Step 2: useRecipeBookDetail.ts**

```ts
import { useQuery } from "@tanstack/react-query";

import { getRecipeBookDetail } from "@/entities/recipe-book/api";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

type Options = {
  enabled?: boolean;
};

export const useRecipeBookDetail = (
  bookId: string,
  sort: string = "addedAt,desc",
  options: Options = {}
) => {
  return useQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.detail(bookId, sort),
    queryFn: () => getRecipeBookDetail(bookId, { page: 0, size: 20, sort }),
    enabled: options.enabled ?? Boolean(bookId),
  });
};
```

- [ ] **Step 3: useRecipeBookDetailInfinite.ts**

```ts
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import {
  getRecipeBookDetail,
  type RecipeBookDetail,
} from "@/entities/recipe-book/api";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useRecipeBookDetailInfinite = (
  bookId: string,
  sort: string = "addedAt,desc"
) => {
  const queryClient = useQueryClient();
  const previewKey = RECIPE_BOOK_QUERY_KEYS.detail(bookId, sort);
  const previewData = queryClient.getQueryData<RecipeBookDetail>(previewKey);

  return useInfiniteQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.detailInfinite(bookId, sort),
    queryFn: ({ pageParam = 0 }) =>
      getRecipeBookDetail(bookId, { page: pageParam, size: 20, sort }),
    getNextPageParam: (last, all) => (last.hasNext ? all.length : undefined),
    initialData: previewData
      ? { pages: [previewData], pageParams: [0] }
      : undefined,
    initialPageParam: 0,
    enabled: Boolean(bookId),
  });
};
```

- [ ] **Step 4: useSavedBooks.ts**

```ts
import { useQuery } from "@tanstack/react-query";

import { getSavedBooks } from "@/entities/recipe-book/api";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useSavedBooks = (recipeId: string) => {
  return useQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.savedBooks(recipeId),
    queryFn: () => getSavedBooks(recipeId),
    enabled: Boolean(recipeId),
  });
};
```

- [ ] **Step 5: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/entities/recipe-book/model/hooks/
git commit -m "feat(recipe-book): add query hooks"
```

---

### Task 1.7: Mutation 훅 5종 (단순)

**Files:**
- Create: `src/entities/recipe-book/model/hooks/useCreateRecipeBook.ts`
- Create: `src/entities/recipe-book/model/hooks/useUpdateRecipeBookName.ts`
- Create: `src/entities/recipe-book/model/hooks/useDeleteRecipeBook.ts`
- Create: `src/entities/recipe-book/model/hooks/useAddRecipesToBook.ts`
- Create: `src/entities/recipe-book/model/hooks/useRemoveRecipesFromBook.ts`

- [ ] **Step 1: useCreateRecipeBook.ts**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRecipeBook,
  type CreateRecipeBookRequest,
  type RecipeBook,
} from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useCreateRecipeBook = () => {
  const queryClient = useQueryClient();

  return useMutation<RecipeBook, Error, CreateRecipeBookRequest>({
    mutationFn: createRecipeBook,
    onSuccess: () => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.list() });
    },
  });
};
```

- [ ] **Step 2: useUpdateRecipeBookName.ts**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateRecipeBookName,
  type RecipeBook,
  type UpdateRecipeBookNameRequest,
} from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useUpdateRecipeBookName = (bookId: string) => {
  const queryClient = useQueryClient();

  return useMutation<RecipeBook, Error, UpdateRecipeBookNameRequest>({
    mutationFn: (body) => updateRecipeBookName(bookId, body),
    onSuccess: () => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.list() });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "detail", bookId],
      });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "infinite", bookId],
      });
    },
  });
};
```

- [ ] **Step 3: useDeleteRecipeBook.ts**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRecipeBook } from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useDeleteRecipeBook = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (bookId) => deleteRecipeBook(bookId),
    onSuccess: () => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.all });
    },
  });
};
```

- [ ] **Step 4: useAddRecipesToBook.ts**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addRecipesToBook,
  type AddRecipesToBookResponse,
} from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

type Variables = {
  bookId: string;
  recipeIds: string[];
};

export const useAddRecipesToBook = () => {
  const queryClient = useQueryClient();

  return useMutation<AddRecipesToBookResponse, Error, Variables>({
    mutationFn: ({ bookId, recipeIds }) =>
      addRecipesToBook(bookId, { recipeIds }),
    onSuccess: (_data, { bookId, recipeIds }) => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.list() });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "detail", bookId],
      });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "infinite", bookId],
      });
      recipeIds.forEach((recipeId) => {
        queryClient.invalidateQueries({
          queryKey: RECIPE_BOOK_QUERY_KEYS.savedBooks(recipeId),
        });
        queryClient.invalidateQueries({
          queryKey: ["recipe-status", recipeId],
        });
      });
    },
  });
};
```

- [ ] **Step 5: useRemoveRecipesFromBook.ts**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeRecipesFromBook } from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

type Variables = {
  bookId: string;
  recipeIds: string[];
};

export const useRemoveRecipesFromBook = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, Variables>({
    mutationFn: ({ bookId, recipeIds }) =>
      removeRecipesFromBook(bookId, { recipeIds }),
    onSuccess: (_data, { bookId, recipeIds }) => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.list() });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "detail", bookId],
      });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "infinite", bookId],
      });
      recipeIds.forEach((recipeId) => {
        queryClient.invalidateQueries({
          queryKey: RECIPE_BOOK_QUERY_KEYS.savedBooks(recipeId),
        });
        queryClient.invalidateQueries({
          queryKey: ["recipe-status", recipeId],
        });
      });
    },
  });
};
```

- [ ] **Step 6: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/entities/recipe-book/model/hooks/
git commit -m "feat(recipe-book): add mutation hooks (create/rename/delete/add/remove)"
```

---

### Task 1.8: Composite mutation 훅 (`useMoveRecipes`)

**Files:**
- Create: `src/entities/recipe-book/model/hooks/useMoveRecipes.ts`

- [ ] **Step 1: useMoveRecipes.ts (add 후 remove 순차 실행)**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addRecipesToBook,
  removeRecipesFromBook,
} from "@/entities/recipe-book/api";
import { triggerHaptic } from "@/shared/lib/bridge";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

type Variables = {
  fromBookId: string;
  toBookId: string;
  recipeIds: string[];
};

export const useMoveRecipes = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Variables>({
    mutationFn: async ({ fromBookId, toBookId, recipeIds }) => {
      await addRecipesToBook(toBookId, { recipeIds });
      await removeRecipesFromBook(fromBookId, { recipeIds });
    },
    onSuccess: (_data, { fromBookId, toBookId, recipeIds }) => {
      triggerHaptic("Success");
      queryClient.invalidateQueries({ queryKey: RECIPE_BOOK_QUERY_KEYS.list() });
      [fromBookId, toBookId].forEach((bookId) => {
        queryClient.invalidateQueries({
          queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "detail", bookId],
        });
        queryClient.invalidateQueries({
          queryKey: [...RECIPE_BOOK_QUERY_KEYS.all, "infinite", bookId],
        });
      });
      recipeIds.forEach((recipeId) => {
        queryClient.invalidateQueries({
          queryKey: RECIPE_BOOK_QUERY_KEYS.savedBooks(recipeId),
        });
      });
    },
  });
};
```

- [ ] **Step 2: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/entities/recipe-book/model/hooks/useMoveRecipes.ts
git commit -m "feat(recipe-book): add composite useMoveRecipes mutation"
```

---

### Task 1.9: entities barrel index

**Files:**
- Create: `src/entities/recipe-book/model/hooks/index.ts`
- Create: `src/entities/recipe-book/index.ts`

- [ ] **Step 1: hooks/index.ts**

```ts
export { useRecipeBooks } from "./useRecipeBooks";
export { useRecipeBookDetail } from "./useRecipeBookDetail";
export { useRecipeBookDetailInfinite } from "./useRecipeBookDetailInfinite";
export { useSavedBooks } from "./useSavedBooks";
export { useCreateRecipeBook } from "./useCreateRecipeBook";
export { useUpdateRecipeBookName } from "./useUpdateRecipeBookName";
export { useDeleteRecipeBook } from "./useDeleteRecipeBook";
export { useAddRecipesToBook } from "./useAddRecipesToBook";
export { useRemoveRecipesFromBook } from "./useRemoveRecipesFromBook";
export { useMoveRecipes } from "./useMoveRecipes";
```

- [ ] **Step 2: entities/recipe-book/index.ts (top barrel)**

```ts
export * from "./api";
export * from "./model/hooks";
export { RECIPE_BOOK_QUERY_KEYS } from "./model/queryKeys";
export {
  RECIPE_BOOK_ERROR_MESSAGES,
  FALLBACK_ERROR_MESSAGE,
  getRecipeBookErrorMessage,
} from "./model/errorMessages";
export {
  recipeBookFormSchema,
  type RecipeBookFormValues,
} from "./model/schema";
```

- [ ] **Step 3: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/entities/recipe-book/
git commit -m "feat(recipe-book): add barrel exports"
```

---

## Phase 2: Migration (favorited → saved)

### Task 2.1: features/recipe-favorite → features/recipe-save (디렉토리 rename)

**Files:**
- Move: `src/features/recipe-favorite/` → `src/features/recipe-save/`

- [ ] **Step 1: git mv로 디렉토리 이동 (히스토리 보존)**

```bash
git mv src/features/recipe-favorite src/features/recipe-save
```

- [ ] **Step 2: 파일 내부 심볼은 아직 그대로 (`useToggleRecipeFavorite`, `postRecipeFavorite`). 다음 task에서 변경.**

- [ ] **Step 3: 타입 체크 — 이 시점에는 `@/features/recipe-favorite` 임포트 사용처에서 에러 발생 예상**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: `Cannot find module '@/features/recipe-favorite'` 류 에러 발생 (다음 task에서 수정)

- [ ] **Step 4: 빠르게 임포트 경로 일괄 치환 (rename 완료시켜 빌드 가능 상태로 만듦)**

```bash
grep -rl "@/features/recipe-favorite" src/ | xargs sed -i 's|@/features/recipe-favorite|@/features/recipe-save|g'
```

> Windows bash 환경에서 `sed -i` 동작 확인. 안 되면 한 파일씩 수동 Edit.

- [ ] **Step 5: 타입 체크 — 임포트 에러 사라졌는지**

```bash
npx tsc --noEmit
```

Expected: 에러 없음 (또는 다른 종류의 에러만)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(features): rename recipe-favorite to recipe-save (paths only)"
```

---

### Task 2.2: features/recipe-save 내부 심볼/응답 마이그레이션

**Files:**
- Modify: `src/features/recipe-save/model/api.ts`
- Modify: `src/features/recipe-save/model/hooks.ts`
- Modify: `src/features/recipe-save/index.ts`

- [ ] **Step 1: api.ts — `postRecipeFavorite` → `postRecipeSave`, `RECIPE_FAVORITE` → `RECIPE_SAVE`, 반환 타입 명시**

`src/features/recipe-save/model/api.ts`:

```ts
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";
import type { SaveToggleResponse } from "@/entities/recipe-book";

export const postRecipeSave = async (id: string): Promise<SaveToggleResponse> => {
  return api.post<SaveToggleResponse>(END_POINTS.RECIPE_SAVE(id));
};
```

- [ ] **Step 2: hooks.ts — 심볼명 변경 + `favoriteByCurrentUser` 사용은 그대로 (entities/recipe의 `RecipeStatus`가 아직 그 필드명이면 유지). invalidate 키 `["recipes", "favorite"]` → `["recipes", "saved"]`**

`src/features/recipe-save/model/hooks.ts`:

```ts
import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { RecipeStatus } from "@/entities/recipe/model/types";
import { RECIPE_BOOK_QUERY_KEYS } from "@/entities/recipe-book";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";

import { trackReviewAction } from "@/shared/lib/review";

import { scheduleReviewGate } from "@/features/review-gate";

import { postRecipeSave } from "./api";

export const useToggleRecipeSave = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { mutate: rawMutate, ...restOfMutation } = useMutation<
    void,
    Error,
    void,
    RecipeStatus | undefined
  >({
    mutationFn: () => postRecipeSave(recipeId).then(() => undefined),
    onMutate: async () => {
      const recipeStatusQueryKey = ["recipe-status", recipeId];

      await queryClient.cancelQueries({
        queryKey: recipeStatusQueryKey,
      });

      const previousRecipeStatus = queryClient.getQueryData<RecipeStatus>(
        recipeStatusQueryKey
      );

      if (previousRecipeStatus) {
        queryClient.setQueryData<RecipeStatus>(recipeStatusQueryKey, (old) =>
          old
            ? {
                ...old,
                favoriteByCurrentUser: !old.favoriteByCurrentUser,
              }
            : old
        );
      }

      return previousRecipeStatus;
    },
    onSuccess: (_data, _variables, context) => {
      if (context && !context.favoriteByCurrentUser) {
        const shouldShow = trackReviewAction("recipe_save");
        if (shouldShow) scheduleReviewGate();
      }
    },
    onError: (error, variables, context) => {
      console.error("저장 처리 실패:", error);
      if (context) {
        queryClient.setQueryData(["recipe-status", recipeId], context);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipe-status", recipeId],
      });
      queryClient.invalidateQueries({ queryKey: ["recipes", "saved"] });
      queryClient.invalidateQueries({
        queryKey: RECIPE_BOOK_QUERY_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: RECIPE_BOOK_QUERY_KEYS.savedBooks(recipeId),
      });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
    },
  });

  const authenticatedMutate = useAuthenticatedAction<
    void,
    MutateOptions<void, Error, void, RecipeStatus | undefined> | undefined,
    void
  >(rawMutate, {
    notifyOnly: true,
  });

  return { ...restOfMutation, mutate: authenticatedMutate };
};
```

> NOTE: `RecipeStatus.favoriteByCurrentUser` 필드명은 backend 영역이라 이 작업의 범위 밖. `entities/recipe`까지 마이그레이션은 별도 작업.

- [ ] **Step 3: index.ts**

`src/features/recipe-save/index.ts`:

```ts
export { useToggleRecipeSave } from "./model/hooks";
```

- [ ] **Step 4: 외부 사용처 — `useToggleRecipeFavorite` 사용처 일괄 grep + 수동 Edit**

```bash
grep -rln "useToggleRecipeFavorite" src/
```

각 파일에 대해 `useToggleRecipeFavorite` → `useToggleRecipeSave` 일괄 치환. 다음 파일들이 후보:
- `src/widgets/RecipeInteractionButtons/index.tsx`
- `src/widgets/SlideShowContent/ui/SlideShowCarousel.tsx`
- `src/shared/ui/SaveButton.tsx`
- `src/widgets/MyFridgeRecipes/ui/MyFridgeRecipeCard.tsx`
- `src/features/recipe-import-youtube/ui/DuplicateRecipeSection.tsx`

각 파일을 Read → Edit으로 심볼명 변경.

- [ ] **Step 5: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 에러 없음.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(recipe-save): rename hooks/api to use 'save' terminology"
```

---

### Task 2.3: features/view-favorite-recipes → features/view-saved-recipes

**Files:**
- Move: `src/features/view-favorite-recipes/` → `src/features/view-saved-recipes/`
- Modify: 파일 내부 심볼/타이틀

- [ ] **Step 1: git mv**

```bash
git mv src/features/view-favorite-recipes src/features/view-saved-recipes
```

- [ ] **Step 2: 임포트 경로 일괄 치환**

```bash
grep -rl "@/features/view-favorite-recipes" src/ | xargs sed -i 's|@/features/view-favorite-recipes|@/features/view-saved-recipes|g'
```

- [ ] **Step 3: model/api.ts 안의 함수 rename — `getMyFavoriteItems` → `getMySavedRecipes`**

`src/features/view-saved-recipes/model/api.ts` Read → 이름만 rename. (구현 그대로 유지: 내부적으로 `END_POINTS.MY_FAVORITES`를 호출하더라도 그 endpoint는 백엔드에서 변경 없음.)

- [ ] **Step 4: index.ts에서 export 이름 변경**

`src/features/view-saved-recipes/index.ts`:

```ts
export { getMySavedRecipes } from "./model/api";
export { default as MySavedRecipesTabContent } from "./ui/MySavedRecipesTabContent";
```

> `MyFavoriteRecipesTabContent` 파일은 일단 그대로 두고 다음 task에서 통째로 교체.

- [ ] **Step 5: 외부 사용처 grep + 심볼명 치환 (`getMyFavoriteItems` → `getMySavedRecipes`, `MyFavoriteRecipesTabContent` → `MySavedRecipesTabContent`)**

```bash
grep -rln "getMyFavoriteItems\|MyFavoriteRecipesTabContent" src/
```

- [ ] **Step 6: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "refactor(view-saved): rename feature dir + symbols (favorite → saved)"
```

---

### Task 2.4: UserTab 라벨 + 일반 UI 텍스트 마이그레이션

**Files:**
- Modify: `src/widgets/UserTab/UserTab.tsx`
- Modify: `src/shared/config/constants/user.ts` (탭 라벨 정의)
- Modify: `src/shared/ui/SaveButton.tsx`
- Modify: `src/widgets/RecipeInteractionButtons/index.tsx`
- Modify: 기타 "즐겨찾기" / "북마크" 사용처

- [ ] **Step 1: 사용처 식별**

```bash
grep -rln "즐겨찾기\|북마크" src/ | grep -v ".d.ts"
```

- [ ] **Step 2: 각 파일에서 "즐겨찾기" → "저장", "북마크" → "저장" 치환**

특히:
- `src/shared/config/constants/user.ts`: `MyTabs` 배열에서 `id: "saved"` 항목의 라벨이 "북마크"이면 "저장"으로 변경
- `src/shared/ui/SaveButton.tsx`: aria-label, 토스트 메시지
- `src/widgets/UserTab/UserTab.tsx`: dynamic import 변수명 `MyFavoriteRecipesTabContent` → `MySavedRecipesTabContent` (Task 2.3에서 했으면 완료됨)
- `src/features/view-saved-recipes/ui/MyFavoriteRecipesTabContent.tsx`: `noResultsMessage` "즐겨찾기한 레시피가 없습니다." → "저장한 레시피가 없습니다."

- [ ] **Step 3: 파일명 마이그레이션 — `MyFavoriteRecipesTabContent.tsx` → `MySavedRecipesTabContent.tsx`**

```bash
git mv src/features/view-saved-recipes/ui/MyFavoriteRecipesTabContent.tsx src/features/view-saved-recipes/ui/MySavedRecipesTabContent.tsx
```

이미 `index.ts`에서 `default as MySavedRecipesTabContent`로 export 했으므로 import 경로만 일치하면 됨. 파일 내부의 `const MyFavoriteRecipesTabContent = ...` 식별자도 `MySavedRecipesTabContent`로 변경.

- [ ] **Step 4: query key `["recipes", "favorite", sort]` → `["recipes", "saved", sort]` 변경**

`src/features/view-saved-recipes/ui/MySavedRecipesTabContent.tsx` 내 두 곳:
- `queryKey: ["recipes", "favorite", sort]` → `queryKey: ["recipes", "saved", sort]`
- `queryKeyToInvalidate={["recipes", "favorite", sort]}` → `queryKeyToInvalidate={["recipes", "saved", sort]}`

- [ ] **Step 5: 잔존 검색 — `favorite` 패턴 (대소문자 X) 누락 없는지 확인**

```bash
grep -rn -i "favorite" src/ | grep -v "favoriteByCurrentUser\|RECIPE_FAVORITE\|MY_FAVORITES\|node_modules"
```

`favoriteByCurrentUser`, `RECIPE_FAVORITE`, `MY_FAVORITES`는 의도적으로 남기는 항목 (entities/recipe 및 backend endpoint). 그 외에는 모두 마이그레이션 완료되었어야 함.

- [ ] **Step 6: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "refactor: migrate '즐겨찾기/북마크' UI text and query key to '저장/saved'"
```

---

## Phase 3: Infrastructure 변경

### Task 3.1: PrevButton에 close 아이콘 옵션 추가

**Files:**
- Modify: `src/shared/ui/PrevButton.tsx`

- [ ] **Step 1: `icon` prop 추가**

`src/shared/ui/PrevButton.tsx` 전체 교체:

```tsx
"use client";

import { useRouter } from "next/navigation";

import { ArrowLeftIcon, XIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type PrevButtonProps = {
  className?: string;
  onClick?: () => void;
  size?: number;
  showOnDesktop?: boolean;
  icon?: "back" | "close";
};

const PrevButton = ({
  className,
  onClick,
  size = 24,
  showOnDesktop = false,
  icon = "back",
}: PrevButtonProps) => {
  const router = useRouter();

  const handleClick = onClick ?? (() => router.back());
  const Icon = icon === "close" ? XIcon : ArrowLeftIcon;
  const ariaLabel = icon === "close" ? "닫기" : "뒤로 가기";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center",
        !showOnDesktop && "md:hidden",
        className
      )}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <Icon size={size} />
    </button>
  );
};

export default PrevButton;
```

- [ ] **Step 2: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/shared/ui/PrevButton.tsx
git commit -m "feat(ui): PrevButton supports close icon variant"
```

---

### Task 3.2: shouldHideNavbar에 `/recipe-books/[bookId]` 추가

**Files:**
- Modify: `src/shared/config/constants/navigation.ts`

- [ ] **Step 1: HIDDEN_NAVBAR_PATTERNS에 패턴 추가**

`src/shared/config/constants/navigation.ts` 전체:

```ts
export const HIDDEN_NAVBAR_PATHS = ["/login"] as const;

export const HIDDEN_NAVBAR_PATTERNS = [
  /^\/recipes\/\d+\/slide-show$/,
  /^\/recipe-books\/[^/]+$/,
] as const;
```

- [ ] **Step 2: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/shared/config/constants/navigation.ts
git commit -m "feat(nav): hide bottom navbar on recipe book detail pages"
```

---

### Task 3.3: 편집 모드 store (zustand)

**Files:**
- Create: `src/features/recipe-book-edit-mode/model/useEditModeStore.ts`
- Create: `src/features/recipe-book-edit-mode/index.ts`

- [ ] **Step 1: store 작성**

```bash
mkdir -p src/features/recipe-book-edit-mode/model src/features/recipe-book-edit-mode/ui
```

`src/features/recipe-book-edit-mode/model/useEditModeStore.ts`:

```ts
import { create } from "zustand";

type EditModeState = {
  isEditMode: boolean;
  selectedIds: Set<string>;
  enter: () => void;
  exit: () => void;
  toggle: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clear: () => void;
};

export const useEditModeStore = create<EditModeState>((set) => ({
  isEditMode: false,
  selectedIds: new Set<string>(),
  enter: () => set({ isEditMode: true }),
  exit: () => set({ isEditMode: false, selectedIds: new Set() }),
  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clear: () => set({ selectedIds: new Set() }),
}));
```

- [ ] **Step 2: index.ts**

`src/features/recipe-book-edit-mode/index.ts`:

```ts
export { useEditModeStore } from "./model/useEditModeStore";
```

- [ ] **Step 3: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/features/recipe-book-edit-mode/
git commit -m "feat(edit-mode): add zustand store for bulk selection state"
```

---

## Phase 4: Sheet/Modal Features

### Task 4.1: CreateRecipeBookSheet

**Files:**
- Create: `src/features/recipe-book-create/ui/CreateRecipeBookSheet.tsx`
- Create: `src/features/recipe-book-create/index.ts`

- [ ] **Step 1: 디렉토리 생성**

```bash
mkdir -p src/features/recipe-book-create/ui
```

- [ ] **Step 2: 컴포넌트 작성**

`src/features/recipe-book-create/ui/CreateRecipeBookSheet.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  recipeBookFormSchema,
  type RecipeBookFormValues,
  useCreateRecipeBook,
  useRecipeBooks,
  getRecipeBookErrorMessage,
} from "@/entities/recipe-book";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/ui/shadcn/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateRecipeBookSheet = ({ open, onOpenChange }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: books } = useRecipeBooks();
  const createMutation = useCreateRecipeBook();

  const form = useForm<RecipeBookFormValues>({
    resolver: zodResolver(recipeBookFormSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open) form.reset({ name: "" });
  }, [open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const trimmed = values.name.trim();
    const isDuplicate = books?.some((b) => b.name === trimmed) ?? false;
    if (isDuplicate) {
      form.setError("name", { message: "이미 같은 이름의 폴더가 있어요" });
      return;
    }
    try {
      await createMutation.mutateAsync({ name: trimmed });
      toast.success("폴더가 만들어졌어요");
      onOpenChange(false);
    } catch (error) {
      const message = getRecipeBookErrorMessage(error);
      if (message.includes("같은 이름")) {
        form.setError("name", { message });
      } else {
        toast.error(message);
      }
    }
  });

  const value = form.watch("name");
  const error = form.formState.errors.name?.message;

  const Body = (
    <form onSubmit={onSubmit} className="space-y-4 px-6 pb-6">
      <div>
        <input
          {...form.register("name")}
          placeholder="폴더 이름"
          maxLength={50}
          className="w-full rounded-xl border border-gray-200 p-4 text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light transition-colors"
          autoFocus
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-red-500">{error ?? ""}</span>
          <span className="text-sm text-gray-400">{value.length} / 50</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="h-12 flex-1 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          onClick={() => onOpenChange(false)}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="h-12 flex-1 rounded-xl bg-olive-light text-white font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          {createMutation.isPending ? "만드는 중..." : "만들기"}
        </button>
      </div>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900">
              새 폴더 만들기
            </DialogTitle>
          </DialogHeader>
          {Body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="px-6 pt-6 pb-4 text-left">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            새 폴더 만들기
          </DrawerTitle>
        </DrawerHeader>
        {Body}
      </DrawerContent>
    </Drawer>
  );
};
```

> NOTE: `useMediaQuery` 훅의 정확한 import 경로와 시그니처는 코드베이스에서 확인 필요. 만약 다른 시그니처면 `CategoryDrawer`의 사용 패턴 그대로 차용 (`src/widgets/CategoryDrawer/CategoryDrawer.tsx` 참고).
>
> `Drawer`/`Dialog`의 정확한 import 경로도 같은 컴포넌트에서 확인.

- [ ] **Step 3: index.ts**

`src/features/recipe-book-create/index.ts`:

```ts
export { CreateRecipeBookSheet } from "./ui/CreateRecipeBookSheet";
```

- [ ] **Step 4: 타입 체크 + 임포트 경로 보정 (`useMediaQuery`, `Drawer`, `Dialog`)**

```bash
npx tsc --noEmit
```

에러 발생 시 `src/widgets/CategoryDrawer/CategoryDrawer.tsx`의 import 패턴 그대로 사용.

- [ ] **Step 5: Commit**

```bash
git add src/features/recipe-book-create/
git commit -m "feat(recipe-book): CreateRecipeBookSheet with form validation"
```

---

### Task 4.2: RenameRecipeBookSheet

**Files:**
- Create: `src/features/recipe-book-rename/ui/RenameRecipeBookSheet.tsx`
- Create: `src/features/recipe-book-rename/index.ts`

- [ ] **Step 1: 디렉토리 + 컴포넌트**

```bash
mkdir -p src/features/recipe-book-rename/ui
```

`src/features/recipe-book-rename/ui/RenameRecipeBookSheet.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  recipeBookFormSchema,
  type RecipeBookFormValues,
  useRecipeBooks,
  useUpdateRecipeBookName,
  getRecipeBookErrorMessage,
} from "@/entities/recipe-book";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/ui/shadcn/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  currentName: string;
};

export const RenameRecipeBookSheet = ({
  open,
  onOpenChange,
  bookId,
  currentName,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: books } = useRecipeBooks();
  const updateMutation = useUpdateRecipeBookName(bookId);

  const form = useForm<RecipeBookFormValues>({
    resolver: zodResolver(recipeBookFormSchema),
    defaultValues: { name: currentName },
  });

  useEffect(() => {
    if (open) form.reset({ name: currentName });
  }, [open, currentName, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const trimmed = values.name.trim();
    if (trimmed === currentName) {
      onOpenChange(false);
      return;
    }
    const isDuplicate =
      books?.some((b) => b.id !== bookId && b.name === trimmed) ?? false;
    if (isDuplicate) {
      form.setError("name", { message: "이미 같은 이름의 폴더가 있어요" });
      return;
    }
    try {
      await updateMutation.mutateAsync({ name: trimmed });
      toast.success("폴더 이름이 변경되었어요");
      onOpenChange(false);
    } catch (error) {
      const message = getRecipeBookErrorMessage(error);
      if (message.includes("같은 이름") || message.includes("기본 폴더")) {
        form.setError("name", { message });
      } else {
        toast.error(message);
      }
    }
  });

  const value = form.watch("name");
  const error = form.formState.errors.name?.message;

  const Body = (
    <form onSubmit={onSubmit} className="space-y-4 px-6 pb-6">
      <div>
        <input
          {...form.register("name")}
          placeholder="폴더 이름"
          maxLength={50}
          className="w-full rounded-xl border border-gray-200 p-4 text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light transition-colors"
          autoFocus
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-red-500">{error ?? ""}</span>
          <span className="text-sm text-gray-400">{value.length} / 50</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="h-12 flex-1 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          onClick={() => onOpenChange(false)}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="h-12 flex-1 rounded-xl bg-olive-light text-white font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          {updateMutation.isPending ? "변경 중..." : "변경"}
        </button>
      </div>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900">
              폴더 이름 변경
            </DialogTitle>
          </DialogHeader>
          {Body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="px-6 pt-6 pb-4 text-left">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            폴더 이름 변경
          </DrawerTitle>
        </DrawerHeader>
        {Body}
      </DrawerContent>
    </Drawer>
  );
};
```

- [ ] **Step 2: index.ts**

`src/features/recipe-book-rename/index.ts`:

```ts
export { RenameRecipeBookSheet } from "./ui/RenameRecipeBookSheet";
```

- [ ] **Step 3: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/features/recipe-book-rename/
git commit -m "feat(recipe-book): RenameRecipeBookSheet"
```

---

### Task 4.3: DeleteRecipeBookModal

**Files:**
- Create: `src/features/recipe-book-delete/ui/DeleteRecipeBookModal.tsx`
- Create: `src/features/recipe-book-delete/index.ts`

- [ ] **Step 1: 디렉토리 + 컴포넌트**

```bash
mkdir -p src/features/recipe-book-delete/ui
```

`src/features/recipe-book-delete/ui/DeleteRecipeBookModal.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  useDeleteRecipeBook,
  getRecipeBookErrorMessage,
} from "@/entities/recipe-book";
import DeleteModal from "@/shared/ui/modal/DeleteModal";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  bookName: string;
  onDeleted?: () => void;
};

export const DeleteRecipeBookModal = ({
  open,
  onOpenChange,
  bookId,
  bookName,
  onDeleted,
}: Props) => {
  const deleteMutation = useDeleteRecipeBook();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(bookId);
      toast.success(`"${bookName}" 폴더가 삭제되었어요`);
      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      toast.error(getRecipeBookErrorMessage(error));
    }
  };

  return (
    <DeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title={`"${bookName}" 폴더를 삭제할까요?`}
      description="이 폴더에만 저장된 레시피는 저장 목록에서도 사라져요."
      confirmLabel="삭제"
      cancelLabel="취소"
      onConfirm={handleConfirm}
      isLoading={deleteMutation.isPending}
    />
  );
};
```

> NOTE: `DeleteModal`의 정확한 prop 시그니처를 `src/shared/ui/modal/DeleteModal.tsx` Read 후 일치시킬 것. `open` 대신 `isOpen`, `onConfirm` 대신 `onConfirmClick` 등 prop 이름이 다를 수 있음.

- [ ] **Step 2: index.ts**

`src/features/recipe-book-delete/index.ts`:

```ts
export { DeleteRecipeBookModal } from "./ui/DeleteRecipeBookModal";
```

- [ ] **Step 3: 타입 체크 + 보정 + Commit**

```bash
npx tsc --noEmit
git add src/features/recipe-book-delete/
git commit -m "feat(recipe-book): DeleteRecipeBookModal"
```

---

### Task 4.4: BulkDeleteConfirmModal + EditModeBottomBar + MoveRecipesSheet

**Files:**
- Create: `src/features/recipe-book-edit-mode/ui/BulkDeleteConfirmModal.tsx`
- Create: `src/features/recipe-book-edit-mode/ui/EditModeBottomBar.tsx`
- Create: `src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx`
- Modify: `src/features/recipe-book-edit-mode/index.ts`

- [ ] **Step 1: BulkDeleteConfirmModal.tsx**

`src/features/recipe-book-edit-mode/ui/BulkDeleteConfirmModal.tsx`:

```tsx
"use client";

import { toast } from "sonner";

import {
  useRemoveRecipesFromBook,
  getRecipeBookErrorMessage,
} from "@/entities/recipe-book";
import DeleteModal from "@/shared/ui/modal/DeleteModal";

import { useEditModeStore } from "../model/useEditModeStore";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
};

export const BulkDeleteConfirmModal = ({ open, onOpenChange, bookId }: Props) => {
  const selectedIds = useEditModeStore((s) => s.selectedIds);
  const exit = useEditModeStore((s) => s.exit);
  const removeMutation = useRemoveRecipesFromBook();
  const count = selectedIds.size;

  const handleConfirm = async () => {
    try {
      await removeMutation.mutateAsync({
        bookId,
        recipeIds: Array.from(selectedIds),
      });
      toast.success(`${count}개 레시피를 폴더에서 뺐어요`);
      onOpenChange(false);
      exit();
    } catch (error) {
      toast.error(getRecipeBookErrorMessage(error));
    }
  };

  return (
    <DeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title={`선택한 ${count}개 레시피를 폴더에서 뺄까요?`}
      description="다른 폴더에 저장돼 있다면 그곳에는 그대로 남아있어요."
      confirmLabel="폴더에서 빼기"
      cancelLabel="취소"
      onConfirm={handleConfirm}
      isLoading={removeMutation.isPending}
    />
  );
};
```

- [ ] **Step 2: MoveRecipesSheet.tsx**

`src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx`:

```tsx
"use client";

import { toast } from "sonner";

import {
  useMoveRecipes,
  useRecipeBooks,
  getRecipeBookErrorMessage,
} from "@/entities/recipe-book";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/ui/shadcn/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

import { useEditModeStore } from "../model/useEditModeStore";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromBookId: string;
};

export const MoveRecipesSheet = ({ open, onOpenChange, fromBookId }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: books } = useRecipeBooks();
  const moveMutation = useMoveRecipes();
  const selectedIds = useEditModeStore((s) => s.selectedIds);
  const exit = useEditModeStore((s) => s.exit);

  const targets = (books ?? []).filter((b) => b.id !== fromBookId);
  const count = selectedIds.size;

  const handleSelect = async (toBookId: string, toBookName: string) => {
    if (count === 0) return;
    try {
      await moveMutation.mutateAsync({
        fromBookId,
        toBookId,
        recipeIds: Array.from(selectedIds),
      });
      toast.success(`${count}개를 ${toBookName}으로 이동했어요`);
      onOpenChange(false);
      exit();
    } catch (error) {
      toast.error(getRecipeBookErrorMessage(error));
    }
  };

  const Body = (
    <div className="px-2 pb-6">
      {targets.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-500">
          이동할 다른 폴더가 없어요. 먼저 새 폴더를 만들어주세요.
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

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold text-gray-900">
              어느 폴더로 이동할까요?
            </DialogTitle>
          </DialogHeader>
          {Body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="px-6 pt-6 pb-2 text-left">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            어느 폴더로 이동할까요?
          </DrawerTitle>
        </DrawerHeader>
        {Body}
      </DrawerContent>
    </Drawer>
  );
};
```

- [ ] **Step 3: EditModeBottomBar.tsx**

`src/features/recipe-book-edit-mode/ui/EditModeBottomBar.tsx`:

```tsx
"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/utils";

import { useEditModeStore } from "../model/useEditModeStore";

import { BulkDeleteConfirmModal } from "./BulkDeleteConfirmModal";
import { MoveRecipesSheet } from "./MoveRecipesSheet";

type Props = {
  bookId: string;
  allRecipeIds: string[];
};

export const EditModeBottomBar = ({ bookId, allRecipeIds }: Props) => {
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const selectedIds = useEditModeStore((s) => s.selectedIds);
  const selectAll = useEditModeStore((s) => s.selectAll);
  const clear = useEditModeStore((s) => s.clear);

  const [moveOpen, setMoveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!isEditMode) return null;

  const count = selectedIds.size;
  const total = allRecipeIds.length;
  const isAllSelected = total > 0 && count === total;
  const hasSelection = count > 0;

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      clear();
    } else {
      selectAll(allRecipeIds);
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-screen-md items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleSelectAllToggle}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            {isAllSelected ? "선택 해제" : "모두 선택"}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!hasSelection}
              onClick={() => setMoveOpen(true)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                hasSelection
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "cursor-not-allowed bg-gray-50 text-gray-400"
              )}
            >
              이동
            </button>
            <button
              type="button"
              disabled={!hasSelection}
              onClick={() => setDeleteOpen(true)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                hasSelection
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "cursor-not-allowed bg-gray-50 text-gray-400"
              )}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
      <MoveRecipesSheet
        open={moveOpen}
        onOpenChange={setMoveOpen}
        fromBookId={bookId}
      />
      <BulkDeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        bookId={bookId}
      />
    </>
  );
};
```

- [ ] **Step 4: index.ts 보강**

`src/features/recipe-book-edit-mode/index.ts`:

```ts
export { useEditModeStore } from "./model/useEditModeStore";
export { EditModeBottomBar } from "./ui/EditModeBottomBar";
export { MoveRecipesSheet } from "./ui/MoveRecipesSheet";
export { BulkDeleteConfirmModal } from "./ui/BulkDeleteConfirmModal";
```

- [ ] **Step 5: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/features/recipe-book-edit-mode/
git commit -m "feat(edit-mode): bottom bar with bulk move/delete actions"
```

---

## Phase 5: Widgets

### Task 5.1: RecipeBookThumbnailGrid

**Files:**
- Create: `src/widgets/RecipeBookGrid/RecipeBookThumbnailGrid.tsx`

- [ ] **Step 1: 디렉토리 + 컴포넌트**

```bash
mkdir -p src/widgets/RecipeBookGrid src/widgets/RecipeBookDetail
```

`src/widgets/RecipeBookGrid/RecipeBookThumbnailGrid.tsx`:

```tsx
import Image from "next/image";

import type { BookRecipe } from "@/entities/recipe-book";

type Props = {
  recipes: BookRecipe[];
};

export const RecipeBookThumbnailGrid = ({ recipes }: Props) => {
  const slots = Array.from({ length: 4 });
  return (
    <div className="aspect-square w-full rounded-2xl bg-beige-50 p-3 shadow-sm">
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5">
        {slots.map((_, idx) => {
          const recipe = recipes[idx];
          if (!recipe) {
            return <div key={idx} className="rounded-lg" aria-hidden />;
          }
          return (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-lg bg-gray-50 shadow-sm"
            >
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                sizes="(min-width: 1024px) 12vw, (min-width: 640px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

> NOTE: `bg-beige-50` 등 정확한 토큰은 프로젝트 tailwind.config 확인. 없으면 `bg-white` 또는 가까운 색.

- [ ] **Step 2: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookGrid/RecipeBookThumbnailGrid.tsx
git commit -m "feat(widget): RecipeBookThumbnailGrid (2x2 with empty slots)"
```

---

### Task 5.2: RecipeBookCardMenu (... drop-down)

**Files:**
- Create: `src/widgets/RecipeBookGrid/RecipeBookCardMenu.tsx`

- [ ] **Step 1: 컴포넌트**

`src/widgets/RecipeBookGrid/RecipeBookCardMenu.tsx`:

```tsx
"use client";

import { MoreVerticalIcon } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";

import { RenameRecipeBookSheet } from "@/features/recipe-book-rename";
import { DeleteRecipeBookModal } from "@/features/recipe-book-delete";

type Props = {
  bookId: string;
  bookName: string;
};

export const RecipeBookCardMenu = ({ bookId, bookName }: Props) => {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-2 top-2 rounded-full bg-white/80 p-1 backdrop-blur transition-colors hover:bg-white"
            aria-label="폴더 메뉴"
          >
            <MoreVerticalIcon size={18} className="text-gray-700" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
            수정
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-red-500 focus:text-red-500"
          >
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameRecipeBookSheet
        open={renameOpen}
        onOpenChange={setRenameOpen}
        bookId={bookId}
        currentName={bookName}
      />
      <DeleteRecipeBookModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        bookId={bookId}
        bookName={bookName}
      />
    </>
  );
};
```

> NOTE: `dropdown-menu` 컴포넌트 경로 확인 (`src/shared/ui/shadcn/dropdown-menu.tsx` 또는 비슷). 없으면 shadcn 추가 또는 Radix Popover로 대체.

- [ ] **Step 2: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookGrid/RecipeBookCardMenu.tsx
git commit -m "feat(widget): RecipeBookCardMenu (... → rename/delete)"
```

---

### Task 5.3: RecipeBookCard

**Files:**
- Create: `src/widgets/RecipeBookGrid/RecipeBookCard.tsx`

- [ ] **Step 1: 컴포넌트**

`src/widgets/RecipeBookGrid/RecipeBookCard.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";

import { useRecipeBookDetail } from "@/entities/recipe-book";

import { RecipeBookCardMenu } from "./RecipeBookCardMenu";
import { RecipeBookThumbnailGrid } from "./RecipeBookThumbnailGrid";

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

  const previewRecipes = data?.recipes.slice(0, 4) ?? [];

  const handleClick = () => {
    router.push(`/recipe-books/${bookId}`);
  };

  return (
    <div className="group relative cursor-pointer" onClick={handleClick}>
      <RecipeBookThumbnailGrid recipes={previewRecipes} />
      {!isDefault && <RecipeBookCardMenu bookId={bookId} bookName={name} />}
      <div className="mt-2 px-1">
        <p className="truncate text-base font-bold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">저장된 레시피 {recipeCount}개</p>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookGrid/RecipeBookCard.tsx
git commit -m "feat(widget): RecipeBookCard with self-fetched thumbnails"
```

---

### Task 5.4: CreateRecipeBookCard (placeholder)

**Files:**
- Create: `src/widgets/RecipeBookGrid/CreateRecipeBookCard.tsx`

- [ ] **Step 1: 컴포넌트**

`src/widgets/RecipeBookGrid/CreateRecipeBookCard.tsx`:

```tsx
"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { CreateRecipeBookSheet } from "@/features/recipe-book-create";

export const CreateRecipeBookCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-gray-400 transition-colors hover:border-olive-light hover:text-olive-light"
          aria-label="폴더 만들기"
        >
          <PlusIcon size={32} />
        </button>
        <div className="mt-2 px-1">
          <p className="text-base font-bold text-gray-400">폴더 만들기</p>
        </div>
      </div>
      <CreateRecipeBookSheet open={open} onOpenChange={setOpen} />
    </>
  );
};
```

- [ ] **Step 2: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookGrid/CreateRecipeBookCard.tsx
git commit -m "feat(widget): CreateRecipeBookCard placeholder"
```

---

### Task 5.5: RecipeBookGrid + index.ts

**Files:**
- Create: `src/widgets/RecipeBookGrid/RecipeBookGrid.tsx`
- Create: `src/widgets/RecipeBookGrid/index.ts`

- [ ] **Step 1: 컴포넌트**

`src/widgets/RecipeBookGrid/RecipeBookGrid.tsx`:

```tsx
"use client";

import { useRecipeBooks } from "@/entities/recipe-book";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { CreateRecipeBookCard } from "./CreateRecipeBookCard";
import { RecipeBookCard } from "./RecipeBookCard";

const MAX_FOLDERS = 5;

const GridSkeleton = () => (
  <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
    {Array.from({ length: MAX_FOLDERS }).map((_, i) => (
      <div key={i}>
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="mt-2 h-5 w-2/3 rounded" />
        <Skeleton className="mt-1 h-4 w-1/2 rounded" />
      </div>
    ))}
  </div>
);

export const RecipeBookGrid = () => {
  const { data: books, isLoading, error, refetch } = useRecipeBooks();

  if (isLoading) return <GridSkeleton />;

  if (error) {
    return (
      <SectionErrorFallback
        message="폴더 목록을 불러올 수 없어요"
        onRetry={() => refetch()}
      />
    );
  }

  const list = books ?? [];
  const showCreateCard = list.length < MAX_FOLDERS;

  return (
    <ErrorBoundary
      fallback={<SectionErrorFallback message="폴더를 불러올 수 없어요" />}
    >
      <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        {list.map((book) => (
          <RecipeBookCard
            key={book.id}
            bookId={book.id}
            name={book.name}
            recipeCount={book.recipeCount}
            isDefault={book.isDefault}
          />
        ))}
        {showCreateCard && <CreateRecipeBookCard />}
      </div>
    </ErrorBoundary>
  );
};
```

> NOTE: `SectionErrorFallback`이 `onRetry` prop을 받지 않으면 그 prop을 빼고 단순 메시지만. 컴포넌트 시그니처 확인 후 보정.

- [ ] **Step 2: index.ts**

`src/widgets/RecipeBookGrid/index.ts`:

```ts
export { RecipeBookGrid } from "./RecipeBookGrid";
```

- [ ] **Step 3: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookGrid/
git commit -m "feat(widget): RecipeBookGrid with skeleton, error, +card limit"
```

---

### Task 5.6: RecipeBookDetailHeader

**Files:**
- Create: `src/widgets/RecipeBookDetail/RecipeBookDetailHeader.tsx`

- [ ] **Step 1: 컴포넌트**

`src/widgets/RecipeBookDetail/RecipeBookDetailHeader.tsx`:

```tsx
"use client";

import { PencilIcon } from "lucide-react";
import { useState } from "react";

import type { RecipeBook } from "@/entities/recipe-book";
import PrevButton from "@/shared/ui/PrevButton";

import { RenameRecipeBookSheet } from "@/features/recipe-book-rename";

import { useEditModeStore } from "@/features/recipe-book-edit-mode";

type Props = {
  book: RecipeBook;
};

export const RecipeBookDetailHeader = ({ book }: Props) => {
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const selectedCount = useEditModeStore((s) => s.selectedIds.size);
  const enter = useEditModeStore((s) => s.enter);
  const exit = useEditModeStore((s) => s.exit);

  const [renameOpen, setRenameOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4">
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {isEditMode ? (
            <PrevButton icon="close" onClick={exit} showOnDesktop />
          ) : (
            <PrevButton icon="back" showOnDesktop />
          )}
          {isEditMode ? (
            <span className="text-base font-bold text-gray-900">
              {selectedCount}개 선택
            </span>
          ) : (
            <div className="flex min-w-0 items-center gap-1">
              <span className="truncate text-base font-bold text-gray-900">
                {book.name}
              </span>
              {!book.isDefault && (
                <button
                  type="button"
                  onClick={() => setRenameOpen(true)}
                  className="shrink-0 rounded-full p-1 text-gray-500 hover:bg-gray-100"
                  aria-label="이름 변경"
                >
                  <PencilIcon size={16} />
                </button>
              )}
            </div>
          )}
        </div>
        {!isEditMode && (
          <button
            type="button"
            onClick={enter}
            className="rounded-xl px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            편집
          </button>
        )}
      </header>
      <RenameRecipeBookSheet
        open={renameOpen}
        onOpenChange={setRenameOpen}
        bookId={book.id}
        currentName={book.name}
      />
    </>
  );
};
```

- [ ] **Step 2: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookDetail/RecipeBookDetailHeader.tsx
git commit -m "feat(widget): RecipeBookDetailHeader with edit mode toggle"
```

---

### Task 5.7: RecipeBookRecipeGrid

**Files:**
- Create: `src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx`

- [ ] **Step 1: 컴포넌트 — 무한스크롤 + 편집 오버레이 + 빈 상태**

`src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx`:

```tsx
"use client";

import { CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useRecipeBookDetailInfinite,
  type BookRecipe,
} from "@/entities/recipe-book";

import { useEditModeStore } from "@/features/recipe-book-edit-mode";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type Props = {
  bookId: string;
  onAllIdsChange?: (ids: string[]) => void;
};

const EmptyState = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 text-5xl" aria-hidden>
        🍳
      </div>
      <p className="mb-6 text-base text-gray-500">아직 저장한 레시피가 없어요</p>
      <button
        type="button"
        onClick={() => router.push("/search/result")}
        className="rounded-xl bg-olive-light px-5 py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
      >
        레시피 둘러보기 →
      </button>
    </div>
  );
};

const GridSkeleton = () => (
  <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i}>
        <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
        <Skeleton className="mt-2 h-5 w-3/4 rounded" />
      </div>
    ))}
  </div>
);

const RecipeItem = ({ recipe }: { recipe: BookRecipe }) => {
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const isSelected = useEditModeStore((s) =>
    s.selectedIds.has(recipe.recipeId)
  );
  const toggle = useEditModeStore((s) => s.toggle);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      toggle(recipe.recipeId);
    }
  };

  return (
    <Link
      href={`/recipes/${recipe.recipeId}`}
      onClick={handleClick}
      className="group relative block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover"
        />
        {isEditMode && (
          <div
            className={cn(
              "absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
              isSelected
                ? "border-olive-light bg-olive-light"
                : "border-white bg-white/80"
            )}
          >
            {isSelected && <CheckIcon size={14} className="text-white" />}
          </div>
        )}
      </div>
      <p className="mt-2 truncate px-1 text-sm font-medium text-gray-900">
        {recipe.title}
      </p>
    </Link>
  );
};

export const RecipeBookRecipeGrid = ({ bookId, onAllIdsChange }: Props) => {
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const query = useRecipeBookDetailInfinite(bookId);
  const { ref } = useInfiniteScroll({
    queryKey: ["recipe-books", "infinite", bookId, "addedAt,desc"],
    queryFn: () => Promise.resolve(null) as any,
    getNextPageParam: () => undefined,
    initialPageParam: 0,
    enabled: false,
  });

  // 위 useInfiniteScroll은 observer ref만 위해 가짜 호출. 실제 paging은 useRecipeBookDetailInfinite에서.
  // 만약 useInfiniteScroll이 외부 query를 받는 시그니처라면 그 패턴으로 교체.

  const recipes =
    query.data?.pages.flatMap((page) => page.recipes) ?? ([] as BookRecipe[]);

  // observer로 다음 페이지 fetch
  // (간단화: query.fetchNextPage를 useEffect + IntersectionObserver로 호출하는 패턴이 프로젝트에 있다면 그것 사용)

  if (query.isLoading) return <GridSkeleton />;
  if (recipes.length === 0) return <EmptyState />;

  // onAllIdsChange로 부모(편집 액션바)에 전체 ID 전달
  if (onAllIdsChange) {
    const ids = recipes.map((r) => r.recipeId);
    // useEffect로 감싸야 무한루프 방지
    queueMicrotask(() => onAllIdsChange(ids));
  }

  return (
    <div className={isEditMode ? "pb-24" : ""}>
      <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        {recipes.map((recipe) => (
          <RecipeItem key={recipe.recipeId} recipe={recipe} />
        ))}
      </div>
      {query.hasNextPage && (
        <div ref={ref} className="h-10" aria-hidden />
      )}
    </div>
  );
};
```

> NOTE: 이 task는 위에 가짜 `useInfiniteScroll` 호출이 있어 그대로 동작하지 않음. 다음 step에서 실제 페이지네이션 흐름을 보정한다.

- [ ] **Step 2: 페이지네이션 보정 — 프로젝트의 `useInfiniteScroll` 시그니처에 맞춰 다시 쓰기**

`src/shared/hooks/useInfiniteScroll.ts`를 Read 한 다음, 둘 중 하나로 정리:

(A) 만약 `useInfiniteScroll`이 자체적으로 `useInfiniteQuery`를 wrap하는 형태라면, `useRecipeBookDetailInfinite` 사용을 버리고 `useInfiniteScroll`로 직접 query 정의 (`MyFavoriteRecipesTabContent` 패턴 따라).

(B) 만약 `useInfiniteScroll`이 단순히 `IntersectionObserver` ref만 제공한다면, `useRecipeBookDetailInfinite` 결과의 `fetchNextPage`를 ref 콜백에서 호출.

`MyFavoriteRecipesTabContent`의 사용 패턴이 (A)이므로 그것에 맞춰 컴포넌트를 다시 정리:

```tsx
"use client";

import { CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { InfiniteData } from "@tanstack/react-query";

import {
  getRecipeBookDetail,
  RECIPE_BOOK_QUERY_KEYS,
  type BookRecipe,
  type RecipeBookDetail,
} from "@/entities/recipe-book";

import { useEditModeStore } from "@/features/recipe-book-edit-mode";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type Props = {
  bookId: string;
  onAllIdsChange: (ids: string[]) => void;
};

const SORT = "addedAt,desc";

const EmptyState = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 text-5xl" aria-hidden>🍳</div>
      <p className="mb-6 text-base text-gray-500">아직 저장한 레시피가 없어요</p>
      <button
        type="button"
        onClick={() => router.push("/search/result")}
        className="rounded-xl bg-olive-light px-5 py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
      >
        레시피 둘러보기 →
      </button>
    </div>
  );
};

const GridSkeleton = () => (
  <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i}>
        <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
        <Skeleton className="mt-2 h-5 w-3/4 rounded" />
      </div>
    ))}
  </div>
);

const RecipeItem = ({ recipe }: { recipe: BookRecipe }) => {
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const isSelected = useEditModeStore((s) =>
    s.selectedIds.has(recipe.recipeId)
  );
  const toggle = useEditModeStore((s) => s.toggle);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      toggle(recipe.recipeId);
    }
  };

  return (
    <Link
      href={`/recipes/${recipe.recipeId}`}
      onClick={handleClick}
      className="group relative block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover"
        />
        {isEditMode && (
          <div
            className={cn(
              "absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
              isSelected
                ? "border-olive-light bg-olive-light"
                : "border-white bg-white/80"
            )}
          >
            {isSelected && <CheckIcon size={14} className="text-white" />}
          </div>
        )}
      </div>
      <p className="mt-2 truncate px-1 text-sm font-medium text-gray-900">
        {recipe.title}
      </p>
    </Link>
  );
};

export const RecipeBookRecipeGrid = ({ bookId, onAllIdsChange }: Props) => {
  const queryClient = useQueryClient();
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const previewKey = RECIPE_BOOK_QUERY_KEYS.detail(bookId, SORT);
  const previewData = queryClient.getQueryData<RecipeBookDetail>(previewKey);

  const { data, isLoading, hasNextPage, isFetching, ref } = useInfiniteScroll<
    RecipeBookDetail,
    Error,
    InfiniteData<RecipeBookDetail>,
    readonly unknown[],
    number
  >({
    queryKey: RECIPE_BOOK_QUERY_KEYS.detailInfinite(bookId, SORT),
    queryFn: ({ pageParam }) =>
      getRecipeBookDetail(bookId, { page: pageParam, size: 20, sort: SORT }),
    getNextPageParam: (last, all) => (last.hasNext ? all.length : undefined),
    initialPageParam: 0,
    initialData: previewData
      ? { pages: [previewData], pageParams: [0] }
      : undefined,
  });

  const recipes = data?.pages.flatMap((p) => p.recipes) ?? [];

  useEffect(() => {
    onAllIdsChange(recipes.map((r) => r.recipeId));
  }, [recipes, onAllIdsChange]);

  if (isLoading && recipes.length === 0) return <GridSkeleton />;
  if (!isFetching && recipes.length === 0) return <EmptyState />;

  return (
    <div className={isEditMode ? "pb-24" : ""}>
      <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        {recipes.map((recipe) => (
          <RecipeItem key={recipe.recipeId} recipe={recipe} />
        ))}
      </div>
      {hasNextPage && <div ref={ref} className="h-10" aria-hidden />}
    </div>
  );
};
```

> `useInfiniteScroll`의 정확한 generic 시그니처는 `MyFavoriteRecipesTabContent.tsx`에서 확인한 것 그대로 사용 (Phase 2에서 query key만 변경됨).

- [ ] **Step 3: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx
git commit -m "feat(widget): RecipeBookRecipeGrid with edit overlay and infinite scroll"
```

---

### Task 5.8: RecipeBookDetail index.ts

**Files:**
- Create: `src/widgets/RecipeBookDetail/index.ts`

- [ ] **Step 1: barrel**

```ts
export { RecipeBookDetailHeader } from "./RecipeBookDetailHeader";
export { RecipeBookRecipeGrid } from "./RecipeBookRecipeGrid";
```

- [ ] **Step 2: Commit**

```bash
git add src/widgets/RecipeBookDetail/index.ts
git commit -m "chore(widget): RecipeBookDetail barrel export"
```

---

## Phase 6: Pages

### Task 6.1: MySavedRecipesTabContent 교체 (폴더 그리드)

**Files:**
- Modify: `src/features/view-saved-recipes/ui/MySavedRecipesTabContent.tsx`

- [ ] **Step 1: 컨텐츠 교체**

`src/features/view-saved-recipes/ui/MySavedRecipesTabContent.tsx` 전체:

```tsx
"use client";

import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import {
  useYoutubeImportStoreV2,
  PendingRecipeSection,
} from "@/features/recipe-import-youtube";

import { RecipeBookGrid } from "@/widgets/RecipeBookGrid";

const MySavedRecipesTabContent = () => {
  const jobs = useYoutubeImportStoreV2((state) => state.jobs);
  const visibleJobKeys = Object.keys(jobs).filter((key) => {
    const job = jobs[key];
    return (
      job.state === "creating" ||
      job.state === "polling" ||
      job.state === "failed"
    );
  });

  const hasVisibleJobs = visibleJobKeys.length > 0;

  return (
    <div>
      {hasVisibleJobs && (
        <ErrorBoundary
          fallback={
            <SectionErrorFallback message="추출 중인 레시피 상태를 불러올 수 없어요" />
          }
        >
          <PendingRecipeSection pendingJobKeys={visibleJobKeys} />
        </ErrorBoundary>
      )}
      <RecipeBookGrid />
    </div>
  );
};

export default MySavedRecipesTabContent;
```

- [ ] **Step 2: 타입 체크 + Commit**

```bash
npx tsc --noEmit
git add src/features/view-saved-recipes/ui/MySavedRecipesTabContent.tsx
git commit -m "feat(view-saved): replace flat list with folder grid"
```

---

### Task 6.2: 폴더 상세 페이지 (`/recipe-books/[bookId]`)

**Files:**
- Create: `src/app/(main)/recipe-books/[bookId]/page.tsx`

- [ ] **Step 1: app routing 디렉토리 — `(main)` 그룹 위치 확인**

```bash
ls "src/app/" 2>/dev/null
```

`(main)` 라우트 그룹이 있는지 확인. 없다면 그냥 `src/app/recipe-books/[bookId]/page.tsx`.

- [ ] **Step 2: 디렉토리 + 페이지 작성**

```bash
mkdir -p "src/app/recipe-books/[bookId]"
```

`src/app/recipe-books/[bookId]/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";

import { useRecipeBooks } from "@/entities/recipe-book";

import { useEditModeStore } from "@/features/recipe-book-edit-mode";
import { EditModeBottomBar } from "@/features/recipe-book-edit-mode";

import {
  RecipeBookDetailHeader,
  RecipeBookRecipeGrid,
} from "@/widgets/RecipeBookDetail";

export default function RecipeBookDetailPage() {
  const params = useParams<{ bookId: string }>();
  const bookId = params?.bookId ?? "";
  const { data: books, isLoading } = useRecipeBooks();
  const exit = useEditModeStore((s) => s.exit);

  const [allRecipeIds, setAllRecipeIds] = useState<string[]>([]);

  // 페이지 unmount 시 편집모드 해제
  useEffect(() => {
    return () => exit();
  }, [exit]);

  if (isLoading) {
    return (
      <div>
        <div className="h-14 border-b border-gray-100 bg-white" />
      </div>
    );
  }

  const book = books?.find((b) => b.id === bookId);

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <RecipeBookDetailHeader book={book} />
      <RecipeBookRecipeGrid bookId={bookId} onAllIdsChange={setAllRecipeIds} />
      <EditModeBottomBar bookId={bookId} allRecipeIds={allRecipeIds} />
    </main>
  );
}
```

- [ ] **Step 3: 타입 체크**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/recipe-books/
git commit -m "feat(page): /recipe-books/[bookId] detail page"
```

---

## Phase 7: Verification

### Task 7.1: 전체 type check + lint

**Files:** (검증만)

- [ ] **Step 1: type check**

```bash
npx tsc --noEmit
```

Expected: 에러 없음.

- [ ] **Step 2: lint**

```bash
npm run lint 2>&1 | tail -30
```

발생한 lint 에러는 모두 수정 후 commit.

- [ ] **Step 3: commit (lint 수정이 있었다면)**

```bash
git add -A
git commit -m "chore: lint fixes for recipe book redesign"
```

---

### Task 7.2: dev server 띄우고 수동 QA

**Files:** (검증만)

- [ ] **Step 1: localhost 확인**

```bash
netstat -ano | findstr :3000
```

이미 떠 있으면 종료 후 재시작:
```bash
taskkill //PID <pid> //F
```

- [ ] **Step 2: dev server 시작 (background)**

```bash
npm run dev
```

(이 단계는 background로)

- [ ] **Step 3: spec의 QA 체크리스트 수행**

`docs/superpowers/specs/2026-04-17-recipe-book-redesign-design.md` Section 12 그대로 수동 확인:

1. 폴더 생성: 정상 / 50자 초과 / 중복 (클라/서버) / 5개 한도 도달 시 "+" 카드 사라짐 / 1106 에러 토스트
2. 폴더 이름 변경: 기본 폴더 ✏️ X / 중복 form 에러 / 1104, 1107 에러
3. 폴더 삭제: 기본 폴더 ... X / 그 폴더에만 있던 레시피의 저장 상태 자동 해제
4. 폴더 진입 시 미리보기 캐시 hit (Network 탭)
5. 편집모드 진입/해제 — 헤더/바텀바 전환, 카드 클릭 = 선택, X로 해제
6. bulk 이동: 현재 폴더 sheet 항목에 안 보임, 즉시 이동, 토스트, 편집모드 해제
7. bulk 삭제: 0개 disabled, 확인 모달, 마지막 폴더에서 빠지면 저장 상태 해제
8. BottomNavbar: `/recipe-books/{id}`에서만 숨김
9. favorited → saved: 기존 저장 토글 정상 동작
10. 햅틱: 모든 mutation onSuccess에서 Success 햅틱

각 항목 통과 시 plan에 체크. 실패 시 별도 fix commit 만들고 재확인.

- [ ] **Step 4: 마지막 wrap-up commit (필요 시)**

수정사항 없으면 skip. 있으면:

```bash
git add -A
git commit -m "fix: address QA findings on recipe book redesign"
```

---

## 마이그레이션 후 cleanup (선택)

### Task 8.1 (optional): RECIPE_FAVORITE alias 제거

**Files:**
- Modify: `src/shared/config/constants/api.ts`

- [ ] **Step 1: `RECIPE_FAVORITE` 라인 삭제 (Task 1.1에서 alias로 남겨둔 것)**

이 단계는 모든 사용처가 `RECIPE_SAVE`로 마이그레이션된 후 별도 commit. grep 후 사용처 0건 확인.

```bash
grep -rn "RECIPE_FAVORITE" src/
```

0건이면:

```ts
// src/shared/config/constants/api.ts에서
RECIPE_FAVORITE: (id: string) => `/recipes/${id}/favorite`,  // ← 이 줄 삭제
```

- [ ] **Step 2: type check + commit**

```bash
npx tsc --noEmit
git add src/shared/config/constants/api.ts
git commit -m "chore: remove RECIPE_FAVORITE alias after migration"
```

---

## 참고: 비범위 (TODO 주석으로만 남김)

이 plan에서 구현하지 않는 항목 (spec Section 11과 동일):

- (e) 레시피 상세에서 저장 버튼 → 폴더 선택 다이얼로그 (1개 자동, 2개+ 선택)
- (f) 저장 해제 시 "모든 폴더에서 해제됩니다" 다이얼로그
- 폴더 안 개별 레시피 카드의 ... 메뉴 (편집모드 → bulk만)

---

## Self-Review 결과

작성 후 spec과 대조:

1. **Spec 커버리지**:
   - §2 라우팅 → Task 6.2 ✓
   - §3 FSD 디렉토리 → Phase 1, 4, 5, 6 전체 ✓
   - §4 Query Keys + 무효화 정책 → Task 1.5, 1.6, 1.7, 1.8, 2.2 ✓
   - §5 페이지/컴포넌트 동작 → Phase 4, 5, 6 ✓
   - §6 Form Validation → Task 1.5 (schema), 4.1, 4.2 ✓
   - §7 favorited→saved 마이그레이션 → Phase 2 ✓
   - §8 햅틱 → Task 1.7, 1.8 (mutation onSuccess) + 기존 save toggle 그대로 ✓
   - §9 빈 상태 / 에러 / 로딩 → Task 5.5 (Skeleton), 5.7 (EmptyState), 4.* (toast) ✓
   - §10 인프라 변경 → Task 3.1, 3.2 ✓
   - §11 비범위 → 위 "비범위" 섹션에 명시 ✓
   - §12 QA → Task 7.2 ✓

2. **Placeholder 스캔**: TBD/TODO 없음. 일부 NOTE는 코드베이스 환경 차이 (`useMediaQuery`, `DeleteModal` 등)에 대한 fallback 안내로 의도적.

3. **Type 일관성**: `RECIPE_BOOK_QUERY_KEYS.detail` / `.detailInfinite` / `.savedBooks` / `.list()` 모두 동일 시그니처로 사용. `useEditModeStore` 메서드명 (`enter` / `exit` / `toggle` / `selectAll` / `clear`) 일관 사용.

4. **남은 위험**: `apiClient.delete`가 body를 받는 방식 (Task 1.4 Step 5) — `apiClient` 구현상 `body`를 옵션에서 받는지 확인 필요. 안 받으면 `addRecipesToBook`처럼 별도 `apiClient<T>(url, {method: "DELETE", body})` 호출로 우회.
