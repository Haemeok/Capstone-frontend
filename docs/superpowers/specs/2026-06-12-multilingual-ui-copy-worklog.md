# 다국어 UI 문구 셋 (ko/ja/en) — Worklog & Handoff

> Branch: `feature/17` · 구현 완료일: 2026-06-13 · 상태: 구현 완료, **머지 전 수동 확인 필요**
> 설계 체인: design → slices → test-design → plan (`2026-06-12-multilingual-ui-copy-*.md`)

## 무엇을 만들었나

ko/ja/en UI 문구 다국어화. 콘텐츠(레시피 본문) 번역은 기존 백엔드 `lang=` 의존이 이미 있었고,
이번엔 **UI chrome 문구 레이어**를 새로 만들고 `/en` 라우트를 신설했다.

### 아키텍처 (`src/shared/i18n`)

- `types.ts` — `Locale = "ko"|"ja"|"en"`, `Dictionary`(명시 키 집합 — 인덱스 시그니처 없음 →
  키 누락 시 `tsc` 컴파일 실패가 1차 방어선), `Plural`.
- `messages/{ko,ja,en}.ts` — `Dictionary`를 만족하는 locale별 정적 객체. namespace:
  `errors` · `common`(미사용 정리됨) · `recipeDetail`(34키) · `search` · `meta.search` · `notFound`.
- `getDictionary(locale)` — 서버 컴포넌트용 동기 룩업.
- `DictionaryProvider` + `useT()` — 클라이언트(`'use client'`) 컴포넌트용 컨텍스트(prop drilling 회피).
- `format(template, vars)` / `plural(n, {one, other})` — `{token}` 보간 + en 복수형.
- `hreflang.ts` `buildHreflangAlternates(path)` — ko/ja/en + x-default URL 맵.

**접근 패턴**: 서버 컴포넌트는 `getDictionary(locale)` 직접, 클라 컴포넌트는 부모가 한 번 감싼
`DictionaryProvider`에서 `useT()`. RecipeDetailView(서버)가 `getDictionary(locale)`를 계산해
트리 전체를 `DictionaryProvider`로 감싼다.

### 커밋 (feature/17, `b5d7f32e`..`f972b9c3`)

| SHA | 내용 |
|---|---|
| b5d7f32e | format/plural 헬퍼 |
| 92f352df | typed dictionary + getDictionary (errors) |
| 5b1d73a7 | DictionaryProvider + useT |
| b306785d | walking skeleton: 상세 섹션 폴백 dict화 |
| 3c5f2663 | 상세 read-path chrome 사전화 (30키, ja/en 번역) |
| 5e6537d2 | 검색 제목/설명 locale화 + en 복수형 |
| 7ccbe5be | 검색 chrome dict (SearchClient provider) |
| b41f97f9 | ja 메타 → locale 일반화 (localizedRecipeMetadata) |
| 980ec62c | `/en/recipes/*` 라우트 신설 + 공유 본문 추출 |
| 7ac32f7c | `/en/search/results` 라우트 신설 |
| cff77e47 | **fix**: en 검색 결과 콘텐츠·카드 href plumbing |
| 8ba27e5d | hreflang alternates (indexable만) |
| f972b9c3 | **fix**: 누락 chrome 4건(코멘트·플레이팅·영상고정) |

### 검증된 것 (자동)

- 전체 `tsc --noEmit` 통과 (키 누락 = 컴파일 실패).
- i18n 영역 32 suites / 165 tests 통과: 와이어링 불변식(locale별 다름)·ko 무회귀 앵커·en 복수형·
  메타 og:locale/noindex/hreflang·검색 query key 격리·notTranslated 배너.
- read-path chrome에 비-DEFER/EXCLUDE 한국어 잔존 없음(grep 확인).

---

## ★ 머지 전 수동 확인 리스트 (자동 테스트가 못 잡는 것)

### 1. 번역 품질 — 네이티브 검수 (가장 중요)
ja/en 문구는 Claude가 PM 페르소나로 작성한 것 — **실제 네이티브 PM 검수가 아니다.** 특히:
- [ ] **ja `修正提案`(제보 버튼)** — 코드 리뷰가 "문서 섹션 제목처럼 읽힌다, 버튼은 `修正を提案` 또는 `報告`가 자연스럽다"고 지적. 확인 필요.
- [ ] **SERP 제목/설명 잘림** — ja `"{q} {count}件のレシピ - レシピオ"`, en `"{q} — {count} recipes | Recipio"`가 구글 검색결과 픽셀 예산(제목 ~600px) 안에 드는지.
- [ ] **고지문 법적 정확성** — en 쿠팡 고지가 수동태 "may be earned"인데 FTC는 1인칭("we may earn") 선호. en 영상 고지도 확인.
- [ ] 나머지 ja/en chrome 전반 (材料/栄養成分/おすすめの器/Recommended vessel 등) 어색함 여부.
- [ ] `messages/ja.ts`·`en.ts` 통독 1회.

