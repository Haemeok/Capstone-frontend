# Error Boundary 점진적 적용 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tier 1(고위험) + Tier 2(중위험) 영역에 에러 바운더리를 점진적으로 적용하여 부분 실패 시에도 나머지 UI를 유지한다.

**Architecture:** 기존 `ErrorBoundary` 클래스 컴포넌트를 그대로 활용하고, 재사용 가능한 fallback UI 컴포넌트 2개(`ErrorFallback`, `SectionErrorFallback`)를 신규 생성한다. 라우트 레벨은 Next.js `error.tsx` 컨벤션, 컴포넌트 레벨은 기존 `ErrorBoundary`로 래핑한다.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, FSD Architecture

---

## File Structure

### 신규 생성

| 파일 | 역할 |
|------|------|
| `src/shared/ui/ErrorFallback.tsx` | 라우트 레벨 에러 fallback UI (페이지 전체용) |
| `src/shared/ui/SectionErrorFallback.tsx` | 컴포넌트 레벨 에러 fallback UI (섹션용) |
| `src/app/recipes/[recipeId]/error.tsx` | 레시피 상세 라우트 에러 바운더리 |
| `src/app/search/results/error.tsx` | 검색 결과 라우트 에러 바운더리 |
| `src/app/users/[userId]/error.tsx` | 마이페이지 라우트 에러 바운더리 |
| `src/app/calendar/[date]/error.tsx` | 캘린더 라우트 에러 바운더리 |
| `src/app/ingredients/error.tsx` | 재료 관리 라우트 에러 바운더리 |
| `src/app/recipes/new/youtube/error.tsx` | YouTube 추출 라우트 에러 바운더리 |
| `src/app/recipes/[recipeId]/edit/error.tsx` | 레시피 수정 라우트 에러 바운더리 |

### 수정

| 파일 | 변경 내용 |
|------|-----------|
| `src/app/recipes/[recipeId]/page.tsx` | 비디오/댓글/재료/스텝 섹션에 ErrorBoundary 래핑 |
| `src/features/view-favorite-recipes/ui/MyFavoriteRecipesTabContent.tsx` | PendingRecipeSection + RecipeGrid 각각 ErrorBoundary 래핑 |
| `src/widgets/FineDiningRecipe/index.tsx` | AiLoading/AIRecipeError 렌더링 영역에 ErrorBoundary 래핑 (다른 AI 모델 페이지도 동일 패턴) |
| `src/app/providers/AppProviders.tsx` | WebSocketProvider를 ErrorBoundary로 래핑 |
| `src/app/page.tsx` | HomeBannerCarousel에 ErrorBoundary 래핑 |
| `src/widgets/UserTab/UserTab.tsx` | CalendarTabContent에 ErrorBoundary 래핑 |
| `src/app/archetype/[code]/page.tsx` | ArchetypeResult에 ErrorBoundary 래핑 |

---

### Task 1: ErrorFallback — 라우트 레벨 에러 UI

**Files:**
- Create: `src/shared/ui/ErrorFallback.tsx`

- [ ] **Step 1: ErrorFallback 컴포넌트 생성**

```tsx
// src/shared/ui/ErrorFallback.tsx
"use client";

type ErrorFallbackProps = {
  reset: () => void;
  message?: string;
};

const ErrorFallback = ({
  reset,
  message = "잠시 후 다시 시도해주세요",
}: ErrorFallbackProps) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
      <p className="text-lg font-bold text-gray-900">문제가 발생했어요</p>
      <p className="text-sm text-gray-500">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="h-12 rounded-xl bg-olive-light px-6 font-medium text-white transition-colors hover:bg-olive-dark"
        >
          다시 시도
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="h-12 rounded-xl bg-gray-100 px-6 font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/shared/ui/ErrorFallback.tsx
git commit -m "feat: add ErrorFallback component for route-level error UI"
```

---

### Task 2: SectionErrorFallback — 섹션 레벨 에러 UI

**Files:**
- Create: `src/shared/ui/SectionErrorFallback.tsx`

