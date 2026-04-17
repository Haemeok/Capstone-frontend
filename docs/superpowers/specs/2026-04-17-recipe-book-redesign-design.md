# 레시피 저장 기능 개편 (레시피북 도입) — 설계 문서

- **날짜**: 2026-04-17
- **브랜치**: feature/17
- **참조 API 명세**: `frontend-api-changes-2026-04-16.html`
- **관련 백엔드 커밋 범위**: `d3769cd` ~ `73b41f2`

## 1. 배경 & 목표

### 변경의 핵심
- **기존**: 즐겨찾기 토글 하나로 저장/해제. 폴더 개념 없음.
- **변경**: 레시피를 **폴더(레시피북)** 단위로 저장. 하나의 레시피가 여러 폴더에 동시에 존재 가능.

### 목표
1. 저장 탭을 폴더 그리드 뷰로 개편
2. 폴더 상세 페이지 신규 (편집 모드 + bulk 이동/삭제)
3. 폴더 CRUD UI (생성, 이름 변경, 삭제)
4. `favorited → saved` 마이그레이션 (네이밍/응답 필드 일괄 변경)
5. TanStack Query 키를 일관된 컨벤션으로 정리

### 명시적 비범위 (Out of Scope)
- 레시피 상세 페이지의 저장 버튼 → 폴더 선택 다이얼로그 (e)
- 레시피 상세 페이지의 저장 해제 시 "모든 폴더에서 해제됩니다" 다이얼로그 (f)
- 폴더 안 개별 레시피 카드의 ... 메뉴 (편집모드 → bulk만)

> 폴더 순서 변경(드래그 앤 드롭)은 이 문서에서 일체 다루지 않음.

---

## 2. 라우팅

| 경로 | 페이지 | 비고 |
|---|---|---|
| `/users/[me]?tab=saved` | 저장 탭 (폴더 그리드) | 기존 UserTab의 "북마크" 탭 → "저장"으로 라벨 변경. 컨텐츠 교체. |
| `/recipe-books/[bookId]` | 폴더 상세 | 신규. BottomNavbar 숨김. |

---

## 3. 아키텍처 (FSD 레이어)

```
src/
├─ entities/
│   └─ recipe-book/                         (신규)
│       ├─ api/
│       │   ├─ index.ts
│       │   ├─ types.ts
│       │   ├─ getRecipeBooks.ts
│       │   ├─ getRecipeBookDetail.ts
│       │   ├─ createRecipeBook.ts
│       │   ├─ updateRecipeBookName.ts
│       │   ├─ deleteRecipeBook.ts
│       │   ├─ addRecipesToBook.ts
│       │   ├─ removeRecipesFromBook.ts
│       │   └─ getSavedBooks.ts
│       ├─ model/
│       │   ├─ queryKeys.ts
│       │   ├─ schema.ts
│       │   ├─ errorMessages.ts
│       │   └─ hooks/
│       │       ├─ useRecipeBooks.ts
│       │       ├─ useRecipeBookDetail.ts
│       │       ├─ useRecipeBookDetailInfinite.ts
│       │       ├─ useCreateRecipeBook.ts
│       │       ├─ useUpdateRecipeBookName.ts
│       │       ├─ useDeleteRecipeBook.ts
│       │       ├─ useAddRecipesToBook.ts
│       │       ├─ useRemoveRecipesFromBook.ts
│       │       └─ useMoveRecipes.ts
│       └─ index.ts
│
├─ features/
│   ├─ recipe-book-create/                  (신규)
│   │   └─ ui/CreateRecipeBookSheet.tsx
│   ├─ recipe-book-rename/                  (신규)
│   │   └─ ui/RenameRecipeBookSheet.tsx
│   ├─ recipe-book-delete/                  (신규)
│   │   └─ ui/DeleteRecipeBookModal.tsx
│   ├─ recipe-book-edit-mode/               (신규)
│   │   ├─ model/useEditModeStore.ts
│   │   └─ ui/
│   │       ├─ EditModeBottomBar.tsx
│   │       ├─ MoveRecipesSheet.tsx
│   │       └─ BulkDeleteConfirmModal.tsx
│   ├─ recipe-save/                         (rename: recipe-favorite)
│   │   ├─ model/api.ts
│   │   └─ model/hooks.ts
│   └─ view-saved-recipes/                  (rename: view-favorite-recipes)
│       └─ ui/MySavedRecipesTabContent.tsx
│
├─ widgets/
│   ├─ RecipeBookGrid/                      (신규)
│   │   ├─ RecipeBookGrid.tsx
│   │   ├─ RecipeBookCard.tsx
│   │   ├─ RecipeBookThumbnailGrid.tsx
│   │   ├─ RecipeBookCardMenu.tsx
│   │   └─ CreateRecipeBookCard.tsx
│   └─ RecipeBookDetail/                    (신규)
│       ├─ RecipeBookDetailHeader.tsx
│       └─ RecipeBookRecipeGrid.tsx
│
└─ app/
    └─ (main)/recipe-books/[bookId]/
        └─ page.tsx
```

