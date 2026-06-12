# 공유 nav chrome i18n — 설계 (Phase 2a)

> 갱신일: 2026-06-13 · 브랜치: feature/17 · 접근법: A (client pathname 해석)
> 상위 보드: `I18N-STATUS.md` §4 (글로벌/공유 영역 — 헤더/하단탭/푸터)

## 1. 배경 / 동기

지금까지 i18n은 페이지 단위(`/recipes/[recipeId]`, `/search/results`)로만 ja/en 완료.
다음 작업 단위는 "페이지"가 아니라 **모든 페이지를 가로지르는 공유 chrome**이다. 이유:

- 홈을 포함한 모든 신규 로컬라이즈 페이지는 헤더/하단탭/푸터를 공유하는데, 이 chrome이
  한국어로 박혀 있어 "본문은 영어, 네비는 한국어" 혼합 상태가 모든 페이지에서 재발한다
  (검색 버그 `cff77e47`에서 이미 당한 실패 모드).
- chrome은 백엔드 `availableLocales`/locale sitemap 대기와 **무관**하게 진행 가능.
- chrome을 먼저 끝내면 홈(Phase 2b)은 하드코딩 3~4개만 남아 거의 자동으로 풀린다.

## 2. 기존 i18n 아키텍처 요약 (이 설계가 올라타는 토대)

세 층:

1. **소스** — `shared/i18n/messages/{ko,ja,en}.ts`. 같은 `Dictionary` 타입을 따르는 객체 3개.
   타입이 세 파일의 키를 동일하게 강제(키 누락 = `tsc` 실패) = **타입 게이트**.
2. **locale 출처** — URL 폴더가 결정. `app/en/.../page.tsx`가 `locale="en"`을 하드코딩하고
   prop으로 아래로 내림. 루트(`app/...`) = `ko` 기본. 마법 없음, 정적으로 확정.
3. **배포(문자열 전달)** — 두 경로:
   - **서버**: `getDictionary(locale)` → `t.xxx`. 서버 컴포넌트에서 호출, SSR HTML에 번역
     텍스트가 구워짐(SEO가 봄). `"use client"` 불필요.
   - **클라**: 서버 컴포넌트가 `const t = getDictionary(locale)` 후 `<DictionaryProvider dict={t}>`로
     client 경계에 넘김(직렬화 1회). 안의 client 잎이 `useT()`로 context에서 읽음. Provider
     없으면 throw.

예 (레시피 상세, 서버 컴포넌트 `RecipeDetailView`):

```
app/en/recipes/[id]/page.tsx → locale="en"
  → RecipeDetailView (server): const t = getDictionary("en")
      <DictionaryProvider dict={t}>
        <ClientLeaf/>          // useT()로 en 읽음
        <ServerChild locale="en"/>
      </DictionaryProvider>
```

## 3. chrome이 예외인 이유 (해결할 문제)

헤더/하단탭/푸터는 페이지 래퍼 밑이 아니라 `src/app/layout.tsx`(루트 layout)에 **단 한 번**
렌더되어 모든 페이지 *위에* 위치한다. 이 layout은 ko·en·ja가 공유한다(전용 `app/en/layout.tsx`
없음). 결과:

- layout은 내려보낼 **`locale` prop이 없다**(URL을 모름, 정적 폴더라 `[locale]` param 없음).
- chrome은 모든 페이지의 `DictionaryProvider` **바깥**에 있다.

→ chrome은 "prop 내림" 패턴을 못 쓴다.

현재 인스코프 chrome 위젯은 **전부 이미 `"use client"`**: `DesktopHeader`, `BottomNavBar`,
`DesktopFooter`, `HomeHeader`, `AppInstallButton`, `NotificationButton`, `SavedRecipeBooksButton`,
`UserProfileHeader`. (`RecipeNavBarButtons`만 server지만 레시피 상세 전용 헤더라 글로벌 nav 아님 →
이 슬라이스 제외, 레시피 상세 잔여 chrome으로 분류.)

## 4. 접근법 결정

**채택: A — client `usePathname()` 자가판단.**

chrome 위젯이 이미 client + 일부는 이미 `usePathname()` 사용. 작은 client 훅이 URL 프리픽스로
locale을 스스로 판단해 nav 사전을 lookup한다. layout 구조·root layout 무변경, 정적 렌더 보존
(`headers()`/`cookies()` 미도입), 신규 client 전환 0(전부 이미 client).

기각:
- **B (per-locale layout 세그먼트)**: `app/en·ja/layout.tsx` + ko route group 신설. 서버 dict와
  일관되나 chrome을 root에서 들어내는 큰 리팩터 + 전환 중 chrome 중복 위험. nav가 이미
  client+pathname이라 비용 대비 이득 작음.
- **C (middleware `x-locale` 헤더 → root `headers()`)**: `headers()`가 root layout 전체를 dynamic으로
  deopt → SEO 정적 생성 전부 깨짐. 부적합.

## 5. 설계 상세

### 5.1 사전 `nav` 네임스페이스

`Dictionary`에 `nav` 추가. 단일 소스를 `shared/i18n/messages/nav/{ko,ja,en}.ts`로 분리하고
메인 `messages/{ko,ja,en}.ts`가 spread해서 합친다 → **chrome client 번들엔 nav 슬라이스만**
들어가 다른 네임스페이스(recipeDetail/search 등) 누출 0. 타입 게이트는 그대로 유지.

