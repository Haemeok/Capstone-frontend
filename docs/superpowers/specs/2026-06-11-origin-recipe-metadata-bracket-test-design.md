# 레시피 메타데이터 품질 패스 — Test Design

- 날짜: 2026-06-11
- 슬라이스 문서: `2026-06-11-origin-recipe-metadata-bracket-slices.md`
- seam: 메타데이터가 곧 제품이다. UI 렌더 계층이 없으므로 **순수함수 출력**이 acceptance
  seam이다 — `generateRecipeMetadata(recipe, id)`의 `.title/.description/.keywords`,
  `createRecipeStructuredData(recipe, id)`의 JSON-LD 필드, `formatSubscriberCount(n)`.
- 테스트 위치: `src/entities/recipe/lib/metadata/__tests__/`, `@jest-environment node`,
  팩토리 `fixtures/recipeFactory.ts`(JP/OTHER 헬퍼 추가 필요).

## Acceptance Criteria (슬라이스에서 verbatim, 번호 부여)

**Slice 1 — JP origin 타이틀**
- AC-1.1 국가 태그가 `JP`일 때, 타이틀은 `[🇯🇵현지레시피]`로 시작한다.
- AC-1.2 `JP`이면서 태그/시간/비용 또는 chef-tv-show 조건에 해당해도 origin 브래킷이
  우선한다 (국가 > 셰프 > 태그/시간/비용).
- AC-1.3 `JP`일 때, 타이틀에 시간 표기(`N분 완성`)가 없다.
- AC-1.4 `JP`일 때, 출처 슬롯 `(출처: {channelName} 유튜브)`은 유지된다.

**Slice 2 — OTHER origin 타이틀**
- AC-2.1 `OTHER`일 때, 타이틀은 `[🌍전세계레시피]`로 시작한다.
- AC-2.2 `OTHER`일 때, 시간 표기(`N분 완성`)가 없다.
- AC-2.3 `OTHER`이면서 태그/시간/비용/셰프 조건이어도 origin 브래킷이 우선한다.

**Slice 3 — 타이틀 시간 중복 제거**
- AC-3.1 브래킷이 `[15분컷⏱️]`이면 타이틀에 `N분 완성`이 없다.
- AC-3.2 브래킷이 `[초간단⚡]`이면 `N분 완성`이 유지된다.
- AC-3.3 태그/비용 브래킷이거나 브래킷이 없으면 `N분 완성`이 유지된다.

**Slice 4 — 영양 보강**
- AC-4.1 youtube description의 영양 라인에 칼로리 + 존재하는 매크로(탄·단·지)가 표시된다.
- AC-4.2 값이 0/없는 매크로는 라인에서 생략된다.
- AC-4.3 매크로가 모두 0/없음이면 칼로리만 표시된다.

**Slice 5 — description 비용·시간 중복 제거**
- AC-5.1 youtube description에서 비용·시간은 상세 라인에만 한 번씩 나타난다(괄호 중복 없음).
- AC-5.2 비-youtube description은 기존 괄호 표기를 유지한다.

**Slice 6 — recipeCuisine 국적 매핑**
- AC-6.1 `JP` 레시피의 `recipeCuisine`은 `"Japanese"`.
- AC-6.2 `KR`/없음 레시피의 `recipeCuisine`은 `"Korean"`.
- AC-6.3 `OTHER` 레시피의 구조화 데이터에는 `recipeCuisine` 키가 없다.

**Slice 7 — 비용 키워드 0원 가드**
- AC-7.1 `totalIngredientCost === 0`이면 keywords에 비용 키워드가 없다.
- AC-7.2 `totalIngredientCost > 0`이면 해당 비용 키워드가 포함된다.

**Slice 8 — 구독자 100만+ 표기**
- AC-8.1 `1,000,000` → "100만명".
- AC-8.2 `1,500,000` → "150만명".
- AC-8.3 `20,000` → "2만명" (회귀).

**Slice 9 — 비대상 불변**
- AC-9.1 `KR`/없음이면 origin 브래킷 미출현 + 기존 브래킷 로직 유지(Slice 3 동일 적용).
- AC-9.2 chef-tv-show이면서 `KR`/없음이면 셰프 타이틀 유지.
- AC-9.3 meta keywords에 origin 검색어 없음.

## 시나리오 (Given/When/Then — 실값)

- **T-01 (AC-1.1 happy):** Given `creatorCountryTag:"JP"`, channel `きょうの料理`, title
  `오야코동` / When generateRecipeMetadata / Then `title`이 `[🇯🇵현지레시피]`로 시작.
- **T-02 (AC-1.2 precedence vs time/cost):** Given JP + `cookingTime:10`,
  `tags:["다이어트"]` / Then title에 `[🇯🇵현지레시피]` 있고 `[다이어트🥗]`/`[15분컷⏱️]` 없음.
- **T-03 (AC-1.2 precedence vs chef):** Given JP + `tags:["셰프 레시피"]` / Then title에
  `[🇯🇵현지레시피]` 있고 `[셰프레시피👨‍🍳]` 없음. (국가 > 셰프)