### 2. 브라우저 시각 확인 (실제 렌더)
- [ ] `/ja/recipes/{번역된id}` · `/en/recipes/{번역된id}` — 긴 영어/일본어 텍스트로 버튼·헤더 레이아웃 안 깨지는지, 한국어 잔존 안 보이는지.
- [ ] `/ja/search/results?q=…` · `/en/search/results?q=…` — 검색 chrome·SERP 메타.
- [ ] 페이지 소스에서 en 번역 페이지의 hreflang(`<link rel="alternate" hreflang=…>`) 4개(ko/ja/en/x-default)·og:locale(en_US/ja_JP) 확인.

### 3. 백엔드 lang=en 실동작 확인
- [ ] 실제 en 번역된 레시피 ID로 `/en/recipes/{id}` 콘텐츠가 **영어로** 오는지.
- [ ] **미번역** ID로 KO 폴백 + 영어 notTranslated 배너 + `noindex` 뜨는지(ja gating 미러).
- [ ] `/en/search/results?q=ramen` 결과 카드가 **모든 페이지** 영어인지(page 0뿐 아니라 무한스크롤 다음 페이지도 — 이게 cff77e47 fix의 핵심), 카드 클릭 시 `/en/recipes/{id}`로 가는지.

### 4. 분리한 후속 작업의 중간 상태 (DEFER 영향)
- [ ] **구독자수 혼합 표기**: en 상세에서 `"subscribers 12.3万명"`처럼 영어 라벨 + 한국어 숫자단위가 섞여 보임(숫자포맷이 #14 DEFER라). 코드 리뷰가 "시각적으로 깨져 보인다"고 지적. **중간 상태로 수용할지, #14를 머지 전 당길지 결정 필요.**
- [ ] 조리시간 `${n}분`·인분 `${n}인분`·절약액 `${n}원`도 동일하게 en/ja에서 한국어 단위 잔존.

### 5. SEO/라우팅 부수 확인 (범위 밖이지만 점검 권장)
- [ ] sitemap에 `/en`·`/ja` 페이지 포함 여부(현재 미포함일 수 있음 — 별도 작업).
- [ ] `/en`·`/ja` 라우트 폴더가 기존 동적 세그먼트(`[^/]+`)·예약 세그먼트와 충돌 없는지.

---

## 의도적으로 안 한 것 (Non-goals / Deferred)

**DEFER — 후속(task #14, "chrome 우선" 사용자 결정으로 분리):**
- 숫자+단위 포맷팅: 구독자수(만명/천명/명), 조리시간(분), 인분, 절약액(원) → 로케일별 숫자 표기.
- `RecipeIngredientsSection` 절약 마케팅 카피("이 레시피는 약 {n}원 절약해요!" 류 어순 재구성).
- `RecipeCompleteButton`, `IngredientListItem`.

**EXCLUDE — 범위 밖 (의도된 KO 잔존, AC1.3 non-goal):**
- 깊은 인터랙션 시트: 재료 복사/신고 시트, 평점, 댓글 작성 폼, 챗, 제보 보상 문구. KO 그대로.
- `[locale]` 세그먼트 재구조화 / next-intl 도입 / ko 루트를 `/ko`로 이동 / ja·en 외 언어 / 런타임 locale 스위처.
- private 레시피 라우트(`/recipes/private/*`)의 자체 섹션 폴백 — ko 전용 라우트라 KO 유지.

## 알아둘 함정 (다음 작업자용)

- **타입 게이트는 키 누락만 잡지, inline 미추출 한국어는 못 잡는다.** 실제로 리뷰에서 chrome 4건이
  타입 통과 상태로 누락돼 있었다. 새 read-path 문구 추가 시 `git grep -nP "[가-힣]"`로 직접 확인.
- **공유 컴포넌트를 client+`useT()`로 바꾸면 모든 렌더 사이트에 `DictionaryProvider` 필요** —
  `useT()` provider 부재는 런타임 에러라 tsc가 못 잡는다. private 페이지가 RecipeVideoSection 등을
  공유해서 함께 provider를 받아야 했다.
- **검색 결과 콘텐츠 plumbing은 chrome과 별개다.** `useSearchResults`/`buildSearchQueryKey`/
  `buildSearchQueryParams`에 locale을 ja처럼 1급으로 넣어야 서버 prefetch와 client fetch가 일치하고
  다음 페이지도 같은 lang으로 온다(cff77e47에서 en 누락분 수정).
