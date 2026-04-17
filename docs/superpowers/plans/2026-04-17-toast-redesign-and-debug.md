# Toast Redesign + Debug Panel + Sheet Count Workaround Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** (1) Sheet 안의 레시피북 항목 카운트도 detail fetch 기반으로 백엔드 미초기화 우회. (2) 모든 토스트 디자인을 흰 배경 + 컬러 아이콘으로 통일. (3) dev 모드에서만 보이는 토스트 디버그 패널을 메인 페이지에 추가.

**Architecture:** 카운트 표시는 작은 entity-level UI 컴포넌트 (`RecipeBookCountText`)로 추출해 RecipeBookCard / MoveRecipesSheet / ChangeBookSheet에서 공통 사용. 토스트는 layout을 action variant 패턴으로 통일하고 variant별 색은 아이콘만 유지. 디버그는 widgets/ToastDebugPanel에 격리하고 dev gate.

**Tech Stack:** Next.js 15, TypeScript, TanStack Query (cache 공유), Zustand (toast store), Tailwind, lucide-react.

**Verification:** 단위 테스트 없음. 각 task 끝에 `npx tsc --noEmit` + commit.

**Hygiene:** **`git add -A` / `git add .` 절대 금지.** 명시된 경로만 stage.

---

## Phase 0: 사전 준비

### Task 0.1: 브랜치 확인

- [ ] **Step 1**: `git branch --show-current` → `feature/17`
- [ ] **Step 2**: `git log --oneline -1` → 직전 SHA 기록 (rollback baseline)

---

## Phase 1: Sheet count workaround (entity-level 공통 컴포넌트)

### Task 1.1: `useDisplayedRecipeCount` 훅 + `RecipeBookCountText` 컴포넌트

**Files:**
- Create: `src/entities/recipe-book/model/hooks/useDisplayedRecipeCount.ts`
- Modify: `src/entities/recipe-book/model/hooks/index.ts`
- Create: `src/entities/recipe-book/ui/RecipeBookCountText.tsx`
- Create: `src/entities/recipe-book/ui/index.ts`
- Modify: `src/entities/recipe-book/index.ts`

#### Step 1: `useDisplayedRecipeCount.ts`

```ts
import { useRecipeBookDetail } from "./useRecipeBookDetail";

/**
 * Returns the displayed recipe count for a recipe book.
 *
 * TEMPORARY workaround: backend's `recipeCount` field on the recipe book
 * list API is not initialized (always 0). We reuse the detail fetch's
 * `recipes` array length instead. Bounded by page size (20) — large books
 * will undercount until the backend fix ships.
 *
 * Remove this hook (revert callers to `book.recipeCount`) once the backend
 * properly initializes the list API count.
 */
export const useDisplayedRecipeCount = (
  bookId: string,
  fallback: number
): number => {
  const { data } = useRecipeBookDetail(bookId);
  return data?.recipes?.length ?? fallback;
};
```

#### Step 2: Hook barrel update

`src/entities/recipe-book/model/hooks/index.ts` — append:

```ts
export { useDisplayedRecipeCount } from "./useDisplayedRecipeCount";
```

#### Step 3: `RecipeBookCountText.tsx`

```tsx
"use client";

import { useDisplayedRecipeCount } from "@/entities/recipe-book/model/hooks/useDisplayedRecipeCount";

import { cn } from "@/shared/lib/utils";

type Props = {
  bookId: string;
  fallback: number;
  className?: string;
};

export const RecipeBookCountText = ({ bookId, fallback, className }: Props) => {
  const count = useDisplayedRecipeCount(bookId, fallback);
  return (
    <span className={cn("text-sm text-gray-500", className)}>{count}개</span>
  );
};
```

#### Step 4: `ui/index.ts`

```ts
export { RecipeBookCountText } from "./RecipeBookCountText";
```

#### Step 5: Top barrel update

`src/entities/recipe-book/index.ts` — add ui exports. Read first to see current shape, then append:

```ts
export * from "./ui";
```

(Or named-export `RecipeBookCountText` directly to match the existing barrel style — pick whichever the file already uses.)

#### Step 6: type check + commit

```bash
npx tsc --noEmit
git add src/entities/recipe-book/model/hooks/useDisplayedRecipeCount.ts \
        src/entities/recipe-book/model/hooks/index.ts \
        src/entities/recipe-book/ui/RecipeBookCountText.tsx \
        src/entities/recipe-book/ui/index.ts \
        src/entities/recipe-book/index.ts
git commit -m "feat(recipe-book): add useDisplayedRecipeCount hook + RecipeBookCountText"
```

