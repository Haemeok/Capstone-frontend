# 레시피북 상세 i18n — 테스트 설계 (요구사항→테스트 매트릭스)

> 날짜: 2026-06-15 · 브랜치: feature/17
> 슬라이스: `2026-06-15-recipe-books-detail-i18n-slices.md`

## 깊이 방침 (risk-weighted)

i18n 카피는 대부분 **cosmetic** → 불변식만: 컴포넌트당 **ja/en no-Hangul 렌더 1개(로케일
파라미터화) + ko 회귀 앵커 1개**. 문자열 N개 등식(change-detector) 금지 — "한글 안 보임 +
핵심 라벨 1~2개 존재"로 계약 고정.

**진짜 로직(integrity)** = 명시적 단위/행동 테스트:
- 에러 코드 분기(`{code,message}`, 1104/1107→fieldError, 그 외→toast)
- zod 팩토리(빈값/50자 경계)
- `getRecipeBookDetail` lang 파라미터(ja/en 실림·ko 생략·키 불변)
- 조사 없는 `{name}` 보간(이동/삭제 토스트)

**Radix portal 주의(보드 교훈)**: Dialog/Sheet는 `document.body`로 portal →
no-Hangul 검사는 `baseElement.textContent`로 읽는다(`container.textContent`는 빈값→거짓통과).

## 트레이서빌리티 매트릭스

| AC | 시나리오 (Given/When/Then 요약) | Test ID | Owner layer | Risk |
| --- | --- | --- | --- | --- |
| **S1**-AC1·AC2·AC4 | `/ja`·`/en` 상세 헤더/카운트/aria 렌더 → 한글 0 + `편집`(ja/en 라벨) 존재 | T-01 | component(RecipeBookDetailHeader) | cosmetic |
| S1-AC2 | 편집모드 진입 selectedCount=3 → `3개 선택`의 ja/en 형태(format) 렌더 | T-02 | component | cosmetic |
| S1-AC3 | 빈 책(recipes=[]) `/ja`·`/en` → 빈상태 제목·CTA 한글 0 | T-03 | component(RecipeBookRecipeGrid) | cosmetic |
| S1-AC5 | ko 상세 → 기존 `편집`·`N개 선택`·빈상태 문자열 그대로(앵커) | T-04 | component | cosmetic |
| **S2**-AC1 | locale=ja → `getRecipeBookDetail(bookId,{...})` 요청에 `lang:"ja"` 포함 | T-05 | unit(getRecipeBookDetail) | integrity |
| S2-AC2 | locale=ko → 요청에 `lang:"ko"` 포함(형제 `getRecipeBooks`와 동일 — ko 생략 안 함) | T-06 | unit | integrity |
| S2-AC3 | `RECIPE_BOOK_QUERY_KEYS.detail/detailInfinite` 시그니처에 locale 세그먼트 없음(불변) | T-07 | unit(queryKeys) | integrity |
| S2-AC1 | 그리드가 `useUserPagesLocale()` 해석값을 queryFn `lang`으로 전달(ja면 lang=ja) | T-08 | component(RecipeBookRecipeGrid) | integrity |
| **S3**-AC1 | `/ja`·`/en` 편집 바 → 한글 0 + `이동`/`삭제` ja/en 라벨 존재 | T-09 | component(EditModeBottomBar) | cosmetic |
| S3-AC2 | `/ja`·`/en` 이동 시트(열림) → portal 내 한글 0(`baseElement`) | T-10 | component(MoveRecipesSheet) | cosmetic |
| S3-AC3 | 책명 `"집밥"`으로 이동 성공(ja) → 토스트가 `{name}` 보간 + 한글 조사(`으로`) 없음 | T-11 | component(MoveRecipesSheet) | integrity |
| S3-AC4 | count=2 `/ja`·`/en` 빼기 모달 → title `2` 보간 + 한글 0 | T-12 | component(BulkDeleteConfirmModal) | cosmetic |
| S3-AC5 | 빼기 성공(ja, count=2) → 토스트 `2` 보간 ja 문구 | T-13 | component(BulkDeleteConfirmModal) | integrity |
| S3-AC6 | ko 바·이동 토스트(`집밥으로 이동`)·빼기 모달 문자열 그대로(앵커) | T-14 | component | cosmetic |
| **S4**-AC1 | `/ja`·`/en` rename·create 시트(열림) → portal 한글 0 + 진행중 라벨 존재 | T-15 | component(Rename·CreateSheet) | cosmetic |
| S4-AC2 | `buildRecipeBookFormSchema(validation)`: name="" → nameRequired, len=51 → nameMax (ja 메시지) | T-16 | unit(schema factory) | integrity |
| S4-AC2 | rename 시트 빈값 제출(ja) → 폼에 ja validation 메시지 표시 | T-17 | component(RenameSheet) | integrity |
| S4-AC3 | 책명 `"집밥"` 삭제 성공(ja) → 토스트 `{name}` 보간(조사 없음) | T-18 | component(DeleteRecipeBookModal) | integrity |
| S4-AC4 | `/ja`·`/en` 삭제 모달 → title `{name}` 보간 + 한글 0 | T-19 | component(DeleteRecipeBookModal) | cosmetic |
| S4-AC3 | rename·create 성공(ja) → 성공 토스트 ja 문구 | T-20 | component | cosmetic |
| S4-AC5 | ko rename/create/delete 시트·토스트(`"집밥" 레시피북이 삭제되었어요`) 그대로(앵커) | T-21 | component | cosmetic |
| **S5**-AC1 | ApiError code=1107 → `getRecipeBookError(e,"ja")` = `{code:1107, message:<ja 중복>}` | T-22 | unit(getRecipeBookError) | integrity |
| S5-AC1 | code=1104 → `{code:1104, message:<ja 기본책>}` | T-23 | unit | integrity |
| S5-AC2 | code=1105 → message ja, non-field 코드; code 미매핑/non-Api → fallback ja | T-24 | unit | integrity |
| S5-AC1 | rename 시트(ja)에서 1107 발생 → **fieldError**(form.setError) 표시, 토스트 아님 | T-25 | component(RenameSheet) | integrity |
| S5-AC2 | rename 시트(ja)에서 1102(접근불가) 발생 → **toast** 표시, fieldError 아님 | T-26 | component | integrity |
| S5-AC3 | 코드베이스에 `"같은 이름"`/`"기본 레시피북"` substring 매칭 없음 | T-27 | grep(structural) | integrity |
| S5-AC4 | ko: code=1107→한국어 중복 메시지, code=1102→한국어 토스트(앵커) | T-28 | unit | integrity |
| **S6**-AC1 | `/ja`·`/en` ChangeBookSheet(열림) → portal 한글 0 + `새 레시피북 만들기` ja/en 존재 | T-29 | component(ChangeBookSheet) | cosmetic |
| S6-AC2 | 책명 `"집밥"` 저장 성공(ja) → 토스트 `{name}` 보간(조사 없음) | T-30 | component(ChangeBookSheet) | integrity |
| S6-AC3 | 현재 책 못 찾음(ja) → "현재 레시피북 없음" ja 토스트 | T-31 | component | cosmetic |
| S6-AC4 | ko ChangeBookSheet·토스트(`집밥으로 이동했어요`) 그대로(앵커) | T-32 | component | cosmetic |

