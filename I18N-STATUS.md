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
| 홈          | `/`                                       | H     | 🔴   | chrome(헤더/하단탭/푸터) 완료 → 잠금해제. 라우트(ja/en)·홈 하드카피("주간 인기"/"가성비"/CategoryTabs title)·배너 미착수                                                                           |
| 검색 진입   | `/search`                                 | H     | 🟢   | ja/en 완료. 셸·시간대 placeholder(현지요리)·큐레이션카드 12장(현지 차분한 톤)·영양테마 label·focused. 가격대 섹션 ja/en 숨김(통화 후속). 카피 자연성 사용자 수동검증 대기                          |
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

| 페이지      | 라우트                                   | Scope | 상태 | 비고                                                                                                                                                                                                       |
| ----------- | ---------------------------------------- | ----- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 로그인      | `/login`, `/login/error`                 | M     | 🔴   | chrome 번역 필요                                                                                                                                                                                           |
| 프로필 편집 | `/users/edit`                            | M     | 🔴   |                                                                                                                                                                                                            |
| 알림        | `/notifications`                         | M     | 🔴   | NotificationType별 문구 조립 — 비목표였음                                                                                                                                                                  |
| 캘린더      | `/calendar/[date]`, `/calendar/timeline` | L     | 🔴   |                                                                                                                                                                                                            |
| 냉장고      | `/recipes/my-fridge`                     | M     | 🟢   | ja/en 라우트 래퍼 + `fridge` 사전(자가판정 `useFridgeDict`). 페이지/빈상태/매치요약/AI배지 + 레시피 데이터 lang(`getMyFridgeRecipes`). 재료 fetch(`getIngredients`)도 lang 전파. DEFER: 조리시간 "분" 단위 |

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

| 항목                             | 상태 | 비고                                                                                                                                                                                                                                    |
| -------------------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 헤더/네비게이션 chrome           | 🟢   | `nav` 네임스페이스 + `useChromeDict`(client pathname 자가판단). 헤더 nav/로그인/알림(plural)/설치/저장북/프로필 + 푸터 라벨 ko/ja/en. 푸터 고유명사·이메일·Copyright·브랜드는 비번역(법적 href는 언어 스위처 작업서 일률 prefix로 변경) |
| 하단 탭바                        | 🟢   | BottomNavBar 홈/검색/냉장고/AI 레시피/My ko/ja/en (`nav` 사전)                                                                                                                                                                          |
| 언어 스위처 / locale-sticky 링크 | 🟢   | 설정 시트 `LanguageSettingRow`(ko/ja/en) + `LocalizedLink`(현재 locale 일률 prefix) + `localizedHref`/`stripLocale` + localStorage `PREFERRED_LOCALE`. 자동 리다이렉트 없음. chrome 링크 전환 완료(전 앱 링크는 점진). **로컬 미확인**  |
| Toast/공통 버튼 문구             | 🔴   | 저장북 toast만 `nav`에 포함. 일반 공통버튼/`common` 네임스페이스 미착수                                                                                                                                                                 |
| root layout `<html lang="ko">`   | 🔴   | ja/en 페이지에도 ko로 박혀있음(Phase 1 수용). next-intl 전환 시 해결                                                                                                                                                                    |
| sitemap 로케일 분리              | 🔴   | 백엔드 `availableLocales`/locale sitemap 엔드포인트 대기                                                                                                                                                                                |
| 가격/통화 기호 분기              | 🔴   | 円/원 — 가격 렌더가 여러 컴포넌트에 흩어짐. 전역 작업 필요                                                                                                                                                                              |

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
- [2026-06-13][i18n] 공유 nav chrome 완료(헤더·하단탭·푸터). **접근법 A**: chrome가 root
  layout 단일 렌더라 locale prop 없음 → 순수 `resolveChromeLocale(pathname)` + client
  `useChromeDict()`로 URL prefix 자가판단(신규 client 전환 0, `headers()` 미도입→정적 보존).
  `nav` 네임스페이스 `messages/{ko,ja,en}/nav.ts`(번들 격리 위해 navMessages가 nav 슬라이스만
  직접 import). 6 task TDD, chrome 스위트 35/35. ko 회귀를 위젯마다 앵커. 비번역: 푸터
  고유명사·이메일·Copyright·브랜드, 법적 링크 href는 ko 목적지 유지. **DEFER/비목표**: `<html lang>`
  per-locale(root 전용→next-intl 후속), CategoryTabs·Toast·`common` 버튼, RecipeNavBarButtons
  (레시피 상세 전용), 언어 스위처. 설계/계획: `docs/superpowers/{specs,plans}/2026-06-13-chrome-nav-i18n-*`.
