# 국가 origin 메타데이터 브래킷 (Origin Recipe Metadata Bracket)

- 날짜: 2026-06-11
- 영역: `src/entities/recipe/lib/metadata/recipeMetadata.ts`

## 배경 / 동기

레시피오는 이제 국제 레시피(특히 일본 가정식)를 지원한다. 차별점은 **한국에서 실제
현지 유튜브 채널을 보며 따라 요리할 수 있다**는 것이다. 그러나 현재 상세페이지 메타데이터
타이틀에서 이 차별점은 `(출처: ○○ 유튜브)`로 타이틀 맨 끝에 붙어, 한글 SERP가 잘리는
지점(~30자) 너머로 밀려 가장 안 읽히는 픽셀에 위치한다.

타이틀의 가장 가치 있는 자리는 맨 앞 브래킷(스캔 앵커)이다. 국제 레시피라면 시간·비용 같은
범용 후크보다 "현지성"이 훨씬 강한 클릭 동인이다.

데이터는 이미 존재한다: `StaticRecipe.creatorCountryTag: "KR" | "JP" | "OTHER"`
(`src/entities/recipe/model/types.ts`). 신규 데이터 적재 없이 메타데이터 레이어만 손대면 된다.

## 설계

`recipeMetadata.ts`의 titleBracket 선정 로직 맨 앞(기존 `tagKeywordMap` 루프 위)에
`creatorCountryTag` 기반 origin 브래킷 분기를 최우선 슬롯으로 추가한다.

### 규칙

- `creatorCountryTag === "JP"` → 브래킷 `[🇯🇵현지레시피]`
- `creatorCountryTag === "OTHER"` → 브래킷 `[🌍전세계레시피]`
- `KR` / `null` / `undefined` → origin 브래킷 없음, 기존 `tag → time → cost` 우선순위 그대로
- origin 브래킷은 tag/time/cost보다 **항상 우선**한다. (있으면 그 브래킷이 슬롯을 차지)
- **JP/OTHER 레시피는 timeText(`N분 완성`)를 타이틀에서 생략한다.** 픽셀을 차별점
  (브래킷 + 일본어 채널명 출처)에 몰아주기 위함.

### 변경하지 않는 것

- 출처 슬롯 `(출처: ${channelName} 유튜브)` — 그대로. JP 채널명이 일본어 원문이라 그
  자체가 정통성 시그널이다.
- description — 그대로. (시간 롱테일은 description의 자연어 "○분" 표현이 떠받친다;
  `generateYoutubeDescription`이 `⏱️ 조리 시간: ${cookingTime}분`을 포함)
- meta keywords — origin 검색어를 추가하지 않는다. (구글은 2009년부터 meta keywords를
  랭킹에 사용하지 않으며, 경쟁사에 타겟 키워드만 노출하는 부작용만 있다)
- `chef-tv-show` 타이틀 분기 — 영향 없음. 셰프 우선순위 유지.

### 예시

```
[🇯🇵현지레시피] 오야코동 (출처: きょうの料理 유튜브) | 레시피오
[🌍전세계레시피] 감바스 (출처: Spain on a Fork 유튜브) | 레시피오
```

## SEO 근거 (의사결정 기록)

- 타이틀에서 시간을 빼도 안전한 **진짜 이유**는, 시간 롱테일("오야코동 25분")을 떠받치는
  것이 description/본문의 자연어 시간 토큰이기 때문이다.
- JSON-LD `totalTime`은 **리치결과 표시용 메타데이터**(레시피 카드의 조리시간 아이콘)이지
  텍스트 랭킹 신호가 아니다. 구글은 구조화 데이터를 공식적으로 "랭킹 부스트 아님"으로
  규정했다. 따라서 totalTime은 시간 롱테일의 안전장치가 아니며, description에서 시간 표현이
  사라지면 totalTime은 이를 백업하지 못한다.
- origin 관련성("일본 가정식" 등)을 정말 노리려면 meta keywords가 아니라 title 브래킷 +
  description 첫 문장 + H1의 자연어로 잡아야 한다. (이번 범위 밖)

## Acceptance Criteria

- JP 태그 레시피 → 타이틀이 `[🇯🇵현지레시피]`로 시작한다.
- OTHER 태그 레시피 → 타이틀이 `[🌍전세계레시피]`로 시작한다.
- KR / 태그 없음 레시피 → 기존 동작 그대로. origin 브래킷이 나타나지 않고 `N분 완성`이
  유지된다.
- JP 레시피가 동시에 15분컷/다이어트 등이어도 → 브래킷은 origin 브래킷이 차지한다.
- JP/OTHER 타이틀에는 `N분 완성`이 들어가지 않는다. 시간 롱테일은 description/본문의 자연어
  시간 표현이 담당하며, JSON-LD totalTime은 리치결과 표시용으로 별개 존재한다(안전장치 아님).
- `chef-tv-show` 레시피 → 영향 없음 (셰프 타이틀 그대로).
- meta keywords에는 origin 검색어를 추가하지 않는다.

## Non-goals

- 출처 슬롯 문구 재작성 (cook-along 카피 등).
- description / H1 / 본문에 origin 자연어 키워드 삽입 (별도 작업).
- JP/OTHER 외 국가 세분화(중식🇨🇳·양식 등 개별 국기). 현재 데이터가 `KR|JP|OTHER`뿐이므로
  OTHER는 🌍로 통일한다.
- 상세페이지에 원본 영상 임베드를 강화하는 작업.
