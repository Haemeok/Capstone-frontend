# Error Boundary 점진적 적용 설계

> 날짜: 2026-03-29
> 전략: Tier 기반 점진적 확장 (Tier 1 고위험 → Tier 2 중위험, Tier 3 생략)

## 개요

프로젝트 전체에서 에러 바운더리가 필요한 지점을 위험도 × 사용자 영향도로 분류하고, Tier 1(핵심)부터 Tier 2까지 적용한다. API 호출이 없는 순수 UI 컴포넌트(Tier 3)는 렌더링 에러 가능성이 극히 낮으므로 생략한다.

## 설계 원칙

- **라우트 레벨 (`error.tsx`)**: 페이지 전체가 빈 화면이 되는 것을 방지
- **컴포넌트 레벨 (`ErrorBoundary`)**: 한 섹션이 죽어도 나머지 페이지는 유지
- **fallback UI**: 프로젝트 디자인 가이드라인 준수 (rounded-2xl, olive 컬러, 여백)
- **생략 기준**: API 호출 없는 순수 UI 컴포넌트는 에러 바운더리 불필요

## 공통 인프라

### 기존 활용

| 컴포넌트 | 위치 | 상태 |
|----------|------|------|
| `ErrorBoundary` | `shared/ui/ErrorBoundary.tsx` | 이미 존재. 클래스 컴포넌트, fallback prop 지원 |

### 신규 추가

| 컴포넌트 | 역할 |
|----------|------|
| `ErrorFallback` | 재사용 가능한 에러 UI — "문제가 발생했어요" + 재시도 버튼. 페이지 레벨용 |
| `SectionErrorFallback` | 페이지 내 섹션용 — 컴팩트한 에러 표시 + 재시도 버튼 |

---

## Tier 1: 핵심 고위험 지점

외부 API 의존성이 크고, 사용자 트래픽이 높은 곳.

### 라우트 레벨 `error.tsx`

| 라우트 | 이유 |
|--------|------|
| `/recipes/[recipeId]/error.tsx` | 트래픽 최다 페이지. 서버 컴포넌트 다수, API 실패 시 전체 빈 화면 |
| `/search/results/error.tsx` | 파라미터 파싱 + API 실패 가능. 검색은 핵심 기능 |
| `/users/[userId]/error.tsx` | 마이페이지 — 저장 레시피 + PendingRecipeSection + 무한스크롤. YouTube 추출 상태도 여기서 표시 |
| `/calendar/[date]/error.tsx` | date 파라미터 파싱 오류 가능. 현재 에러 처리 없음 |

### 컴포넌트 레벨 `ErrorBoundary`

| 대상 | 이유 |
|------|------|
| 레시피 상세 — 비디오 섹션 | react-player 동적 import + YouTube embed. 비디오 실패해도 레시피 본문 유지 |
| 레시피 상세 — 댓글 섹션 | useSuspenseQuery 사용. 댓글 실패가 레시피 전체를 죽이면 안 됨 |
| 마이페이지 — PendingRecipeSection | YouTube 추출 상태 표시. 폴링/상태 관리 실패 시 저장 레시피 목록 유지 |
| 마이페이지 — 레시피 그리드 (무한스크롤) | 그리드 렌더링 에러가 PendingSection까지 죽이지 않도록 격리 |
| AI 레시피 — AiLoading/AIRecipeError 영역 | 폴링 중 런타임 에러 대비. 전용 에러 UI 있지만 바운더리 없이는 페이지 크래시 |
| WebSocket Provider 내부 | 연결 실패 시 알림만 죽고 앱 전체 유지 |
| RecipeSlide (유지) | 홈 캐러셀 — 이미 적용됨, 그대로 유지 |

---

## Tier 2: 복잡한 클라이언트 상태

에러 확률은 낮지만, 발생 시 사용자 경험 영향이 있는 곳.

### 라우트 레벨 `error.tsx`

| 라우트 | 이유 |
|--------|------|
| `/ingredients/error.tsx` | 냉장고 재료 관리 — 벌크 추가/삭제 mutation + 검색 드로어 조합 |
| `/recipes/new/youtube/error.tsx` | 메타데이터 fetch + 중복 체크 등 비동기 조합. 라우트 레벨 안전망 |
| `/recipes/[recipeId]/edit/error.tsx` | 레시피 수정 — 기존 데이터 로딩 + 폼 상태. 크래시 시 작성 내용 유실 방지 |

### 컴포넌트 레벨 `ErrorBoundary`

| 대상 | 이유 |
|------|------|
| 검색 결과 — RecipeGrid | 무한스크롤 + 필터 조합. 그리드 실패 시 검색바 유지 |
| 홈 — HomeBannerCarousel | Embla 캐러셀 라이브러리 의존. 배너 실패해도 레시피 슬라이드 유지 |
| 레시피 상세 — 재료 섹션 (독립 바운더리) | 서버 데이터 파싱 중 예상 못한 구조 시 렌더링 에러. 재료 실패해도 스텝/댓글 유지 |
| 레시피 상세 — 스텝 섹션 (독립 바운더리) | 동일 이유. 스텝 실패해도 재료/댓글 유지 |
| 마이페이지 — 캘린더 탭 | DayPicker 동적 import + 날짜별 데이터 조합 |
| Archetype 이미지 공유 | html-to-image + CORS + Canvas. 렌더링 크래시 방지 |

---

## Tier 3: 생략

API 호출 없는 순수 UI 컴포넌트는 렌더링 에러 가능성이 극히 낮으므로 전체 생략.

생략 대상: Header/Footer, CategoryTabs/CategoryDrawer, 설정/프로필 페이지, IngredientGrid/IngredientPackCard, NotificationPermissionDrawer, ReviewGateDrawer, LoginEncourageDrawer, OnboardingSurveyModal, QR 코드, Analytics Provider 등.

---

## Fallback UI 가이드라인

### 라우트 레벨 (`error.tsx`)

```tsx
// 전체 페이지 에러 — reset() 활용 복구
<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
  <p className="text-lg font-bold text-gray-900">문제가 발생했어요</p>
  <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요</p>
  <button
    onClick={() => reset()}
    className="h-12 rounded-xl bg-olive-light px-6 text-white font-medium"
  >
    다시 시도
  </button>
</div>
```

### 컴포넌트 레벨 (섹션용)

```tsx
// 섹션 에러 — 컴팩트하게
<div className="flex items-center justify-center gap-2 rounded-2xl bg-gray-50 p-6">
  <p className="text-sm text-gray-500">이 영역을 불러올 수 없어요</p>
  <button
    onClick={onRetry}
    className="text-sm font-medium text-olive-light"
  >
    재시도
  </button>
</div>
```

---

## 구현 순서

1. 공통 인프라: `ErrorFallback`, `SectionErrorFallback` 컴포넌트 생성
2. Tier 1 라우트 `error.tsx` 4개 추가
3. Tier 1 컴포넌트 바운더리 6개 래핑
4. Tier 2 라우트 `error.tsx` 3개 추가
5. Tier 2 컴포넌트 바운더리 5개 래핑
6. 전체 동작 확인
