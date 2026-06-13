# 언어 스위처 — 테스트 설계

> 갱신일: 2026-06-13 · 브랜치: feature/17
> 슬라이스: `2026-06-13-language-switcher-slices.md` · 다음: writing-plans

## 레이어 소유 원칙

- **unit** — 순수 함수 `localizedHref`·`stripLocale`·`getStoredLocale`. 입출력 매핑/검증 로직 소유.
- **acceptance(component)** — `LocalizedLink`가 현재 locale로 prefix된 anchor를 렌더하는가(사용자 seam:
  래퍼가 실제로 usePathname+헬퍼를 쓰는가), 스위처 select가 올바른 경로로 이동+저장하는가.
- **재검증 안 함** — `useChromeLocale`/`resolveChromeLocale`(기존, chrome i18n에서 소유), `next/link` 자체.
- **change-detector 회피** — 스위처는 선택상태/이동타깃 *행동*만 단언, 라벨 문자열 전수 등식 금지.

---

## 매트릭스

### Slice 1 — chrome 링크 stickiness

| AC | 시나리오 (실제값) | Test ID | Owner | Risk |
| --- | --- | --- | --- | --- |
| AC1-3 | `localizedHref` 테이블: `("/search","ja")→"/ja/search"`, `("/search","en")→"/en/search"`, `("/search","ko")→"/search"`, `("/","ja")→"/ja"`(root 이중슬래시 금지), `("/","ko")→"/"` | T-01 | unit | integrity |
| AC1-4 | `localizedHref` 무변경: `("https://x.com/a","ja")` 그대로, `("#top","ja")` 그대로, `("/ja/search","ja")` 그대로(이중 prefix 방지) | T-02 | unit | **integrity**(외부링크 깨짐) |
| AC1-1 | `usePathname="/en/recipes/1"`, `<LocalizedLink href="/search">` 렌더 → anchor `href="/en/search"` | T-03 | accept | correctness |
| AC1-2 | `usePathname="/"`, `<LocalizedLink href="/search">` → anchor `href="/search"`(prefix 없음) | T-04 | accept | **integrity**(ko 회귀) |

### Slice 2 — 설정 언어 스위처

| AC | 시나리오 | Test ID | Owner | Risk |
| --- | --- | --- | --- | --- |
| AC2-4 | `stripLocale("/ja/recipes/1")→{ja,"/recipes/1"}`, `("/recipes/1")→{ko,"/recipes/1"}`, `("/ja")→{ja,"/"}`, `("/engine")→{ko,"/engine"}`(경계) | T-05 | unit | integrity |
| AC2-5 | `getStoredLocale`: `"ja"`저장→`"ja"`, `"de"`저장→`null`, `""`→`null`, 미설정→`null` | T-06 | unit | integrity |
| AC2-1 | `usePathname="/en/recipes/1"`로 설정 시트 렌더 → 한국어/日本語/English row 존재, **English**가 선택상태 | T-07 | accept | correctness |
| AC2-2 | 설정에서 日本語 select → `router.push("/ja/recipes/1")` 호출 + localStorage `PREFERRED_LOCALE==="ja"` | T-08 | accept | correctness |
| AC2-3 | `usePathname="/en/recipes/1"`에서 한국어 select → `router.push("/recipes/1")`(prefix 없음) | T-09 | accept | correctness |

---

## 커버리지 게이트

- AC1-1→T-03, AC1-2→T-04, AC1-3→T-01, AC1-4→T-02, AC2-1→T-07, AC2-2→T-08, AC2-3→T-09,
  AC2-4→T-05, AC2-5→T-06. **빠진 AC 없음.**
- acceptance 레이어 존재: T-03/04(LocalizedLink), T-07/08/09(스위처). unit만 아님.
- happy + edge: 무변경 케이스(T-02), ko 회귀(T-04), 경계(T-05), 손상값(T-06).
- owner-layer 중복 없음: prefix 매핑은 T-01만, LocalizedLink(T-03/04)는 wiring만 잡음.

## Non-goals (테스트 없음 — 의도된 부재)

- 자동 locale 리다이렉트 · 404 회피 레지스트리 · 쿠키/서버 리다이렉트 · `<html lang>`
- chrome 외 전 앱 `<Link>` 일괄 전환 · 카피/번역 데이터

## TDD 순서 (writing-plans task 순서)

T-01(localizedHref) → T-03/T-04(LocalizedLink + chrome 전환, 회귀) → T-02(엣지) →
T-05/T-06(stripLocale/store units) → T-07/T-08/T-09(스위처).

> 맵일 뿐 — TDD에서 한 번에 한 테스트(red→green→refactor). 지금 전체 테스트 코드 미리 쓰지 않음.
