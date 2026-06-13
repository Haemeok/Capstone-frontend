# 검색 진입 페이지 i18n — 수직 슬라이스

> 브랜치: feature/17 · 작성: 2026-06-13
> 설계: `2026-06-13-search-discovery-i18n-design.md`
> 각 슬라이스 = `/ja/search`·`/en/search`에서 **데모 가능한** 한 가닥. 레이어("사전
> 추가"/"래퍼 추가")로 쪼개지 않는다 — 사전 슬라이버·래퍼는 그걸 처음 쓰는 슬라이스 안에 든다.

## Glossary (Ubiquitous Language)

| 단어 | 의미 |
| ---- | ---- |
| **디스커버리(discovery)** | `/search` 진입(검색 전) 큐레이션 화면. 검색결과(results)와 구분 |
| **placeholder rotation** | 검색창의 시간대별 회전 유도 문구 |
| **큐레이션 카드(curation card)** | `CONTENT_PAGES` 한 장(title+subtitle) |
| **nutrition theme** | `NUTRITION_THEMES` 식단 테마 칩(label+description) |
| **가격대 섹션(price section)** | `PriceRangeSection`. ja/en 비렌더 |
| **focused 모드** | 검색창 포커스(`?focused=1`) 상태 — 최근 검색어/최근 본 |
| **chrome** | UI 문자열(사전). vs content(백엔드 `?lang=`) |
| **로케일 래퍼** | `app/{ja,en}/search/page.tsx` 얇은 래퍼 |

## Out of Scope (non-goals — 테스트 없음)

- 가격대 섹션 ja/en 번역 (통화 plumbing 후속)
- `NUTRITION_THEMES` 다른 소비자(검색결과 필터·SEO·nutrition util) 로케일화
- `/search` hreflang/색인 (비색인 의도)
- 언어 스위처/자동 리다이렉트 (별도 brainstorming)
- `/search/results` (이미 완료)
- 백엔드 데이터 번역(레시피 카드 내용)

## Slices (순서 = 구현 순서)

### S0 — 로케일 디스커버리 셸 (walking skeleton)

가장 얇은 end-to-end 가닥: 래퍼 라우트 + `searchDiscovery` 사전(정적 키만) +
위젯 `locale` prop 배선이 한 번에 증명된다. 가격 섹션 숨김도 여기서 확정.

- **AC0.1:** `/ja/search` 진입 시 정적 헤딩("이런 레시피 어때요?", "오늘은 어떤 한 끼가
  끌려요?")·최신 슬라이드 제목("따끈따끈한 최신 레시피")·검색창 aria가 **일본어**로 렌더된다.
- **AC0.2:** `/en/search`도 동일하게 **영어**로 렌더된다.
- **AC0.3:** ja/en `/search`에서 **가격대 섹션이 렌더되지 않는다.**
- **AC0.4:** ko `/search`는 헤딩·가격 섹션·aria 모두 한국어 그대로(회귀 0).
- **AC0.5:** `searchDiscovery` 사전 키 누락 시 `npx tsc --noEmit` 실패(타입 게이트 작동).

### S1 — 시간대별 현지 요리 placeholder

- **AC1.1:** ja/en 검색창 placeholder가 현재 시간대(아침/점심/저녁) 버킷의 **현지 가정식**을
  가리킨다(ja에 "북엇국" 같은 한국 요리 직번역이 없다).
- **AC1.2:** ko placeholder는 기존 한국 요리·문구 그대로(회귀 0).
- **AC1.3:** 모든 locale placeholder가 글자수 가드 내(개발 모드 오버플로 경고 0).

### S2 — 큐레이션 카드 현지 재작성

- **AC2.1:** ja/en "이런 레시피 어때요?" 12장 카드 title+subtitle이 **현지 차분한 톤**으로
  보인다(한국 밈 직번역·과장/감탄사 없음).
- **AC2.2:** 카드의 링크(searchParams)·이미지는 ko와 동일하게 작동(필터 깨짐 0).
- **AC2.3:** ko 카드 문구 회귀 0.

### S3 — 현지 식단 테마

- **AC3.1:** ja/en 테마 칩 10개 label/description이 **현지 식단 용어**로 보인다
  (예: 키토→ケト/keto, 위고비→GLP-1/Wegovy계, 저당→低糖質/low-sugar).
- **AC3.2:** `NUTRITION_THEMES`를 공유하는 검색결과 필터·SEO 화면은 영향 없음(ko 유지).
- **AC3.3:** 테마 칩 링크(nutrition href)는 동일 작동.

### S4 — focused 모드 현지화

- **AC4.1:** ja/en에서 검색창 포커스(`?focused=1`) 시 "최근 검색어"·"최근 본 레시피"·
  "지우기"가 해당 언어로 보인다.
- **AC4.2:** ko focused 모드 회귀 0.

## 공통 회귀 (모든 슬라이스에 매달림, 별도 슬라이스 아님)

- ko 루트(`/search`)는 시각·문자 그대로. 각 슬라이스가 자기 영역 ko 앵커를 든다.
