# 국제화(i18n) 현황 — 페이지별 진행 보드

> 프로젝트 전체 다국어(ko/ja/en) 작업의 **러프한 페이지별 현황판**.
> 각 에이전트는 작업하면서 이 파일의 해당 행 상태를 갱신하고, 맨 아래
> "참고사항 / 남은 Task"에 발견·결정·블로커를 적는다.
>
> 갱신일: 2026-06-14 · 브랜치: feature/17

---

## 0. 번역 원칙 (필독 — 매 i18n 작업 체크리스트 0번)

EN/JA 카피는 **직역 금지**. 각 언어를 모국어로 쓰는 **현지 IT 프로덕트 PM**이 레시피
앱에 직접 쓴 것처럼 자연스럽게. 작업 시 **타깃 언어로 프롬프트를 작성**해 생성하고,
톤은 **차분·실용**(마케팅 과장·이모지 남발 금지). 라벨은 표시 문맥에 맞는 자연어로,
전송 메시지/CTA는 라벨과 1:1로 대응. 통화·한국 한정 기능(절약 KRW·쿠팡 등)은 번역
가치를 따져 **숨김 vs 번역**을 정한다(기본: KRW 금액은 숨김, 광고 제거 추천 이벤트는
번역해 노출).

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

| 페이지      | 라우트                                    | Scope | 상태 | 비고                                                                                                                                                                                                                |
| ----------- | ----------------------------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 레시피 상세 | `/recipes/[recipeId]`                     | H     | 🟡   | 백엔드 연동·read-path chrome 완료(34키). 🔸DEFER: 숫자+단위 포맷(구독자수 만명·`분`·`인분`·절약액 `원`)·절약 마케팅 카피·RecipeCompleteButton. EXCLUDE(비목표): 재료 복사/신고 시트·평점·댓글폼·챗                  |
| 검색 결과   | `/search/results`                         | H     | 🟢   | ja/en 완료                                                                                                                                                                                                          |
| 홈          | `/`                                       | H     | 🔴   | chrome(헤더/하단탭/푸터) 완료 → 잠금해제. 라우트(ja/en)·홈 하드카피("주간 인기"/"가성비"/CategoryTabs title)·배너 미착수                                                                                            |
| 검색 진입   | `/search`                                 | H     | 🟢   | ja/en 완료. 셸·시간대 placeholder(현지요리)·큐레이션카드 12장(현지 차분한 톤)·영양테마 label·focused. 가격대 섹션 ja/en 숨김(통화 후속). 카피 자연성 사용자 수동검증 대기                                           |
| 카테고리    | `/recipes/category/[id]`                  | H     | 🟢   | ja/en 완료. chrome 사전(`category`) + 태그 라벨(택소노미) + `?lang` fetch + queryKey locale + hreflang/canonical. **ja/en noindex**(availableLocales 대기). CHEF 셀럽 키워드 ko 전용                                |
| 재료 목록   | `/ingredients`                            | H     | 🔴   |                                                                                                                                                                                                                     |
| 재료 상세   | `/ingredients/[ingredientId]`             | H     | 🟢   | ja/en 완료. chrome locale-prop 사전(`getDictionary`), `?lang=` 서버fn, hreflang/inLanguage. 쿠팡 ko-only. EXCLUDE(비목표): 재료 데이터 번역(백엔드)·영양 단위·제철 월 등 데이터 필드                                |
| 큐레이션    | `/curation`, `/curation/[slug]`           | H     | 🔴   |                                                                                                                                                                                                                     |
| 유저 프로필 | `/users/[userId]`                         | M     | 🟢   | ja/en 완료. 탭 라벨·소개 더읽기(common)·프로필수정·광고이벤트(referral)·캘린더(절약 KRW 비ko 숨김 + 스트릭 식비색 제거 번역 + date-fns 로케일)·설정 시트. no-Hangul 가드 컴포넌트 테스트 분산. KRW 절약은 비ko 숨김 |
| 레시피북    | `/recipe-books`, `/recipe-books/[bookId]` | M     | 🔴   |                                                                                                                                                                                                                     |
| 랜딩        | `/landing`                                | H     | 🔵   | 마케팅 카피 — 번역 vs 로케일별 별도 카피 결정 필요                                                                                                                                                                  |
| 매거진      | `/magazine/food-trends-2026`              | L     | 🔵   | 1회성 콘텐츠, 번역 가치 판단                                                                                                                                                                                        |
| 이벤트      | `/events/*`                               | L     | ⚪   | 한국 한정 이벤트로 보임 — 확인 필요                                                                                                                                                                                 |
| 공지/약관   | `/notice`, `/privacy`                     | M     | 🔵   | 법적 문구 — 번역 신중                                                                                                                                                                                               |