- [2026-06-13][i18n] 🔓 chrome 완료로 **홈 잠금해제**. 다음 우선순위(보드 §3): 홈 라우트화 →
  재료목록/카테고리/큐레이션(SEO). 단 백엔드 `availableLocales`/sitemap 미전달이라 발견 경로 0은 여전.
- [2026-06-13][i18n] 언어 스위처 + locale-sticky 링크 완료(사용자 요청, 4 task TDD, 59 tests).
  모델 A: 링크 stickiness + 설정 스위처, **자동 리다이렉트 없음**(localStorage client 전용). 순수
  `localizedHref`/`stripLocale` + `LocalizedLink`(현재 locale 일률 prefix, 예외 레지스트리 없음) +
  localStorage `PREFERRED_LOCALE`(`getStoredLocale`/`setStoredLocale`) + 설정 `LanguageSettingRow`.
  chrome 링크(헤더/하단탭/푸터) 전환 완료, active 하이라이트 `stripLocale` 보정. **결정 변경**: 일률
  prefix라 푸터 법적 링크 href가 이제 `/en/terms`로 prefix됨(이전 chrome 작업의 "ko 유지" 뒤집음) →
  미로컬라이즈 목적지는 점진 커버 전까지 404(i18n 미배포라 수용). **비목표**: 자동 리다이렉트·404
  레지스트리·쿠키/서버 리다이렉트·`<html lang>`·chrome 외 전 앱 링크 일괄 전환.
  설계/계획: `docs/superpowers/{specs,plans}/2026-06-13-language-switcher-*`.
- [2026-06-13][i18n] ✅ **검색 진입 `/search` 디스커버리 ja/en 완료**(7 커밋, 16 tests, TDD).
  `searchDiscovery` 네임스페이스 + client 자가판단 `useSearchDiscoveryDict`(usePathname→resolveChromeLocale,
  nav 패턴 답습). 셸·시간대 placeholder(현지요리로 교체)·큐레이션카드 12장(밈→현지 차분한 톤)·영양테마
  label 10개·focused(최근검색/본/지우기). **가격대 섹션 ja/en 숨김**(`locale==="ko"`만 렌더 — KRW 필터
  mismatch, 통화 plumbing 후속). CONTENT_PAGES title/subtitle 상수→사전 이전(+`ContentPageId`),
  NUTRITION_THEMES 상수 불변(공유 소비자 보호). **누락가드(no-Hangul 렌더 스캔)가 `RecipeSlide.tsx`
  미추출 한글 3건("더보기"/빈상태/에러)을 잡아 사전화** — 타입게이트가 못 잡는 inline 문자열 사례 재확인.
  설계/계획: `docs/superpowers/{specs,plans}/2026-06-13-search-discovery-i18n-*`.
  **후속(코드리뷰 발견, 비차단):** ①`recipeSlide{ViewMore,Empty,Error}` 키가 `searchDiscovery`에
  얹혀 있음 — 범용 위젯이라 `common`/`recipeSlide` 네임스페이스로 이전 권고(현재 `common` 없음).
  ②`RecommendedRecipeGrid` inline 한글(레시피 상세 전용, /search 밖)·③ja/en `/search` metadata
  title/desc 아직 ko(noindex라 영향 작음). ④큐레이션카드·테마 href가 plain Link+buildSearchResultsUrl
  이라 locale-sticky 아님(언어스위처 "chrome 외 링크 일괄 전환" 비목표와 동일 건).