- [ ] **Step 1: SectionErrorFallback 컴포넌트 생성**

```tsx
// src/shared/ui/SectionErrorFallback.tsx
"use client";

type SectionErrorFallbackProps = {
  message?: string;
};

const SectionErrorFallback = ({
  message = "이 영역을 불러올 수 없어요",
}: SectionErrorFallbackProps) => {
  return (
    <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-6">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default SectionErrorFallback;
```

> **Note:** ErrorBoundary 클래스 컴포넌트의 `fallback` prop은 `ReactNode`이므로 재시도(reset) 기능은 ErrorBoundary에 `onReset` 콜백을 추가하지 않는 한 불가능하다. 현재 구조에서는 메시지만 표시하고, 사용자가 페이지 새로고침으로 복구하는 것으로 충분하다. 기존 `RecipeSlideWithErrorBoundary` 패턴과 동일.

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/shared/ui/SectionErrorFallback.tsx
git commit -m "feat: add SectionErrorFallback component for section-level error UI"
```

---

### Task 3: Tier 1 라우트 — `/recipes/[recipeId]/error.tsx`

**Files:**
- Create: `src/app/recipes/[recipeId]/error.tsx`

- [ ] **Step 1: error.tsx 생성**

```tsx
// src/app/recipes/[recipeId]/error.tsx
"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const RecipeDetailError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} message="레시피를 불러올 수 없어요" />;
};

export default RecipeDetailError;
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/recipes/[recipeId]/error.tsx
git commit -m "feat: add error boundary for recipe detail route"
```

---

### Task 4: Tier 1 라우트 — `/search/results/error.tsx`

**Files:**
- Create: `src/app/search/results/error.tsx`

- [ ] **Step 1: error.tsx 생성**

```tsx
// src/app/search/results/error.tsx
"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const SearchResultsError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} message="검색 결과를 불러올 수 없어요" />;
};

export default SearchResultsError;
```

- [ ] **Step 2: 커밋**

```bash
git add src/app/search/results/error.tsx
git commit -m "feat: add error boundary for search results route"
```

---

### Task 5: Tier 1 라우트 — `/users/[userId]/error.tsx`

**Files:**
- Create: `src/app/users/[userId]/error.tsx`

- [ ] **Step 1: error.tsx 생성**

```tsx
// src/app/users/[userId]/error.tsx
"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const UserProfileError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} />;
};

export default UserProfileError;
```

- [ ] **Step 2: 커밋**

```bash
git add src/app/users/[userId]/error.tsx
git commit -m "feat: add error boundary for user profile route"
```

---

### Task 6: Tier 1 라우트 — `/calendar/[date]/error.tsx`

**Files:**
- Create: `src/app/calendar/[date]/error.tsx`

- [ ] **Step 1: error.tsx 생성**

```tsx
// src/app/calendar/[date]/error.tsx
"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const CalendarError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} message="캘린더를 불러올 수 없어요" />;
};

export default CalendarError;
```

- [ ] **Step 2: 커밋**

```bash
git add src/app/calendar/[date]/error.tsx
git commit -m "feat: add error boundary for calendar route"
```

---

### Task 7: Tier 1 컴포넌트 — 레시피 상세 페이지 섹션별 ErrorBoundary

**Files:**
- Modify: `src/app/recipes/[recipeId]/page.tsx`

이 페이지는 **서버 컴포넌트**이므로 `ErrorBoundary`를 직접 사용할 수 없다. 대신 각 섹션을 래핑하는 클라이언트 wrapper를 만들거나, 이미 클라이언트인 컴포넌트들을 내부에서 래핑한다.

현재 구조:
- `RecipeVideoSection` (client) → 내부에 children으로 댓글/재료/스텝 등을 받음
- `RecipeIngredientsSection` (client)
- `RecipeCommentsSection` (server)
- `RecipeStepList` (client)

서버 컴포넌트에서 `ErrorBoundary` (client)를 import해서 children을 래핑하는 것은 **가능**하다 (React Server Components에서 클라이언트 컴포넌트를 import하고 서버 컴포넌트를 children으로 전달하는 것은 허용됨).

- [ ] **Step 1: page.tsx에서 ErrorBoundary import 추가**

`src/app/recipes/[recipeId]/page.tsx` 상단에 추가:

```tsx
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";
```

- [ ] **Step 2: RecipeVideoSection에 ErrorBoundary 래핑**

`src/app/recipes/[recipeId]/page.tsx`에서 `<RecipeVideoSection>` 전체를 래핑:

기존:
```tsx
          <RecipeVideoSection
            videoUrl={staticRecipe.youtubeUrl ?? ""}
            youtubeMetadata={youtubeMetadata}
          >
