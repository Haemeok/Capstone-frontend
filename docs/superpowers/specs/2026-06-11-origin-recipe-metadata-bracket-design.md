# 레시피 메타데이터 품질 패스 — origin 브래킷 + 중복 제거 + 영양/구조화 데이터 교정

- 날짜: 2026-06-11
- 영역: `src/entities/recipe/lib/metadata/{recipeMetadata,seo,schema,youtube}.ts`

## 배경 / 동기

레시피오는 이제 국제 레시피를 지원한다. 차별점은 **한국에서 실제 일본인(현지) 크리에이터의
유튜브를 보며 따라 요리할 수 있다**는 것이다. 이 차별점을 상세페이지 메타데이터에 드러내는
작업을 하던 중, 같은 타이틀/설명/구조화 데이터에서 여러 품질 문제가 함께 발견되어 한 패스로
잡는다.

핵심 데이터 의미: **`creatorCountryTag`는 크리에이터(사람)의 국적**이지, 그 레시피가 해당
국가의 요리라는 보장이 아니다. 따라서 origin 브래킷은 "리얼 일본인 크리에이터의 레시피"라는
*사람* 어필이다(요리 cuisine 단정이 아님). cuisine을 직접 알려주는 필드는 없다.

데이터: `StaticRecipe.creatorCountryTag: "KR" | "JP" | "OTHER" | null`,
`StaticRecipe.nutrition: { protein, carbohydrate, fat, sugar, sodium }`,
`StaticRecipe.totalCalories`, `youtubeSubscriberCount` 등. 신규 적재 없이 메타데이터
레이어만 손댄다.

## 설계

### A. 국가 origin 브래킷 (최우선)

`recipeMetadata.ts`에서 `creatorCountryTag`를 **가장 먼저** 검사한다.

- `JP` → 브래킷 `[🇯🇵현지레시피]`
- `OTHER` → 브래킷 `[🌍전세계레시피]`
- `KR` / null/없음 → origin 브래킷 없음, 기존 `tag → time → cost` 우선순위

규칙:

- **국가가 가장 우선이다.** origin 브래킷은 태그/시간/비용 브래킷은 물론 **`chef-tv-show`
  분기보다도 우선한다.** JP/OTHER 레시피는 chef-tv-show 조건에 해당해도 origin 타이틀로
  렌더된다 (국가 > 셰프 > 태그/시간/비용).
- JP/OTHER 레시피는 **timeText(`N분 완성`)를 타이틀에서 생략**한다.
- 출처 슬롯 `(출처: ${channelName} 유튜브)`은 그대로. JP 채널명이 일본어 원문이라 그 자체가
  정통성 시그널이다.

```
[🇯🇵현지레시피] 오야코동 (출처: きょうの料理 유튜브) | 레시피오
[🌍전세계레시피] 감바스 (출처: Spain on a Fork 유튜브) | 레시피오
```

### B. 타이틀 시간 표기 중복 제거 (국가 무관)

브래킷이 시간 숫자를 이미 포함할 때 timeText를 생략한다.

- 브래킷이 `[15분컷⏱️]`(cookingTime ≤ 15, "15" 포함) → timeText 생략.
- 브래킷이 `[초간단⚡]`(16~30분, 숫자 없음) → timeText 유지.
- 태그/비용 브래킷, 또는 브래킷 없음 → timeText 유지.

```
변경 전: [15분컷⏱️] 마늘쫑 비빔밥 15분 완성 (출처: 바니얌 baniyum 유튜브) | 레시피오
변경 후: [15분컷⏱️] 마늘쫑 비빔밥 (출처: 바니얌 baniyum 유튜브) | 레시피오
```

### C. description 영양 정보 보강

`seo.ts`의 `generateYoutubeDescription` 내 `🍽️ 1인분 기준:` 라인에 매크로를 추가한다.

- `🍽️ 1인분 기준: 칼로리 Xkcal · 탄수화물 Yg · 단백질 Zg · 지방 Wg` 형태.
- 값이 없거나 0인 매크로는 생략. (모두 0이고 칼로리만 있으면 칼로리만)
- 나트륨·당은 제외. 비-youtube(standard) description에 영양 라인을 신규 추가하지 않음.

### D. description 비용·시간 중복 제거

현재 youtube description은 비용·시간을 **두 번** 보여준다: `baseDescription`의 괄호
`(예상비용: 2,685원, 15분 소요)` + 아래 `💰 예상 재료비` / `⏱️ 조리 시간` 상세 라인.

- youtube 내러티브 경로(`youtubeMetadata && recipeType !== "chef-tv-show"`)에서는
  `additionalInfo` 괄호를 description에 붙이지 않는다. 상세 라인(💰/⏱️)이 더 풍부하게
  담당한다.
- 비-youtube 경로는 괄호를 유지한다(상세 라인이 없으므로).

### E. recipeCuisine 크리에이터 국적 매핑 (구조화 데이터 교정)