```
nav: {
  home, search, fridge, aiRecipe, youtubeRecipe, login, profile,
  install, installAria,
  notificationsAria,                  // "알림 페이지로 이동"
  notificationsUnreadAria: Plural,    // "{count}개 미읽음" — format()/plural() 재사용
  unreadBadgeAria: Plural,            // "{count}개의 읽지 않은 알림"
  savedBooksAria, savedBooksToast,
  footer: {
    sectionService, sectionSupport, tagline, businessInfoToggleAria,
    terms, privacy, reportError, adInquiry, copyrightReport,
    ceoLabel, csLabel, adLabel
  }
}
```

**번역하지 않음(사전 제외, 리터럴 유지):** 대표명(도원진)·이메일 주소·브랜드명(레시피오/Recipio)·
Copyright 라인. 푸터 법적 링크는 **라벨만** 로컬라이즈하고 목적지 페이지는 ko 유지(공지/약관은
`I18N-STATUS.md` 🔵 별도 결정 대상).

### 5.2 해석 메커니즘 (신규)

`shared/i18n`에 둘 추가:

- `useChromeLocale(): Locale` — `usePathname()`을 읽어 **세그먼트 경계 안전**하게 판정.
  `pathname === "/en" || pathname.startsWith("/en/")` → `"en"`, ja 동일, 그 외 `"ko"`.
  `/engine`·`/news` 같은 오매칭 금지.
- `useChromeDict(): Dictionary["nav"]` — `messages/nav/*` 3개 import 후 `useChromeLocale()`로 pick.
  chrome 전용 client 소비 경로. (페이지는 기존 서버 `getDictionary`+Provider 그대로 — 소스 동일
  nav 파일, 전달 경로만 다름.)

각 chrome 위젯의 하드코딩 문자열을 `useChromeDict()` lookup으로 교체.

### 5.3 ko에 대한 영향 (중요)

chrome 위젯은 ko·en·ja 공유라 **ko도 사전 경유로 전환된다.**

- **화면/동작**: 무변화. "홈"은 그대로 "홈"(JSX 리터럴 → `nav.ko`로 이사만).
- **코드/blast radius**: ko chrome도 `useChromeDict()`로 읽으므로 ko가 **회귀 검증 대상**에 포함.
  공유물을 건드리니 en/ja뿐 아니라 ko 화면이 그대로인지 반드시 확인(검색 버그의 "page 0만
  영어였던 hydration 마스킹" 교훈).
- **페이지 본문(non-chrome)**: 무영향. 이 슬라이스는 헤더/하단탭/푸터만 건드림.

ko를 비껴가지 않는 이유: ko만 리터럴로 남기면 컴포넌트를 ko용/번역용으로 쪼개야 하는 중복(성급한
추상화). 공유 컴포넌트 i18n 정석은 모든 locale을 한 사전에서 먹이는 것 — ko는 그 사전의 한 줄이 된다.

## 6. Acceptance Criteria

- pathname이 `/en`·`/en/...`이면 헤더·하단탭·푸터 전부 영어 라벨, `/ja`·`/ja/...`면 일본어,
  그 외(루트 ko) 한국어를 렌더한다.
- 루트 ko 경로에서 chrome 라벨은 변경 전과 글자 단위로 동일하다(홈/검색/냉장고/AI 레시피 등).
- 미읽음 알림 N건일 때 en/ja에서 알림 aria-label이 해당 locale의 plural형 + N 치환으로 나온다.
- `Dictionary.nav`에 키를 추가하면 ko/ja/en 셋 다 채우지 않는 한 `tsc --noEmit`이 실패한다.
- `useChromeLocale`이 `/engine` 같은 모호 프리픽스에 `ko`를 반환한다(세그먼트 경계 안전).
- 이 변경으로 정적 렌더에서 빠지는 페이지가 0이다(no `headers()`/`cookies()` 신규 도입).

## 7. 테스트 원칙 (designing-tests-from-requirements 입력)

> 상세 매트릭스는 vertical-slicing → designing-tests 단계에서 슬라이스별 AC로 펼친다. 여기선 원칙만.

- **로직 소유는 가장 낮은 한 층:** pathname→locale 매핑은 `useChromeLocale`(사실상 순수 함수)이
  소유 → 테이블 테스트(`/`, `/en`, `/ja`, `/en/recipes/x`, `/engine` 오매칭 가드, `/ja` 중첩).
- **타입 게이트가 소유하는 건 테스트 안 씀:** nav 사전 완전성(ko/ja/en 키 일치)은 `Dictionary`
  타입이 강제 → 중복 테스트 금지.
- **기존 인프라가 소유하는 건 재검증 안 씀:** plural/치환은 기존 `format`/`plural` 테스트 소유.
- **공유 컴포넌트 회귀 1개:** `usePathname` 모킹 후 chrome 위젯이 (a) 루트에서 ko 라벨 유지,
  (b) `/en`에서 영어 라벨 노출 — 스모크 최소.
- change-detector 금지: 사전 값 N개를 등식으로 재진술하지 말 것. 불변식(경계 매핑) + 스모크 1개.

## 8. Non-goals (이 슬라이스 밖)

- `<html lang>` per-locale 전환(root layout에서만 가능 → next-intl 후속, 보드 §4).
- CategoryTabs·Toast·공통 버튼(`common` 네임스페이스) — 범위 "네비게이션만"으로 한정.
- `RecipeNavBarButtons`(레시피 상세 전용 헤더) — 레시피 상세 잔여 chrome.
- 푸터 법적/공지 페이지 *목적지* 번역(🔵 별도 결정).
- 언어 스위처/자동 리다이렉트(Phase 1 비목표, 후속).