```

변경:
```tsx
          <ErrorBoundary
            fallback={
              <SectionErrorFallback message="비디오를 불러올 수 없어요" />
            }
          >
            <RecipeVideoSection
              videoUrl={staticRecipe.youtubeUrl ?? ""}
              youtubeMetadata={youtubeMetadata}
            >
```

닫는 태그도 대응하여 추가:
```tsx
            </RecipeVideoSection>
          </ErrorBoundary>
```

- [ ] **Step 3: RecipeCommentsSection에 ErrorBoundary 래핑**

`RecipeVideoSection` children 내부에서 `<RecipeCommentsSection>` 래핑:

기존:
```tsx
            <RecipeCommentsSection comments={staticRecipe.comments} />
```

변경:
```tsx
            <ErrorBoundary
              fallback={
                <SectionErrorFallback message="댓글을 불러올 수 없어요" />
              }
            >
              <RecipeCommentsSection comments={staticRecipe.comments} />
            </ErrorBoundary>
```

- [ ] **Step 4: RecipeIngredientsSection에 ErrorBoundary 래핑**

기존:
```tsx
            <RecipeIngredientsSection recipe={staticRecipe} />
```

변경:
```tsx
            <ErrorBoundary
              fallback={
                <SectionErrorFallback message="재료 정보를 불러올 수 없어요" />
              }
            >
              <RecipeIngredientsSection recipe={staticRecipe} />
            </ErrorBoundary>
```

- [ ] **Step 5: RecipeStepList에 ErrorBoundary 래핑**

기존:
```tsx
            <RecipeStepList RecipeSteps={staticRecipe.steps} />
```

변경:
```tsx
            <ErrorBoundary
              fallback={
                <SectionErrorFallback message="조리 순서를 불러올 수 없어요" />
              }
            >
              <RecipeStepList RecipeSteps={staticRecipe.steps} />
            </ErrorBoundary>
```

- [ ] **Step 6: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 7: 커밋**

```bash
git add src/app/recipes/[recipeId]/page.tsx
git commit -m "feat: add component-level error boundaries to recipe detail sections"
```

---

### Task 8: Tier 1 컴포넌트 — 마이페이지 PendingRecipeSection + RecipeGrid

**Files:**
- Modify: `src/features/view-favorite-recipes/ui/MyFavoriteRecipesTabContent.tsx`

- [ ] **Step 1: import 추가**

`src/features/view-favorite-recipes/ui/MyFavoriteRecipesTabContent.tsx` 상단에 추가:

```tsx
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";
```

- [ ] **Step 2: PendingRecipeSection에 ErrorBoundary 래핑**

기존:
```tsx
      {hasVisibleJobs && (
        <PendingRecipeSection pendingJobKeys={visibleJobKeys} />
      )}
```

변경:
```tsx
      {hasVisibleJobs && (
        <ErrorBoundary
          fallback={
            <SectionErrorFallback message="추출 중인 레시피 상태를 불러올 수 없어요" />
          }
        >
          <PendingRecipeSection pendingJobKeys={visibleJobKeys} />
        </ErrorBoundary>
      )}
```

- [ ] **Step 3: RecipeGrid에 ErrorBoundary 래핑**

기존:
```tsx
      <RecipeGrid
        recipes={recipes}
        isSimple={false}
        ...
      />