### 인증 / 유저 플로우 (우선순위 중)

| 페이지      | 라우트                                   | Scope | 상태 | 비고                                                                                                                                                                                                       |
| ----------- | ---------------------------------------- | ----- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 로그인      | `/login`, `/login/error`                 | M     | 🔴   | chrome 번역 필요                                                                                                                                                                                           |
| 프로필 편집 | `/users/edit`                            | M     | 🟢   | ja/en 완료. `userPages.profile.edit` 사전 와이어 + 미러 라우트. validation/toast/placeholder 현지화. 자유텍스트(닉/소개) 미번역                                                                            |
| 알림        | `/notifications`                         | M     | 🔴   | NotificationType별 문구 조립 — 비목표였음                                                                                                                                                                  |
| 캘린더      | `/calendar/[date]`, `/calendar/timeline` | L     | 🔴   |                                                                                                                                                                                                            |
| 냉장고      | `/recipes/my-fridge`                     | M     | 🟢   | ja/en 라우트 래퍼 + `fridge` 사전(자가판정 `useFridgeDict`). 페이지/빈상태/매치요약/AI배지 + 레시피 데이터 lang(`getMyFridgeRecipes`). 재료 fetch(`getIngredients`)도 lang 전파. DEFER: 조리시간 "분" 단위 |

### 레시피 생성 플로우 (다른 에이전트 기능 작업중)

> ⚠️ youtube 추출·AI 생성 **기능**은 다른 에이전트가 작업중. 아래 i18n 상태는
> 기능과 별개. 기능 구현 후 chrome 사전화 진행.

| 페이지      | 라우트                                                    | Scope | 상태 | 비고                                                                                                                                                                                                     |
| ----------- | --------------------------------------------------------- | ----- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 생성 허브   | `/recipes/new`                                            | M     | 🟢   | ja/en 완료. `recipeCreate` 사전 + 미러 라우트 + locale-sticky 카드. 모드 선택 허브만                                                                                                                     |
| 유튜브 추출 | `/recipes/new/youtube`                                    | M     | 🔴   | 기능: 다른 에이전트                                                                                                                                                                                      |
| AI 생성     | `/recipes/new/ai`(+ingredient/nutrition/price/finedining) | M     | 🔴   | 기능: 다른 에이전트                                                                                                                                                                                      |
| 수동 작성   | `/recipes/new/manual`                                     | L     | 🟢   | ja/en 완료. `recipeForm` 사전(labels/validation/ui) + **zod 스키마 팩토리**(locale 주입) + 전 UI 인라인 + 재료 picker(데스크톱/모바일 `IngredientPicker` 엔티티). 단위·카테고리 코드값 ko canonical 유지 |
| 편집        | `/recipes/[recipeId]/edit`                                | L     | 🔴   |                                                                                                                                                                                                          |
| 리믹스      | `/recipes/[recipeId]/remix`                               | L     | 🔴   |                                                                                                                                                                                                          |
| 슬라이드쇼  | `/recipes/[recipeId]/slide-show`                          | L     | 🔴   |                                                                                                                                                                                                          |
| 평점        | `/recipes/[recipeId]/rate`                                | L     | 🔴   |                                                                                                                                                                                                          |
| 댓글        | `/recipes/[recipeId]/comments`(+`/[commentId]`)           | M     | 🔴   | 댓글 번역 배지는 비목표였음                                                                                                                                                                              |
| 재료 등록   | `/ingredients/new`                                        | L     | 🔴   |                                                                                                                                                                                                          |
| 비공개 상세 | `/recipes/private/[recipeId]`                             | L     | 🔵   | 비공개라 SEO 무관, 로케일 변형 필요한지 판단                                                                                                                                                             |