---

### Task 1.2: RecipeBookCard 리팩터 (기존 inline workaround → 공통 hook)

**File:**
- Modify: `src/widgets/RecipeBookGrid/RecipeBookCard.tsx`

#### Step 1: Read current file

It currently has:
```tsx
const displayedCount = data?.recipes?.length ?? recipeCount;
// ...
<p className="text-sm text-gray-500">저장된 레시피 {displayedCount}개</p>
```

#### Step 2: Replace with hook

```tsx
"use client";

import { useRouter } from "next/navigation";

import {
  useDisplayedRecipeCount,
  useRecipeBookDetail,
} from "@/entities/recipe-book";

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
  const displayedCount = useDisplayedRecipeCount(bookId, recipeCount);

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
          <p className="text-sm text-gray-500">저장된 레시피 {displayedCount}개</p>
        </div>
        {!isDefault && (
          <RecipeBookCardMenu bookId={bookId} bookName={name} />
        )}
      </div>
    </div>
  );
};
```

> NOTE: The `useRecipeBookDetail` call still exists for thumbnails. The `useDisplayedRecipeCount` hook internally calls the same hook — TanStack Query dedupes by key, so no extra request.

#### Step 3: type check + commit

```bash
npx tsc --noEmit
git add src/widgets/RecipeBookGrid/RecipeBookCard.tsx
git commit -m "refactor(widget): use useDisplayedRecipeCount hook in RecipeBookCard"
```

---

### Task 1.3: MoveRecipesSheet — count도 detail 기반으로

**File:**
- Modify: `src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx`

#### Step 1: Read current file

The sheet has a `<ul>` with `targets.map(b => <li>...{b.name}...{b.recipeCount}개...</li>)`.

#### Step 2: Replace count display with `RecipeBookCountText`

Find the row JSX:

```tsx
<button ...>
  <span className="font-medium text-gray-900">{b.name}</span>
  <span className="text-sm text-gray-500">{b.recipeCount}개</span>
</button>
```

Replace the count span with:

```tsx
<button ...>
  <span className="font-medium text-gray-900">{b.name}</span>
  <RecipeBookCountText bookId={b.id} fallback={b.recipeCount} />
</button>
```

Add the import:
```ts
import { RecipeBookCountText } from "@/entities/recipe-book";
```

#### Step 3: type check + commit

```bash
npx tsc --noEmit
git add src/features/recipe-book-edit-mode/ui/MoveRecipesSheet.tsx
git commit -m "fix(edit-mode): show detail-derived count in move sheet rows"
```

---

### Task 1.4: ChangeBookSheet — 동일 적용

**File:**
- Modify: `src/features/recipe-book-change/ui/ChangeBookSheet.tsx`

#### Step 1: Read current file

Same pattern: a `<ul>` with `targets.map(b => ...{b.recipeCount}개...)`.

#### Step 2: Replace count display

Find:
```tsx
<button ...>
  <span className="font-medium text-gray-900">{b.name}</span>
  <span className="text-sm text-gray-500">{b.recipeCount}개</span>
</button>
```

Replace count span:

```tsx
<button ...>
  <span className="font-medium text-gray-900">{b.name}</span>
  <RecipeBookCountText bookId={b.id} fallback={b.recipeCount} />
</button>
```

Add import:
```ts
import { RecipeBookCountText } from "@/entities/recipe-book";
```

#### Step 3: type check + commit

```bash
npx tsc --noEmit
git add src/features/recipe-book-change/ui/ChangeBookSheet.tsx
git commit -m "fix(recipe-book-change): show detail-derived count in change sheet rows"
```

---

## Phase 2: 토스트 디자인 통일 (모두 흰 배경)

### Task 2.1: Toast.tsx — variant별 색 → 아이콘만 유지, 배경 흰색 통일

**File:**
- Modify: `src/widgets/Toast/ui/Toast.tsx`

#### Step 1: Read current file

Current: variants have different bg colors (`bg-olive-light`, `bg-red-500` 등). Action variant alone uses white. Mobile non-action layout is `h-8` compact bar with no icon.

#### Step 2: Replace style maps + render

Replace the constant maps with white-uniform versions:

```ts
const MOBILE_TOAST_STYLE: Record<ToastType["variant"], string> = {
  success: "bg-white text-gray-900 border border-gray-100 shadow-lg",
  error: "bg-white text-gray-900 border border-gray-100 shadow-lg",
  warning: "bg-white text-gray-900 border border-gray-100 shadow-lg",
  info: "bg-white text-gray-900 border border-gray-100 shadow-lg",
  default: "bg-white text-gray-900 border border-gray-100 shadow-lg",
  "rich-youtube": "bg-white text-gray-900 border border-gray-100 shadow-lg",
  action: "bg-white text-gray-900 border border-gray-100 shadow-lg",
};

const DESKTOP_TOAST_STYLE: Record<ToastType["variant"], string> = {
  success: "bg-white border border-gray-100 shadow-md",
  error: "bg-white border border-gray-100 shadow-md",
  warning: "bg-white border border-gray-100 shadow-md",
  info: "bg-white border border-gray-100 shadow-md",
  default: "bg-white border border-gray-100 shadow-md",
  "rich-youtube": "bg-white border border-gray-100 shadow-md",
  action: "bg-white border border-gray-100 shadow-md",
};

// ICON_STYLE stays the same — color differentiation moves entirely to icon.
const ICON_STYLE: Record<ToastType["variant"], string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
  default: "text-olive-light",
  "rich-youtube": "text-olive-light",
  action: "text-olive-light",
};
```

(`TOAST_ICON` and `TOAST_SIZE` stay the same.)

#### Step 3: Restructure mobile rendering — unify layout

Replace the entire mobile JSX (the existing `variant === "action" && action ? ... : ...` ternary) with one unified layout:

```tsx
<div
  className={cn(
    MOBILE_TOAST_STYLE[variant],
    "pointer-events-auto z-30 flex w-11/12 items-center gap-3 rounded-xl px-5 py-3 shadow-md md:hidden",
    isVisible ? "animate-slideInUp" : "animate-fadeOut"
  )}
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  <Icon className={cn("h-5 w-5 shrink-0", ICON_STYLE[variant])} />
  <span className="flex-1 text-sm">{message}</span>
  {variant === "action" && action && (
    <button
      type="button"
      onClick={() => {
        action.onClick();
        removeToast(id);
      }}
      className="shrink-0 px-2 py-1 text-sm font-bold text-olive-light underline underline-offset-2"
    >
      {action.label ?? "변경"}
    </button>
  )}
</div>
```

Key points:
- Layout is identical for all variants — icon left, message middle, optional action right
- `pointer-events-auto` always on (so any interactive content works)
- `gap-3` and `py-3` for breathing room
- `rounded-xl` consistent with action toast we already shipped
- Removed `h-8` fixed height
- The non-action `TOAST_SIZE` preset and `truncate` are no longer applied — small inconsistency from the previous compact mode is intentional, the unified layout takes precedence.

#### Step 4: Desktop rendering — already mostly OK, just confirm bg

The desktop block already has `pointer-events-auto`, icon, message, optional action button, and a close button. Just confirm `DESKTOP_TOAST_STYLE` change applies. No structural change needed unless you spot a layout issue when bg is white. (Existing bg was already light pastel, so visual change is subtle.)

#### Step 5: type check + commit

```bash
npx tsc --noEmit
git add src/widgets/Toast/ui/Toast.tsx
git commit -m "feat(toast): unify all variants to white bg + colored icon (Toss-style)"
```

---

### Task 2.2: RichToast.tsx — 같은 흰 배경 톤 적용

**File:**
- Modify: `src/widgets/Toast/ui/RichToast.tsx`

#### Step 1: Read current file

This is the rich-youtube variant rendering (with thumbnail, title, subtitle, badge). Find the container's bg styles.

#### Step 2: Match white bg + light shadow

Wherever the container had a colored bg (`bg-olive-mint` 등), change to:
- Mobile: `bg-white text-gray-900 border border-gray-100 shadow-lg`
- Desktop: `bg-white border border-gray-100 shadow-md`

Text colors that were white on colored bg → switch to `text-gray-900` for title and `text-gray-600` for subtitle (or whatever matches Toss/Airbnb tone).