현재 `schema.ts`는 모든 레시피에 `recipeCuisine: "Korean"`을 하드코딩한다. cuisine 데이터가
없으므로 정확히는 알 수 없지만, **크리에이터 국적을 약한 사전확률로** 사용한다(보장 아님).

- `KR` / null/없음 → `recipeCuisine: "Korean"` (유지)
- `JP` → `recipeCuisine: "Japanese"`
- `OTHER` → `recipeCuisine` **생략** (특정 국가 미상이라 cuisine을 단정하지 않음)

### F. 비용 키워드 0원 가드

현재 `recipeMetadata.ts`의 dynamicKeywords 비용 분기는 `totalIngredientCost > 0` 가드가
없어, 비용 데이터가 없는(0원) 레시피에 "가성비요리·3000원요리" 키워드가 붙는다(없는 숫자).
타이틀 비용 브래킷과 동일하게 `> 0` 가드를 추가한다.

### G. 구독자수 100만+ 표기 수정

`youtube.ts`의 `formatSubscriberCount`는 ≥1,000,000 분기에서 `floor(count/10000)/100`로
계산해 `1,000,000`을 "1만명"으로(100배 축소) 표시한다. ≥10,000 분기가 이미 `100만명`을 올바로
처리하므로 **버그 분기를 제거**한다.

- `1,000,000` → `100만명`, `1,500,000` → `150만명`.

## SEO 근거 (의사결정 기록)

- 타이틀에서 시간을 빼도(중복 제거해도) 안전한 이유는, 시간 롱테일을 description/본문의
  **자연어 시간 토큰**이 떠받치기 때문이다. JSON-LD `totalTime`은 리치결과 표시용이지 텍스트
  랭킹 신호가 아니며(구글 공식 "랭킹 부스트 아님"), 시간 표현의 안전장치가 아니다.
- meta keywords는 구글이 2009년부터 무시한다. origin 관련성은 title 브래킷 + description
  자연어로 잡는다.
- `recipeCuisine`은 cuisine 실데이터가 없어 어떤 값도 추정이다. "가장 틀릴 자리(OTHER 외국
  크리에이터)"에서만 단정을 빼고, 사전확률이 높은 KR/JP는 매핑하는 절충을 택했다.

## Acceptance Criteria

**A. origin 브래킷**
- JP → 타이틀이 `[🇯🇵현지레시피]`로 시작.
- OTHER → 타이틀이 `[🌍전세계레시피]`로 시작.
- JP/OTHER가 태그/시간/비용 또는 chef-tv-show 조건에 해당해도 origin 브래킷이 우선.
- JP/OTHER 타이틀에는 `N분 완성`이 없다.
- JP/OTHER 타이틀의 출처 슬롯은 유지된다.

**B. 타이틀 시간 중복**
- 브래킷이 `[15분컷⏱️]` → 타이틀에 `N분 완성` 없음 (국가 무관).
- 브래킷이 `[초간단⚡]` → `N분 완성` 유지.
- 태그/비용 브래킷 또는 브래킷 없음 → `N분 완성` 유지.

**C. 영양 보강**
- youtube description의 `🍽️` 라인에 칼로리 + 존재하는 매크로(탄·단·지)가 표시된다.
- 매크로가 모두 0/없음 → 칼로리만.

**D. description 비용·시간 중복**
- youtube description에서 비용·시간이 한 번씩만(상세 라인에만) 나타난다. 괄호 중복 없음.
- 비-youtube description은 기존 괄호 표기를 유지한다.

**E. recipeCuisine**
- JP 레시피의 구조화 데이터 `recipeCuisine`은 `"Japanese"`.
- KR/null 레시피의 `recipeCuisine`은 `"Korean"`.
- OTHER 레시피의 구조화 데이터에는 `recipeCuisine` 키가 없다.

**F. 비용 키워드 가드**
- `totalIngredientCost === 0` → keywords에 "가성비요리/3000원요리/만원요리/알뜰요리"가 없다.
- `totalIngredientCost > 0` → 기존대로 해당 비용 키워드가 들어간다.

**G. 구독자 표기**
- `subscriberCount === 1,000,000` → "100만명"으로 표시된다.
- `subscriberCount === 20,000` → "2만명" (회귀 없음).

**불변**
- KR/null → origin 브래킷 미출현, 기존 브래킷 로직 유지(B 규칙은 동일 적용).
- chef-tv-show이면서 KR/null → 셰프 타이틀 유지.
- meta keywords에 origin 검색어 추가 없음.

## Non-goals

- 출처 슬롯 문구 재작성.
- description / H1 / 본문에 origin 자연어 키워드 삽입.
- meta keywords에 origin 검색어 추가.
- JP/OTHER 외 국가 세분화(개별 국기), OTHER의 cuisine 추정.
- 원본 영상 임베드 강화.
- `[초간단⚡]` 등 비-숫자 브래킷에서 timeText 제거.
- 영양 라인에 나트륨·당 추가, 비-youtube description에 영양 라인 신규 추가.
- 비용 브래킷 `[0천원💰]`(F5)·fallback "0원"(F6) — 이번 범위 밖(별도).
