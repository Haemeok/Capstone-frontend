# 국제화(i18n) 현황 — 페이지별 진행 보드

> 프로젝트 전체 다국어(ko/ja/en) 작업의 **러프한 페이지별 현황판**.
> 각 에이전트는 작업하면서 이 파일의 해당 행 상태를 갱신하고, 맨 아래
> "참고사항 / 남은 Task"에 발견·결정·블로커를 적는다.
>
> 갱신일: 2026-06-13 · 브랜치: feature/17

---

## 1. 아키텍처 요약 (새로 합류하는 에이전트는 여기부터)

**접근:** additive 정적 세그먼트. ko는 루트(`/...`) 무변경, 다른 로케일은
`src/app/ja/`, `src/app/en/` 폴더에 **얇은 래퍼**를 둔다. next-intl
마이그레이션은 후속 Phase (URL 계약 `/ja/...`가 동일해 SEO 비용 0).

- **로케일:** `ko`(기본/루트) · `ja` · `en` — `src/shared/i18n/types.ts` `LOCALES`
- **데이터 번역:** 백엔드 V3가 `?lang=ja|en`로 번역 응답. ko 데이터·URL·코드는 안 건드림
- **UI 문자열(chrome) 번역:** `src/shared/i18n/` 사전 시스템
  - `messages/{ko,ja,en}.ts` — 타입드 사전 (`Dictionary` 타입이 강제)
  - 서버: `getDictionary(locale)` → `t.recipeDetail.xxx`
  - 클라이언트: `<DictionaryProvider>` + `useT()`
  - 복수형/치환: `format()`, `plural()`
- **SEO:** `buildHreflangAlternates()`로 hreflang 방출, locale별 canonical/robots
- **공유 렌더 패턴:** 페이지 본문은 위젯의 `server/renderLocalized*.tsx`로 추출하고,
  `app/{locale}/.../page.tsx`는 `locale` prop만 넘기는 래퍼. 예:
  - `widgets/RecipeDetailView/server/renderLocalizedRecipePage.tsx`
  - `widgets/SearchClient/server/renderLocalizedSearchPage.tsx`

**현재 사전이 커버하는 네임스페이스:** `search`, `meta.search`, `errors`,
`notFound`, `recipeDetail` 뿐. 새 페이지를 국제화하려면 **먼저 `Dictionary` 타입에
네임스페이스를 추가**하고 ko/ja/en 세 파일을 같이 채워야 한다(타입이 누락을 잡아줌).

---

## 2. 완료된 것 (Phase 1)

- ✅ i18n 인프라 전체 (`shared/i18n`): 사전·Provider·format/plural·hreflang
- ✅ `/recipes/[recipeId]` → `/ja/`, `/en/` 라우트 + 데이터 fetch(`?lang=`) +
  chrome 사전화 + 미번역 fallback(noindex) + JSON-LD `inLanguage`
- ✅ `/search/results` → `/ja/`, `/en/` 라우트 + locale-aware 쿼리/queryKey +
  복수형 메타 + 카드 href 로케일 전파
- ✅ indexable 로컬라이즈 페이지에 hreflang alternates 방출

---

## 3. 페이지별 현황

**상태 범례:** 🟢 완료 · 🟡 진행중 · 🔴 미착수(국제화 필요) · 🔵 결정 필요 · ⚪ 대상 아님

**Scope:** 국제화 우선순위 — `H`(SEO 핵심/공개) · `M`(유저 플로우) · `L`(낮음) · `—`(대상 아님)

### 공개 / SEO 페이지 (우선순위 높음)

