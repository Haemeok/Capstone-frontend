# 검색 진입 페이지(`/search`) i18n — 설계

> 브랜치: feature/17 · 작성: 2026-06-13
> 보드(`I18N-STATUS.md`) §3 "검색 진입 `/search`" 🔴 → ja/en 착수.
> `/search/results`는 이미 🟢. 본 작업은 **진입(디스커버리) 페이지**만.

## 1. 목표

`/search` 진입 페이지의 모든 사용자 노출 카피를 ja/en으로 제공한다.
**직역이 아니라** ja-pm/en-pm 페르소나가 현지 레시피 앱 말투로 재작성한
자연스러운 카피여야 한다(유저 핵심 요구). ko 루트(`/search`)는 무변경.

## 2. 결정 (확정)

- **가격대 섹션(`PriceRangeSection`, "지갑은 가볍게, 식탁은 든든하게")은 ja/en에서 숨김.**
  `maxCost` 필터가 KRW라 "5천원 이하" 직역은 표시≠실제필터 불일치를 만든다.
  통화 plumbing(보드 §4 '가격/통화 기호 분기' 전역 🔴)이 들어올 때 제대로 한다.
  쿠팡 ko-only 선례와 동일. → ja/en에서 `PRICE_RANGES` 번역 불필요.
- **CONTENT_PAGES 밈 카드 톤 = 현지적·차분한 톤.** 기존 페르소나(오늘의집/Ohou
  톤, no-hype)와 일관. 한국 밈("살 빠지는 게 죄면 무기징역") 직번역 ❌, 같은 훅을
  현지 레시피 앱이 쓸 차분한 말투로 재창작.

## 3. 번역 대상 surface (전부 `/search` 안)

| # | 위치 | 카피 | 비고 |
| - | ---- | ---- | ---- |
| 1 | `SearchInput` | 시간대별 롤링 placeholder (아침/점심/저녁 각 4개) | **요리 자체를 현지 요리로 교체**(번역 ❌). 글자수 예산 locale별 |
| 2 | `SearchInput` aria | "레시피 검색", "입력 지우기" | |
| 3 | `SaveButton` aria | "저장한 레시피북" | |
| 4 | `LatestRecipesSlide` | "따끈따끈한 최신 레시피" | |
| 5 | `SearchDiscoveryDefault` | "이런 레시피 어때요?" 헤딩 | |
| 6 | `ContentPageGrid` → `CONTENT_PAGES` | 12장 title+subtitle | 현지적·차분한 재창작 |
| 7 | `NutritionThemeSection` | "오늘은 어떤 한 끼가 끌려요?" 헤딩 | |
| 8 | `NUTRITION_THEMES` label/description | 테마 10개 | 키토/저당/위고비 등 — 현지 식단 용어 |
| 9 | `RecentSearchChips` (focused) | "최근 검색어", "지우기" | |
| 10 | `RecentlyViewedRecipes` (focused) | "최근 본 레시피", "지우기" | |
| — | `PriceRangeSection` | — | **ja/en 숨김** (번역 안 함) |

## 4. 메커니즘 (기존 패턴 답습)

1. **사전 먼저:** `Dictionary` 타입에 `searchDiscovery` 네임스페이스 추가 →
   `messages/{ko,ja,en}/searchDiscovery.ts` 동시 작성(타입이 누락 강제).
2. **상수 카피 이전:**
   - `CONTENT_PAGES`(유일 소비자 = ContentPageGrid): `id`/`searchParams`/`imageUrl`은
     상수 유지, `title`/`subtitle`은 dict로 이전(themeKey처럼 `id` 키로 매핑).
   - `NUTRITION_THEMES`(5곳 공유): 상수 구조(`values`/`icon`/key) **유지**, `label`/
     `description`만 locale 맵(`themeKey → {label, description}`)으로 병렬 추가.
     search-entry 섹션만 locale 라벨을 읽고, 다른 소비자는 기존 ko 상수 유지.
   - `PRICE_RANGES`: 손대지 않음(ja/en 미렌더).
