# 다국어 UI 문구 셋 (ko/ja/en) — Test Design

> Slices: `2026-06-12-multilingual-ui-copy-slices.md` · Date: 2026-06-12 · Branch: feature/17

## 테스트 철학 (이 피처 특수성)

i18n 문자열 작업은 change-detector 함정이 크다. 3분할로 책임을 나눈다:

| 무엇 | 누가 소유 | 런타임 테스트 |
|---|---|---|
| **완전성** (ja/en 키 누락 없음) | `tsc --noEmit` 타입 게이트 (`Dictionary` = ko 파생) | **없음** |
| **품질** (번역이 자연스러운가) | PM 페르소나 사람 리뷰 | **없음** |
| **와이어링** (문자열이 locale로 구동되나) | "locale=ja ≠ ko 동일 요소" 렌더 테스트 | 있음 — 단, **특정 번역문 안 박음** |
| **진짜 로직** (plural·검색제목 보간·메타 분기·ko 무회귀) | 단위 테스트 | 있음 |

→ 번역 카피 문자열을 assert하지 않는다(PM이 고치면 깨지는 change-detector). 대신 *locale이
문자열을 바꾼다*는 불변식과, ko 무회귀 앵커(frozen 계약)만 핀으로 박는다.

## Traceability Matrix

| AC | Scenario (Given/When/Then) | Test ID | Owner layer | Risk |
|----|----|----|----|----|
| AC0.3 / AC6 | ja.ts·en.ts가 `Dictionary` 미충족 → 컴파일 실패 | **TC-type** | type-check (`tsc`) | integrity |
| AC0.1 | `getDictionary("ja")`→ja 객체, `getDictionary("ko")`→ko 객체 (locale 라우팅) | T-01 | unit | integrity |
| AC0.2 | skeleton namespace의 ko 값 = 현재 한국어 문자열 (무회귀 앵커) | T-02 | unit | integrity |
| AC1.1 | RecipeDetailView `locale="ja"` 렌더: 대표 read-path 헤더 텍스트가 `locale="ko"`와 **다르고** 비어있지 않다 | T-10 | acceptance (render) | cosmetic |
| AC1.4 | 같은 렌더 `locale="ko"`: 헤더 = 현재 한국어 문자열 (무회귀 앵커) | T-10 | acceptance (render) | integrity |
| AC1.2 | RecipeDetailView에 `notTranslatedMessage` 주어짐 → `role=status` 배너가 그 메시지를 렌더 | T-11 | acceptance (render) | integrity |
| AC1.3 | 깊은 인터랙션 시트는 KO 잔존 | — | **no test (non-goal 경계)** | — |
| AC2.1 | SearchClient `locale="ja"`(DictionaryProvider 래핑): 대표 chrome(빈 상태)가 ko와 다르다 | T-20 | acceptance (render) | cosmetic |
| AC2.2 | `buildSearchTitle("라멘", 12, 0, "ja")` → q "라멘"·건수 12가 보간되고 ko 출력과 다르다 | T-21 | unit | seo |
| AC2.3 | `buildSearchTitle("", 0, 0, locale)` → 각 locale의 no-q 기본 템플릿 (ja/en/ko) | T-22 | unit | seo |
| AC2.4 | `buildSearchTitle("라멘", 12, 0, "ko")` === 리팩터 전 정확 출력 (frozen 앵커) | T-23 | unit | integrity |
| AC3.1 | `generateLocalizedRecipeMetadata(r, id, {locale:"en", translated:true})` → `og:locale=en_US`, inLanguage en, **indexable** | T-30 | unit | seo |
| AC3.2 | 같은 빌더 `{locale:"en", translated:false}` → `robots.index=false` (noindex) | T-31 | unit | seo |
| AC3.1 | 같은 빌더 `{locale:"ja", translated:true}` → `og:locale=ja_JP` (회귀) | T-30 | unit | seo |
| AC3.3 | `/en/recipes/{없는id}` not-found 페이지 → 영어 not-found 카피, noindex/nofollow | T-32 | acceptance (render) | seo |
| AC3.4 | 공유 본문 추출 리팩터 후 ja 상세 동작·문구 무회귀 | T-10·T-11 재실행 | acceptance | integrity |
| AC4.1 | SearchClient `locale="en"` + `buildSearchTitle(...,"en")` → 영어 chrome·제목 | T-40·T-41 | acceptance+unit | seo |
| AC4.2 | `buildSearchTitle("ramen", 1, 0, "en")`→"1 recipe", `(…,2,…)`→"recipes"(복수) | T-41 | unit | integrity |
| AC4.2 | `plural(1,{one,other})`=one, `plural(0,…)`=other, `plural(2,…)`=other | T-42 | unit | integrity |
| AC4.3 | `buildSearchTitle("", 0, 0, "en")` → 영어 no-q 기본 (T-22에 en 포함) | T-22 | unit | seo |
| AC4.4 | `buildSearchTitle` ja/ko는 n=1·n=2에서 같은 단어 (plural 미적용 회귀) | T-42 | unit | integrity |
| AC5.1 | `generateLocalizedRecipeMetadata(...indexable)` → `alternates.languages`에 ko·ja·en·x-default | T-50 | unit | seo |
| AC5.2 | `{translated:false}`(noindex) → 자신을 indexable alternate로 광고 안 함 | T-51 | unit | seo |
| AC5.3 | ko 페이지 body 카피는 hreflang 추가로 안 바뀜 | T-10·T-20 (앵커) | acceptance | integrity |

## Non-goals (no test — 의도적 부재)

- 깊은 인터랙션 시트(신고·복사·평점·댓글·챗) 번역 — AC1.3.
- `[locale]` 재구조화 / next-intl / ko→`/ko` 이동 / 추가 언어 / 런타임 스위처.
- **번역 카피의 정확한 문자열** (PM 사람 리뷰 소유, 단위 테스트 대상 아님).

## Coverage gate 체크

- 모든 in-scope AC가 ≥1 test ID 보유 (AC0.3/AC6은 type-check가 소유 — "없음" 아님, 타입 게이트).
- 각 슬라이스에 acceptance-layer 테스트 존재: T-10(detail render), T-20/T-40(search render),
  T-32(en not-found). 나머지 메타·헬퍼는 unit이 owner(유저 seam = SERP 메타 출력·plural 결과).
- 같은 행동 중복 레이어 테스트 없음: 완전성은 type, 와이어링은 render 1개/surface, 카피 품질은
  사람. plural·메타 분기는 각자 lowest owner(pure fn)에서 1회.
- 모든 non-goal "no test" 명시.

## TDD 순서 (walking skeleton first)

TC-type(상시) → T-01 → T-02 → T-10 → T-11 → T-20 → T-21 → T-23 → T-22 →
T-30 → T-31 → T-32 → T-40 → T-41 → T-42 → T-50 → T-51.

각 test는 writing-plans에서 task의 failing test로 들어가며 이 ID를 인용한다.
