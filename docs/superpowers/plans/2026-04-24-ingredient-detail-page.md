# Ingredient Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 냉장고에서 재료 타일을 탭하면 진입하는 재료 상세 페이지를 구현한다. UI/디자인만 구현하고 데이터는 목데이터로 공급한다.

**Architecture:**
- `/ingredients/[ingredientId]` 동적 라우트의 서버 컴포넌트가 `IngredientDetailPageClient` 를 렌더.
- 위젯 내부에 5개의 섹션 UI 컴포넌트를 두고, `mock.ts` 에서 재료 상세 데이터를 동기적으로 공급.
- 레시피 슬라이드는 기존 `widgets/RecipeSlide/RecipeSlide.tsx` 를 직접 재사용하되 mock recipes 를 props 로 건넴.
- 냉장고 `IngredientItem` 의 탭 동작을 삭제 모드가 아닐 때 `Link` 로 감싸 상세로 이동.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion (기존 유지), lucide-react 아이콘, FSD 레이어링.

**Reference spec:** `docs/superpowers/specs/2026-04-24-ingredient-detail-page-design.md`

---

## File Structure

### 생성
- `src/widgets/IngredientDetailPage/index.ts`
- `src/widgets/IngredientDetailPage/IngredientDetailPageClient.tsx` — 오케스트레이터 ("use client")
- `src/widgets/IngredientDetailPage/mock.ts` — 재료 상세 mock + 레시피 mock + resolver
- `src/widgets/IngredientDetailPage/ui/IngredientHero.tsx` — 액자 이미지 + 이름/카테고리
- `src/widgets/IngredientDetailPage/ui/StorageInfoCard.tsx` — 온도/기간 2컬럼 + 메모
- `src/widgets/IngredientDetailPage/ui/PairingChip.tsx` — 재료 이름 + `>` 의 Link 칩
- `src/widgets/IngredientDetailPage/ui/PairingSection.tsx` — 좋은/나쁜 2 서브그룹
- `src/widgets/IngredientDetailPage/ui/CookingMethodsSection.tsx` — 조리법 칩 가로 스크롤
- `src/app/ingredients/[ingredientId]/page.tsx` — 서버 컴포넌트 라우트

### 수정
- `src/entities/ingredient/model/types.ts` — `StorageInfo`, `PairingIngredient`, `CookingMethod`, `IngredientDetail` 타입 추가
- `src/entities/ingredient/index.ts` — 신규 타입 export
- `src/widgets/IngredientGrid/ui/IngredientItem.tsx` — 삭제 모드가 아닐 때 `next/link` 로 상세 페이지로 이동

각 파일은 하나의 책임만 담당한다. UI 컴포넌트들은 presentational 이며 데이터는 props 로만 주입된다. 데이터 로딩/resolver 는 `mock.ts` 한 곳에 격리.

---

## Task 1: Ingredient detail 타입 정의

**Files:**
- Modify: `src/entities/ingredient/model/types.ts` (append)
- Modify: `src/entities/ingredient/index.ts`

- [ ] **Step 1: `types.ts` 하단에 detail 관련 타입 추가**

`src/entities/ingredient/model/types.ts` 파일의 가장 아래에 다음을 추가:

```typescript
export type StorageInfo = {
  temperatureLabel: string;
  durationLabel: string;
  tip: string;
};

export type PairingIngredient = {
  id: string;
  name: string;
  imageUrl?: string;
};

export type CookingMethod = {
  id: string;
  name: string;
  icon: string;
};

export type IngredientDetail = {
  id: string;
  name: string;
  imageUrl?: string;
  categoryLabel: string;
  storage: StorageInfo;
  pairings: {
    good: PairingIngredient[];
    bad: PairingIngredient[];
  };
  cookingMethods: CookingMethod[];
};
```

> 주의: 기존 `IngredientItem` 과는 별개의 narrow 타입으로 정의한다. 이 페이지는 "재료 카탈로그 상세" 이고 냉장고 전용 필드(`inFridge`, `quantity` 등)가 무관하기 때문이다.

- [ ] **Step 2: `entities/ingredient/index.ts` 에서 새 타입 export**

기존 export 블록에 타입을 추가:

```typescript
export type {
  AIIngredientPayload,
  CookingMethod,
  IngredientDetail,
  IngredientItem,
  IngredientPayload,
  IngredientsApiResponse,
  PairingIngredient,
  StorageInfo,
} from "./model/types";
```

> `getIngredientNames`, `getIngredients`, `useMyIngredientIds` 의 기존 export 라인은 그대로 둔다.

- [ ] **Step 3: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 기존 에러 없이 통과.

- [ ] **Step 4: 커밋**

```bash
git add src/entities/ingredient/model/types.ts src/entities/ingredient/index.ts
git commit -m "feat(ingredient): add IngredientDetail and related types"
```

---

## Task 2: Mock 데이터 모듈

**Files:**
- Create: `src/widgets/IngredientDetailPage/mock.ts`

- [ ] **Step 1: mock 모듈 작성**

`src/widgets/IngredientDetailPage/mock.ts`:

```typescript
import type { DetailedRecipeGridItem } from "@/entities/recipe";
import type { IngredientDetail } from "@/entities/ingredient";

export const INGREDIENT_DETAIL_MOCKS: Record<string, IngredientDetail> = {
  onion: {
    id: "onion",
    name: "양파",
    imageUrl: "/mock/ingredients/onion.png",
    categoryLabel: "뿌리·구근류",
    storage: {
      temperatureLabel: "0–4℃",
      durationLabel: "7일",
      tip: "에틸렌 가스에 민감한 과일과는 분리해 보관하세요. 자른 양파는 밀폐 용기에 담아 냉장 3일 이내 사용.",
    },
    pairings: {
      good: [
        { id: "carrot", name: "당근" },
        { id: "tomato", name: "토마토" },
        { id: "chicken-breast", name: "닭가슴살" },
      ],
      bad: [{ id: "honey", name: "꿀" }],
    },
    cookingMethods: [
      { id: "grill", name: "구이", icon: "🔥" },
      { id: "boil", name: "삶기", icon: "💧" },
      { id: "stirfry", name: "볶기", icon: "🍳" },
      { id: "braise", name: "조림", icon: "🥘" },
    ],
  },
  carrot: {
    id: "carrot",
    name: "당근",
    imageUrl: "/mock/ingredients/carrot.png",
    categoryLabel: "뿌리·구근류",
    storage: {
      temperatureLabel: "0–4℃",
      durationLabel: "14일",
      tip: "흙이 묻은 상태로 신문지에 싸서 세워 보관하면 더 오래갑니다. 수분이 닿으면 쉽게 물러져요.",
    },
    pairings: {
      good: [
        { id: "onion", name: "양파" },
        { id: "chicken-breast", name: "닭가슴살" },
      ],
      bad: [{ id: "cucumber", name: "오이" }],
    },
    cookingMethods: [
      { id: "grill", name: "구이", icon: "🔥" },
      { id: "boil", name: "삶기", icon: "💧" },
      { id: "juice", name: "착즙", icon: "🥤" },
    ],
  },
  tomato: {
    id: "tomato",
    name: "토마토",
    imageUrl: "/mock/ingredients/tomato.png",
    categoryLabel: "열매채소",
    storage: {
      temperatureLabel: "실온 후 냉장 10℃",
      durationLabel: "5일",
      tip: "완전히 익기 전에는 실온 보관하다 익으면 냉장으로 옮기세요. 꼭지 부분이 아래로 가도록 두면 더 오래 신선해요.",
    },
    pairings: {
      good: [
        { id: "onion", name: "양파" },
        { id: "cucumber", name: "오이" },
      ],
      bad: [{ id: "cheese", name: "치즈" }],
    },
    cookingMethods: [
      { id: "raw", name: "생식", icon: "🥗" },
      { id: "stirfry", name: "볶기", icon: "🍳" },
      { id: "stew", name: "끓이기", icon: "🍲" },
    ],
  },
  "chicken-breast": {
    id: "chicken-breast",
    name: "닭가슴살",
    imageUrl: "/mock/ingredients/chicken-breast.png",
    categoryLabel: "육류",
    storage: {
      temperatureLabel: "0–4℃ (냉동 -18℃)",
      durationLabel: "냉장 2일 / 냉동 30일",
      tip: "구입 후 즉시 소분해 냉동 보관하는 것이 좋아요. 해동은 반드시 냉장실에서 천천히.",
    },
    pairings: {
      good: [
        { id: "onion", name: "양파" },
        { id: "carrot", name: "당근" },
      ],
      bad: [],
    },
    cookingMethods: [
      { id: "grill", name: "구이", icon: "🔥" },
      { id: "boil", name: "삶기", icon: "💧" },
      { id: "stirfry", name: "볶기", icon: "🍳" },
    ],
  },
};

export const INGREDIENT_RECIPE_MOCKS: Record<string, DetailedRecipeGridItem[]> = {
  onion: [
    {
      id: "mock-recipe-1",
      title: "양파볶음",
      imageUrl: "/mock/recipes/onion-stirfry.jpg",
      authorName: "recipio",
      authorId: "mock-author",
      profileImage: "/mock/users/recipio.png",
      cookingTime: 15,
      createdAt: "2026-04-20T09:00:00Z",
      likeCount: 124,
      likedByCurrentUser: false,
      favoriteByCurrentUser: false,
      avgRating: 4.5,
      ratingCount: 32,
    },
    {
      id: "mock-recipe-2",
      title: "양파 크림 파스타",
      imageUrl: "/mock/recipes/onion-pasta.jpg",
      authorName: "recipio",
      authorId: "mock-author",
      profileImage: "/mock/users/recipio.png",
      cookingTime: 25,
      createdAt: "2026-04-18T09:00:00Z",
      likeCount: 89,
      likedByCurrentUser: false,
      favoriteByCurrentUser: false,
      avgRating: 4.2,
      ratingCount: 21,
    },
  ],
  carrot: [
    {
      id: "mock-recipe-3",
      title: "당근 라페",
      imageUrl: "/mock/recipes/carrot-rape.jpg",
      authorName: "recipio",
      authorId: "mock-author",
      profileImage: "/mock/users/recipio.png",
      cookingTime: 10,
      createdAt: "2026-04-15T09:00:00Z",
      likeCount: 56,
      likedByCurrentUser: false,
      favoriteByCurrentUser: false,
      avgRating: 4.0,
      ratingCount: 12,
    },
  ],
  tomato: [
    {
      id: "mock-recipe-4",
      title: "토마토 파스타",
      imageUrl: "/mock/recipes/tomato-pasta.jpg",
      authorName: "recipio",
      authorId: "mock-author",
      profileImage: "/mock/users/recipio.png",
      cookingTime: 20,
      createdAt: "2026-04-10T09:00:00Z",
      likeCount: 203,
      likedByCurrentUser: false,
      favoriteByCurrentUser: false,
      avgRating: 4.7,
      ratingCount: 58,
    },
  ],
  "chicken-breast": [
    {
      id: "mock-recipe-5",
      title: "닭가슴살 샐러드",
      imageUrl: "/mock/recipes/chicken-salad.jpg",
      authorName: "recipio",
      authorId: "mock-author",
      profileImage: "/mock/users/recipio.png",
      cookingTime: 15,
      createdAt: "2026-04-22T09:00:00Z",
      likeCount: 312,
      likedByCurrentUser: false,
      favoriteByCurrentUser: false,
      avgRating: 4.6,
      ratingCount: 74,
    },
  ],
};

export const getIngredientDetail = (id: string): IngredientDetail | undefined =>
  INGREDIENT_DETAIL_MOCKS[id];

export const getIngredientRecipes = (id: string): DetailedRecipeGridItem[] =>
  INGREDIENT_RECIPE_MOCKS[id] ?? [];
```

