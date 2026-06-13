# 공유 nav chrome i18n — 테스트 설계 (Phase 2a)

> 갱신일: 2026-06-13 · 브랜치: feature/17
> 슬라이스: `2026-06-13-chrome-nav-i18n-slices.md` · 설계: `...-design.md`
> 다음 단계: writing-plans (각 task의 실패 테스트가 아래 Test ID를 인용)

## 레이어 소유 원칙 (이 피처 한정)

- **unit** — `useChromeLocale(pathname)`는 순수 함수. prefix→locale 매핑(경계 포함)을 소유.
- **acceptance(component)** — 위젯이 모킹된 pathname에서 올바른 locale 라벨을 렌더하는가.
  매핑이 아니라 **"위젯이 실제로 chrome 훅을 쓰고 Provider 바깥에서도 throw 없이 렌더되는가"**
  (unit이 구조적으로 못 잡는 것 = 사용자 seam)를 소유.
- **독립 테스트 안 함:** `useChromeDict`(= `navMessages[useChromeLocale()]`, 합성이라 component +
  useChromeLocale로 전이 커버), `plural()`/`format()`(기존 `format.test` 소유 → 재검증 금지),
  사전 완전성(타입 게이트), 정적 보존(build 불변식).
- **change-detector 회피:** 위젯당 ~15개 문자열을 등식으로 재진술하지 않는다. **대표 라벨 1~2개 +
  locale 전환 불변식**만. (code-quality `test-change-detector`/`test-tuning-constants`.)

---

## 시나리오 → Test ID 매트릭스

### Slice 1 — 하단탭 (walking skeleton)

| AC | 시나리오 (Given/When/Then, 실제값) | Test ID | Owner | Risk |
| --- | --- | --- | --- | --- |
| AC1-1 | pathname=`/en/recipes/1` → BottomNavBar에 "Home","Search" 노출 | T-01 | accept | correctness |
| AC1-1 | pathname=`/ja/recipes/1` → "ホーム","検索" 노출 | T-02 | accept | correctness |
| AC1-1·AC1-2 | pathname=`/` → "홈","검색","냉장고","AI 레시피" (변경 전과 동일) | T-03 | accept | **integrity**(ko 회귀) |
| AC1-3 | `useChromeLocale`: `/`→ko, `/en`→en, `/en/`→en, `/en/recipes/1`→en, `/ja`→ja, `/engine`→ko, `/news`→ko, `/english`→ko | T-04 | unit | **integrity**(경계) |
| AC1-4 | `nav`에서 en 키 하나 제거 시 `tsc --noEmit` 실패 / 셋 다 채우면 통과 | TG-1 | 타입시스템 | integrity |
| AC1-5 | chrome 경로에 `next/headers`(`headers`/`cookies`) import 신규 0 → 페이지 정적 유지 | INV-1 | build/review | integrity |

### Slice 2 — 데스크톱 헤더

| AC | 시나리오 | Test ID | Owner | Risk |
| --- | --- | --- | --- | --- |
| AC2-1 | pathname=`/en` → DesktopHeader에 "Recipe Search","Login" 노출 | T-05 | accept | correctness |
| AC2-1·AC2-4 | pathname=`/` → "레시피 검색","로그인" (변경 전과 동일) | T-06 | accept | **integrity**(ko 회귀) |
| AC2-2 | NotificationButton, `/en`, unreadCount=3 → aria에 영어 plural형 + "3" 포함 | T-07 | accept | correctness |
| AC2-2 | NotificationButton, `/en`, unreadCount=0 → 기본 aria(미읽음 절 없음) | T-08 | accept | boundary |
| AC2-3 | `/en` → AppInstallButton "Install"(label+aria), SavedRecipeBooks aria+toast 영어, UserProfileHeader "Profile" | T-09 | accept | correctness |
| AC2-3·AC2-4 | `/` → 위 셋 한국어 그대로(앱 설치/저장한 레시피북/프로필) | T-10 | accept | **integrity**(ko 회귀) |

### Slice 3 — 데스크톱 푸터

| AC | 시나리오 | Test ID | Owner | Risk |
| --- | --- | --- | --- | --- |
| AC3-1 | pathname=`/en` → DesktopFooter에 "Service"/"Support" 섹션 제목, 영어 태그라인, "Terms of Service" 링크 라벨 | T-11 | accept | correctness |
| AC3-1·AC3-4 | pathname=`/` → "서비스"/"고객지원", 한국어 태그라인(변경 전과 동일) | T-12 | accept | **integrity**(ko 회귀) |
| AC3-2 | `/en` → 푸터에 "도원진","recipio.cs@gmail.com","Copyright © 2026 Team Recipio","레시피오 (Recipio)" 그대로(비번역) | T-13 | accept | **integrity**(과번역 방지) |
| AC3-3 | `/en` → 이용약관 링크 href==="/terms", 개인정보 href==="/privacy"(ko 목적지) | T-14 | accept | integrity |

---

## 커버리지 게이트

- 모든 AC에 ≥1 Test ID: AC1-1→T-01/02/03, AC1-2→T-03, AC1-3→T-04, AC1-4→TG-1, AC1-5→INV-1,
  AC2-1→T-05/06, AC2-2→T-07/08, AC2-3→T-09/10, AC2-4→T-06/10, AC3-1→T-11/12, AC3-2→T-13,
  AC3-3→T-14, AC3-4→T-12. **빠진 AC 없음.**
- acceptance 레이어 존재: 위젯 렌더 테스트가 사용자 seam(✓ unit만 있는 게 아님).
- happy + edge: 경계(T-04 오매칭, T-08 unread 0), 회귀(T-03/06/10/12), 과번역(T-13) 포함.
- owner-layer 중복 없음: 매핑은 T-04(unit)만, 위젯은 wiring/회귀만 — 각자 상대가 못 잡는 것.

## Non-goals (테스트 없음 — 의도된 부재)

- `<html lang>` per-locale · CategoryTabs/Toast/common · `RecipeNavBarButtons`
- 푸터 고유명사/이메일/Copyright/브랜드 **번역**(T-13은 *비번역 유지*를 검증, 번역을 검증하지 않음)
- 법적 페이지 *목적지* 번역(T-14는 href가 ko로 *유지*됨을 검증)
- 언어 스위처/자동 리다이렉트

## TDD 순서 (writing-plans task 순서로)

T-04(unit, 매핑) → T-01/02/03(하단탭 walking skeleton + ko 회귀) → T-05~T-10(헤더, plural 포함)
→ T-11~T-14(푸터). TG-1/INV-1은 슬라이스 1 완료 시점에 `tsc`/import 점검으로 확인.

> 주의: 위는 **맵**이다. TDD에서 한 번에 한 테스트(red→green→refactor)로 구현한다. 지금 전체 테스트
> 코드를 미리 쓰지 않는다.
