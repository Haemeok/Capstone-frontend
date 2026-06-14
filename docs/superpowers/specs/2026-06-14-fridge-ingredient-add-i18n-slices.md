# 냉장고 재료 추가 i18n — 수직 슬라이스

> 날짜: 2026-06-14 · 브랜치: feature/17
> 설계: `2026-06-14-fridge-ingredient-add-i18n-design.md`

## 글로서리 (Ubiquitous Language)

| 도메인어 (ko / 코드 / ja·en) | 의미 |
| --- | --- |
| 재료 추가 페이지 / `IngredientAddView` / ingredient add page | `/ingredients/new` 본문 위젯 |
| 검색 드로어 / `IngredientSearchDrawer` / search drawer | 데스크톱 재료 검색·추가 시트 |
| 팩 / `pack` (`INGREDIENT_PACKS`) / おすすめ食材セット·pack | 추천 재료 묶음 |
| 팩 카드 / `IngredientPackCard` / pack card | 팩 그리드 항목 |
| 팩 상세 드로어 / `IngredientPackDetailDrawer` / pack detail drawer | 팩 재료 선택 시트 |
| 팩 메타 / `localizePack` / pack meta | 팩 이름·설명 오버레이 |
| 재료명 오버레이 / `localizeIngredientName` / ingredient name overlay | id→현지화 재료명 |
| 보유중 / `owned` / 追加済み·owned | 이미 냉장고에 있는 재료 |
| 조리시간 단위 / `cookTimeMinutes` / 分·min | 레시피 카드 분 단위 |

> 표기 통일: 코드/비교/폼값·`imageUrl` 자산 경로는 **ko canonical 불변**, 표시만 현지화.

## Out of Scope (non-goals — 테스트 없음)

- `/ingredients`(재료 목록) 페이지 및 그 페이지에서 `/ingredients/new`로 가는 링크들
- `/ingredients/new` SEO 인덱싱 (noindex 유지)
- 통화·가격 표기, `<html lang>` per-locale
- 재료 데이터 백엔드 번역 (이미 됨 — `?lang=`)
- 모바일 `IngredientPicker` (이미 i18n 완료)
- `getIngredients` lang 전파 (이미 됨 — 두 경로 모두)

---

## Slice 1 — (워킹 스켈레톤) ja/en 재료 추가 페이지 셸이 현지 언어로 뜬다

ja/en 유저가 `/ja|/en/ingredients/new`에 진입하면 페이지 chrome(헤더, 검색 진입
버튼, "추천 재료 모음" 제목/부제)이 해당 언어로 보인다. — 이 슬라이스가 라우트
래퍼·`IngredientAddView` 위젯 추출·`ingredientAdd` 사전 네임스페이스·자가판정
`useIngredientAddDict` 훅을 **전 경로 관통**으로 증명한다.

**AC**
1. `/ja/ingredients/new` 진입 시 헤더가 "食材を追加", 검색 진입 버튼 문구·추천 모음
   제목/부제가 일본어로 표시된다.
2. `/en/ingredients/new`에서 동일 영역이 영어로 표시된다.
3. ko `/ingredients/new`는 기존 문구 그대로(회귀 0)이며 동일 위젯을 렌더한다.
4. 검색 진입 버튼의 `aria-label`도 현지 언어다.

## Slice 2 — 데스크톱 검색 드로어가 현지 언어로 뜬다

ja/en 유저가 재료 추가 페이지에서 검색 드로어를 열면 제목·설명·placeholder·검색
버튼·로딩·에러·빈상태·닫기와 카테고리 칩이 해당 언어로 보인다(재료 리스트명은
백엔드 번역분).

**AC**
1. ja/en에서 드로어 제목·설명·검색 placeholder·`aria-label`이 현지 언어다.
2. 카테고리 칩이 현지 언어로 표시된다("전체"→"すべて"/"All" 포함) — 기존
   `useTaxonomy().localize(category,"ingredientCategory")` 경유.
3. 결과 0건이면 `"{query}에 해당하는 재료가 없어요"`가 현지 언어로, query 치환되어
   표시된다.
4. 페치 에러 시 에러 문구가 현지 언어로 표시된다.
5. 추가/추가됨 토글 버튼 라벨이 현지 언어다.
6. ko 드로어는 회귀 0.

## Slice 3 — 팩 카드가 현지 언어로 뜬다

ja/en 유저가 추천 모음 그리드에서 팩 카드의 이름·설명·"보유 중" 배지·"재료 N개"
카운트를 현지 언어로 본다. (팩 메타 오버레이, ko 상수 불변)

**AC**
1. ja/en에서 각 팩 카드의 이름·설명이 팩 메타 오버레이의 현지 언어 값으로 표시된다.
2. 팩 전체 보유 시 "보유 중" 배지가 현지 언어로 표시된다.
3. "재료 N개" 카운트가 현지 언어 템플릿으로 N 치환되어 표시된다.
4. 카드 `aria-label`("{name} 상세 보기")이 현지 언어이고 팩 이름이 현지화되어 들어간다.
5. ko 카드는 회귀 0(팩 이름/설명 한글 그대로).

## Slice 4 — 팩 상세 드로어가 재료명까지 현지 언어로 뜬다

ja/en 유저가 팩 카드를 눌러 상세 드로어를 열면 헤더(이름·설명·총 개수)·"N개
선택됨"·전체선택/선택해제·"보유중"·제출 CTA(추가/삭제 N개·진행중)와 **모든 팩
재료명**이 현지 언어로 보인다.

**AC**
1. ja/en 드로어 헤더의 팩 이름·설명이 현지 언어, "· 총 N개" 접미가 현지 언어로
   N 치환되어 표시된다.
2. "N개 선택됨"·전체 선택·선택 해제·"보유중"이 현지 언어다.
3. 팩 내 모든 재료명이 재료명 오버레이의 현지 언어로 표시된다.
4. 제출 CTA가 상태별("N개 추가하기"/"N개 삭제하기"/"추가 중…"/"삭제 중…")로 현지
   언어이며 N 치환된다.
5. **팩 상세 드로어 ja/en 렌더 결과에 한글 0** (no-Hangul 가드 — 재료명 누락 포착).
6. ko 드로어는 회귀 0.

## Slice 5 — my-fridge 레시피 카드 조리시간 단위가 현지 언어로 뜬다

ja/en 유저가 `/ja|/en/recipes/my-fridge`에서 레시피 카드의 조리시간 단위를 현지
언어로 본다.

**AC**
1. ja에서 조리시간이 `{N}分`, en에서 `{N} min`으로 표시된다.
2. ko는 `{N}분` 그대로(회귀 0).

## Slice 6 — ja/en 냉장고 빈상태 CTA가 같은 locale 페이지로 이동한다

ja/en 유저가 냉장고가 빈 상태에서 "재료 추가" CTA를 누르면 같은 locale의 재료 추가
페이지로 이동한다.

**AC**
1. `/ja/recipes/my-fridge` 빈상태 CTA의 href가 `/ja/ingredients/new`다.
2. `/en/recipes/my-fridge` 빈상태 CTA의 href가 `/en/ingredients/new`다.
3. ko 빈상태 CTA href는 `/ingredients/new` 그대로(회귀 0).

---

## 순서 (= writing-plans task 순서)

1 (워킹 스켈레톤) → 2 → 3 → 4 → 5 → 6.
1이 사전·훅·위젯·라우트 인프라를 깔고, 2·3·4가 각 표면을 채우고, 5·6은 독립 마감.