- **T-04 (AC-1.3):** Given JP + `cookingTime:25` / Then title에 `완성` 문자열 없음.
- **T-05 (AC-1.4):** Given JP, channel `きょうの料理` / Then title에 `(출처: きょうの料理 유튜브)`.
- **T-06 (AC-2.1):** Given `creatorCountryTag:"OTHER"`, channel `Spain on a Fork`,
  title `감바스` / Then title이 `[🌍전세계레시피]`로 시작.
- **T-07 (AC-2.2):** Given OTHER + `cookingTime:20` / Then title에 `완성` 없음.
- **T-08 (AC-2.3):** Given OTHER + `tags:["셰프 레시피"]` / Then `[🌍전세계레시피]` 있고
  `[셰프레시피👨‍🍳]` 없음.
- **T-09 (AC-3.1):** Given KR(국가 없음), `cookingTime:15`, `tags:["한식"]` / Then title에
  `[15분컷⏱️]` 있고 `완성` 없음. (변경 전엔 `15분 완성` 있었음 — 중복 제거)
- **T-10 (AC-3.1 boundary cookingTime<15):** Given `cookingTime:10`, `tags:["한식"]` / Then
  `[15분컷⏱️]` 있고 `완성` 없음.
- **T-11 (AC-3.2):** Given `cookingTime:25`, `tags:["한식"]` / Then `[초간단⚡]` 있고
  `25분 완성` 있음.
- **T-12 (AC-3.3 cost bracket):** Given `tags:["한식"]`, `cookingTime:45`,
  `totalIngredientCost:3000` / Then `[3천원💰]` 있고 `45분 완성` 있음.
- **T-13 (AC-4.1):** Given youtube recipe, `totalCalories:590`,
  `nutrition:{protein:18,carbohydrate:62,fat:12,...}` / Then description에
  `칼로리 590kcal`·`탄수화물 62g`·`단백질 18g`·`지방 12g` 모두 포함.
- **T-14 (AC-4.2 partial zero):** Given `nutrition:{protein:18,carbohydrate:0,fat:12,...}`
  / Then `탄수화물` 토큰 없음, `단백질 18g`·`지방 12g` 있음.
- **T-15 (AC-4.3 all zero):** Given `totalCalories:590`,
  `nutrition:{protein:0,carbohydrate:0,fat:0,...}` / Then `칼로리 590kcal` 있고
  `탄수화물`/`단백질`/`지방` 토큰 없음.
- **T-16 (AC-5.1 youtube dedup):** Given youtube recipe, `totalIngredientCost:2685`,
  `cookingTime:15` / Then description에서 `예상비용:` 괄호 표기 없음; `💰` 라인과
  `⏱️ 조리 시간: 15분`은 한 번씩. (`2685`·`15분` 중복 카운트 1회 영역만)
- **T-17 (AC-5.2 non-youtube keeps parenthetical):** Given non-youtube recipe(채널 없음),
  `totalIngredientCost:8000`, `cookingTime:30` / Then description에
  `(예상비용: 8,000원, 30분 소요)` 포함.
- **T-18 (AC-6.1):** Given JP recipe / When createRecipeStructuredData / Then Recipe JSON-LD
  `recipeCuisine === "Japanese"`.
- **T-19 (AC-6.2):** Given KR/국가 없음 recipe / Then `recipeCuisine === "Korean"`.
- **T-20 (AC-6.3):** Given OTHER recipe / Then JSON-LD에 `recipeCuisine` 키 없음
  (`"recipeCuisine" in data === false`).
- **T-21 (AC-7.1):** Given `totalIngredientCost:0`, `tags:["한식"]`, `cookingTime:45` / Then
  keywords에 `가성비요리`·`3000원요리`·`만원요리`·`알뜰요리` 모두 없음.
- **T-22 (AC-7.2):** Given `totalIngredientCost:3000` / Then keywords에 `가성비요리` 포함.
- **T-23 (AC-8.1 unit):** `formatSubscriberCount(1_000_000) === "100만명"`.
- **T-24 (AC-8.2 unit):** `formatSubscriberCount(1_500_000) === "150만명"`.
- **T-25 (AC-8.3 regression unit):** `formatSubscriberCount(20_000) === "2만명"`.
- **T-26 (AC-8.1 wiring/acceptance):** Given youtube recipe `youtubeSubscriberCount:1_000_000`
  / Then description에 `구독자 100만명` 포함, `1만명` 없음. (기존 line 27 테스트를 이 값으로
  갱신: 150만 픽스처 → `구독자 150만명`)
- **T-27 (AC-9.1):** Given 국가 없음, `tags:["다이어트"]` / Then title에 `[🇯🇵` 없음,
  `[🌍` 없음, `[다이어트🥗]` 있음.