> 이미지 경로(`/mock/ingredients/*.png`, `/mock/recipes/*.jpg`)는 실제 파일이 없어도 된다. `Image` 컴포넌트가 fallback 을 렌더하므로 개발 중에도 페이지 레이아웃은 정상. 최종 배포 전에 실제 이미지가 있으면 그때 경로 갱신.

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/IngredientDetailPage/mock.ts
git commit -m "feat(ingredient-detail): add mock ingredient detail and recipe data"
```

---

## Task 3: `IngredientHero` 컴포넌트

**Files:**
- Create: `src/widgets/IngredientDetailPage/ui/IngredientHero.tsx`

- [ ] **Step 1: 구현**

```tsx
import { Image } from "@/shared/ui/image/Image";

type IngredientHeroProps = {
  name: string;
  categoryLabel: string;
  imageUrl?: string;
};

const IngredientHero = ({ name, categoryLabel, imageUrl }: IngredientHeroProps) => {
  return (
    <div className="flex flex-col items-center py-8 gap-3">
      <div className="w-24 h-24 rounded-2xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden">
        <Image
          src={imageUrl ?? ""}
          alt={name}
          width={64}
          height={64}
          aspectRatio="1 / 1"
          fit="contain"
          wrapperClassName="rounded-lg"
        />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        <p className="text-sm text-gray-500">{categoryLabel}</p>
      </div>
    </div>
  );
};

