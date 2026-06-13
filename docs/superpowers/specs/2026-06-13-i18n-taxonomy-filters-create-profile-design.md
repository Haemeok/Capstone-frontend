# 택소노미 현지화 + 생성/프로필 페이지 i18n (ko→ja/en) — Design

> 작성일: 2026-06-13 · 브랜치: feature/17

## 목표

사용자가 지목한 4개 미번역 표면을 하나의 일관된 작업으로 묶어 ja/en 현지화한다.
공유 뿌리인 **택소노미 라벨**(카테고리 칩·요리유형·정렬·레시피유형·재료카테고리·
영양 라벨)을 foundation으로 먼저 깐 뒤, 그 위에 페이지 chrome·라우트·SEO를 올린다.

지목된 4표면:

1. `/recipes/new` 생성 허브(+`/manual`)
2. 프로필 편집 `/users/edit`
3. 카테고리 이름 — 홈/검색 카테고리 칩 + 요리 유형 + 카테고리 상세 페이지 + 재료 카테고리
4. `/search/results` 필터 섹션(정렬·요리유형·태그·재료·영양 칩)

## 핵심 사실 (설계 전제)

백엔드 계약은 **이미 코드 기반**이다. 검색 URL이 `sort=createdAt,DESC`,
`types=USER,AI,YOUTUBE`, `dishType=<CODE>`, `tags=<CODE>`로 나간다 — 한글이 네트워크
경계를 넘지 않는다. 한글 문자열은 (a) 클라이언트 컴포넌트 **상태**와 (b) **화면 표시**에만
존재한다. 따라서 현지화는 네트워크 경계를 전혀 건드리지 않는다.

택소노미 라벨은 `src/shared/config/constants/recipe.ts`에 있고 여러 곳에서 import되며,
**한글 문자열이 lookup 키를 겸한다**(`SORT_TYPE_CODES["인기순"]`, `DISH_TYPE_CODES["볶음"]`,
`TAG_CODES`, `INGREDIENT_CATEGORY_CODES`). 이 entanglement가 유일한 아키텍처 난점이다.

## 접근법 결정: A — 표시 전용 오버레이 (코드 키 사전)

기존 상수는 **한 글자도 안 건드린다**(ko canonical 유지, 코드 매핑·필터 상태·URL 로직
불변 → ko 회귀 0, 다른 소비자 영향 0). 새 locale 라벨 사전을 안정적인 `code`로 키잉하고,
얇은 리졸버를 둬 렌더 지점에서만 라벨→현지화 변환한다.

- 기각 **B(canonical 키를 코드로 전면 이관)**: 필터 훅·FilterChip·CategoryPicker·drawer
  config 등 잘 돌아가는 공유 배관을 전부 건드리고 ko를 전 지점 재검증해야 함 — 사용자가
  요청 안 한 코드까지 손대는 큰 위험. 가치 대비 과함.
- 선례: `/search` 디스커버리 작업이 CONTENT_PAGES 표시 카피만 사전으로 들어올리고
  NUTRITION_THEMES 상수는 공유 소비자 보호 위해 불변 유지한 것과 동일 철학.

---

## 설계

### 1. Foundation — 택소노미 라벨 사전 + 리졸버

**새 사전(기존 상수 불변), 코드를 키로:**

```
src/shared/i18n/messages/{ko,ja,en}/taxonomy.ts   → { tags, dishType, sort, recipeType, ingredientCategory, nutritionTheme, nutritionLabel }
src/shared/i18n/taxonomyMessages.ts                → Record<Locale, TaxonomyDict>
src/shared/i18n/useTaxonomyLabel.ts                → client, resolveChromeLocale(pathname)
```

도메인별 키:

- `tags` — 15개 TAG_DEFINITIONS 코드(`CHEF_RECIPE`, `HOME_PARTY`, `LATE_NIGHT`…)
- `dishType` — 13개 DISH_TYPES 코드(`SOUP_STEW`, `GRILL`, `SALAD`…) + `전체`(null/ALL)
- `sort` — `popularityScore,DESC`/`createdAt,DESC`/`createdAt,ASC` 또는 ko키 매핑
- `recipeType` — `USER`/`AI`/`YOUTUBE`
- `ingredientCategory` — 12개 INGREDIENT_CATEGORY_CODES(`meat`, `vegetable`…) + `전체`
- `nutritionTheme` — NUTRITION_THEMES 라벨(키토·저당…) + `nutritionLabel`(재료비·칼로리·
  탄수화물·단백질·지방·당류·나트륨)