```

변경:
```tsx
      <ErrorBoundary
        fallback={
          <SectionErrorFallback message="레시피 목록을 불러올 수 없어요" />
        }
      >
        <RecipeGrid
          recipes={recipes}
          isSimple={false}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          noResults={recipes.length === 0 && !isFetching && !hasVisibleJobs}
          noResultsMessage={
            recipes.length === 0
              ? "즐겨찾기한 레시피가 없습니다."
              : "즐겨찾기한 레시피를 추가해보세요."
          }
          observerRef={ref}
          error={error}
          useLCP={false}
          queryKeyToInvalidate={["recipes", "favorite", sort]}
        />
      </ErrorBoundary>
```

- [ ] **Step 4: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add src/features/view-favorite-recipes/ui/MyFavoriteRecipesTabContent.tsx
git commit -m "feat: add error boundaries to favorite recipes tab sections"
```

---

### Task 9: Tier 1 컴포넌트 — AI 레시피 페이지 ErrorBoundary

**Files:**
- Modify: `src/widgets/FineDiningRecipe/index.tsx` (대표 예시, 다른 3개 AI 모델도 동일 패턴 적용)

AI 모델 위젯은 `isPending`/`isFailed` 조건에서 `AiLoading`/`AIRecipeError`를 early return 한다. 이 전체 컴포넌트를 감싸는 방식이 적절하다. AI 모델 위젯을 사용하는 **페이지 파일**에서 래핑한다.

- [ ] **Step 1: AI 모델 페이지 파일 확인**

4개 AI 모델 페이지:
- `src/app/recipes/new/ai/finedining/page.tsx`
- `src/app/recipes/new/ai/ingredient/page.tsx`
- `src/app/recipes/new/ai/nutrition/page.tsx`
- `src/app/recipes/new/ai/price/page.tsx`

각 페이지를 읽고 현재 구조를 확인한다.

- [ ] **Step 2: 각 AI 페이지에서 위젯을 ErrorBoundary로 래핑**

각 페이지에서 AI 위젯 컴포넌트를 `ErrorBoundary`로 래핑한다. 예시 (finedining):

기존 패턴:
```tsx
import FineDiningRecipe from "@/widgets/FineDiningRecipe";

export default function Page() {
  return <FineDiningRecipe />;
}
```

변경:
```tsx
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";
import FineDiningRecipe from "@/widgets/FineDiningRecipe";

export default function Page() {
  return (
    <ErrorBoundary
      fallback={
        <SectionErrorFallback message="AI 레시피 생성 중 문제가 발생했어요" />
      }
    >
      <FineDiningRecipe />
    </ErrorBoundary>
  );
}
```

4개 모두 동일 패턴으로 적용한다.

- [ ] **Step 3: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add src/app/recipes/new/ai/
git commit -m "feat: add error boundaries to AI recipe generation pages"
```

---

### Task 10: Tier 1 컴포넌트 — WebSocket Provider ErrorBoundary

**Files:**
- Modify: `src/app/providers/AppProviders.tsx`

WebSocketProvider가 throw하면 하위의 YoutubeImportProvider, AIRecipeProvider, AppStateInitializer 전부 죽는다. WebSocketProvider를 ErrorBoundary로 래핑하되, 에러 시 children은 WebSocket 없이 렌더링한다.

- [ ] **Step 1: AppProviders에 ErrorBoundary import 및 래핑**

`src/app/providers/AppProviders.tsx` 수정:

기존:
```tsx
        <ScrollProvider>
          <WebSocketProvider>
            <YoutubeImportProvider>
              <AIRecipeProvider>
                <AppStateInitializer>{children}</AppStateInitializer>
              </AIRecipeProvider>
            </YoutubeImportProvider>
            <ToastProvider />
            <YoutubeExtractionPrompter />
          </WebSocketProvider>
        </ScrollProvider>
```

변경:
```tsx
        <ScrollProvider>
          <ErrorBoundary fallback={<>{children}</>}>
            <WebSocketProvider>
              <YoutubeImportProvider>
                <AIRecipeProvider>
                  <AppStateInitializer>{children}</AppStateInitializer>
                </AIRecipeProvider>
              </YoutubeImportProvider>
              <ToastProvider />
              <YoutubeExtractionPrompter />
            </WebSocketProvider>
          </ErrorBoundary>
        </ScrollProvider>