### 변경되는 기존 파일

| 작업 | 파일 |
|---|---|
| Rename | `features/recipe-favorite/` → `features/recipe-save/` |
| Rename | `features/view-favorite-recipes/` → `features/view-saved-recipes/` |
| Update | `widgets/UserTab/UserTab.tsx` ("북마크" → "저장", dynamic import 경로) |
| Update | `shared/lib/navigation.ts` (`/recipe-books/[bookId]` BottomNavbar hide pattern 추가) |
| Update | `shared/ui/PrevButton.tsx` (`icon?: "back" \| "close"` prop 추가, default "back") |
| Update | `shared/config/constants/api.ts` (`END_POINTS.RECIPE_BOOK_*`, `END_POINTS.RECIPE_SAVE` 추가/리네임) |

---

## 4. 데이터 흐름 & TanStack Query

### Query Keys (`entities/recipe-book/model/queryKeys.ts`)

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

### API ↔ 훅 ↔ 키 매핑

| API | API 함수 | 훅 | Query Key |
|---|---|---|---|
| `GET /api/me/recipe-books` | `getRecipeBooks()` | `useRecipeBooks()` | `list()` |
| `GET /api/me/recipe-books/{bookId}?page&size&sort` | `getRecipeBookDetail(bookId, params)` | `useRecipeBookDetail(bookId, sort)` (size=20) | `detail(bookId, sort)` |
| 위 endpoint, infinite | 동일 | `useRecipeBookDetailInfinite(bookId, sort)` | `detailInfinite(bookId, sort)` |
| `POST /api/me/recipe-books` | `createRecipeBook({name})` | `useCreateRecipeBook()` | mutation |
| `PATCH /api/me/recipe-books/{bookId}` | `updateRecipeBookName(bookId, {name})` | `useUpdateRecipeBookName(bookId)` | mutation |
| `DELETE /api/me/recipe-books/{bookId}` | `deleteRecipeBook(bookId)` | `useDeleteRecipeBook()` | mutation |
| `POST /api/me/recipe-books/{bookId}/recipes` | `addRecipesToBook(bookId, {recipeIds})` | `useAddRecipesToBook()` | mutation |
| `DELETE /api/me/recipe-books/{bookId}/recipes` | `removeRecipesFromBook(bookId, {recipeIds})` | `useRemoveRecipesFromBook()` | mutation |
| (composite add+remove) | — | `useMoveRecipes()` | mutation |
| `GET /api/recipes/{recipeId}/saved-books` | `getSavedBooks(recipeId)` | `useSavedBooks(recipeId)` | `savedBooks(recipeId)` |
| `POST /api/recipes/{id}/favorite` (응답 `saved`) | `postRecipeSave(id)` | `useToggleRecipeSave(recipeId)` | mutation |

### 무효화 정책