**리졸버 두 형태:**

- 코드를 이미 든 렌더 지점 → `taxonomyLabel(code, domain, locale)`
  (예: `RecipeTypeSelector`의 `USER/AI/YOUTUBE`, 카테고리 상세 페이지의 `tagCode`).
- 한글 canonical을 든 렌더 지점 → `localizeTaxonomy(koLabel, domain, locale)`:
  기존 reverse map으로 ko→code→사전 해석. **`locale === "ko"`이면 입력을 그대로 반환** →
  구조상 ko 회귀 불가.
- 클라이언트는 `useTaxonomyLabel()`(`usePathname()`→`resolveChromeLocale`로 prefix
  자가판단, nav/searchDiscovery 패턴 답습 — 신규 Provider 도입 0, 정적 보존).

**불변식: 상태·URL·코드 매핑은 변경하지 않는다.** 표시 지점에서만 변환한다.

### 2. 라우팅 — 물리적 미러 라우트

기존 `/ja /en` additive 정적 세그먼트 패턴 그대로. 얇은 래퍼 추가:

```
src/app/{ja,en}/recipes/new/page.tsx
src/app/{ja,en}/recipes/new/manual/page.tsx
src/app/{ja,en}/users/edit/page.tsx
src/app/{ja,en}/recipes/category/[id]/page.tsx
```

- 클라이언트 컴포넌트(`/users/edit`, 필터들, `IngredientCategoryTabs`) →
  `resolveChromeLocale(usePathname())` 자가판단(래퍼는 동일 트리만 렌더).
- 서버 컴포넌트(생성 허브 `CreationModeSelector`, 카테고리 상세) → `locale` prop +
  `getDictionary(locale)`. 본문은 `widgets|features/.../server/renderLocalized*.tsx`로
  추출하고 ko 래퍼도 동일 컴포넌트를 호출하는 순수 이동 리팩터.
- 기각: middleware rewrite / 저장 locale 서버 판독 — 코드베이스와 괴리, SSR 결정성 훼손.

### 3. 페이지 chrome 사전 (택소노미 라벨과 별개)

새 네임스페이스 3개. 각 `Dictionary` 타입에 추가 후 ko/ja/en 세 파일 동시 작성(타입이
누락 강제):

- **`userEdit`** — 취소, 프로필 변경, 저장 중…/확인, 이름, 소개, validation(닉네임을
  입력해주세요·N자 이하로·JPG/PNG/WebP 형식만), placeholder(소개를 입력해주세요),
  실패 toast(프로필 업데이트에 실패했습니다).
- **`recipeCreate`** — 허브 제목(어떻게 레시피를 만드시겠어요?)·설명·"직접 입력하기"·
  "유튜브로 가져오기" 카드 제목/본문/`alt` + `/manual` 작성 폼 chrome. 허브 `Link`는
  `localizedHref`로 현재 locale prefix 전파.
- **`category`** — 카테고리 상세 히어로·`CategoryChips`·`CategoryCount`·
  `CategoryEmptyState` chrome.

ja/en 값은 **구현 단계에서 ja-pm / en-pm 페르소나**(`docs/i18n/personas/*`)로 차분한
톤(오늘의집 톤) 번역. 구조 계약(같은 키·placeholder·복수형) 준수.

### 4. 데이터 lang 전파

- **카테고리 상세**: `getRecipesOnServer` 호출에 명시적 `?lang=`(쿠키/Accept-Language
  비의존 → ISR 캐시 결정적), 클라이언트 TanStack queryKey에 `locale` 포함(ko 캐시 분리,
  언어 전환 시 refetch). create-flows-data와 동일 패턴, 캐시 태그는 ko와 공유.
- **검색 결과 데이터는 이미 lang 적용 완료**(보드 §2). 여기선 **필터 라벨만** 현지화.

### 5. SEO (카테고리 상세 한정 — 나머지 표면은 비공개/noindex)

- `/ja/recipes/category/[id]`·`/en/...`에 locale별 `generateMetadata`(title/description를
  현지화 템플릿으로) + `buildHreflangAlternates` + robots(미번역 fallback noindex) +
  JSON-LD `inLanguage`.