| 페이지      | 라우트                                    | Scope | 상태 | 비고                                                                                                                                                                                               |
| ----------- | ----------------------------------------- | ----- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 레시피 상세 | `/recipes/[recipeId]`                     | H     | 🟡   | 백엔드 연동·read-path chrome 완료(34키). 🔸DEFER: 숫자+단위 포맷(구독자수 만명·`분`·`인분`·절약액 `원`)·절약 마케팅 카피·RecipeCompleteButton. EXCLUDE(비목표): 재료 복사/신고 시트·평점·댓글폼·챗 |
| 검색 결과   | `/search/results`                         | H     | 🟢   | ja/en 완료                                                                                                                                                                                         |
| 홈          | `/`                                       | H     | 🔴   | 라우트·chrome 미착수                                                                                                                                                                               |
| 검색 진입   | `/search`                                 | H     | 🔴   | `/search/results`만 됨, 진입 페이지 별도                                                                                                                                                           |
| 카테고리    | `/recipes/category/[id]`                  | H     | 🔴   |                                                                                                                                                                                                    |
| 재료 목록   | `/ingredients`                            | H     | 🔴   |                                                                                                                                                                                                    |
| 재료 상세   | `/ingredients/[ingredientId]`             | H     | 🟢   | ja/en 완료. chrome locale-prop 사전(`getDictionary`), `?lang=` 서버fn, hreflang/inLanguage. 쿠팡 ko-only. EXCLUDE(비목표): 재료 데이터 번역(백엔드)·영양 단위·제철 월 등 데이터 필드               |
| 큐레이션    | `/curation`, `/curation/[slug]`           | H     | 🔴   |                                                                                                                                                                                                    |
| 유저 프로필 | `/users/[userId]`                         | M     | 🔴   |                                                                                                                                                                                                    |
| 레시피북    | `/recipe-books`, `/recipe-books/[bookId]` | M     | 🔴   |                                                                                                                                                                                                    |
| 랜딩        | `/landing`                                | H     | 🔵   | 마케팅 카피 — 번역 vs 로케일별 별도 카피 결정 필요                                                                                                                                                 |
| 매거진      | `/magazine/food-trends-2026`              | L     | 🔵   | 1회성 콘텐츠, 번역 가치 판단                                                                                                                                                                       |
| 이벤트      | `/events/*`                               | L     | ⚪   | 한국 한정 이벤트로 보임 — 확인 필요                                                                                                                                                                |
| 공지/약관   | `/notice`, `/privacy`                     | M     | 🔵   | 법적 문구 — 번역 신중                                                                                                                                                                              |

### 인증 / 유저 플로우 (우선순위 중)

| 페이지      | 라우트                                   | Scope | 상태 | 비고                                      |
| ----------- | ---------------------------------------- | ----- | ---- | ----------------------------------------- |
| 로그인      | `/login`, `/login/error`                 | M     | 🔴   | chrome 번역 필요                          |
| 프로필 편집 | `/users/edit`                            | M     | 🔴   |                                           |
| 알림        | `/notifications`                         | M     | 🔴   | NotificationType별 문구 조립 — 비목표였음 |
| 캘린더      | `/calendar/[date]`, `/calendar/timeline` | L     | 🔴   |                                           |
| 냉장고      | `/recipes/my-fridge`                     | M     | 🔴   |                                           |

### 레시피 생성 플로우 (다른 에이전트 기능 작업중)

> ⚠️ youtube 추출·AI 생성 **기능**은 다른 에이전트가 작업중. 아래 i18n 상태는
> 기능과 별개. 기능 구현 후 chrome 사전화 진행.

| 페이지      | 라우트                                                    | Scope | 상태 | 비고                                         |
| ----------- | --------------------------------------------------------- | ----- | ---- | -------------------------------------------- |
| 생성 허브   | `/recipes/new`                                            | M     | 🔴   |                                              |
| 유튜브 추출 | `/recipes/new/youtube`                                    | M     | 🔴   | 기능: 다른 에이전트                          |
| AI 생성     | `/recipes/new/ai`(+ingredient/nutrition/price/finedining) | M     | 🔴   | 기능: 다른 에이전트                          |
| 수동 작성   | `/recipes/new/manual`                                     | L     | 🔴   |                                              |
| 편집        | `/recipes/[recipeId]/edit`                                | L     | 🔴   |                                              |
| 리믹스      | `/recipes/[recipeId]/remix`                               | L     | 🔴   |                                              |
| 슬라이드쇼  | `/recipes/[recipeId]/slide-show`                          | L     | 🔴   |                                              |
| 평점        | `/recipes/[recipeId]/rate`                                | L     | 🔴   |                                              |
| 댓글        | `/recipes/[recipeId]/comments`(+`/[commentId]`)           | M     | 🔴   | 댓글 번역 배지는 비목표였음                  |
| 재료 등록   | `/ingredients/new`                                        | L     | 🔴   |                                              |
| 비공개 상세 | `/recipes/private/[recipeId]`                             | L     | 🔵   | 비공개라 SEO 무관, 로케일 변형 필요한지 판단 |

### 관리자 (국제화 대상 아님)

| 페이지      | 라우트                         | Scope | 상태 | 비고                        |
| ----------- | ------------------------------ | ----- | ---- | --------------------------- |
| 어드민 전체 | `/admin/*`, `/recipes/admin/*` | —     | ⚪   | 데스크톱 내부용. 번역 안 함 |

---

## 4. 글로벌/공유 영역 (페이지 가로지름 — 별도 추적)

| 항목                           | 상태 | 비고                                                                 |
| ------------------------------ | ---- | -------------------------------------------------------------------- |
| 헤더/네비게이션 chrome         | 🔴   | 전 페이지 공통. 사전 네임스페이스 신설 필요                          |
| 하단 탭바                      | 🔴   |                                                                      |
| Toast/공통 버튼 문구           | 🔴   |                                                                      |
| root layout `<html lang="ko">` | 🔴   | ja/en 페이지에도 ko로 박혀있음(Phase 1 수용). next-intl 전환 시 해결 |
| sitemap 로케일 분리            | 🔴   | 백엔드 `availableLocales`/locale sitemap 엔드포인트 대기             |
| 가격/통화 기호 분기            | 🔴   | 円/원 — 가격 렌더가 여러 컴포넌트에 흩어짐. 전역 작업 필요           |

