# Ingredient Detail Page — Design Spec

- **Date:** 2026-04-24
- **Branch:** feature/17
- **Scope:** UI + 디자인 only (목데이터 기반, API 연동 없음)

## 1. Context & Goal

냉장고(`/ingredients`)에서 재료 타일을 탭하면 그 재료의 상세 페이지로 이동한다.
상세 페이지는 **재료 카탈로그 상세**의 성격을 띠며, 주요 목적은 **정보 제공**이다.
레시피 연결은 서브 역할로 하단에 둔다.

이번 작업은 **UI 레이아웃/디자인만** 구현하며, 모든 데이터는 하드코딩된 목데이터를 사용한다.
API 설계 및 서버 연동은 이후 작업으로 미룬다.

### Key UX 결정사항 (브레인스토밍 요약)

- 페이지 본질 = 재료 카탈로그 상세. "내 냉장고에 있는지 여부"는 UI에 일절 반영하지 않는다.
- 진입 경로:
  1. 냉장고 재료 타일 탭 (기존 UI에 링크 추가)
  2. 다른 재료 상세 페이지의 **궁합재료 칩** 탭 (상세 → 상세 간 이동)
- 히어로: 큰 배너 대신 **센터 정렬 액자 느낌의 작은 이미지**. 재료가 캐릭터/일러스트 톤이므로 풀폭으로 깔면 어색하다.
- 섹션 순서는 **정보 우선** 배치. 레시피는 서브로 맨 아래.
- 전체 톤: **플랫**. 페이지 배경 없음(기본). 섹션 래퍼 카드·그림자 없음. 여백 + 얇은 디바이더로만 구분.
- 내부 박스/칩은 `border` 만 사용 (그림자 없음).

## 2. Route

- `/ingredients/[ingredientId]`
- `ingredientId` 는 nanoid 문자열. 숫자 정규식(`\d+`)을 쓰지 않는다.
- 기존 `/ingredients/new` 와 충돌하지 않도록 경로 정규식을 다른 모듈에서 쓰는 경우 `[^/]+` + negative lookahead(`(?!new)`) 패턴 유지. 이번 PR에서는 라우트 레벨 충돌은 없음(Next App Router가 `[ingredientId]` 보다 정적 세그먼트 `new` 를 우선함).

## 3. Page Layout

```
┌──────────────────────────────────────┐
│  ← (PrevButton)                       │  상단 네비
├──────────────────────────────────────┤
│       ╭──────────╮                    │
│       │  🥕 이미지 │   ← 액자 느낌     │  히어로
│       ╰──────────╯                    │  (센터 정렬)
│           양파                         │
│        뿌리·구근류                     │
├──────────────────────────────────────┤  디바이더 (border-t)
│ 보관방법                               │
│ ┌─ 🌡️ 온도 ─┐ ┌─ 📅 기간 ─┐         │
│ │  0–4℃    │ │  7일       │          │
│ └──────────┘ └────────────┘          │
│ ┌─ 📝 보관 팁 ─────────────┐         │
│ │ 에틸렌 가스에 민감...      │         │
│ └───────────────────────────┘         │
├──────────────────────────────────────┤  디바이더
│ 궁합 재료                              │
│ 같이 먹으면 좋아요                      │
│ [당근 >] [토마토 >] [브로콜리 >] ...  │  가로스크롤
│ 피해야 해요                            │
│ [꿀 >] [우유 >] ...                   │  가로스크롤
├──────────────────────────────────────┤  디바이더
│ 추천 조리법                            │
│ [🔥 구이] [💧 삶기] [🍳 볶기] ...     │  가로스크롤
├──────────────────────────────────────┤  디바이더
│ 이 재료로 만들 수 있는 레시피   더보기 >│
│ (RecipeSlide UI 재활용)                │
└──────────────────────────────────────┘
```

### 섹션 순서 (정보 우선)

1. Hero
2. 보관방법 (Storage)
3. 궁합 재료 (Pairings)
4. 추천 조리법 (Cooking Methods)
5. 만들 수 있는 레시피 (Recipes — 서브)

## 4. Component Structure (FSD)

```
src/app/ingredients/[ingredientId]/
 └─ page.tsx
     - Server Component
     - params.ingredientId 파싱 후 <IngredientDetailPageClient /> 렌더
     - 목데이터에서 찾지 못하면 next/navigation.notFound()
     - not-found.tsx 는 추가 안 함 (App Router 기본 404 사용)

src/widgets/IngredientDetailPage/
 ├─ index.ts
 ├─ IngredientDetailPageClient.tsx
 │   - "use client"
 │   - 섹션 오케스트레이션만. 데이터는 props 혹은 mock 모듈에서 로드
 ├─ mock.ts
 │   - INGREDIENT_DETAIL_MOCKS: Record<string, IngredientDetail>
 │   - 최소 3~4종 (양파/당근/토마토/닭가슴살) + 궁합재료로 서로 순환 참조되는 구성
 └─ ui/
    ├─ IngredientHero.tsx           # 액자 이미지 + 이름 + 카테고리 라벨
    ├─ StorageInfoCard.tsx          # 온도/기간 2컬럼 + 메모 풀폭
    ├─ PairingSection.tsx           # 좋은/나쁜 2 서브그룹 렌더
    ├─ PairingChip.tsx              # [이름 >] Link 칩, next/link
    └─ CookingMethodsSection.tsx    # 조리법 칩 가로스크롤
```

레시피 섹션은 별도 wrapper 없이 `IngredientDetailPageClient` 에서 `<RecipeSlide />` 를 직접 호출한다 (RecipeSlide 자체가 title/to/recipes 를 props 로 받으므로 래핑 불필요).

### 재활용 컴포넌트