export default IngredientHero;
```

> 히어로 이미지는 "액자" 느낌이라 프레임은 96px square, 이미지는 64px square 로 여백을 둬 캐릭터 톤이 자연스럽게 보이도록. `fit="contain"` 은 캐릭터 이미지가 잘리지 않도록 하기 위함.

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/IngredientDetailPage/ui/IngredientHero.tsx
git commit -m "feat(ingredient-detail): add IngredientHero component"
```

---

## Task 4: `StorageInfoCard` 컴포넌트

**Files:**
- Create: `src/widgets/IngredientDetailPage/ui/StorageInfoCard.tsx`

- [ ] **Step 1: 구현**

```tsx
import type { StorageInfo } from "@/entities/ingredient";

type StorageInfoCardProps = {
  storage: StorageInfo;
};

const StorageInfoCard = ({ storage }: StorageInfoCardProps) => {
  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">보관방법</h2>

      <div className="flex gap-3">
        <div className="flex-1 rounded-xl border border-gray-200 p-4 flex flex-col gap-1">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <span>🌡️</span>
            <span>온도</span>
          </span>
          <span className="text-lg font-bold text-gray-900">
            {storage.temperatureLabel}
          </span>
        </div>

        <div className="flex-1 rounded-xl border border-gray-200 p-4 flex flex-col gap-1">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <span>📅</span>
            <span>기간</span>
          </span>
          <span className="text-lg font-bold text-gray-900">
            {storage.durationLabel}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-700 leading-relaxed mt-3">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
          <span>📝</span>
          <span>보관 팁</span>
        </span>
        <p>{storage.tip}</p>
      </div>
    </section>
  );
};

export default StorageInfoCard;
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/IngredientDetailPage/ui/StorageInfoCard.tsx
git commit -m "feat(ingredient-detail): add StorageInfoCard section"
```

---

## Task 5: `PairingChip` 컴포넌트

**Files:**
- Create: `src/widgets/IngredientDetailPage/ui/PairingChip.tsx`

- [ ] **Step 1: 구현**

```tsx
"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { PairingIngredient } from "@/entities/ingredient";

type PairingChipProps = {
  ingredient: PairingIngredient;
};

const PairingChip = ({ ingredient }: PairingChipProps) => {
  const handleClick = () => {
    triggerHaptic("Light");
  };

  return (
    <Link
      href={`/ingredients/${ingredient.id}`}
      onClick={handleClick}
      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700 flex-shrink-0 hover:bg-gray-50 active:scale-[0.98] transition-all"
    >
      <span>{ingredient.name}</span>
      <ChevronRight size={14} className="text-gray-400" />
    </Link>
  );
};

export default PairingChip;
```

> Link 는 Next.js 의 client prefetch 를 자동으로 쓰기 때문에 상세간 전환이 부드럽다.

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/IngredientDetailPage/ui/PairingChip.tsx
git commit -m "feat(ingredient-detail): add PairingChip navigator"
```

---

## Task 6: `PairingSection` 컴포넌트

**Files:**
- Create: `src/widgets/IngredientDetailPage/ui/PairingSection.tsx`

- [ ] **Step 1: 구현**

```tsx
import type { PairingIngredient } from "@/entities/ingredient";

import PairingChip from "./PairingChip";

type PairingSectionProps = {
  good: PairingIngredient[];
  bad: PairingIngredient[];
};

const ChipRow = ({ items }: { items: PairingIngredient[] }) => {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400 px-1">해당 재료 없음</p>;
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 py-1">
      {items.map((item) => (
        <PairingChip key={item.id} ingredient={item} />
      ))}
    </div>
  );
};

