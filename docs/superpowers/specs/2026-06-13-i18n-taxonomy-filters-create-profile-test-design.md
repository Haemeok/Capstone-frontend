# 택소노미 현지화 + 생성/프로필 페이지 i18n — Test Design

> 작성일: 2026-06-13 · 브랜치: feature/17
> 슬라이스: `2026-06-13-i18n-taxonomy-filters-create-profile-slices.md`

## 테스트 철학 (이 피처 한정 깊이)

i18n의 **owner seam은 컴포넌트 렌더**다(사용자가 보는 라벨). 따라서 acceptance =
pathname을 `/ja`·`/en`으로 모킹해 컴포넌트를 렌더하고 표시 문자열을 검증.

라벨 N개 등식 나열은 **change-detector**다(카피 한 번 다듬으면 N개 깨짐). 대신:

- **메커니즘(리졸버) unit 1회** — `taxonomyLabel(code, domain, locale)`·`localizeTaxonomy`
  의 ko passthrough / code→locale / unknown fallback.
- **표면별 대표 1개** — 그 표면이 ja dict 값을 렌더하고 ko dict 값과 다른지.
- **no-Hangul 스캔 invariant** — 그 표면의 ja/en 렌더 트리에 한글이 없음(미추출
  문자열을 잡는 진짜 가드. 타입게이트가 못 잡는 inline 한글 사례 보호).
- **ko 회귀 앵커** — ko 렌더가 한글 그대로 + 동작 불변.

표시 라벨은 **하드코딩 카피가 아니라 `messages.ja.<...>` 사전 값과 일치**로 검증한다
(카피는 구현 단계 페르소나가 정함 → 테스트가 카피에 결합하지 않게).

모킹 경계: `next/navigation`(usePathname), network/`apiClient`만. **자기 훅·모듈 모킹 금지**
(S5 에러는 apiClient 응답을 모킹하고 실제 mutation 훅을 돌린다).

---

## S1 — 레시피 유형 필터 라벨 (walking skeleton)

**시나리오**

- 해피: `/ja`에서 `RecipeTypeSelector` 렌더 → USER 칩 텍스트 === `messages.ja.taxonomy.recipeType.USER`,
  그리고 `!== messages.ko...USER`, 한글 없음.
- ko 회귀: `/`(ko)에서 USER 칩 === "사용자 레시피"(ko dict 값).
- 코드 경로: `/ja`에서 USER 칩 클릭 → `onTypesChange`가 `["USER"]`(코드)로 호출됨.
- 메커니즘: `taxonomyLabel("AI","recipeType","ja")` → ja 값; `taxonomyLabel("ZZZ",…)` →
  안전 fallback(코드 또는 빈 처리, throw 안 함); `localizeTaxonomy(x,d,"ko")` → x 그대로.

## S2 — 검색 필터 나머지 라벨 + 재료비 숨김

**시나리오**

- 해피(스캔): `/ja`에서 `SearchFilters` 렌더 → 한글 잔존 0(정렬·요리유형·태그·재료·영양
  칩/드로어 전체).
- 정렬 코드 보존: `/ja`에서 정렬을 "최신순"에 해당하는 항목으로 바꿈 → 표시는 ja dict
  값이지만 상태/쿼리는 `createdAt,DESC`(ko와 동일 코드).
- 요리유형 코드 보존: `/ja`에서 요리유형 한 개 선택 → 동일 코드(`SOUP_STEW` 등)가 쿼리에.
- 재료비 숨김: `/ja`·`/en` 영양 필터 → 재료비(원) 컨트롤 부재. `/`(ko) → 존재. 칼로리·
  탄단지·당류·나트륨 범위는 ja에서도 존재.
- ko 회귀: ko 필터 칩·드로어 라벨 한글 그대로.

## S3 — 홈/검색 카테고리 칩(CategoryTabs)

**시나리오**

- 해피: `/ja`에서 `CategoryTabs` 렌더 → 대표 칩 === ja dict 값, 한글 없음.
- 링크 sticky + 코드: `/ja`에서 `CHEF_RECIPE` 칩의 href === `/ja/recipes/category/CHEF_RECIPE`.
- ko 회귀: ko 렌더 칩 한글 + href === `/recipes/category/CHEF_RECIPE`.

## S4 — 재료 카테고리 탭

**시나리오**

- 해피: `/ja`에서 `IngredientCategoryTabs` 렌더 → 대표 탭(고기 등) === ja dict 값, 한글 없음.
- 선택 보존: `/ja`에서 탭 클릭 → `onSelect`가 ko canonical(예: "고기")로 호출되고
  `selected` 하이라이트가 정확히 그 탭에 걸림.