## 비목표 (테스트 없음 — 의도적 부재)

- 유저가 만든 책 이름 번역 → **no test**
- `DetailedRecipeGridItem` 카드 내부 → **no test**
- 레시피북 목록 페이지 → **no test**(S4 완료분)
- `getRecipeBookDetail` lang의 queryKey 포함 → **no test**(§6 결정, T-07이 *불포함*을 고정)
- hreflang/canonical/noindex → **no test**(상세=비공개 유저 데이터)

## 커버리지 게이트 체크

- 모든 슬라이스 AC가 ≥1 Test ID 보유: S1(T-01~04)·S2(T-05~08)·S3(T-09~14)·S4(T-15~21)·
  S5(T-22~28)·S6(T-29~32). ✅
- 각 슬라이스 acceptance-층(컴포넌트 행동) 테스트 보유. ✅ (S2는 데이터-계약이라 unit이 owner
  + T-08 컴포넌트 wiring)
- 동일 행동 중복 층 없음: 에러 메시지는 헬퍼(unit, T-22~24)가 owner; 컴포넌트(T-25/26)는
  unit이 못 잡는 **표면 분기(field vs toast)** 만 검증. zod 메시지는 팩토리(T-16)가 owner;
  T-17은 시트 wiring(주입 resolver 동작)만.
- 비목표 전부 "no test" 명시. ✅

## TDD 순서 (= 계획 task 순서)

T-05~07(데이터 계약 unit, 가장 얇음) → T-01~04(skeleton 화면) → T-08(데이터 wiring) →
T-09~14(편집 플로우) → T-15~21(시트, zod 포함) → T-22~28(에러 분기) → T-29~32(픽커).
실제 코드는 TDD로 한 번에 하나(red→green)씩, 이 순서대로.