### 관리자 (국제화 대상 아님)

| 페이지      | 라우트                         | Scope | 상태 | 비고                        |
| ----------- | ------------------------------ | ----- | ---- | --------------------------- |
| 어드민 전체 | `/admin/*`, `/recipes/admin/*` | —     | ⚪   | 데스크톱 내부용. 번역 안 함 |

---

## 4. 글로벌/공유 영역 (페이지 가로지름 — 별도 추적)

| 항목                             | 상태 | 비고                                                                                                                                                                                                                                                                                     |
| -------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 헤더/네비게이션 chrome           | 🟢   | `nav` 네임스페이스 + `useChromeDict`(client pathname 자가판단). 헤더 nav/로그인/알림(plural)/설치/저장북/프로필 + 푸터 라벨 ko/ja/en. 푸터 고유명사·이메일·Copyright·브랜드는 비번역(법적 href는 언어 스위처 작업서 일률 prefix로 변경)                                                  |
| 하단 탭바                        | 🟢   | BottomNavBar 홈/검색/냉장고/AI 레시피/My ko/ja/en (`nav` 사전)                                                                                                                                                                                                                           |
| 언어 스위처 / locale-sticky 링크 | 🟢   | 설정 시트 `LanguageSettingRow`(ko/ja/en) + `LocalizedLink`(현재 locale 일률 prefix) + `localizedHref`/`stripLocale` + localStorage `PREFERRED_LOCALE`. 자동 리다이렉트 없음. chrome 링크 전환 완료(전 앱 링크는 점진). **로컬 미확인**                                                   |
| Toast/공통 버튼 문구             | 🔴   | 저장북 toast만 `nav`에 포함. 일반 공통버튼/`common` 네임스페이스 미착수                                                                                                                                                                                                                  |
| root layout `<html lang="ko">`   | 🔴   | ja/en 페이지에도 ko로 박혀있음(Phase 1 수용). next-intl 전환 시 해결. **아래 word-break 자동화의 전제이기도 함**(`:lang()` CSS가 lang 속성에 의존)                                                                                                                                       |
| locale별 word-break/text-pretty  | 🔴   | `break-keep`(word-break:keep-all)은 ko 어절 유지용인데 **공백 없는 ja에선 줄바꿈 전면차단** → line-clamp `-webkit-box`가 max-content로 넘쳐 1줄 잘림(AI 컨셉 카드서 실측·수정 `324bdffd`). `text-pretty`와 자주 페어(13/25). 25파일 사용. **TODO**: locale 자동 유틸(§6 참조, 설계 보류) |
| sitemap 로케일 분리              | 🔴   | 백엔드 `availableLocales`/locale sitemap 엔드포인트 대기                                                                                                                                                                                                                                 |
| 가격/통화 기호 분기              | 🔴   | 円/원 — 가격 렌더가 여러 컴포넌트에 흩어짐. 전역 작업 필요                                                                                                                                                                                                                               |

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

