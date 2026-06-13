# 테스트 설계 — 생성·추출·재료 fetch 데이터 현지화

> 작성일: 2026-06-13 · 브랜치: feature/17 · 슬라이스: `2026-06-13-i18n-create-flows-data-slices.md`

## FE 테스트 가능 경계 (먼저 읽기)

FE가 검증할 수 있는 계약은 **"나가는 요청이 active locale의 `lang`을 싣는다"**(+ locale 해석 로직)뿐이다.
"완료된 본문이 ja로 온다"는 **백엔드 동작**이라 FE에서 모킹해 단언하면 우리 모킹을 테스트하는 꼴 →
**BE 통합 경계로 표시하고 FE 테스트는 두지 않는다**(아래 매트릭스 `BE경계` 표기). 기존 레포 패턴
(`getLocalizedIngredientOnServer.test` = fetch URL에 `lang=ja` 단언)과 동일한 seam을 쓴다.

전 항목 risk = **integrity**(언어 데이터 정합성). security/billing 없음 → 불변식 수준 깊이, 적대적 패스
불필요.

## 시나리오 (구체 예시 — Given/When/Then)

### locale 해석 (슬라이스 1에서 생성되는 공유 sliver)

- **resolveLocaleFromPath (순수 함수, owner=unit)**
  - `"/ja"` → `"ja"`; `"/ja/recipes/new/ai"` → `"ja"`; `"/en"` → `"en"`
  - `"/"` → `null`; `"/recipes/new/youtube"` → `null`; `"/january"` → `null`(정확한 세그먼트만 prefix)
- **useApiLocale (composition, owner=hook)** — pathname 우선 → 저장값 fallback → `ko`
  - pathname `"/recipes"` + stored `"ja"` → `"ja"`
  - pathname `"/recipes"` + stored 없음 → `"ko"`
  - pathname `"/en"` + stored `"ja"` → `"en"`(pathname이 저장값을 이김)

### 슬라이스 1 — 재료 fetch

- ja 재료 검색: `getIngredients({category:null, q:"감자", ..., locale:"ja"})` → fetch URL `…?…&lang=ja`
- en: `locale:"en"` → URL `…&lang=en`
- ko 회귀: `locale:"ko"`(또는 미지정) → URL에 `lang=` 없음
- 미지원 locale degrade: `locale:"en"`이고 BE가 ko를 반환 → 함수가 throw 없이 content 반환(FE 분기 없음)

### 슬라이스 2 — 유튜브 추출

- ja 추출: `createExtractionJobV2(url, key, model, "ja")` → POST params에 `lang=ja`
- en: `…, "en"` → `lang=en`
- 중복 체크: `checkYoutubeDuplicate(url, "ja")` → GET params에 `lang=ja`
- 서버 trending: `getTrendingYoutubeRecipesOnServer("ja")` → fetch URL에 `lang=ja`(locale별 URL 분리 →
  캐시 미혼합)
- ko 회귀: `"ko"`/미지정 → `lang=` 없음

### 슬라이스 3 — AI 생성

- ja 생성: `createAIRecipeJobV2(aiRequest, "INGREDIENT_FOCUS", key, model, "ja")` → params에 `lang=ja`
- en: `…, "en"` → `lang=en`
- concept 독립성: `concept="FINE_DINING"`이어도 `lang=ja` 그대로 부착(concept에 하드코딩 안 됨)
- ko 회귀: `"ko"`/미지정 → `lang=` 없음

## 추적 매트릭스

| AC | 시나리오 | Test ID | Owner | Risk |
| --- | --- | --- | --- | --- |
| **슬라이스 1** | | | | |
| AC1-1 | `/ja` 재료 조회 → URL `lang=ja` | T-05 | integration(api fn) | integrity |
| AC1-2 | `/en` 재료 조회 → URL `lang=en` | T-05 | integration | integrity |
| AC1-3 | prefix 없음 + stored `ja` → `lang=ja` | T-02 ∘ T-05 | hook+integration | integrity |
| AC1-4 | prefix·stored 없음 → `lang=` 없음(ko 회귀) | T-06 | integration | integrity |
| AC1-5 | BE 미지원 locale → 에러 없이 ko 데이터 | T-05(en) | integration | integrity |
| 해석 | resolveLocaleFromPath 6 케이스 | T-01 | unit | integrity |
| 해석 | useApiLocale 우선순위/fallback 3 케이스 | T-02 | hook | integrity |
| (본문 ja 표시) | 완료 콘텐츠 언어 | **BE경계** | — | — |
| **슬라이스 2** | | | | |
| AC2-1 | ja 추출 요청 → `lang=ja` | T-09 | integration | integrity |
| AC2-2 | en 추출 요청 → `lang=en` | T-09 | integration | integrity |
| AC2-3 | 중복 체크 요청 → active locale `lang` | T-10 | integration | integrity |
| AC2-4 | 서버 trending → `lang=ja`, 캐시 미혼합 | T-11 | integration(server) | integrity |
| AC2-5 | ko 회귀 → `lang=` 없음 | T-12 | integration | integrity |
| (본문 ja) | 완료 레시피 언어 | **BE경계** | — | — |
| **슬라이스 3** | | | | |
| AC3-1 | ja 생성 요청 → `lang=ja` | T-13 | integration | integrity |
| AC3-2 | en 생성 요청 → `lang=en` | T-13 | integration | integrity |
| AC3-3 | 4개 concept 모두 lang 전파(concept 독립) | T-14 | integration | integrity |
| AC3-4 | ko 회귀 → `lang=` 없음 | T-15 | integration | integrity |
| (본문 ja) | 완료 레시피 언어 | **BE경계** | — | — |

### Owner-layer 메모 (중복 방지)

- "요청이 lang을 싣는다"는 각 흐름의 **api 함수 seam**이 소유(T-05/09/10/11/12/13/14/15).
- "active locale 해석"은 **resolveLocaleFromPath(unit)** + **useApiLocale(hook)** 가 소유(T-01/02).
- **컴포넌트 글루**(컴포넌트가 `useApiLocale()`를 불러 api 함수에 넘김)는 **별도 테스트 없음** — 양끝
  (해석/계약)이 이미 소유, 통과만 하는 얇은 패스스루라 재검증은 change-detector. AC1-3는 그 합성
  (T-02 → T-05)으로 커버.
- renderHook 주의(메모리): `useApiLocale` 훅 테스트는 **안정 참조**로 인자 주입(인라인 리터럴 금지 →
  무한루프/OOM 회피).

## Non-goals (테스트 없음 — 의도적 부재)

- job **status 폴링** lang 부착 — no test.
- 전역 `apiClient` locale 주입 / `preferred_locale` PUT — no test.
- 이 페이지들의 **UI 카피 번역** — no test(별도 작업이 소유).
- **en 라우트 디렉토리 신설** — no test.
- **백엔드 locale 지원/번역 백필** — no test(BE경계).
- 세 흐름 밖 앱 전역 SSR locale 갭 — no test.

## TDD 순서 (walking skeleton → 엣지)

1. T-01 (resolveLocaleFromPath) → T-02 (useApiLocale) — 공유 해석 sliver
2. T-05 (ja/en) → T-06 (ko 회귀) — 슬라이스 1 계약
3. T-09 → T-10 → T-11 → T-12 — 슬라이스 2
4. T-13 → T-14 → T-15 — 슬라이스 3

이 순서가 writing-plans의 task 순서가 된다. 각 task의 실패 테스트는 매트릭스의 Test ID를 인용한다.