const PairingSection = ({ good, bad }: PairingSectionProps) => {
  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">궁합 재료</h2>

      <p className="text-sm font-medium text-gray-600 mb-2">같이 먹으면 좋아요</p>
      <ChipRow items={good} />

      <p className="text-sm font-medium text-gray-600 mb-2 mt-4">피해야 해요</p>
      <ChipRow items={bad} />
    </section>
  );
};

export default PairingSection;
```

> `-mx-5 px-5` 트릭: 섹션은 padding 유지하면서 가로 스크롤은 엣지까지 스크롤되도록. 기존 프로젝트 레이아웃 관례와 일치.

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/IngredientDetailPage/ui/PairingSection.tsx
git commit -m "feat(ingredient-detail): add PairingSection with good/bad chip rows"
```

---

## Task 7: `CookingMethodsSection` 컴포넌트

**Files:**
- Create: `src/widgets/IngredientDetailPage/ui/CookingMethodsSection.tsx`

- [ ] **Step 1: 구현**

```tsx
import type { CookingMethod } from "@/entities/ingredient";

type CookingMethodsSectionProps = {
  methods: CookingMethod[];
};

const CookingMethodsSection = ({ methods }: CookingMethodsSectionProps) => {
  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">추천 조리법</h2>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 py-1">
        {methods.map((method) => (
          <div
            key={method.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700 flex-shrink-0"
          >
            <span className="text-base">{method.icon}</span>
            <span>{method.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CookingMethodsSection;
```

> 조리법 칩은 탭 이벤트를 내지 않는다 (spec 상 정보성 display). 따라서 `button` / `Link` 가 아니라 평범한 `div` 로 두고 hover/active 효과도 생략.

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/IngredientDetailPage/ui/CookingMethodsSection.tsx
git commit -m "feat(ingredient-detail): add CookingMethodsSection chips"
```

---

## Task 8: `IngredientDetailPageClient` 오케스트레이터 + index

**Files:**
- Create: `src/widgets/IngredientDetailPage/IngredientDetailPageClient.tsx`
- Create: `src/widgets/IngredientDetailPage/index.ts`

- [ ] **Step 1: 오케스트레이터 구현**

`src/widgets/IngredientDetailPage/IngredientDetailPageClient.tsx`:

```tsx
"use client";

import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import type { IngredientDetail } from "@/entities/ingredient";
import type { DetailedRecipeGridItem } from "@/entities/recipe";

import RecipeSlide from "@/widgets/RecipeSlide/RecipeSlide";

import CookingMethodsSection from "./ui/CookingMethodsSection";
import IngredientHero from "./ui/IngredientHero";
import PairingSection from "./ui/PairingSection";
import StorageInfoCard from "./ui/StorageInfoCard";

type IngredientDetailPageClientProps = {
  detail: IngredientDetail;
  recipes: DetailedRecipeGridItem[];
};

const IngredientDetailPageClient = ({
  detail,
  recipes,
}: IngredientDetailPageClientProps) => {
  return (
    <Container padding={false}>
      <div className="px-5 pt-4">
        <PrevButton />
      </div>

      <IngredientHero
        name={detail.name}
        categoryLabel={detail.categoryLabel}
        imageUrl={detail.imageUrl}
      />

      <StorageInfoCard storage={detail.storage} />

      <PairingSection good={detail.pairings.good} bad={detail.pairings.bad} />

      <CookingMethodsSection methods={detail.cookingMethods} />

      <section className="px-5 py-6 border-t border-gray-100">
        <RecipeSlide
          title="이 재료로 만들 수 있는 레시피"
          recipes={recipes}
          isLoading={false}
          error={null}
        />
      </section>
    </Container>
  );
};

export default IngredientDetailPageClient;
```

> `Container padding={false}` 를 쓰는 이유: 각 섹션이 자기 padding (`px-5`) 을 직접 관리하기 때문. 가로 스크롤 섹션의 `-mx-5 px-5` 가 정확히 동작한다.

- [ ] **Step 2: index 생성**

`src/widgets/IngredientDetailPage/index.ts`:

```typescript
export { default as IngredientDetailPageClient } from "./IngredientDetailPageClient";
export { getIngredientDetail, getIngredientRecipes } from "./mock";
```

- [ ] **Step 3: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 통과.

- [ ] **Step 4: 커밋**

```bash
git add src/widgets/IngredientDetailPage/IngredientDetailPageClient.tsx src/widgets/IngredientDetailPage/index.ts
git commit -m "feat(ingredient-detail): compose sections in page client"
```

---

## Task 9: 라우트 페이지 추가

**Files:**
- Create: `src/app/ingredients/[ingredientId]/page.tsx`

- [ ] **Step 1: 서버 컴포넌트 작성**

```tsx
import { notFound } from "next/navigation";