| Mutation | 무효화 대상 |
|---|---|
| `useCreateRecipeBook` | `RECIPE_BOOK_QUERY_KEYS.list()` |
| `useUpdateRecipeBookName(bookId)` | `list()`, `detail(bookId)` (이름이 detail 응답에도 있음) |
| `useDeleteRecipeBook` | `RECIPE_BOOK_QUERY_KEYS.all` (broad) |
| `useAddRecipesToBook(bookId)` | `list()`, `detail(bookId)`, 추가된 각 `recipeId`에 대해 `savedBooks(recipeId)` + `["recipe-status", recipeId]` |
| `useRemoveRecipesFromBook(bookId)` | `list()`, `detail(bookId)`, 각 `recipeId`에 대해 `savedBooks(recipeId)` + `["recipe-status", recipeId]` |
| `useMoveRecipes(from, to)` | `list()`, `detail(from)`, `detail(to)`, 각 `recipeId`에 대해 `savedBooks(recipeId)` |
| `useToggleRecipeSave(recipeId)` | `RECIPE_BOOK_QUERY_KEYS.all`, `["recipe-status", recipeId]`, `["recipes", "saved"]`, `savedBooks(recipeId)`, `["recipe", recipeId]` |

### 캐시 전략

- 기본 staleTime / gcTime: 프로젝트 기본 (5min / 30min)
- `useRecipeBookDetail` (미리보기): `size=20`, `sort="addedAt,desc"` — 폴더 진입 시 동일 키로 cache hit
- `useRecipeBookDetailInfinite` (상세 페이지): 첫 페이지를 미리보기 캐시에서 `initialData`로 주입 → 진입 시 0ms 렌더

```ts
const useRecipeBookDetailInfinite = (bookId: string, sort = "addedAt,desc") => {
  const queryClient = useQueryClient();
  const previewKey = RECIPE_BOOK_QUERY_KEYS.detail(bookId, sort);
  const previewData = queryClient.getQueryData(previewKey);

  return useInfiniteQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.detailInfinite(bookId, sort),
    queryFn: ({ pageParam = 0 }) =>
      getRecipeBookDetail(bookId, { page: pageParam, size: 20, sort }),
    getNextPageParam: (last, all) => (last.hasNext ? all.length : undefined),
    initialData: previewData
      ? { pages: [previewData], pageParams: [0] }
      : undefined,
    initialPageParam: 0,
  });
};
```

### 폴더 카드 자체 fetch

폴더 리스트 API에 썸네일이 없어 폴더 카드 컴포넌트 자체가 자기 썸네일을 fetch.

```
MySavedRecipesTabContent
  └─ useRecipeBooks()
      └─ <RecipeBookGrid books>
            ├─ books.map → <RecipeBookCard bookId name count isDefault />
            │     └─ useRecipeBookDetail(bookId, "addedAt,desc")  // 자체 fetch
            │     └─ <RecipeBookThumbnailGrid recipes={data.recipes.slice(0, 4)} />
            └─ books.length < 5 → <CreateRecipeBookCard />
```

### 폴더 개수 제한

- 백엔드 한도: 20개
- 프론트 한도: **5개** (이번 작업의 의도적 제한)
- `books.length >= 5` 일 때 `CreateRecipeBookCard` 자체를 그리지 않음 (사용자가 외부에서 5개 이상 만든 상태도 동일 처리)

---

## 5. 페이지/컴포넌트 동작

### 5.1 저장 탭 (`/users/[me]?tab=saved`)

- 모바일 2열 / 데스크톱 4열 (UserTab 기존 그리드와 동일)
- 폴더 정렬: API의 `displayOrder` 그대로 (기본 폴더가 항상 1번)
- "+" 카드는 마지막 칸. `books.length >= 5`이면 안 그림

### 5.2 `RecipeBookCard`

- props: `{ bookId, name, recipeCount, isDefault }`
- 클릭 → `router.push('/recipe-books/{bookId}')`
- 우상단 ... 메뉴 (드롭다운: `수정` / `삭제`)
  - `isDefault: true`인 경우 ... 메뉴 자체를 렌더하지 않음
  - `수정` → `<RenameRecipeBookSheet>` 오픈
  - `삭제` → `<DeleteRecipeBookModal>` 오픈