- **T-28 (AC-9.2):** Given 국가 없음 + `tags:["셰프 레시피"]` / Then `[셰프레시피👨‍🍳]` 있음.
- **T-29 (AC-9.3):** Given JP recipe / Then keywords에 `일본 가정식`·`전세계 레시피`·
  `해외 레시피` 등 origin 검색어 없음.

## Traceability Matrix

| AC | Scenario | Test ID | Owner layer | Risk |
|----|----------|---------|-------------|------|
| AC-1.1 | JP 타이틀 시작 라벨 | T-01 | acceptance(generateRecipeMetadata) | cosmetic |
| AC-1.2 | JP > time/cost | T-02 | acceptance | integrity(우선순위) |
| AC-1.2 | JP > chef | T-03 | acceptance | integrity(우선순위) |
| AC-1.3 | JP 시간 표기 없음 | T-04 | acceptance | integrity |
| AC-1.4 | JP 출처 유지 | T-05 | acceptance | integrity |
| AC-2.1 | OTHER 시작 라벨 | T-06 | acceptance | cosmetic |
| AC-2.2 | OTHER 시간 없음 | T-07 | acceptance | integrity |
| AC-2.3 | OTHER > chef | T-08 | acceptance | integrity |
| AC-3.1 | 15분컷 dedup (=15) | T-09 | acceptance | integrity |
| AC-3.1 | 15분컷 dedup (<15) | T-10 | acceptance | integrity |
| AC-3.2 | 초간단 시간 유지 | T-11 | acceptance | integrity |
| AC-3.3 | 비-시간 브래킷 시간 유지 | T-12 | acceptance | integrity |
| AC-4.1 | 매크로 표시 | T-13 | acceptance | integrity |
| AC-4.2 | 0 매크로 생략 | T-14 | acceptance | integrity |
| AC-4.3 | 전부 0 → 칼로리만 | T-15 | acceptance | integrity |
| AC-5.1 | youtube 비용·시간 1회 | T-16 | acceptance | integrity |
| AC-5.2 | 비-youtube 괄호 유지 | T-17 | acceptance | integrity |
| AC-6.1 | JP → Japanese | T-18 | acceptance(createRecipeStructuredData) | integrity |
| AC-6.2 | KR/null → Korean | T-19 | acceptance | integrity |
| AC-6.3 | OTHER → 키 없음 | T-20 | acceptance | integrity |
| AC-7.1 | cost 0 → 키워드 없음 | T-21 | acceptance | integrity(없는 숫자) |
| AC-7.2 | cost>0 → 키워드 있음 | T-22 | acceptance | integrity |
| AC-8.1 | 1M → 100만명 | T-23 | unit(formatSubscriberCount) | integrity |
| AC-8.2 | 1.5M → 150만명 | T-24 | unit | integrity |
| AC-8.3 | 2만 회귀 | T-25 | unit | integrity |
| AC-8.1 | 1M description 와이어링 | T-26 | acceptance | integrity |
| AC-9.1 | KR 브래킷 불변 | T-27 | acceptance | cosmetic |
| AC-9.2 | KR+chef 셰프 유지 | T-28 | acceptance | integrity |
| AC-9.3 | origin 키워드 없음 | T-29 | acceptance | integrity |

**Owner-layer 메모:** AC-8은 포맷 산술의 owner가 순수함수 `formatSubscriberCount`(T-23~25,
unit). T-26은 unit이 못 잡는 것 — "≥100만 tier의 description이 그 함수를 실제로 태운다"는
와이어링 —만 검증한다(기존 line 27 change-detector를 올바른 기대값으로 교체하는 형태).
나머지 AC는 메타데이터 출력 자체가 사용자 seam이라 acceptance 1계층에서 owner.

## Non-goals (테스트 없음 — 의도적 부재)

- 출처 슬롯 문구 재작성 / origin 자연어 키워드 / meta keywords origin — no test
- OTHER cuisine 추정, 국가 세분화 — no test
- `[초간단⚡]` 등 비-숫자 브래킷 시간 제거 — no test (오히려 T-11이 "유지"를 가드)
- 영양 라인 나트륨·당 — no test
- 비-youtube description 영양 라인 신규 — no test
- 비용 브래킷 `[0천원💰]`(F5)·fallback "0원"(F6) — no test (범위 밖)

## 기존 테스트 영향 (갱신 필요)

- `recipeMetadata.youtube.test.ts:27` — `구독자 1.5만명` 기대값이 F2 버그를 인코딩. 150만
  픽스처 기준 `구독자 150만명`으로 갱신 (T-26과 동일 행동).
- `:186` "조리시간 … 30분 완성" — Famous(국가 없음, `cookingTime:30` → `[초간단⚡]`)라 시간
  유지 대상. AC-3.2와 일치, 영향 없음 (확인용).

## 순서 (incremental TDD — writing-plans 태스크 순서)

T-01(walking skeleton) → T-02~05 → T-06~08 → T-09~12 → T-13~15 → T-16~17 → T-18~20 →
T-21~22 → T-23~26 → T-27~29.