---

## 5. 새 페이지 국제화 체크리스트 (반복 레시피)

1. **사전 먼저:** `shared/i18n/types.ts`의 `Dictionary`에 네임스페이스 추가 →
   `messages/ko.ts`, `ja.ts`, `en.ts` 세 파일 동시 작성 (타입이 누락 강제)
2. **본문 추출:** 페이지 렌더를 `widgets/<Widget>/server/renderLocalized*.tsx`로
   추출, `locale` prop 받게 (ko 페이지도 이 위젯 호출하도록 순수 이동 리팩터)
3. **로케일 래퍼 생성:** `app/ja/.../page.tsx`, `app/en/.../page.tsx` —
   `locale="ja"|"en"`만 넘김 (기존 recipes/search 래퍼 그대로 복붙)
4. **데이터 fetch:** 서버 fetch에 명시적 `?lang=` (쿠키/Accept-Language 비의존 →
   ISR 캐시 결정적). 캐시 태그는 ko와 공유 (`revalidateTag` 한 번에 무효화)
5. **클라이언트 쿼리:** TanStack queryKey에 `locale` 포함 (ko 캐시와 분리)
6. **SEO:** locale별 canonical(self) + `buildHreflangAlternates()` + robots
   (미번역 fallback은 `noindex`) + JSON-LD `inLanguage`
7. **내부 링크:** 카드/슬라이드 href에 locale 전파 (`/ja/...`, `/en/...`)
8. **검증:** `npx tsc --noEmit`

---

## 6. 참고사항 / 남은 Task (에이전트 append 영역)

> 작업하며 발견한 것·결정·블로커를 여기에 추가. 형식: `- [날짜][담당] 내용`

- [2026-06-13][i18n] 백엔드 후속 요청 미해결: ①상세 응답 `availableLocales`(ko↔ja
  hreflang 양방향), ②locale-aware sitemap 엔드포인트. 이거 오기 전엔 ja/en 발견
  경로 거의 없음(의도된 상태, 백필 전 미개방 방침과 일치)
- [2026-06-13][i18n] 비목표(Phase 1)였던 것들 — 후속 필요: 언어 스위처/자동
  리다이렉트, `preferred-locale` 설정 화면, 댓글 번역 배지·원문 토글, 알림 ja 문구셋
- [2026-06-13][i18n] 레시피 상세 read-path chrome 완료 (`recipeDetail` 34키
  ko/ja/en). 코드리뷰가 누락 chrome 4건(코멘트 헤딩·빈상태·추천 그릇·영상 고정)을
  잡아 수정(`f972b9c3`). **DEFER(후속 task)**: 숫자+단위 포맷(구독자수 만명/천명·`분`·
  `인분`·절약액 `원`) + RecipeIngredientsSection 절약 마케팅 카피. 현재 en에서 라벨은
  영어인데 숫자단위가 한국어로 섞여 보임(`subscribers 12.3万명`) — 중간상태 수용 or
  당겨 처리 결정 필요.
- [2026-06-13][i18n] 🐛 수정(`cff77e47`): en 검색 결과가 chrome만 영어이고 fetch는
  ko로 떨어지던 버그. `useSearchResults`/`buildSearchQueryKey`/`buildSearchQueryParams`가
  `"ko"|"ja"`로만 타입돼 en을 경계에서 ko로 remap → 서버 prefetch(lang=en)와 클라
  refetch(lang=ko) 불일치, 카드 href도 `/`로. en을 ja처럼 1급 plumb해 수정(서버/클라
  lang·queryKey 일치, 카드 href `/en` 전파). **page 0만 영어이던 hydration 마스킹**이
  교훈 — 다음 페이지 페이징·카드 클릭으로 검증할 것.
- [2026-06-13][i18n] 세션 교훈 3건 `code-quality` 스킬에 적립(`41a68d11`):
  `policy-i18n-type-gate-misses-unextracted-strings`(타입게이트는 키 누락만 잡지 미추출
  inline 문자열 못 잡음→grep), `react-context-hook-provider-coverage`(공유 leaf를 useT로
  바꾸면 모든 렌더사이트에 Provider 필요·런타임 throw), `policy-i18n-chrome-vs-content-axes`
  (chrome 번역≠콘텐츠 fetch 번역).
- [2026-06-13][i18n] 이번 피처 설계·계획·머지전 검증 체크리스트 상세:
  `docs/superpowers/specs/2026-06-12-multilingual-ui-copy-*.md`(design/slices/test-design/
  plan/worklog).
