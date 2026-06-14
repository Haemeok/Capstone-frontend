# 냉장고 재료 추가 페이지 i18n (`/ingredients/new`) + my-fridge 마감 — 설계

> 날짜: 2026-06-14 · 브랜치: feature/17 · 스코프: M
> 후속 보드: `I18N-STATUS.md` §3 냉장고 / 재료 추가

## 0. 번역 원칙 (I18N-STATUS §0 상속)

EN/JA 카피는 직역 금지. 각 언어 모국어 IT 프로덕트 PM이 레시피 앱에 직접 쓴 것처럼
자연스럽게, 차분·실용 톤(마케팅 과장·이모지 남발 금지). 라벨=표시 문맥 자연어,
CTA는 1:1 대응. 코드/비교/폼값·자산 경로는 ko canonical 유지(표시만 현지화).

## 1. 배경 / 문제

`/recipes/my-fridge`(냉장고 레시피 매칭 뷰)는 이미 ja/en 완료 상태이나, 냉장고
플로우의 다른 한 축인 **재료 추가 페이지 `/ingredients/new`** 가 통째로 미번역이다.
냉장고가 빈 유저는 `MyFridgeEmptyState`의 "재료 추가하러 가기" CTA로 이 페이지에
직접 도달하므로, ja/en 유저는 냉장고를 채우려는 순간 한글 벽을 만난다.

### 현황 (실제 코드 기준, 2026-06-14 조사)

- ✅ `/recipes/my-fridge` (`MyFridgeView` + `MyFridgeRecipes` 위젯) — 완료.
  **잔여 1건: `MyFridgeRecipeCard`의 `{recipe.cookingTime}분` 단위.**
- ✅ 모바일 `entities/ingredient/ui/IngredientPicker` — 이미 완전 i18n
  (`useIngredientPickerDict` + `useTaxonomy().localize` + `useApiLocale` lang 전파).
  **손대지 않는다.**
- ✅ `getIngredients` lang 전파 — 데스크톱(`IngredientSearchDrawer`)·모바일 두 경로
  모두 이미 `lang: locale` 전달. **API 배선 추가 불필요.** 검색 드로어 리스트의
  재료명은 백엔드 번역분(`?lang=`, 재료 상세 🟢로 검증)이 그대로 온다.
- 🔴 데스크톱 `features/ingredient-add-fridge/ui/IngredientSearchDrawer` — chrome 전부
  한글 + 카테고리 칩 raw 렌더(`{category}`)
- 🔴 `features/ingredient-add-fridge/ui/IngredientPackDetailDrawer` — chrome + 팩 재료명
- 🔴 `widgets/IngredientPackCard/IngredientPackCard` — 팩 이름/설명/배지/카운트
- 🔴 `app/ingredients/new/page.tsx` (`NewIngredientsPage`) — 헤더·검색 진입·추천 모음
- 🔴 `shared/config/constants/ingredientPacks.ts` (`INGREDIENT_PACKS`) — 팩 8개
  이름/설명 + 고유 재료명 ~120개 (프론트 단독 상수 → 직접 번역)

## 2. 결정

- **범위**: 재료 추가 페이지(`/ingredients/new`) 전체 + my-fridge `분` 단위 마감.
  (사용자 확정 2026-06-14)
- **팩 재료명 ~120개**: id→ja/en 오버레이로 **전부 직접 번역**(ko fallback).
  (사용자 확정 2026-06-14) — 다수 외래어라 기계적. 팩 상세 드로어에서만 노출.

## 3. 아키텍처 (I18N-STATUS §5 반복 레시피 답습)

### 3.1 본문 추출 + 라우트 래퍼

`NewIngredientsPage` 클라이언트 본문을 위젯 `widgets/IngredientAddPage/ui/IngredientAddView.tsx`
로 순수 이동. 3개 라우트가 이 위젯을 렌더하는 얇은 래퍼:

- `app/ingredients/new/page.tsx` → `<IngredientAddView />`
- `app/ja/ingredients/new/page.tsx` → `<IngredientAddView />` (신규)
- `app/en/ingredients/new/page.tsx` → `<IngredientAddView />` (신규)

locale은 dict 훅이 pathname으로 자가판정하므로 prop 불필요(my-fridge와 동형).
metadata는 noindex 유지(앱 내부 페이지, SEO 무관).

### 3.2 자가판정 사전 훅

`useFridgeDict` 패턴 복제 → `shared/i18n/useIngredientAddDict.ts`:
`ingredientAddMessages[resolveChromeLocale(usePathname() ?? "/")]`.

### 3.3 데이터 fetch

변경 없음. 두 드로어 모두 `useApiLocale`로 `lang` 이미 전파 중.

## 4. 사전 / 오버레이 설계

### 4.1 `ingredientAdd` 네임스페이스 (타입드 Dictionary, ko/ja/en 강제)

페이지 + 검색 드로어 + 팩 상세 드로어 + 팩 카드의 chrome 문자열(~25키). 예시 키:

```
ingredientAdd: {
  pageTitle, searchEntry, searchEntryAria, packsHeading, packsSubtitle,
  drawerTitle, drawerDescription, searchPlaceholder, searchAria, searchAction,
  loading, errorPrefix /* {message} */, added, add, allLoaded,
  noResults /* {query} */, close,
  packCountSuffix /* {count} → "· 총 {count}개" */, selectedCount /* {count} */,
  selectAll, deselectAll, owned, deleting, adding,
  deleteCount /* {count} */, addCount /* {count} */,
  cardOwned, cardCount /* {count} */, cardDetailAria /* {name} */,
}
```

치환은 기존 `format()` 사용. 카테고리 칩은 **신규 번역 없음** — 데스크톱 드로어의
`{category}` raw 렌더를 `useTaxonomy().localize(category, "ingredientCategory")`로 교체
(`localizeTaxonomy`가 "전체"→"ALL" 포함 전 카테고리 처리, ko 입력 그대로).

### 4.2 팩 메타 오버레이 (표시 전용)

`INGREDIENT_PACKS` 구조·`imageUrl`(한글 파일명 = 자산 경로) **불변**. ko 팩명을 키로:

```
packMeta: Record<koPackName, { name, description }>   // per locale (ja/en); ko는 식별자
```

리졸버 `localizePack(pack, locale)` → `{ name, description }`. ko/누락 시 상수값 fallback.

### 4.3 재료명 오버레이 (표시 전용)

상수 `name`(ko, `imageUrl` 파일명도 겸함)은 불변. 별도 데이터 모듈:

```
ingredientNameOverlay: Record<Locale, Record<ingredientId, localizedName>>
```

리졸버 `localizeIngredientName(id, koName, locale)` → ja/en 있으면 그 값, 없으면 koName.
ja/en만 작성(ko 빈 맵, fallback). 팩 상세 드로어 `{ingredient.name}` 렌더 지점에 적용.
**안전망**: 팩 상세 드로어 ja/en **no-Hangul 렌더 가드**가 누락분을 잡는다
(타입게이트 사각 보완 — `policy-i18n-type-gate-misses-unextracted-strings` 교훈).

## 5. my-fridge 마감

`fridge` 사전에 `cookTimeMinutes` 추가: ko `"{min}분"` / ja `"{min}分"` / en `"{min} min"`.
`MyFridgeRecipeCard`의 `{recipe.cookingTime}분` → `format(dict.cookTimeMinutes, { min })`.

## 6. locale-sticky 보정

`MyFridgeEmptyState`의 `<Link href="/ingredients/new">` → `LocalizedLink`로 교체.
ja/en 냉장고 빈상태에서 CTA가 같은 locale의 재료 추가 페이지로 이동.
(범위 밖: `/ingredients` 목록의 동일 링크 — 별도 페이지)

## 7. Acceptance Criteria

1. `/ja·/en/ingredients/new` 진입 시 페이지 헤더·검색 진입·추천 모음 섹션이 해당
   언어로 표시된다.
2. 데스크톱 검색 드로어를 ja/en에서 열면 제목·placeholder·버튼·빈상태·에러·카테고리
   칩이 해당 언어로 표시된다(재료 리스트명은 백엔드 번역분).
3. 팩 카드와 팩 상세 드로어가 ja/en에서 팩 이름·설명·재료명·"보유중"·카운트·CTA까지
   해당 언어로 표시된다.
4. ja/en 냉장고 빈상태 CTA를 누르면 같은 locale의 재료 추가 페이지로 이동한다.
5. `/ja·/en/recipes/my-fridge` 레시피 카드의 조리시간 단위가 해당 언어로
   표시된다(`分`/`min`).
6. ko(`/ingredients/new`, `/recipes/my-fridge`)는 표시·동작 회귀 0.
7. 팩 상세 드로어(ja/en) 렌더 결과에 한글 0 (no-Hangul 가드).

## 8. 비목표

- `/ingredients`(재료 목록) 및 그 페이지의 `/ingredients/new` 링크들
- `/ingredients/new`의 SEO 인덱싱 (noindex 유지)
- 통화·가격 표기, `<html lang>` per-locale
- 재료 데이터 백엔드 번역 (이미 됨)
- 모바일 `IngredientPicker` (이미 됨)

## 9. 글로서리 (Ubiquitous Language)

- **재료 추가 페이지 / ingredient add page** — `/ingredients/new`, 위젯 `IngredientAddView`
- **검색 드로어 / search drawer** — 데스크톱 `IngredientSearchDrawer`
- **팩 / pack** — `INGREDIENT_PACKS` 추천 재료 묶음
- **팩 상세 드로어 / pack detail drawer** — `IngredientPackDetailDrawer`
- **팩 메타 / pack meta** — 팩 이름·설명 오버레이
- **재료명 오버레이 / ingredient name overlay** — id→localized name
- **보유중 / owned** — 이미 냉장고에 있는 재료 표시
- **조리시간 단위 / cook time unit** — `cookTimeMinutes`