- ko 회귀: ko 탭 한글 그대로.

## S5 — 프로필 편집 `/users/edit`

**시나리오**

- 해피(스캔): `/ja/users/edit` 렌더 → 헤더(취소·프로필 변경·확인)·라벨(이름·소개)·
  placeholder가 ja dict 값, 한글 잔존 0.
- 닉네임 boundary: `/ja`에서 닉네임 비우고 blur → validation 메시지 === ja dict; 13자
  초과 입력 → 길이 초과 메시지 === ja dict.
- 이미지 error: `/ja`에서 `image/gif` 업로드 → "JPG/PNG/WebP만" 메시지 === ja dict.
- 서버 error: apiClient가 code 102(중복 닉네임) 응답하도록 모킹 → 닉네임 필드에 서버
  메시지 표시; 그 외 실패 모킹 → toast가 ja dict 값. (실제 mutation 훅 사용)
- 자유텍스트 불변: 닉네임 `"홍길동"`·소개 한글 입력값이 `/ja`에서도 변환 없이 그대로 렌더.
- ko 회귀: `/users/edit` 한글 chrome 그대로.

## S6 — 생성 허브 `/recipes/new` + `/manual`

**시나리오**

- 해피(스캔): 허브를 `locale="ja"`로 렌더 → 제목·두 카드 제목/본문/`alt`가 ja dict,
  한글 잔존 0.
- 링크 sticky: ja 허브의 카드 href === `/ja/recipes/new/manual`·`/ja/recipes/new/youtube`.
- manual 해피: `/ja/recipes/new/manual` 렌더 → 작성 폼 chrome ja dict, 한글 없음.
- ko 회귀: ko 허브·manual chrome·링크(`/recipes/new/manual`) 그대로.

## S7 — 카테고리 상세 `/recipes/category/[id]`

**SEO 결정(명확화):** 백엔드 `availableLocales`/locale sitemap이 아직 없다(보드 §6 블로커).
기존 방침("백필 전 미개방")과 일관되게 **ja/en 카테고리 상세는 당분간 `robots: noindex`**
(self canonical + hreflang은 방출). availableLocales 도착 시 indexable 전환은 후속.

**시나리오**

- 해피(스캔): `/ja/recipes/category/CHEF_RECIPE` 렌더 → 히어로·칩·카운트·빈상태 chrome +
  태그 라벨이 ja dict, 한글 잔존 0.
- 데이터 lang: ja 라우트 렌더 시 `getRecipesOnServer`가 `lang: "ja"` 포함해 호출됨
  (network 모킹으로 인자 검증).
- queryKey locale 분리: 카테고리 리스트 queryKey가 `ja`·`ko`에서 서로 다름(언어 전환
  refetch 보장). `buildXxxQueryKey(...,"ja") !== (...,"ko")`.
- 메타 현지화: ja `generateMetadata(CHEF_RECIPE)` → title이 ja 템플릿(ko "모음" 문자열
  미포함), `alternates.languages`에 hreflang, JSON-LD `inLanguage === "ja"`.
- CHEF 키워드 제외: ja `generateMetadata(CHEF_RECIPE).keywords`에 "흑백요리사"·"안성재"
  등 한국 셀럽 키워드 없음.
- noindex: ja/en `generateMetadata().robots.index === false`.
- ko 회귀: ko 카테고리 상세 chrome·메타(CHEF 특수 카피 포함)·데이터 그대로.

---

## 추적 매트릭스