import {
  IngredientDetailPageClient,
  getIngredientDetail,
  getIngredientRecipes,
} from "@/widgets/IngredientDetailPage";

type IngredientDetailPageProps = {
  params: Promise<{ ingredientId: string }>;
};

const IngredientDetailPage = async ({ params }: IngredientDetailPageProps) => {
  const { ingredientId } = await params;
  const detail = getIngredientDetail(ingredientId);

  if (!detail) {
    notFound();
  }

  const recipes = getIngredientRecipes(ingredientId);

  return <IngredientDetailPageClient detail={detail} recipes={recipes} />;
};

export default IngredientDetailPage;
```

> Next.js 15 의 App Router 에서 `params` 는 Promise 로 넘어온다. await 해서 사용.

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/app/ingredients/[ingredientId]/page.tsx
git commit -m "feat(ingredient-detail): add dynamic ingredient detail route"
```

---

## Task 10: 냉장고 타일 클릭 → 상세 페이지 이동

**Files:**
- Modify: `src/widgets/IngredientGrid/ui/IngredientItem.tsx`

- [ ] **Step 1: 현재 파일 확인**

`IngredientItem` 은 현재 삭제 모드(`isDeleteMode`)에서만 `handleClick` 을 호출해 선택 토글한다. 삭제 모드가 아닐 때는 클릭 이벤트가 없다. 여기서 일반 모드 클릭 시 `/ingredients/[id]` 로 이동하도록 `next/link` 래퍼를 추가한다.

- [ ] **Step 2: `Link` 도입 및 분기 처리**

기존 반환 구조가 `motion.div` 하나로 래핑되어 있으니, 다음 패턴으로 수정한다:
- 삭제 모드일 때: 기존처럼 `motion.div` 루트, 클릭 시 선택 토글.
- 일반 모드일 때: `next/link` 의 `<Link>` 로 `motion.div` 를 감싼다. 탭 시 햅틱 발동 + 상세 이동.

수정된 전체 파일 (`src/widgets/IngredientGrid/ui/IngredientItem.tsx`):

```tsx
"use client";

import Link from "next/link";

import { AnimatePresence, motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { IngredientItem as IngredientItemType } from "@/entities/ingredient";

type IngredientItemProps = {
  ingredient: IngredientItemType;
  isDeleteMode: boolean;
  setSelectedIngredientIds: React.Dispatch<React.SetStateAction<string[]>>;
  isSelected: boolean;
};

const IngredientItem = ({
  ingredient,
  isDeleteMode,
  setSelectedIngredientIds,
  isSelected,
}: IngredientItemProps) => {
  const handleDeleteModeClick = () => {
    triggerHaptic("Light");
    setSelectedIngredientIds((prev) => {
      if (!prev.includes(ingredient.id)) {
        return [...prev, ingredient.id];
      } else {
        return prev.filter((id) => id !== ingredient.id);
      }
    });
  };

  const handleNavigateClick = () => {
    triggerHaptic("Light");
  };

  const tile = (
    <motion.div
      onClick={isDeleteMode ? handleDeleteModeClick : undefined}
      className={cn(
        "relative flex items-center gap-4 rounded-2xl bg-white px-3 py-3 shadow-sm transition-all",
        isDeleteMode && "cursor-pointer",
        isSelected && "ring-2 ring-olive-light bg-olive-light/5",
        !isDeleteMode && "hover:shadow-md hover:scale-[1.02]"
      )}
      whileTap={isDeleteMode ? { scale: 0.98 } : undefined}
    >
      <Image
        src={ingredient.imageUrl ?? ""}
        alt={ingredient.name}
        wrapperClassName="rounded-xl"
        imgClassName="flex-shrink-0"
        width={60}
        height={60}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-medium text-gray-400">
          {ingredient.category}
        </span>
        <span className="break-words text-sm font-bold text-gray-900">
          {ingredient.name}
        </span>
      </div>
      {isDeleteMode && (
        <motion.div
          className={cn(
            "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
            isSelected
              ? "border-olive-light bg-olive-light"
              : "border-gray-300 bg-white"
          )}
          initial={false}
          animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          role="checkbox"
          aria-checked={isSelected}
          aria-label={`${ingredient.name} 선택`}
        >
          <AnimatePresence>
            {isSelected && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                width="14"
                height="14"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );

  if (isDeleteMode) {
    return tile;
  }

  return (
    <Link
      href={`/ingredients/${ingredient.id}`}
      onClick={handleNavigateClick}
      className="block"
      aria-label={`${ingredient.name} 상세 보기`}
    >
      {tile}
    </Link>
  );
};

export default IngredientItem;
```

