# 언어 스위처 + locale-sticky 네비게이션 — 수직 슬라이스

> 갱신일: 2026-06-13 · 브랜치: feature/17
> 설계: `2026-06-13-language-switcher-design.md` · 다음: designing-tests-from-requirements

데모 기준: 각 슬라이스는 "제품 오너에게 보여줄 수 있는 가치 스레드".

---

## 글로서리 (한 개념 = 한 단어)

| 단어 | 의미 | 코드 식별자 |
| --- | --- | --- |
| **locale** | ko·ja·en | `Locale` |
| **prefix** | URL의 `/en`·`/ja` 선두 세그먼트 | — |
| **localizedHref** | (bare path, locale) → prefix 적용 경로 | `localizedHref` |
| **stripLocale** | pathname → `{locale, barePath}` 분해 | `stripLocale` |
| **barePath** | locale prefix 없는 경로(`/recipes/1`) | `barePath` |
| **LocalizedLink** | 현재 locale을 href에 자동 prefix하는 `next/link` 래퍼 | `LocalizedLink` |
| **chrome** | 헤더·하단탭·푸터 | — |
| **스위처** | 설정 시트의 언어 선택 row | — |
| **선호 locale** | localStorage 저장값 | `PREFERRED_LOCALE`, `getStoredLocale`/`setStoredLocale` |

---

## Out of Scope (non-goals — 테스트 없음)

- 자동 locale 리다이렉트(저장값으로 ko URL 덮어쓰기) — 후속 phase
- 미로컬라이즈 목적지 404 회피용 라우트 레지스트리/폴백 — 안 만듦(점진 커버)
- 쿠키 기반 서버 리다이렉트, `<html lang>` per-locale — next-intl 후속
- chrome 외 전 앱 `<Link>` 일괄 전환 — 헬퍼·래퍼만 확립, 점진 적용
- 언어별 카피/번역 데이터 자체 — 기존 사전 시스템 소관

---

## 슬라이스

### Slice 1 — chrome 링크 stickiness (walking skeleton)

이 슬라이스 안에서 토대 생성: 순수 `localizedHref(path, locale)` + `LocalizedLink` 래퍼.
그 뒤 chrome 링크(헤더 nav·로고·My·하단탭·푸터)를 `LocalizedLink`로 교체.

**AC**
- `/en`·`/ja` 페이지에서 chrome 링크를 누르면 목적지가 현재 locale prefix를 유지한다
  (예: `/en`에서 헤더 "Recipe Search" → `/en/search`).
- ko(`/`)에서 chrome 링크는 prefix 없는 ko 경로 그대로다(회귀 무).
- `localizedHref("/search","ja")==="/ja/search"`, `localizedHref("/search","ko")==="/search"`.
- `localizedHref`는 외부 URL(`https://…`)·앵커(`#…`)·이미 `/ja`·`/en`로 시작하는 path를
  무변경으로 둔다(외부 링크 깨짐·이중 prefix 방지).

---

### Slice 2 — 설정 언어 스위처

대상: `features/auth/ui/SettingsActionButton` row 추가 + `stripLocale` + localStorage 헬퍼.

**AC**
- 설정 시트에 한국어 / 日本語 / English 선택 row가 있고, 현재 활성 언어가 선택 상태로 표시된다.
- 日本語 선택 시 현재 경로의 `/ja` 버전으로 이동하고 localStorage(`PREFERRED_LOCALE`)에 `ja`가 저장된다.
- 한국어 선택 시 prefix 없는 ko 경로로 이동한다.
- `stripLocale("/ja/recipes/1")==={locale:"ja",barePath:"/recipes/1"}`,
  `stripLocale("/recipes/1")==={locale:"ko",barePath:"/recipes/1"}`,
  `stripLocale("/ja")==={locale:"ja",barePath:"/"}`.
- `getStoredLocale()`은 손상/미지원 값(`"de"`·`""`)에 `null`을 반환한다.

---

## 순서

1 (skeleton, 토대 포함) → 2. 엣지는 소유 슬라이스에 접힘: 무변경 케이스(외부/앵커/이중prefix)·
ko 회귀 = Slice 1, stripLocale 경계·저장값 검증 = Slice 2.