- 내부에서 `useRecipeBookDetail(bookId)` → 첫 4개 썸네일 추출

### 5.3 `RecipeBookThumbnailGrid` (2x2 부드러운 3D)

- 카드 내부 padding: 16px
- 썸네일 4개는 1:1, gap 2px, `rounded-lg`, 각자 `shadow-sm`
- 부드러운 3D 느낌은 카드 자체 `shadow-sm` + 썸네일 개별 그림자 조합으로 (회전 X)
- 4개 미만이면 빈 자리는 비워둠 (placeholder 안 그림)
- 카드 하단 텍스트: 폴더 이름 (1줄, ellipsis) → 줄바꿈 → `저장된 레시피 N개`

### 5.4 `CreateRecipeBookCard`

- 같은 사이즈, `border-dashed border-gray-200`, 중앙에 `+` 아이콘 + "폴더 만들기"
- 클릭 → `<CreateRecipeBookSheet>` 오픈

### 5.5 폴더 상세 (`/recipe-books/[bookId]`)

#### Header (`RecipeBookDetailHeader`)

- props: `book`, `editMode`, `selectedCount`, `totalCount`, `onToggleEditMode`, `onExitEditMode`
- 좌측 정렬 레이아웃:
  ```
  편집모드 OFF: [<] 한식 모음 ✏️           [편집]
  편집모드 ON:  [X] 3개 선택
  ```
- 좌측 버튼:
  - OFF → `ArrowLeft` (router.back)
  - ON → `X` (`onExitEditMode`) — **`PrevButton`에 `icon` prop 추가로 처리**
- 중앙 좌측:
  - OFF → `폴더 이름 + ✏️` (기본폴더는 ✏️ 없음). 이름 또는 ✏️ 클릭 → `<RenameRecipeBookSheet>` 오픈
  - ON → `{count}개 선택`
- 우측:
  - OFF → "편집" 텍스트 버튼
  - ON → 사라짐

#### 본문

- 무한스크롤 레시피 그리드. 기존 `RecipeCard` 재사용
- 편집모드 ON: 카드 좌상단에 원형 체크 (선택 시 olive 색, 미선택은 빈 원)
- 편집모드 ON: 카드 클릭 = 선택/해제 토글 (상세 navigation 차단)
- 편집모드 OFF: 카드 클릭 = 레시피 상세로 이동 (기존 동작)

#### 편집모드 상태 (`useEditModeStore`, zustand)

```ts
type EditModeStore = {
  isEditMode: boolean;
  selectedIds: Set<string>;
  enter: () => void;
  exit: () => void;
  toggle: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clear: () => void;
};
```

- 페이지 unmount 시 `exit()` cleanup
- 다른 폴더로 이동 시 자동 reset

#### `EditModeBottomBar`

```
[모두 선택]                       [이동]  [삭제]
```

- 좌측 "모두 선택" 토글: `selectedIds.size === totalCount` 이면 "선택 해제"로 변경
- 우측 [이동] [삭제]: `selectedIds.size === 0`이면 disabled
- `[이동]` → `<MoveRecipesSheet>` 오픈
- `[삭제]` → `<BulkDeleteConfirmModal>` 오픈
- fixed bottom-0, BottomNavbar와 동일 높이/스타일 (흰 배경 + top border)

#### `<MoveRecipesSheet>`

- 반응형 (모바일 drawer / 데스크톱 dialog)
- `useRecipeBooks()` → 현재 폴더 제외하고 list 렌더
- 각 항목: `폴더 이름 · {recipeCount}개`
- 항목 탭 → 즉시 `useMoveRecipes` 실행 (확인 버튼 없음)
- 성공 → sheet 닫힘 → 편집모드 자동 해제 → 토스트 `"N개를 {bookName}으로 이동했어요"`