- [2026-06-14][i18n] ✅ **유저페이지 `/users/[userId]` 마감(ja/en)**. 신규 네임스페이스
  `common`(CollapsibleP 더읽기)·`referral`(광고 제거 추천 이벤트: 기프트버튼·"광고 없이 이용 중"
  배너·초대 시트·redeem 에러)·`settings`(설정 시트 전 항목 + `formatRemaining` locale 옵션) +
  `userPages.profile.tabs`/`calendar.streak*` 확장. 탭 라벨을 상수에서 들어내 `useTabState`가 dict
  주입. **캘린더 결정:** 탭은 유지하되 `MonthlySavingsSummary`(KRW 절약)만 `locale!=="ko"` 게이트로
  숨김(이 탭의 유일 KRW surface — `CalendarDayPhoto`는 개수배지뿐). 스트릭은 `motivationalMessage`
  순수fn(밴드 경계 테스트) + plural 단위로 현지화하고 식비/배달 색 제거. date-fns는 `resolveDateFnsLocale`
  매핑. no-Hangul 가드는 각 ja 컴포넌트 테스트에 분산 동승(메가 render 회피). 설계/계획:
  `docs/superpowers/{specs,plans}/2026-06-14-user-pages-i18n-finish-*`.
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
  `getIngredients`/`getMyFridgeRecipes`에 `lang` 파라미터(ko면 생략 — `getIngredientDetail` 패턴). **결정(확정):
  locale은 queryKey에 안 넣고 요청 `lang`에만 둔다 — 5 호출부 전부 동일 규칙.** 키에 locale을 넣으면 얻는 건
  "스위처로 언어 바꾼 직후 같은 리스트 5분 내 재방문 시 옛 언어 깜빡"을 막는 것뿐인데, 코스메틱+자가치유
  (mutation invalidate/5분 stale로 교정)라 비대칭 규칙·mutation locale 배선 비용 대비 가치 없음. 일관 규칙 1개 선택.
- [2026-06-13][i18n] 🐛 사전결함 발견(비차단, 내 변경과 무관): `recipe-create-ai/useConceptJob.test.tsx`가
  `useT`를 DictionaryProvider 없이 렌더해 11개 전부 fail(clean tree에서도 동일). 별도 fix 필요.
- [2026-06-13][i18n] 📋 보드 stale: §3 홈(`/`)이 🔴이나 실제 ja/en 라우트·카피 완료됨(`734f3842`/`048beeb9`).
  AI 생성도 완료(`a4877f99`). 다음 정리 때 갱신.
- [2026-06-13][i18n] ✅ **택소노미 라벨 + 생성허브/프로필편집/카테고리상세 완료**(11 task, TDD, 118 tests).
  **접근법 A(표시 전용 오버레이)**: 기존 한글-키 상수(`recipe.ts`) 불변, 새 `taxonomy` 사전을 **코드 키**로 두고
  렌더 지점 리졸버(`taxonomyLabel`/`localizeTaxonomy`/`useTaxonomy`)로 표시만 현지화 → ko 회귀 구조상 0(ko 사전이
  한글 보유, 리졸버가 ko 입력 그대로). 적용: 검색필터 칩 전부(정렬·요리유형·태그·재료·영양 + 재료비(원) ja/en 숨김)·
  CategoryTabs 칩(sticky 링크)·재료 카테고리 탭·RecipeTypeSelector. 페이지: `/users/edit`(사전 와이어, 컴포넌트/
  라우트는 병렬작업 `2cf3415d`가 선행 — 테스트만 추가)·`/recipes/new` 허브(`recipeCreate` 사전)·`/recipes/category/[id]`
  (`category` 사전+`?lang`+queryKey locale+hreflang, **ja/en noindex**). 설계/계획:
  `docs/superpowers/{specs,plans}/2026-06-13-i18n-taxonomy-filters-create-profile-*`.
  **후속 1건:** 태그 **드로어 항목**(CategoryPicker) 현지화 — availableValues가 `이모지+이름`이라
  reverse-map 미스, 코덱 경로 위험 회피로 드로어 항목만 ko 유지(칩은 현지화됨).
- [2026-06-13][i18n] ✅ **수동 작성 폼(`/recipes/new/manual`) 완료**(사용자 요청으로 후속 당겨 처리, Task 12~16, 5 task).
  `recipeForm` 사전(labels/validation/ui ~50키) + **locale-aware zod 스키마 팩토리**(`buildRecipeFormSchema(validation)`,
  3 훅 create/edit/remix에 `useMemo`로 resolver 안정화) + 전 UI 인라인 현지화(group A/B). 재료 picker는
  데스크톱(`IngredientSelector`)·모바일 공유 엔티티(`entities/.../IngredientPicker` + Card + SelectionTray) 둘 다 —
  새 `ingredientPicker` 사전(shared, FSD 역방향 금지 준수). 카테고리 칩은 `ingredientCategory` 택소노미 재사용,
  UNITLESS(약간/적당량)·단위·카테고리 **코드/비교/폼값은 ko canonical 유지**(표시만 현지화). 미사용 `MSG`/`FIELD_LABELS`
  상수 제거. tsc clean, 115 tests green.