```

> **주의:** 이 패턴에서 ErrorBoundary의 fallback으로 `{children}`을 전달하면, WebSocket이 죽었을 때 children(앱 전체)은 렌더링되지만 ToastProvider와 YoutubeExtractionPrompter는 렌더링되지 않는다. 이것이 의도한 동작이다 — WebSocket 관련 기능만 비활성화.

하지만 `ErrorBoundary`의 `fallback` prop은 정적 `ReactNode`이므로 `{children}`을 직접 참조할 수 없다. ErrorBoundary는 children을 렌더링하거나 fallback을 렌더링하는 이분법 구조다.

**수정된 접근:** WebSocketProvider 자체를 ErrorBoundary로 감싸되, children 구조를 재배치한다.

```tsx
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <PostHogProvider>
      <PostHogPageView />
      <QueryClientProvider client={queryClient}>
        <ScrollProvider>
          <ErrorBoundary fallback={<></>}>
            <WebSocketProvider>
              <YoutubeImportProvider>
                <AIRecipeProvider>
                  <AppStateInitializer>{children}</AppStateInitializer>
                </AIRecipeProvider>
              </YoutubeImportProvider>
              <ToastProvider />
              <YoutubeExtractionPrompter />
            </WebSocketProvider>
          </ErrorBoundary>
        </ScrollProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
};
```

> **재고:** 이러면 WebSocket 에러 시 앱 전체가 빈 화면이 된다. 실제로 WebSocketProvider가 렌더링 중 throw할 가능성은 매우 낮다 (useEffect 내 비동기 처리라 throw하지 않음). 이 태스크는 **생략**하고, WebSocket 에러는 기존 try-catch + console.error로 충분하다고 판단한다.

- [ ] **Step 1: 이 태스크는 생략 — WebSocketProvider는 렌더링 중 throw하지 않음**

WebSocketProvider의 에러 발생 지점:
- `connectWithTicket()` — useEffect 내 async 함수, try-catch 처리 완료
- `handleError()` — 이벤트 핸들러, console.error 처리 완료

렌더링 중 에러가 발생하지 않으므로 ErrorBoundary 불필요.

- [ ] **Step 2: 커밋 없음 — 변경 없음**

---

### Task 11: Tier 2 라우트 — `/ingredients/error.tsx`

**Files:**
- Create: `src/app/ingredients/error.tsx`

- [ ] **Step 1: error.tsx 생성**

```tsx
// src/app/ingredients/error.tsx
"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const IngredientsError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} message="재료 목록을 불러올 수 없어요" />;
};

export default IngredientsError;
```

- [ ] **Step 2: 커밋**

```bash
git add src/app/ingredients/error.tsx
git commit -m "feat: add error boundary for ingredients route"
```

---

### Task 12: Tier 2 라우트 — `/recipes/new/youtube/error.tsx`

**Files:**
- Create: `src/app/recipes/new/youtube/error.tsx`

- [ ] **Step 1: error.tsx 생성**

```tsx
// src/app/recipes/new/youtube/error.tsx
"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const YoutubeImportError = ({ reset }: ErrorProps) => {
  return <ErrorFallback reset={reset} />;
};

export default YoutubeImportError;
```

- [ ] **Step 2: 커밋**

```bash
git add src/app/recipes/new/youtube/error.tsx
git commit -m "feat: add error boundary for YouTube import route"
```

---

### Task 13: Tier 2 라우트 — `/recipes/[recipeId]/edit/error.tsx`

**Files:**
- Create: `src/app/recipes/[recipeId]/edit/error.tsx`

- [ ] **Step 1: error.tsx 생성**

```tsx
// src/app/recipes/[recipeId]/edit/error.tsx
"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const RecipeEditError = ({ reset }: ErrorProps) => {
  return (
    <ErrorFallback reset={reset} message="레시피 수정 페이지를 불러올 수 없어요" />
  );
};