3. **위젯 locale prop:** `SearchDiscoveryDefault`/`Focused`/하위 ui가 `locale` 받게.
   ko `/search`는 `locale="ko"`로 호출(순수 이동 리팩터). 가격 섹션은 `locale==="ko"`일 때만 렌더.
4. **로케일 래퍼:** `app/ja/search/page.tsx`, `app/en/search/page.tsx` — 기존
   `/search/page.tsx` 구조(prefetch + HydrationBoundary) 복제 + `locale` 전달.
5. **SEO:** `/search`는 이미 `robots: { index: false }` → hreflang/canonical 불필요.
   래퍼도 동일 noindex 메타. (디스커버리 페이지는 비색인이 의도)
6. **placeholder:** locale 사전의 시간대별 배열에서 생성. 시간대 버킷 로직(아침/점심/
   저녁) 구조는 유지, 문자열만 locale. 글자수 가드(`MAX_PLACEHOLDER_CHARS`)는 locale별로.
7. **검증:** `npx tsc --noEmit` + chrome 회귀(ko 그대로) 앵커.

## 5. PM 페르소나 디스패치 (핵심)

`docs/i18n/personas/{ja,en}-pm.md` 페르소나에 다음을 넘긴다:
- ko `searchDiscovery` dict 객체(구조 계약: 동일 키, placeholder 배열 형태 유지)
- 섹션별 컨텍스트 노트:
  - placeholder: "시간대별(아침/점심/저녁) 검색 유도 문구. **현지 가정식**으로 교체.
    `'…"○○ 레시피" 검색'` 패턴. 글자수 짧게(모바일 1줄)."
  - CONTENT_PAGES: "큐레이션 카드 훅. 같은 의도를 **현지 레시피 앱 차분한 말투**로.
    한국 밈 직번역 금지, 과장/감탄사 금지."
  - NUTRITION_THEMES: "식단 테마. 현지에서 통용되는 다이어트/영양 용어
    (예: 키토→keto/ケト, 위고비→GLP-1/Wegovy계, 저당→low-sugar/低糖質)."

## 6. Acceptance Criteria

- AC1: `/ja/search`·`/en/search` 진입 시, 디스커버리 화면의 **모든** 노출 카피가
  해당 언어로 보인다(헤딩·placeholder·카드·테마·focused 헤딩·aria). 한국어 잔존 0.
- AC2: placeholder가 **현지 요리**를 가리킨다(ja에 "북엇국" 직번역 같은 게 없다).
- AC3: ja/en `/search`에서 **가격대 섹션이 렌더되지 않는다**.
- AC4: ko `/search`는 시각·문자 그대로(가격 섹션 포함). 회귀 0.
- AC5: `NUTRITION_THEMES`를 공유하는 다른 화면(검색결과 필터·SEO)은 영향 없음(ko 유지).
- AC6: `npx tsc --noEmit` 통과(사전 키 누락은 타입에서 막힘).

## 7. Non-goals

- 가격대 섹션 ja/en 번역(통화 plumbing 후속).
- `NUTRITION_THEMES` 다른 소비자(검색결과 필터 등) 로케일화.
- `/search`에 hreflang/색인(비색인 의도).
- 언어 스위처/자동 리다이렉트(별도 brainstorming, 보드 §7).
- 검색 결과(`/search/results`) — 이미 완료.
- 백엔드 데이터 번역(레시피 카드 내용은 `?lang=`로 백엔드가 처리, 별도 축).

## 8. Glossary (씨앗)

- **discovery / 디스커버리** — `/search` 진입(검색 전) 큐레이션 화면. results와 구분.
- **placeholder rotation** — 시간대별 검색창 회전 문구.
- **content page card** — `CONTENT_PAGES` 큐레이션 카드(title+subtitle).
- **nutrition theme** — `NUTRITION_THEMES` 식단 테마 칩.
- **chrome** — UI 문자열(사전). vs content(백엔드 `?lang=`).