- `widgets/RecipeSlide/RecipeSlide.tsx` — 그대로 사용. `recipes`는 mock에서 공급.
- `shared/ui/Container` — 페이지 wrapper.
- `shared/ui/PrevButton` — 상단 뒤로가기.
- `shared/lib/bridge` — `triggerHaptic("Light")`, 모든 칩 탭에 적용.

## 5. Types (entities/ingredient/model/types.ts 확장)

```ts
export type StorageInfo = {
  temperatureLabel: string;   // "0–4℃"
  durationLabel: string;      // "7일"
  tip: string;                // 보관 메모
};

export type PairingIngredient = {
  id: string;
  name: string;
  imageUrl?: string;
};

export type CookingMethod = {
  id: string;
  name: string;   // "구이"
  icon: string;   // 이모지 문자열 (e.g. "🔥")
};

export type IngredientDetail = IngredientItem & {
  categoryLabel: string;
  storage: StorageInfo;
  pairings: {
    good: PairingIngredient[];
    bad: PairingIngredient[];
  };
  cookingMethods: CookingMethod[];
  // recipes는 목데이터에서 DetailedRecipeGridItem[] 배열로 별도 공급
};
```

레시피용 mock은 `DetailedRecipeGridItem` 타입을 재사용한다 (entities/recipe).

## 6. Styling Tokens

### 페이지 배경
- 기본값. `bg-*` 지정 없음.

### 히어로
- 컨테이너: `flex flex-col items-center py-8 gap-3`
- 이미지 액자: `w-24 h-24 rounded-2xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden`
- 이미지 자체: 순수 `<img>` 태그, `w-16 h-16 object-contain` (캐릭터 톤 유지)
- 이름: `text-2xl font-bold text-gray-900`
- 카테고리 라벨: `text-sm text-gray-500`

### 섹션 공통
- 섹션 래퍼: `px-5 py-6`. **Hero 이후 섹션부터** 상단에 `border-t border-gray-100` 을 붙여 섹션 구분. Hero 자체는 디바이더 없음.
- 섹션 타이틀: `text-lg font-bold text-gray-800 mb-3`

### 보관방법 내부
- 온도/기간 박스: `flex-1 rounded-xl border border-gray-200 p-4 flex flex-col gap-1`
- 라벨: `text-xs text-gray-500 flex items-center gap-1` (이모지 + 라벨)
- 값: `text-lg font-bold text-gray-900`
- 메모 박스: `rounded-xl border border-gray-200 p-4 text-sm text-gray-700 leading-relaxed mt-3`

### 궁합/조리법 칩
- 공통 칩: `inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-700 flex-shrink-0`
- 궁합 칩: 우측 `<ChevronRight size={14} className="text-gray-400" />`, Link 컴포넌트
- 조리법 칩: 이모지 + 이름 (`inline-flex gap-1.5`)
- 가로 스크롤 컨테이너: `flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 py-1`
- 서브타이틀 (좋은/나쁜): `text-sm font-medium text-gray-600 mb-2 mt-3`

### 인터랙션
- 모든 칩 탭: `triggerHaptic("Light")` (haptic-feedback 가이드라인)
- Hover: `hover:bg-gray-50 transition-colors`
- Active: `active:scale-[0.98] transition-transform`

### 이미지 규칙 (프로젝트 규약)
- `next/image` 사용 금지. 순수 `<img>` 태그.

## 7. Mock Data 구성

`widgets/IngredientDetailPage/mock.ts`:

- 최소 3~4종 재료를 포함. 예: `onion`, `carrot`, `tomato`, `chicken-breast`.
- **순환 참조**: 양파의 궁합재료 "당근"을 탭하면 당근 상세 페이지로 진입 → 당근 상세에서 "양파"가 다시 있음. 이렇게 하면 칩 → 칩 이동 UX가 작동하는 것을 목데이터만으로도 시연 가능.
- 찾을 수 없는 ID로 진입 시 `notFound()`.

## 8. Scope — Out

이번 작업에서 **하지 않는** 것:

- API 연동 (전부 목데이터)
- 노트 편집 UI (유저 입력 없는 하드코딩 가이드)
- "내 냉장고에 담기" 같은 CTA
- 로딩/에러 스켈레톤 (목데이터 즉시 반환)
- 레시피 정렬/필터/무한 스크롤 (mock 정적 리스트만)
- 검색/카탈로그 페이지에서의 진입 (이번엔 냉장고 + 칩 간 이동만)

## 9. Testing Checklist (수동)

- [ ] `/ingredients/[기존 재료 id]` 진입 시 5개 섹션 전부 렌더
- [ ] `/ingredients/new` 여전히 정상 (기존 페이지와 충돌 없음)
- [ ] `/ingredients/존재하지않는id` 진입 시 404
- [ ] 궁합재료 칩 탭 → 해당 재료 상세로 이동, 뒤로가기 동작
- [ ] 햅틱이 모든 칩 탭에서 발동 (WebView 환경)
- [ ] 모바일 가로 스크롤 (궁합/조리법) 정상 동작, 스크롤바 숨김
- [ ] 다크모드 없음 — 라이트 톤 한정

## 10. Architectural Notes

- FSD 의존 방향 준수: `widgets/IngredientDetailPage` → `widgets/RecipeSlide`, `entities/ingredient`, `entities/recipe`, `shared/*`.
- 페이지 컴포넌트는 서버 컴포넌트 유지, 클라이언트 로직은 `IngredientDetailPageClient` 에 집중.
- 목데이터 모듈은 widget 내부에 둔다 (일회성이며 실제 API 붙는 순간 삭제될 것이므로 entity까지 끌어올리지 않는다).
- 이 페이지는 **정보성**이므로 TanStack Query·Zustand 등 상태 라이브러리 도입이 불필요하다. mock은 단순 import.