> 삭제 모드일 때 Link 로 감싸면 탭이 네비게이션으로 흘러가 버리므로, 삭제 모드 여부로 래퍼 자체를 분기한다.

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/widgets/IngredientGrid/ui/IngredientItem.tsx
git commit -m "feat(fridge): navigate to ingredient detail on tile tap"
```

---

## Task 11: 수동 UI 검증

**Files:**
- None (검증 전용)

- [ ] **Step 1: 개발 서버 상태 확인 후 기동**

- localhost 사용 중인지 체크: `netstat -ano | findstr :3000`
- 이미 떠 있으면 그대로 쓰고, 없으면 `npm run dev` 를 백그라운드로 기동.

- [ ] **Step 2: 주요 경로 수동 검증**

브라우저에서 확인:
- `http://localhost:3000/ingredients/onion` → 5개 섹션 모두 렌더, 히어로 이미지 액자가 가운데.
- `http://localhost:3000/ingredients/carrot` → 당근 상세 렌더.
- 양파 상세에서 "당근" 칩 탭 → URL 이 `/ingredients/carrot` 로 바뀌고 당근 상세가 로딩됨.
- 당근 상세에서 "양파" 칩 탭 → 다시 양파로 돌아감 (칩 → 칩 순환 이동 확인).
- `http://localhost:3000/ingredients/없는id` → 404 페이지.
- `http://localhost:3000/ingredients/new` → 기존 재료 추가 페이지가 정상 (동적 세그먼트에 덮이지 않음).
- `http://localhost:3000/ingredients` → 냉장고 타일 탭 시 상세로 이동. 삭제 모드에서는 이동이 아닌 선택 토글.

- [ ] **Step 3: 가로 스크롤/햅틱 확인**

- 궁합재료 / 조리법 섹션을 가로 스크롤 해서 모바일 감성 확인 (개발자 도구 모바일 뷰).
- WebView 환경이 아니면 햅틱은 콘솔 레벨만 확인 (이 프로젝트는 bridge 로 호출하며 웹에선 no-op).

- [ ] **Step 4: 타입 체크 최종**

Run: `npx tsc --noEmit`
Expected: 클린.

- [ ] **Step 5: 최종 점검 커밋 (없음)**

검증만 수행. 별도 커밋 없음. 문제가 발견되면 이전 task 로 돌아가 수정 후 추가 커밋.

---

## Out of Scope 재확인

- 실제 이미지 에셋 (`/mock/ingredients/*.png` 등) 배치 — 현 단계에선 placeholder/fallback 로 충분.
- API 연동 및 TanStack Query 도입.
- 노트 편집 UI.
- "냉장고에 담기" CTA.
- 검색/카탈로그 등 다른 진입 경로.
- 조리법 칩 탭 인터랙션 (현 단계에선 display 만).
- 로딩/에러 스켈레톤 (mock 은 동기 반환, 레시피는 `RecipeSlide` 가 자체 처리).

## 커밋 순서 요약

1. feat(ingredient): add IngredientDetail and related types
2. feat(ingredient-detail): add mock ingredient detail and recipe data
3. feat(ingredient-detail): add IngredientHero component
4. feat(ingredient-detail): add StorageInfoCard section
5. feat(ingredient-detail): add PairingChip navigator
6. feat(ingredient-detail): add PairingSection with good/bad chip rows
7. feat(ingredient-detail): add CookingMethodsSection chips
8. feat(ingredient-detail): compose sections in page client
9. feat(ingredient-detail): add dynamic ingredient detail route
10. feat(fridge): navigate to ingredient detail on tile tap