export default RecipeEditError;
```

- [ ] **Step 2: 커밋**

```bash
git add src/app/recipes/[recipeId]/edit/error.tsx
git commit -m "feat: add error boundary for recipe edit route"
```

---

### Task 14: Tier 2 컴포넌트 — 검색 결과 RecipeGrid

**Files:**
- 검색 결과 페이지의 클라이언트 컴포넌트를 찾아 RecipeGrid를 ErrorBoundary로 래핑

- [ ] **Step 1: SearchClient 위젯 확인**

`src/widgets/SearchClient/` 디렉토리를 읽어 RecipeGrid 사용 위치를 확인한다.

- [ ] **Step 2: SearchClient 내 RecipeGrid에 ErrorBoundary 래핑**

SearchClient 내부에서 RecipeGrid를 ErrorBoundary로 래핑한다:

```tsx
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

// RecipeGrid 부분을 래핑:
<ErrorBoundary
  fallback={
    <SectionErrorFallback message="검색 결과를 표시할 수 없어요" />
  }
>
  <RecipeGrid ... />
</ErrorBoundary>
```

- [ ] **Step 3: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add src/widgets/SearchClient/
git commit -m "feat: add error boundary to search results grid"
```

---

### Task 15: Tier 2 컴포넌트 — 홈 HomeBannerCarousel

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: import 추가 및 HomeBannerCarousel 래핑**

`src/app/page.tsx`에서:

import 추가:
```tsx
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";
```

기존:
```tsx
          <HomeBannerCarousel
            slides={[
              {
                id: "youtube",
                ...
              },
            ]}
          />
```

변경:
```tsx
          <ErrorBoundary
            fallback={<SectionErrorFallback message="배너를 불러올 수 없어요" />}
          >
            <HomeBannerCarousel
              slides={[
                {
                  id: "youtube",
                  ...
                },
              ]}
            />
          </ErrorBoundary>
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/page.tsx
git commit -m "feat: add error boundary to home banner carousel"
```

---

### Task 16: Tier 2 컴포넌트 — 마이페이지 캘린더 탭

**Files:**
- Modify: `src/widgets/UserTab/UserTab.tsx`

- [ ] **Step 1: import 추가 및 CalendarTabContent 래핑**

`src/widgets/UserTab/UserTab.tsx`에서:

import 추가:
```tsx
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";
```

`renderTabContent` 함수 내 calendar case 변경:

기존:
```tsx
      case "calendar":
        return <CalendarTabContent />;
```

변경:
```tsx
      case "calendar":
        return (
          <ErrorBoundary
            fallback={
              <SectionErrorFallback message="캘린더를 불러올 수 없어요" />
            }
          >
            <CalendarTabContent />
          </ErrorBoundary>
        );
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/UserTab/UserTab.tsx
git commit -m "feat: add error boundary to calendar tab"
```

---

### Task 17: Tier 2 컴포넌트 — Archetype 이미지 공유

**Files:**
- Modify: `src/app/archetype/[code]/page.tsx`

- [ ] **Step 1: ArchetypeResult에 ErrorBoundary 래핑**

`src/app/archetype/[code]/page.tsx`에서:

import 추가:
```tsx
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";
```

기존:
```tsx
  return (
    <Container padding={false}>
      <ArchetypeResult result={archetypeKey} />
    </Container>
  );
```

변경:
```tsx
  return (
    <Container padding={false}>
      <ErrorBoundary
        fallback={
          <SectionErrorFallback message="결과를 표시할 수 없어요" />
        }
      >
        <ArchetypeResult result={archetypeKey} />
      </ErrorBoundary>
    </Container>
  );
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/archetype/[code]/page.tsx
git commit -m "feat: add error boundary to archetype result page"
```

---

### Task 18: 최종 타입 체크 및 확인

- [ ] **Step 1: 전체 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 2: 변경 파일 목록 확인**

Run: `git log --oneline feature/17 --not main`

Expected: Task 1~17의 커밋들이 순서대로 나열