#### `<BulkDeleteConfirmModal>`

기존 `DeleteModal` 재사용:
- 제목: `선택한 N개 레시피를 폴더에서 뺄까요?`
- 설명: `다른 폴더에 저장돼 있다면 그곳에는 그대로 남아있어요.`
- confirm: `폴더에서 빼기`
- 확인 → `useRemoveRecipesFromBook` 실행 → 모달/편집모드 닫힘 → 토스트

### 5.6 `<CreateRecipeBookSheet>`

- 반응형 (drawer/dialog)
- 헤더: "새 폴더 만들기"
- form: react-hook-form + zod
- input + 글자수 카운터 (`{value.length} / 50`)
- 버튼: [취소] [만들기]
- mutation onSuccess → sheet 닫힘 + 토스트 `"폴더가 만들어졌어요"` + 햅틱 `Success`

### 5.7 `<RenameRecipeBookSheet>`

- CreateSheet와 동일 구조, 헤더 "폴더 이름 변경"
- defaultValue = 현재 이름
- 클라 검증: 다른 폴더(기본 폴더 포함)와 중복 시 즉시 form 에러
- 서버 1107 → form `setError`

### 5.8 `<DeleteRecipeBookModal>`

기존 `DeleteModal` 재사용:
- 제목: `"한식 모음" 폴더를 삭제할까요?`
- 설명: `이 폴더에만 저장된 레시피는 저장 목록에서도 사라져요.`
- confirm: `삭제`

---

## 6. Form Validation

### `entities/recipe-book/model/schema.ts`

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

### 중복 검증
- 클라이언트: `useRecipeBooks()` 결과(기본 폴더 포함)와 비교 → 일치 시 즉시 에러
- 서버: 응답 1107 → form `setError("name", { message: "이미 같은 이름의 폴더가 있어요" })`
- 두 단계 모두 적용 (race condition 대비)

---

## 7. favorited → saved 일괄 마이그레이션

### Rename

| Before | After |
|---|---|
| `features/recipe-favorite/` | `features/recipe-save/` |
| `features/view-favorite-recipes/` | `features/view-saved-recipes/` |
| `useToggleRecipeFavorite` | `useToggleRecipeSave` |
| `postRecipeFavorite` | `postRecipeSave` |
| `getMyFavoriteItems` | `getMySavedRecipes` |
| `MyFavoriteRecipesTabContent` | `MySavedRecipesTabContent` |
| `END_POINTS.RECIPE_FAVORITE` | `END_POINTS.RECIPE_SAVE` (URL은 그대로 `/api/recipes/{id}/favorite`) |

### Query Key 변경

| Before | After |
|---|---|
| `["recipes", "favorite", sort]` | `["recipes", "saved", sort]` |
| `["recipe-status", id]` | (그대로) |

### API 응답 파싱

- `response.favorited` → `response.saved`

### UI 텍스트

- "즐겨찾기" → "저장"
- UserTab 탭 라벨 "북마크" → "저장"
- 토스트: "저장했어요" / "저장을 해제했어요"

### 마이그레이션 시 누락 방지 grep

구현 시 다음 패턴을 일괄 검색:
- `favorite` (대소문자 X)
- `favorited`
- `즐겨찾기`
- `북마크`

---

## 8. 햅틱

| 위치 | 햅틱 |
|---|---|
| 폴더 생성/이름 변경/삭제 onSuccess | `Success` |
| 레시피 bulk 추가/삭제/이동 onSuccess | `Success` |
| 저장 토글 onSuccess (기존 유지) | `Success` |

> Light 햅틱은 이번 작업에서 추가하지 않음.

---

## 9. 빈 상태 / 로딩 / 에러

### 폴더 그리드 (저장 탭)

- 로딩: skeleton 폴더 카드 5개 (실제 카드와 동일 사이즈, pulse)
- 에러: 인라인 메시지 + 재시도 버튼
- 0개: 백엔드가 기본 폴더 자동 생성 보장 → 별도 처리 X