- **결정**: `CHEF_RECIPE`의 한국 셀럽 키워드 카피(흑백요리사·냉장고를부탁해·안성재…)는
  **ko 전용 유지**. ja/en은 일반 템플릿(`{태그명} 모음`)으로 — 한국 검색 타깃이라
  ja/en에선 무의미.
- 생성 허브·`/manual`·`/users/edit`는 비공개/유저 플로우라 SEO alternates 생략.

### 6. 가격/통화 (선례 따름)

- 검색 필터 영양 시트 중 **재료비(cost/원) 부분은 ja/en 숨김** — `/search` 디스커버리가
  가격대 섹션을 ja/en에서 숨긴 선례와 동일(KRW plumbing 후속 작업). 칼로리·탄수화물·
  단백질·지방·당류·나트륨 범위는 유지.

### 7. 회귀(ko) 보호

- 택소노미 리졸버가 `ko`에서 입력 그대로 반환 → 모든 ko 라벨·동작 불변.
- 기존 상수·코드 매핑·필터 상태·URL 빌더 미변경.
- ko 라우트(`/recipes/new`, `/users/edit`, `/recipes/category/[id]`, `/search/results`)는
  기존 컴포넌트를 `locale="ko"`로 호출하는 순수 이동 리팩터만 받음.

---

## Acceptance Criteria

1. `/ja`·`/en`에서 카테고리 칩(CategoryTabs)·요리 유형·정렬·레시피 유형·재료 카테고리
   탭 라벨이 해당 언어로 표시되고, 선택/필터 동작·백엔드로 가는 코드는 ko와 동일하게
   작동한다.
2. ko 라우트(`/...`)는 모든 택소노미 라벨·동작이 회귀 없이 그대로다(리졸버가 ko 입력을
   그대로 반환).
3. `/ja/users/edit`·`/en/users/edit`에서 폼 chrome(헤더·라벨·validation·placeholder·
   실패 toast)이 해당 언어로 뜬다. 닉네임/소개 자유텍스트는 입력값 그대로.
4. `/ja/recipes/new`·`/en/recipes/new`(+`/manual`)에서 허브·카드·작성 폼 chrome이 해당
   언어로 뜨고, 카드 링크가 같은 locale로 sticky하다.
5. `/ja/recipes/category/{code}`·`/en/...`이 렌더되고(404 아님), chrome·라벨이 해당 언어,
   레시피 데이터가 `lang`으로 번역되어 내려오며, 메타/hreflang/`inLanguage`가 locale에
   맞는다. `CHEF_RECIPE` 한국 셀럽 키워드는 ja/en 메타에 안 들어간다.
6. 검색 결과 필터 섹션 전체(정렬·요리유형·태그·재료·영양 칩)가 ja/en에서 현지화되고,
   재료비(원) 부분은 ja/en에서 숨겨진다.
7. ja/en 렌더 chrome·라벨에 한글 잔존이 없다(기존 no-Hangul 렌더 스캔 가드).
8. 언어 전환 시 카테고리 상세 리스트 데이터가 refetch된다(queryKey에 locale) — stale ko
   콘텐츠 없음.

## Non-goals

- user-pages 광범위 스펙의 나머지(공개 프로필 `/users/[userId]`·레시피북·캘린더).
- youtube/AI 추출·생성 **본문 데이터** lang 및 그 페이지 **기능**(create-flows-data /
  타 에이전트 소유).
- 접근법 B(상수 코드 키 전면 이관).
- 자동 locale 리다이렉트 / 통화(원↔円) 변환 / `<html lang>` per-locale.
- 재료 **데이터**(재료명·카테고리 데이터 필드) 번역 — 백엔드 lang 소관. 여기선 재료
  카테고리 **탭 라벨**(static)만.
- `/recipes/new/ai/*` 하위 플로우 chrome(타 에이전트 기능 작업 영역 — 후속).

## 글로서리 (Ubiquitous Language)

- **택소노미 라벨(taxonomy label)** — 코드에 대응하는 표시 문자열. 코드가 canonical,
  라벨이 locale 가변.
- **리졸버(resolver)** — code(또는 ko canonical) + locale → 표시 라벨.
- **chrome** — 페이지 정적 UI 문자열(헤더·버튼·라벨·placeholder·toast). 콘텐츠 데이터와 구분.
- **미러 라우트(mirror route)** — `/ja`·`/en` 아래 동일 트리를 렌더하는 얇은 래퍼.
- **sticky 링크** — 현재 locale prefix를 유지하는 내부 이동 링크.