- [2026-06-14][i18n] 🐛 **AI 생성 컨셉 카드 설명 ja 잘림 수정**(브라우저 실측 `324bdffd`). 카드(버튼)는 4개 다
  173px 동일인데 설명 `<p>`가 긴 ja 컨셉(영양밸런스·파인다이닝)에서 215/196px로 **카드 밖 가로 넘침→1줄 잘림**.
  원인: `break-keep`(word-break:keep-all)이 공백 없는 ja 줄바꿈을 전면 차단 + line-clamp의 `-webkit-box`가
  max-content로 부풂. `break-keep` 제거로 CJK 글자단위 wrap → 4개 다 141px/2줄(ja·ko 모두 Playwright 실측,
  회귀 없음). `line-clamp-2`는 2줄 일관 클램프로 유지.
- [2026-06-14][i18n] 📋 **TODO(설계 보류 — 사용자 지시로 투두만 등록)**: `break-keep`+`text-pretty`를 **locale에
  따라 자동 적용**하는 유틸. 둘 다 프로젝트서 사실상 필수라 호출부마다 수동 분기 대신 자동화 원함. 후보 **A안**:
  ① `app/{ja,en}/layout.tsx`에 `lang` 래퍼(현재 없음 — root `<html lang="ko">` 고정이라 ja/en도 ko로 태깅, §4) ②
  globals에 `:lang(ko) .x{word-break:keep-all}` + 기본 `text-wrap:pretty; word-break:normal` 유틸 클래스(자동·무JS·
  a11y/SEO 부수개선) ③ 25개 `break-keep` 사용처 점진 마이그레이션 + 신규 `break-keep` 억제 lint. **미해결 결정**:
  유틸을 (pretty+break) 한 클래스로 묶을지 vs word-break만 분리할지. brainstorming 보류 상태.
- [2026-06-14][i18n] ✅ **생성/추출 흐름 데이터 lang 전파**(youtube 추출·AI 생성·재료 fetch): 클라 mutation이 V3
  `/dev/*` 위에 있으나 `?lang` 미전파라 ja/en 사용자가 ko 결과를 받던 갭. `createExtractionJobV2`/`checkYoutubeDuplicate`/
  `createAIRecipeJobV2`에 `lang` 추가(ko 생략) + job persist에 locale 캡처(제출·재시도 동일 locale) + 유튜브 trending
  서버 fetch lang + ja/en 페이지 전파. 설계/계획/테스트: `docs/superpowers/{specs,plans}/2026-06-13-i18n-create-flows-*`.
- [2026-06-14][i18n] ✅ **명령형 라우팅 locale 누락 클래스 수정**: `router.push`/`replace`가 하드코딩 경로를 써서
  ja에서 ko로 새던 버그(AI 컨셉 선택·플로팅 생성 버튼). `useLocalizedRouter`(LocalizedLink의 명령형 대칭짝, pathname
  기반 prefix, ko no-op) 추가 + `local/no-raw-router` eslint(**warn** — 기존 ~62곳 CI 안 깸, 점진 sweep 유도).
  AIModelSelection·AICreditDrawer·FloatingCreateRecipeButton 전환. 결정 기록(ADR): `docs/superpowers/specs/
2026-06-14-i18n-routing-strategy-decision.md`(custom 유지 vs next-intl — SEO 우려는 as-needed로 무효, custom의
  ko static-by-default가 실이점, 트리거 충족 시 재검토). **남은 sweep**: raw `router.push` ~62곳 + raw `next/link`
  하드코딩 href(no-raw-router는 useRouter만 잡음).

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