### 폴더 카드 자체 (썸네일 fetch)

- 로딩: 2x2 빈 자리 (placeholder 안 그림)
- 에러: 그냥 빈 자리 (조용히 fail)

### 폴더 상세

- 로딩: skeleton 레시피 그리드
- 0개 레시피:
  ```
  [일러스트]
  아직 저장한 레시피가 없어요
  [레시피 둘러보기 →]   ← /search/result로 이동
  ```
- 에러: 인라인 메시지 + 재시도

### 에러 메시지 매핑 (`errorMessages.ts`)

```ts
export const RECIPE_BOOK_ERROR_MESSAGES: Record<number, string> = {
  1101: "요청한 폴더가 없어요.",
  1102: "이 폴더에 접근할 수 없어요.",
  1103: "기본 폴더는 삭제할 수 없어요.",
  1104: "기본 폴더는 이름을 변경할 수 없어요.",
  1105: "이미 폴더에 들어있는 레시피예요.",
  1106: "폴더는 최대 20개까지 만들 수 있어요.",
  1107: "이미 같은 이름의 폴더가 있어요.",
};
```

mutation `onError`에서 에러 코드 추출 → 토스트 또는 form `setError`. 매핑 없으면 fallback `"잠시 후 다시 시도해주세요."`

---

## 10. 인프라 변경

### `shared/lib/navigation.ts` — BottomNavbar 숨김

```ts
const HIDDEN_PATH_PATTERNS = [
  ...,
  /^\/recipe-books\/[^/]+$/,
];
```

### `shared/ui/PrevButton.tsx` — X 아이콘 swap

기존 props에 `icon?: "back" | "close"` 추가 (default `"back"`). `"close"` 시 X 아이콘 렌더. 기존 사용처 영향 없음.

---

## 11. 명시적 비범위 (Out of Scope, 추후 별도 작업)

- **(e) 레시피 상세에서 저장 버튼 → 폴더 선택 다이얼로그**: 폴더가 1개면 자동 저장, 2개+면 폴더 선택 sheet. 기존 토글 동작은 이번 작업에서 `saved` 응답으로만 마이그레이션됨.
- **(f) 저장 해제 시 "모든 폴더에서 해제됩니다" 다이얼로그**: `GET /api/recipes/{id}/saved-books` 호출 → 2개+ 폴더 시 confirm.
- **개별 레시피 카드의 ... 메뉴**: 항상 편집모드 → bulk 처리만.

---

## 12. 수동 QA 체크리스트

- 폴더 생성: 정상 케이스 / 50자 초과 / 중복 이름(클라/서버) / 5개 한도 도달 시 "+" 카드 사라짐 / 1106 에러 토스트
- 폴더 이름 변경: 기본 폴더는 ✏️ 안 보임 / 다른 폴더와 중복 시 form 에러 / 1104, 1107 에러
- 폴더 삭제: 기본 폴더는 ... 메뉴 안 보임 / 삭제 후 그 폴더에만 있던 레시피의 저장 상태 자동 해제 확인
- 폴더 진입 시 미리보기 캐시 hit (Network 탭에서 동일 요청 발생 안 함 확인)
- 편집모드: 진입 → 헤더/바텀바 전환, 카드 클릭 = 선택, X 버튼으로 해제 (해제 시 우측 "편집" 버튼 다시 표시)
- bulk 이동: 현재 폴더 sheet 항목에 안 보임, 탭 즉시 이동, 성공 토스트, 편집모드 자동 해제
- bulk 삭제: 0개일 때 disabled, 확인 모달 → 빼기, 마지막 폴더에서 빠지면 저장 상태 자동 해제 확인
- BottomNavbar: `/recipe-books/{id}`에서만 숨김. 다른 페이지 영향 없음
- favorited → saved: 기존 저장 기능 (저장 토글, 저장 목록 조회) 정상 동작
- 햅틱: Success 햅틱이 모든 mutation onSuccess에서 발생
