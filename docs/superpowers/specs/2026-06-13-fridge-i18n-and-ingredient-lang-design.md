# 냉장고 페이지 i18n + 재료 fetch lang 연결 (design)

> 작성일: 2026-06-13 · 브랜치: feature/17 · 베이스: `2026-06-13-i18n-create-flows-data-design.md`, `I18N-STATUS.md` §5

## 배경

냉장고 페이지(`/recipes/my-fridge`)는 ko 하드카피로만 존재하고 `/ja` `/en` 라우트가 없다.
재료 fetch(`getIngredients`)는 V3 i18n 엔드포인트 위에 있으나 `lang`을 전파하지 않아 ja/en
사용자도 ko 재료를 받는다. 이 작업은 ① 냉장고 페이지를 ko/ja/en으로 번역하고 ② 재료 fetch에
활성 locale을 전파한다.

**탐색 결과 — 두 영역은 거의 분리됨:** 냉장고 페이지 본문은 *레시피*(`getMyFridgeRecipes`)이고,
`getIngredients`를 쓰는 드로어는 `/ingredients/new`에 있다(냉장고 페이지 아님).

## 접근법 결정

- **냉장고 라우트:** `/ja` `/en` 래퍼 추가 → pathname prefix 기반 locale(홈·검색·재료상세와 동일
  패턴). chrome·본문·데이터 locale 일관. 기각: client 자가판정(루트에서 chrome ko / 본문 ja 불일치).
- **재료 API lang:** per-call `?lang`(create-flows-data 접근법 A). locale 출처는
  `useApiLocale()` = `resolveLocaleFromPath(pathname) ?? getStoredLocale() ?? "ko"` —
  prefix 없는 페이지(`/ingredients` 등 라우트 미신설)에서도 저장 locale로 graceful.

## 설계 (3 슬라이스)

### Slice A — 재료 API lang (`getIngredients` 5곳)

- **신규** `shared/i18n/resolveLocaleFromPath.ts`: `(pathname) => Locale | null` (명시적 `/ja`·`/en`
  prefix만, 없으면 `null`). `resolveChromeLocale`은 ko를 반환해 저장값 fallback이 안 걸리므로 별도.
- **신규** `shared/i18n/useApiLocale.ts`: `useApiLocale()` =
  `resolveLocaleFromPath(usePathname() ?? "/") ?? getStoredLocale() ?? "ko"`.
- `getIngredients`에 `lang?: Locale` 파라미터. `getIngredientDetail`과 동일 — `ko`(또는 미지정)면
  쿼리 생략, 아니면 `params: { lang }`. ko fetch 캐시·동작 불변.
- 5개 호출부에서 `useApiLocale()`를 lang으로 전달 + TanStack queryKey에 locale 포함(ko 캐시 분리):
  `useInfiniteIngredients`, `IngredientSelector`, `IngredientSearchDrawer`,
  `IngredientsFilterSheet`, `IngredientPicker`.

### Slice B — 냉장고 페이지 chrome 번역

- **신규 `fridge` 네임스페이스**(`Dictionary` 타입 + `messages/{ko,ja,en}`): 페이지 타이틀/서브타이틀,
  "정렬", lastPageMessage 2종(없음/더보기), 빈 상태(헤딩+2줄 본문+CTA "재료 추가하러 가기"),
  `FridgeMatchSummary`("냉장고 재료로 바로 완성" / "N개 필요"(plural/format) / "접기"), 카드 "AI 생성".
- `lastPageMessage`는 현재 `useMyFridgeQueries` 훅 안에 하드코딩 → 컴포넌트로 올려 dict 사용.
- **`/ja/recipes/my-fridge` + `/en/recipes/my-fridge`** 래퍼 추가. 페이지 copy는 `useChromeLocale()`
  (pathname) 기반 → chrome과 일관. layout metadata title도 locale별.

### Slice C — 냉장고 레시피 데이터 lang

- `getMyFridgeRecipes(sort, page)` → `lang` 추가, `useMyFridgeRecipesInfiniteQuery`에서
  `useChromeLocale()` 전달. queryKey에 locale. ja 페이지의 레시피 제목·부족재료명이 ja로 옴.

## Acceptance Criteria

1. `/ja`·`/en/recipes/my-fridge`에서 정적 카피가 해당 언어로 렌더. ko 루트는 회귀 없음.
2. `/ja`·`/en` 컨텍스트에서 재료 검색/냉장고추가/필터/피커/레시피생성의 `getIngredients` 호출에
   `?lang`이 실림. prefix 없는 루트는 저장 locale → 둘 다 없으면 ko.
3. ko 사용자/ko 라우트는 lang 생략, fetch 캐시·queryKey 불변.
4. ja 냉장고 페이지의 레시피 카드 제목·부족재료명이 ja로 옴.
5. 백엔드가 특정 locale 미지원이어도 FE는 에러 없이 fallback(데이터만).

## Non-goals

- `/ingredients`·`/ingredients/new` 라우트 신설 및 그 페이지(드로어) 카피 번역 — 드로어는 API lang만 받음.
- 숫자+단위 포맷(조리시간 "분"·"인분"), 통화.
- `getIngredientNames`/`fetchIngredientUnits` lang — 필요 시 후속.
- 정렬 라벨(`useSort`/`SortPicker` — 공유 컴포넌트, blast radius).

## 검증

- 순수 함수(`resolveLocaleFromPath`)·lang 전파(`getIngredients`)는 단위 테스트(TDD).
- 카피 추출은 no-Hangul 렌더 스캔 + `npx tsc --noEmit`(`Dictionary` 타입이 키 누락 강제).
