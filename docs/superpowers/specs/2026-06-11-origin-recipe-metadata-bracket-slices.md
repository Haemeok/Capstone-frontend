# 레시피 메타데이터 품질 패스 — Vertical Slices

- 날짜: 2026-06-11
- 설계 문서: `2026-06-11-origin-recipe-metadata-bracket-design.md`
- 관찰 단위: `generateRecipeMetadata` 반환값의 **타이틀/description/keywords**, 그리고
  `createRecipeStructuredData` 반환값의 **JSON-LD 필드**(`recipeCuisine` 등). "데모" =
  특정 레시피 입력 → 나오는 메타데이터 필드를 보여주는 것.

## Glossary (Ubiquitous Language — 개념당 한 단어)

| 단어 | 의미 |
| --- | --- |
| **국가 태그** | `recipe.creatorCountryTag` — 크리에이터(사람)의 국적 (`KR`\|`JP`\|`OTHER`\|null) |
| **origin 브래킷** | JP/OTHER 레시피 타이틀 맨 앞 라벨 슬롯 |
| **현지레시피** | JP 라벨 → `[🇯🇵현지레시피]` (= 리얼 일본인 크리에이터) |
| **전세계레시피** | OTHER 라벨 → `[🌍전세계레시피]` |
| **titleBracket** | 기존 단일 브래킷 (태그→시간→비용 중 하나) |
| **시간 브래킷** | 시간 기반 titleBracket — `[15분컷⏱️]`(≤15분), `[초간단⚡]`(≤30분) |
| **시간 표기** | 타이틀의 `N분 완성` 조각 (`timeText`) |
| **출처 슬롯** | `(출처: {channelName} 유튜브)` 조각 |
| **셰프 타이틀** | `chef-tv-show` 타입의 별도 타이틀 분기 |
| **영양 정보 라인** | description의 `🍽️ 1인분 기준: …` 조각 |
| **recipeCuisine** | 구조화 데이터의 요리 cuisine 필드 |
| **구독자 표기** | description의 `구독자 N만명` 문자열 (`formatSubscriberCount`) |

우선순위: **국가 > 셰프 > 태그/시간/비용**. 라벨 동의어 갈아끼우기 금지(현지레시피/전세계레시피).
국가 태그는 **크리에이터 국적**이지 요리 cuisine 보장이 아님.

## Non-goals (테스트 없음 — 의도적 부재)

- 출처 슬롯 문구 재작성
- description/H1/본문 origin 자연어 키워드 삽입, meta keywords origin 추가
- JP/OTHER 외 국가 세분화, OTHER cuisine 추정
- 원본 영상 임베드 강화
- `[초간단⚡]` 등 비-숫자 브래킷의 시간 표기 제거
- 영양 라인 나트륨·당 추가, 비-youtube description 영양 라인 신규 추가
- 비용 브래킷 `[0천원💰]`(F5)·fallback "0원"(F6)

---

## Slice 1 — JP 레시피 origin 타이틀 (walking skeleton)

JP 국가 태그가 타이틀 맨 앞 브래킷까지 흐르는 end-to-end 최소 스레드.

**AC**
- 국가 태그가 `JP`일 때, 타이틀은 `[🇯🇵현지레시피]`로 시작한다.
- 국가 태그가 `JP`이면서 태그/시간/비용 브래킷 조건 **또는 chef-tv-show 조건**에 해당해도
  origin 브래킷 타이틀이 우선한다 (국가 > 셰프 > 태그/시간/비용).
- 국가 태그가 `JP`일 때, 타이틀에 시간 표기(`N분 완성`)가 없다.
- 국가 태그가 `JP`일 때, 출처 슬롯 `(출처: {channelName} 유튜브)`은 유지된다.

## Slice 2 — OTHER 레시피 origin 타이틀

Slice 1과 같은 메커니즘, 라벨 매핑만 다르다.

**AC**
- 국가 태그가 `OTHER`일 때, 타이틀은 `[🌍전세계레시피]`로 시작한다.
- 국가 태그가 `OTHER`일 때, 타이틀에 시간 표기(`N분 완성`)가 없다.
- 국가 태그가 `OTHER`이면서 태그/시간/비용/셰프 조건에 해당해도 origin 브래킷이 우선한다.

## Slice 3 — 타이틀 시간 표기 중복 제거 (국가 무관)

**AC**
- 브래킷이 `[15분컷⏱️]`일 때, 타이틀에 시간 표기(`N분 완성`)가 없다.
- 브래킷이 `[초간단⚡]`일 때, 시간 표기는 유지된다.
- 태그/비용 브래킷이거나 브래킷이 없을 때, 시간 표기는 유지된다.

## Slice 4 — description 영양 정보 보강

영양 정보 라인이 약속한 "영양정보"를 실제로 채운다.

**AC**
- youtube 경로 description의 영양 정보 라인에 칼로리와 존재하는 매크로(탄수화물·단백질·지방)가
  표시된다 (`🍽️ 1인분 기준: 칼로리 Xkcal · 탄수화물 Yg · 단백질 Zg · 지방 Wg`).
- 값이 없거나 0인 매크로는 라인에서 생략된다.
- 매크로가 모두 0/없음일 때는 칼로리만 표시된다.

## Slice 5 — description 비용·시간 중복 제거

youtube description에서 비용·시간이 괄호와 상세 라인에 두 번 나오던 것을 한 번으로.

**AC**
- youtube 경로 description에서 비용·시간은 상세 라인(💰/⏱️)에만, 한 번씩 나타난다
  (`baseDescription`의 `(예상비용: …, … 소요)` 괄호 중복 없음).
- 비-youtube 경로 description은 기존 괄호 표기를 유지한다.

## Slice 6 — recipeCuisine 크리에이터 국적 매핑

구조화 데이터의 cuisine을 모든 레시피 "Korean" 단정에서 국적 기반 추정으로 교정.

**AC**
- 국가 태그가 `JP`인 레시피의 구조화 데이터 `recipeCuisine`은 `"Japanese"`이다.
- 국가 태그가 `KR`/없음인 레시피의 `recipeCuisine`은 `"Korean"`이다.
- 국가 태그가 `OTHER`인 레시피의 구조화 데이터에는 `recipeCuisine` 키가 없다.

## Slice 7 — 비용 키워드 0원 가드

**AC**
- `totalIngredientCost === 0`일 때, keywords에 비용 키워드(가성비요리·3000원요리·만원요리·
  알뜰요리)가 포함되지 않는다.
- `totalIngredientCost > 0`일 때, 해당 구간의 비용 키워드가 기존대로 포함된다.

## Slice 8 — 구독자수 100만+ 표기 수정

**AC**
- `subscriberCount === 1,000,000`일 때, 구독자 표기는 "100만명"이다.
- `subscriberCount === 1,500,000`일 때, "150만명"이다.
- `subscriberCount === 20,000`일 때, "2만명"이다 (회귀 가드).

## Slice 9 — 비대상 레시피 불변 (회귀 가드)

**AC**
- 국가 태그가 `KR`이거나 없을 때, origin 브래킷이 나타나지 않고 기존 태그→시간→비용
  titleBracket 로직이 유지된다 (시간 중복 규칙 Slice 3은 동일 적용).
- `chef-tv-show`이면서 국가 태그가 `KR`/없음인 레시피는 셰프 타이틀을 그대로 반환한다.
- meta keywords에는 origin 검색어가 추가되지 않는다.

---

## 순서

Slice 1(walking skeleton) → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9(회귀 가드 마지막).
타이틀(1–3) · description(4–5) · 구조화 데이터(6) · 키워드(7) · 구독자(8) · 불변(9).
