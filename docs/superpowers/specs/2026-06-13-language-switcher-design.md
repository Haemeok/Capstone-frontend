# 언어 스위처 + locale-sticky 네비게이션 — 설계

> 갱신일: 2026-06-13 · 브랜치: feature/17
> 선행: 공유 nav chrome i18n(`2026-06-13-chrome-nav-i18n-*`). Phase 1 비목표였던
> "언어 스위처/자동 리다이렉트"를 당겨 처리(자동 리다이렉트는 제외).

## 1. 배경 / 페인

로컬라이즈 페이지(`/en`·`/ja`)에서 헤더·하단탭·카드 링크가 **ko 경로로 하드코딩**돼,
`/en`에서 뭘 눌러도 ko로 튕긴다. 사용자가 매번 URL을 손으로 바꿔야 함. 또 선택한 언어를
기억하는 수단이 없다.

## 2. 핵심 결정 (확정)

- **동작 모델 = 링크 stickiness + 설정 스위처. 자동 리다이렉트 없음.**
  내부 링크가 현재 페이지 locale을 전파해 in-session 이동이 그 locale로 유지된다.
  ko URL로 직접 진입하면 ko로 보이고(스위처로 전환), 저장값이 ko URL을 덮어쓰지 않는다.
  (localStorage는 client 전용이라 서버 리다이렉트 불가 → 깜빡임 회피 위해 자동 리다이렉트 제외.)
- **링크 prefix는 일률 적용, 예외/레지스트리 없음.** 미로컬라이즈 목적지가 `/en`에서 404 나는 건
  점진적으로 페이지를 채워 해소한다(현재 i18n 미배포라 중간 404 수용). "안전한 예외 분기"를
  만들지 않는다 — 단순성 우선.
- **저장 = localStorage.** 자동 리다이렉트에 연결하지 않고, 스위처 현재값 표시 + 후속 phase seed로만.

## 3. 접근법

**B. `<LocalizedLink>` 래퍼 채택.** `next/link`를 감싸 `useChromeLocale()`로 현재 locale을 읽고
순수 함수 `localizedHref(href, locale)`로 prefix. 기존 `<Link>`를 점진적으로 `<LocalizedLink>`로
교체. prefix 로직 1곳. (대안 A: 호출부마다 `localizedHref` 직접 호출 — locale 인자 누락 위험으로 기각.)

## 4. 컴포넌트 / 데이터 흐름

### 4.1 순수 헬퍼 (`shared/i18n`)
- `localizedHref(path: string, locale: Locale): string`
  - `locale === "ko"` → `path` 그대로
  - ja/en → `/${locale}${path}`
  - 무변경 케이스(이중 prefix·깨짐 방지): 외부 URL(`http`로 시작)·앵커(`#`로 시작)·이미
    `/ja`·`/en` 세그먼트로 시작하는 path
- `stripLocale(pathname: string): { locale: Locale; barePath: string }`
  - `/ja/recipes/1` → `{ locale: "ja", barePath: "/recipes/1" }`
  - `/recipes/1` → `{ locale: "ko", barePath: "/recipes/1" }`
  - `/ja` → `{ locale: "ja", barePath: "/" }`
  - 스위처가 "현재 경로의 다른 locale 버전" 계산에 사용. `resolveChromeLocale`과 세그먼트
    경계 규칙 공유.

### 4.2 `<LocalizedLink>` 클라이언트 래퍼 (`shared/i18n`)
- `"use client"`. `useChromeLocale()` → `localizedHref(href, locale)` 적용 후 `next/link` 렌더,
  나머지 props 패스스루. 내부 내비게이션용 드롭인 교체.

### 4.3 chrome 링크 전환
- 헤더 `NAV_LINKS`(`/`·`/search`·`/ingredients`·`/recipes/new/ai`·`/recipes/new/youtube`),
  로고(`/`), My(`/users/[id]`), 하단탭 path 5개, 푸터 링크 → `LocalizedLink`로 교체.

### 4.4 언어 스위처 (설정 시트 `features/auth/ui/SettingsActionButton`에 row 추가)
- "언어 / Language" row: 한국어 / 日本語 / English.
- 선택 시: `setStoredLocale(next)` + `router.push(localizedHref(stripLocale(pathname).barePath, next))`.
- 현재 선택 표시: `stripLocale(pathname).locale` 우선, 보조로 `getStoredLocale()`.

### 4.5 localStorage 헬퍼 (`shared`)
- `PREFERRED_LOCALE` 키 상수(localStorage key 상수 모듈 규칙 준수).
- `getStoredLocale(): Locale | null`(유효 locale 검증, 손상값 무시), `setStoredLocale(locale)`.

## 5. Acceptance Criteria

- `/en` 페이지에서 `LocalizedLink` 클릭 → 목적지가 `/en/...`로 유지된다.
- ko(`/`)에서 `LocalizedLink` → prefix 없이 ko 경로 그대로(회귀 무).
- 설정에서 日本語 선택 → 현재 경로의 `/ja` 버전으로 이동 + localStorage에 `ja` 저장.
- 스위처가 현재 활성 언어를 선택 상태로 표시한다.
- `localizedHref("/search","ja")==="/ja/search"`, `localizedHref("/search","ko")==="/search"`,
  외부 URL(`https://…`)·`#anchor`·이미 `/ja`로 시작하는 path는 무변경.
- `stripLocale("/ja/recipes/1")` === `{locale:"ja",barePath:"/recipes/1"}`,
  `stripLocale("/recipes/1")` === `{locale:"ko",barePath:"/recipes/1"}`,
  `stripLocale("/ja")` === `{locale:"ja",barePath:"/"}`.
- `getStoredLocale()`는 손상/미지원 값(`"de"`, `""`)에 `null`을 반환한다.

## 6. Non-goals (테스트 없음)

- 자동 locale 리다이렉트(저장값으로 ko URL 덮어쓰기) — 후속 phase.
- 미로컬라이즈 목적지 404 회피용 라우트 레지스트리/폴백 — 만들지 않음(점진 커버).
- 쿠키 기반 서버 리다이렉트, `<html lang>` per-locale — next-intl 후속.
- chrome 외 전 앱 `<Link>` 일괄 전환 — 헬퍼·래퍼만 확립하고 점진 적용.
- 언어별 별도 카피/번역 데이터 자체 — 기존 사전 시스템 소관.
