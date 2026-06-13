# 공유 nav chrome i18n — 수직 슬라이스 (Phase 2a)

> 갱신일: 2026-06-13 · 브랜치: feature/17
> 설계: `2026-06-13-chrome-nav-i18n-design.md` (접근법 A — client usePathname 해석)
> 다음 단계: designing-tests-from-requirements (각 슬라이스 AC를 매트릭스 왼쪽 칸으로)

각 슬라이스의 데모 기준: **"`/en`(또는 `/ja`)으로 들어가서 해당 chrome 표면이 그 언어로
보이고, 루트(ko)는 그대로다"** — 제품 오너에게 보여줄 수 있는 가치 스레드.

---

## 글로서리 (Ubiquitous Language — 한 개념 = 한 단어)

| 단어 | 의미 | 코드 식별자 |
| --- | --- | --- |
| **locale** | ko·ja·en (✋ "언어"/"lang" 금지) | `Locale`, `locale` |
| **chrome** | 페이지를 가로지르는 공통 UI (헤더·하단탭·푸터) | — |
| **nav** | chrome 문자열의 사전 네임스페이스 | `Dictionary["nav"]` |
| **사전(dictionary)** | locale별 messages 객체 | `getDictionary`, `dict` |
| **prefix** | URL의 `/en`·`/ja` 선두 세그먼트 | — |
| **하단탭** | 모바일 하단 네비게이션 바 | `BottomNavBar` |
| **헤더** | 상단 네비게이션 | `DesktopHeader` 외 |
| **푸터** | 데스크톱 하단 정보 영역 | `DesktopFooter` |
| **미읽음(unread)** | 알림 미읽음 건수 | `unreadCount` |
| **타입 게이트** | `Dictionary` 타입이 키 누락을 강제 | — |
| **chrome 훅** | URL prefix로 locale 자가판단 + nav lookup | `useChromeLocale`, `useChromeDict` |

---

## Out of Scope (non-goals — 테스트 없음)

- `<html lang>` per-locale 전환 (root layout 전용 → next-intl 후속, 보드 §4)
- CategoryTabs · Toast · 공통 버튼(`common` 네임스페이스) — 범위 "네비게이션만"
- `RecipeNavBarButtons` (레시피 상세 전용 헤더) — 레시피 상세 잔여 chrome
- 푸터 대표명(도원진)·이메일·Copyright·브랜드명(레시피오/Recipio) **번역 안 함**(리터럴 유지)
- 푸터 법적/공지 페이지 *목적지* 번역 — 라벨만 번역, href는 ko 유지 (🔵 별도 결정)
- 언어 스위처 / 자동 locale 리다이렉트 (Phase 1 비목표)

---

## 슬라이스

### Slice 1 — 하단탭 로케일화 (walking skeleton)

가장 얇은 end-to-end 스레드. 이 슬라이스 **안에서** 토대를 만든다: `nav` 네임스페이스 +
`messages/nav/{ko,ja,en}.ts`(최소 하단탭 키) + `useChromeLocale` + `useChromeDict`.
이후 슬라이스는 이 토대를 재사용한다. ("토대만 따로 만드는 task"는 만들지 않는다.)

대상 위젯: `BottomNavBar` (홈/검색/냉장고/AI 레시피).

**AC**
- `/en`·`/en/...`에서 하단탭이 Home/Search/Fridge/AI Recipe, `/ja`는 일본어, 루트는
  홈/검색/냉장고/AI 레시피를 렌더한다.
- 루트(ko) 경로에서 하단탭 라벨이 변경 전과 **글자 단위 동일**하다(회귀).
- `useChromeLocale`이 `/engine`·`/news` 같은 모호 prefix에 `ko`를 반환한다(세그먼트 경계 안전:
  `=== "/en"` 또는 `startsWith("/en/")`만 매칭).
- `Dictionary.nav`에 키를 추가하면 ko/ja/en 중 하나라도 비었을 때 `tsc --noEmit`이 실패한다
  (타입 게이트).
- 이 슬라이스가 `headers()`/`cookies()`를 새로 도입하지 않는다(정적 렌더 보존).

---

### Slice 2 — 데스크톱 헤더 로케일화

대상 위젯: `DesktopHeader`(nav 링크 + 로그인), `AppInstallButton`, `NotificationButton`,
`SavedRecipeBooksButton`, `UserProfileHeader`.

**AC**
- `/en`·`/ja`에서 헤더 nav(홈/레시피 검색/냉장고/AI 레시피/유튜브 레시피)와 로그인 라벨이
  해당 locale로 표시된다; 루트는 ko 동일.
- 미읽음 N건일 때 en/ja에서 알림 aria-label이 해당 locale의 **plural형 + N 치환**으로 나온다;
  0건이면 plural 절 없는 기본 aria("알림 페이지로 이동" 상당).
- 앱 설치·저장한 레시피북 버튼의 라벨/aria-label과 저장 토스트 문구, 프로필 헤더 라벨이
  locale로 표시된다; 루트 ko 동일.
- 루트(ko)에서 헤더 전체가 변경 전과 동일하다(회귀).

---

### Slice 3 — 데스크톱 푸터 로케일화

대상 위젯: `DesktopFooter`.

**AC**
- `/en`·`/ja`에서 푸터 섹션 제목(서비스/고객지원)·태그라인·법적 링크 라벨(이용약관/개인정보/
  오류제보/광고·제휴 문의/저작권 신고)이 해당 locale로 표시된다.
- 대표명·이메일 주소·Copyright 라인·브랜드명(레시피오/Recipio)은 **모든 locale에서 동일**하다
  (번역 안 함 — non-goal).
- 법적 링크의 href 목적지는 모든 locale에서 ko 페이지로 동일하다(라벨만 번역).
- 루트(ko)에서 푸터 전체가 변경 전과 동일하다(회귀).

---

## 순서

1 (skeleton, 토대 포함) → 2 → 3. 엣지는 소유 슬라이스에 접힘: 세그먼트 경계 안전·타입 게이트·
정적 보존 = Slice 1, 미읽음 plural = Slice 2, 비번역 리터럴 = Slice 3. ko 회귀는 세 슬라이스 공통 AC.