If the file has its own style logic, adapt accordingly. If you spot a structural issue (e.g., a button that's hard to read on white), restyle minimally — don't redesign the whole layout.

#### Step 3: type check + commit

```bash
npx tsc --noEmit
git add src/widgets/Toast/ui/RichToast.tsx
git commit -m "feat(toast): RichToast uses white bg + dark text"
```

---

## Phase 3: Toast Debug Panel (dev only)

### Task 3.1: ToastDebugPanel widget

**Files:**
- Create: `src/widgets/ToastDebugPanel/ui/ToastDebugPanel.tsx`
- Create: `src/widgets/ToastDebugPanel/ui/ToastDebugButton.tsx`
- Create: `src/widgets/ToastDebugPanel/index.ts`

#### Step 1: 디렉토리 생성

```bash
mkdir -p src/widgets/ToastDebugPanel/ui
```

#### Step 2: ToastDebugPanel.tsx

`src/widgets/ToastDebugPanel/ui/ToastDebugPanel.tsx`:

```tsx
"use client";

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

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

import { useToastStore } from "@/widgets/Toast/model/store";
import type { ToastType } from "@/widgets/Toast/model/types";

type Variant = ToastType["variant"];
type Position = NonNullable<ToastType["position"]>;

const VARIANT_LIST: Variant[] = [
  "success",
  "error",
  "warning",
  "info",
  "default",
  "rich-youtube",
  "action",
];

const POSITION_LIST: Position[] = ["top", "middle", "bottom"];

const SAMPLE_MESSAGE: Record<Variant, string> = {
  success: "성공 토스트 예시 메시지입니다.",
  error: "에러가 발생했어요.",
  warning: "주의가 필요해요.",
  info: "참고할 정보입니다.",
  default: "기본 토스트입니다.",
  "rich-youtube": "유튜브 레시피 추출 진행중",
  action: `"저장된 레시피"에 보관되었습니다.`,
};

const DESKTOP_BREAKPOINT = "(min-width: 768px)";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ToastDebugPanel = ({ open, onOpenChange }: Props) => {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);
  const addToast = useToastStore((s) => s.addToast);

  const fireToast = (variant: Variant, position: Position) => {
    if (variant === "rich-youtube") {
      addToast({
        message: SAMPLE_MESSAGE[variant],
        variant,
        position,
        richContent: {
          thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
          title: "샘플 레시피 제목",
          subtitle: "추출 진행중...",
        },
      });
      return;
    }
    if (variant === "action") {
      addToast({
        message: SAMPLE_MESSAGE[variant],
        variant,
        position,
        action: {
          label: "변경",
          onClick: () =>
            addToast({
              message: "변경 액션이 호출됨",
              variant: "info",
              position,
            }),
        },
      });
      return;
    }
    addToast({
      message: SAMPLE_MESSAGE[variant],
      variant,
      position,
    });
  };

  const Body = (
    <div className="space-y-6 px-4 pb-6">
      {POSITION_LIST.map((position) => (
        <section key={position}>
          <h3 className="mb-2 text-sm font-bold text-gray-700">
            position: {position}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {VARIANT_LIST.map((variant) => (
              <button
                key={`${position}-${variant}`}
                type="button"
                onClick={() => fireToast(variant, position)}
                className="rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {variant}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold text-gray-900">
              🐛 Toast Debug
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
            🐛 Toast Debug
          </DrawerTitle>
        </DrawerHeader>
        {Body}
      </DrawerContent>
    </Drawer>
  );
};
```

#### Step 3: ToastDebugButton.tsx (dev gate)

`src/widgets/ToastDebugPanel/ui/ToastDebugButton.tsx`:

```tsx
"use client";

import { useState } from "react";
import { BugIcon } from "lucide-react";

import { ToastDebugPanel } from "./ToastDebugPanel";

export const ToastDebugButton = () => {
  const [open, setOpen] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-24 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-transform active:scale-95"
        aria-label="토스트 디버그"
      >
        <BugIcon size={20} />
      </button>
      <ToastDebugPanel open={open} onOpenChange={setOpen} />
    </>
  );
};
```

> NOTE: `bottom-24` so it sits above the BottomNavbar on mobile. Adjust if it overlaps another fixed element.

#### Step 4: index.ts

`src/widgets/ToastDebugPanel/index.ts`:

```ts
export { ToastDebugButton } from "./ui/ToastDebugButton";
```

#### Step 5: type check + commit

```bash
npx tsc --noEmit
git add src/widgets/ToastDebugPanel/
git commit -m "feat(debug): toast debug panel for testing all variants in dev"
```

---

### Task 3.2: 메인 페이지에 디버그 버튼 마운트

**File:**
- Modify: `src/app/page.tsx`

#### Step 1: Read main page

```bash
cat src/app/page.tsx
```

It's likely a server component or simple wrapper. Identify where to inject a client-side button. If `page.tsx` is server, the `ToastDebugButton` (a `"use client"` component) can be rendered as a child — Next.js handles the boundary.

#### Step 2: Inject the button

Add an import:

```ts
import { ToastDebugButton } from "@/widgets/ToastDebugPanel";
```

In the JSX, add `<ToastDebugButton />` somewhere in the return — preferably at the end of the root element so it floats above content. The button auto-hides outside dev mode, so no conditional needed at the call site.

Example:

```tsx
return (
  <>
    {/* existing page content */}
    <ToastDebugButton />
  </>
);
```

If the page returns a complex layout, just stick the button as a sibling/child wherever it doesn't disrupt structure — fixed positioning means parent layout doesn't matter.

#### Step 3: type check + commit

```bash
npx tsc --noEmit
git add src/app/page.tsx
git commit -m "feat(debug): mount toast debug button on main page"
```

---

## Phase 4: 검증

### Task 4.1: 전체 type check + lint

```bash
npx tsc --noEmit
npm run lint -- src/entities/recipe-book src/features/recipe-book-edit-mode src/features/recipe-book-change src/widgets/RecipeBookGrid src/widgets/Toast src/widgets/ToastDebugPanel src/app/page.tsx 2>&1 | tail -30
```

Lint 오류 발생 시 해당 파일만 수정 후 commit:

```bash
git commit -m "chore(lint): autofix toast/debug imports"
```

### Task 4.2: dev server 수동 QA

```bash
npm run dev
```

확인 항목:

1. **메인 페이지에 🐛 디버그 버튼** — 우하단에 floating 버튼 보임 (dev 모드)
2. **디버그 패널 열림** — 버튼 클릭 시 sheet/dialog 오픈
3. **각 variant 토스트 발사** — success/error/warning/info/default/rich-youtube/action 모두 흰 배경 + 색 아이콘으로 뜸
4. **각 position** — top/middle/bottom 모두 작동
5. **action variant 변경 버튼** — 모바일에서도 클릭됨, 다른 토스트 띄움
6. **저장 토스트 (실제 저장 버튼)** — 흰 배경 action 토스트로 뜸 (Phase 2 영향)
7. **레시피북 카드 카운트** — 그리드에서 정상 표시
8. **이동 sheet 카운트** — 각 행의 개수가 detail 기반으로 표시
9. **변경 sheet 카운트** — 동일
10. **production 빌드 시 디버그 버튼 숨김** — `NODE_ENV=production` 가정 (실제로는 빌드 후 확인 — `npm run build`는 사용자가 명시적으로 요청했을 때만)

문제 발견 시 별도 fix commit.

---

## 비범위 (이번에 미포함)

- 페이지 size 초과 시 정확한 카운트 (백엔드 fix 대기)
- 디버그 패널 운영 노출 옵션 (`?debug=1`) — dev only로 충분
- RichToast 내부 layout 전면 재설계 (배경색만 변경, 구조는 유지)
- 토스트 z-index 충돌 (모달/시트와 겹칠 때) — 발견 시 별도 처리

---

## Self-Review

**Spec 커버리지** (사용자 요청 vs tasks):

| 요청 | 커버 task |
|---|---|
| sheet에서도 개수 detail 기반 | Task 1.3 (Move) + 1.4 (Change), 공통 컴포넌트 1.1 |
| 모든 토스트 흰 배경 디자인 통일 | Task 2.1 (Toast) + 2.2 (RichToast) |
| 메인 페이지 디버그 버튼 + 모든 variant 테스트 | Task 3.1 (panel) + 3.2 (mount) |
| dev only | Task 3.1의 `process.env.NODE_ENV !== "development"` gate |

**Placeholder 스캔**: TBD/TODO 없음. NOTE는 코드베이스 확인이 필요한 위치 안내.

**Type 일관성**: `RecipeBookCountText` props (`bookId`, `fallback`)와 `useDisplayedRecipeCount` 시그니처 일관. ToastDebugPanel의 variant/position 타입은 `ToastType` 직접 인용.

**남은 위험**:
- Task 2.1에서 모바일 토스트 layout 변경 시, 기존 `TOAST_SIZE`의 small/medium/large 분기가 사라짐. 만약 `size="small"` 토스트가 어딘가에서 명시적으로 사용 중이면 시각 변화 발생. grep으로 확인:
  ```bash
  grep -rn "size:\s*\"small\"\|size: 'small'\|size=\"small\"" src/ | grep -i toast
  ```
  발견 시 conditional `py-2 px-3` 같은 compact 스타일을 small에 적용하는 식으로 분기 추가.
- Task 3.2에서 `src/app/page.tsx`의 구조에 따라 button 주입 위치 조정 필요.