| AC | 시나리오 | Test ID | Owner layer | Risk |
| --- | --- | --- | --- | --- |
| S1-1 | /ja recipeType 칩 = ja dict, 한글 없음 | T-01 | component(acc) | integrity |
| S1-2 | ko recipeType 칩 = 사용자 레시피 | T-02 | component(acc) | integrity |
| S1-3 | /ja USER 클릭 → onTypesChange(["USER"]) | T-03 | component | integrity |
| S1-mech | taxonomyLabel code→locale / ko passthrough / unknown fallback | T-04 | unit | integrity |
| S2-1 | /ja SearchFilters no-Hangul 스캔 | T-05 | component(acc) | integrity |
| S2-2 | /ja 정렬 변경 → 표시 ja, 코드 createdAt,DESC | T-06 | component | integrity |
| S2-3 | /ja 요리유형 선택 → 코드 SOUP_STEW | T-07 | component | integrity |
| S2-4 | /ja·/en 재료비(원) 부재 · ko 존재 | T-08 | component | integrity |
| S2-5 | ko 필터 라벨 한글 회귀 앵커 | T-09 | component(acc) | integrity |
| S3-1 | /ja CategoryTabs 대표칩 = ja dict, 한글 없음 | T-10 | component(acc) | integrity |
| S3-2 | /ja CHEF_RECIPE 칩 href = /ja/recipes/category/CHEF_RECIPE | T-11 | component | integrity |
| S3-3 | ko 칩 한글 + ko href | T-12 | component(acc) | integrity |
| S4-1 | /ja IngredientCategoryTabs 대표탭 = ja dict, 한글 없음 | T-13 | component(acc) | integrity |
| S4-2 | /ja 탭 클릭 → onSelect(ko canonical) + 하이라이트 | T-14 | component | integrity |
| S4-3 | ko 탭 한글 회귀 앵커 | T-15 | component(acc) | integrity |
| S5-1 | /ja /users/edit chrome = ja dict, no-Hangul 스캔 | T-16 | component(acc) | integrity |
| S5-2 | /ja 닉네임 빈값/13자 초과 validation = ja dict | T-17 | component | integrity |
| S5-3 | /ja image/gif 업로드 메시지 = ja dict | T-18 | component | integrity |
| S5-4 | code102 모킹 → 필드 서버메시지 · 기타실패 → ja toast | T-19 | component | integrity |
| S5-5 | 닉네임/소개 자유텍스트 변환 없이 렌더 | T-20 | component | integrity |
| S5-6 | ko /users/edit chrome 회귀 앵커 | T-21 | component(acc) | integrity |
| S6-1 | ja 허브 제목/카드/alt = ja dict, no-Hangul 스캔 | T-22 | component(acc) | integrity |
| S6-2 | ja 허브 카드 href = /ja/recipes/new/{manual,youtube} | T-23 | component | integrity |
| S6-3 | /ja manual chrome = ja dict, 한글 없음 | T-24 | component(acc) | integrity |
| S6-5 | ko 허브/manual chrome·링크 회귀 앵커 | T-25 | component(acc) | integrity |
| S7-1 | /ja category 상세 chrome+라벨 = ja dict, no-Hangul 스캔 | T-26 | component(acc) | integrity |
| S7-2 | ja 라우트 → getRecipesOnServer(lang:"ja") | T-27 | integration(network mock) | integrity |
| S7-3 | queryKey ja !== ko | T-28 | unit | integrity |
| S7-4 | ja generateMetadata: ja title + hreflang + inLanguage=ja | T-29 | unit | SEO |
| S7-5 | ja CHEF keywords에 셀럽명 없음 | T-30 | unit | SEO |
| S7-6 | ja/en robots.index === false | T-31 | unit | SEO |
| S7-7 | ko category 상세 메타/데이터 회귀 앵커 | T-32 | unit+component | integrity |

## Coverage Gate

- 모든 AC가 ≥1 Test ID 보유(위 매트릭스 좌열 = 슬라이스 AC 전부). ✅
- 각 슬라이스가 해피 + 관련 edge/error 보유: S5(boundary 닉네임·error 이미지/서버),
  S2(재료비 숨김 edge), S7(noindex·키워드 제외 edge). ✅
- 각 표면에 acceptance-layer(component 렌더) 테스트 존재. ✅
- owner-layer 1회 원칙: 리졸버 메커니즘은 T-04 unit 1곳 소유. 표면 테스트는 "그 표면이
  사전을 쓰는가"만(메커니즘 재검증 아님). 메타 로직은 unit(T-29~31), 렌더는 component. ✅
- 라벨 등식 나열 회피: 표면당 대표 1 + no-Hangul 스캔 invariant로 깊이 제한(change-detector
  배제). ✅

## Non-goals (테스트 없음 — 의도적 부재)

- 공개 프로필 `/users/[userId]`·레시피북·캘린더 — no test.
- youtube/AI 추출·생성 본문 데이터 lang·기능 — no test.
- 접근법 B(상수 코드 키 이관) — no test.
- 자동 리다이렉트 / 통화 변환 / `<html lang>` per-locale — no test.
- 재료명·카테고리 **데이터 필드** 번역(백엔드 lang) — no test(탭 라벨만 테스트).
- `/recipes/new/ai/*` 하위 chrome — no test.
- ja/en **카피 자연성**(품질) — 자동 테스트 아님. 페르소나 산출 + 사용자 수동 검증.

## 순서 (TDD walking skeleton)

T-04(리졸버 unit) → T-01~03(S1 skeleton) → T-05~09(S2) → T-10~12(S3) →
T-13~15(S4) → T-16~21(S5) → T-22~25(S6) → T-26~32(S7).