- [2026-06-13][i18n] ✅ **냉장고 `/recipes/my-fridge` ja/en 완료**(설계: `docs/.../2026-06-13-fridge-i18n-and-ingredient-lang-design.md`).
  `fridge` 네임스페이스 + 자가판정 `useFridgeDict`(searchDiscovery 패턴). /ja /en 라우트 래퍼 + 본문을
  `MyFridgeView`로 추출(3 라우트 1 컴포넌트). lastPageMessage를 훅에서 dict로 이전. **레시피 데이터 lang**
  (`getMyFridgeRecipes`)도 전파(카드 제목·부족재료명 ja). DEFER: 조리시간 "분" 단위.
- [2026-06-13][i18n] ✅ **재료 fetch lang 전파**(`getIngredients` 5 호출부 전부): 신규 `useApiLocale`
  (`resolveLocaleFromPath(pathname) ?? getStoredLocale() ?? "ko"`) + 순수 `resolveLocaleFromPath`(prefix만→null).
  `getIngredients`/`getMyFridgeRecipes`에 `lang` 파라미터(ko면 생략 — `getIngredientDetail` 패턴). **결정:
  queryKey locale 분리는 mutation 없고 /ja 변동 있는 selector/filter/picker만** — 냉장고추가 드로어·재료목록은
  `browse`/`["ingredients",...]` 3-튜플 유지(optimistic add/remove가 정확 매칭하는 키라 locale 끼우면 깨짐 +
  라우트 래퍼 없어 locale=저장값으로 세션 내 불변). 후속: 풀 캐시분리 원하면 `browse`/`myFridge` factory +
  add/delete mutation에 locale default-ko 인자 추가.
- [2026-06-13][i18n] 🐛 사전결함 발견(비차단, 내 변경과 무관): `recipe-create-ai/useConceptJob.test.tsx`가
  `useT`를 DictionaryProvider 없이 렌더해 11개 전부 fail(clean tree에서도 동일). 별도 fix 필요.
- [2026-06-13][i18n] 📋 보드 stale: §3 홈(`/`)이 🔴이나 실제 ja/en 라우트·카피 완료됨(`734f3842`/`048beeb9`).
  AI 생성도 완료(`a4877f99`). 다음 정리 때 갱신.

---

## 7. 로컬 확인 현황 (사용자 dev 직접 테스트)

> dev `:3000`에서 `/en`·`/ja` 직접 확인. ✅통과 · ❌미흡 · ⬜미확인.

### 레시피 상세 `/en·/ja/recipes/{id}` — ❌ (2026-06-13 사용자 확인)

- ❌ **재료 가격·쿠팡 링크·쿠팡 안내문이 i18n 페이지에 노출** → 결정: **국제화(ja/en)에선 제거**
  (쿠팡은 ko-only 제휴라 ja/en 무의미). 가격도 i18n에선 숨김.
- ❌ 조리시간/인분 **단위 미번역**(`40분`·`2인분`) — 기존 DEFER(숫자+단위 포맷)와 동일 건
- ❌ **액션버튼 미번역**(저장/공유/완료 등)
- ❌ **코멘트 요약 미번역**("N명의 사람들이 평균 ~")

→ 레시피 상세 i18n 잔여 작업으로 묶어 후속(read-path chrome 34키 이후 미처리분). 일부는 다른
에이전트 소유 영역과 겹침 — 손대기 전 확인.

### 🚩 사용자 요청(2026-06-13): 언어 스위처 + locale-sticky 네비게이션

설정 탭에 언어 선택(우선 localStorage 저장), 선택 locale 고정 시 **내부 이동이 계속 그 locale로**
유지(현재는 chrome/카드 링크가 ko 경로로 박혀 매번 URL 수동 변경 필요). Phase 1 비목표였던
"언어 스위처/자동 리다이렉트"를 당겨 처리. → 별도 brainstorming으로 설계 예정.
