# 슬라이스 — 생성·추출·재료 fetch 데이터 현지화

> 작성일: 2026-06-13 · 브랜치: feature/17 · 설계: `2026-06-13-i18n-create-flows-data-design.md`

## 글로서리 (Ubiquitous Language — 개념당 한 단어)

| 단어 | 의미 |
| --- | --- |
| **locale** | 활성 표시 언어(`ko`/`ja`/`en`). 와이어(쿼리)로는 `lang` 키로 전송 — 개념은 locale, 백엔드 파라미터명은 `lang`. |
| **active locale** | pathname prefix(`/ja`,`/en`) 우선, 없으면 저장된 선호값, 둘 다 없으면 `ko`로 해석된 현재 locale. |
| **resolve** | pathname/저장값에서 active locale을 도출하는 행위(`resolveLocaleFromPath` → `useApiLocale`). |
| **extract** | 유튜브 영상에서 레시피를 추출(비동기 job). |
| **generate** | AI가 레시피를 생성(비동기 job). |
| **ingredient fetch** | 재료 검색·냉장고 목록·재료 선택 목록 조회. |
| **job** | extract/generate의 비동기 작업. locale은 **생성(POST) 시점**에 고정. |
| **fallback** | 백엔드가 해당 locale을 미지원하면 ko로 떨어지는 동작(에러 아님). |

## Non-goals (이 기능이 하지 않는 것 — 테스트 없음)

- 백엔드의 locale 지원/데이터 번역 백필 자체(BE 영역).
- 전역 `apiClient` locale 주입 / `preferred_locale` PUT(접근법 B/C 기각).
- 이 페이지들의 UI 카피 번역(`2026-06-13-i18n-home-youtube-ai`에서 처리).
- en 라우트 디렉토리 신설(별도 작업).
- job **status 폴링**에 lang 부착(완료 콘텐츠 언어는 생성 시점에 고정되므로 불필요).
- 이 세 흐름 밖의 앱 전역 SSR locale 갭 정리.

## 슬라이스

### 슬라이스 1 (walking skeleton) — 재료 fetch가 active locale로 현지화된다

가장 얇은 end-to-end 스레드. 공유 sliver인 `resolveLocaleFromPath` + `useApiLocale`를 **이 슬라이스
안에서** 만들고, `getIngredients`(+ 이 흐름이 쓰는 names/units 조회)에 lang을 붙인다.

**Acceptance Criteria**

- `/ja` 라우트에서 재료 검색·냉장고·재료 선택 목록 조회 시 호출 URL에 `lang=ja`가 붙고, 재료명·카테고리가
  ja로 표시된다.
- `/en` 라우트에서 동일 조회 시 URL에 `lang=en`이 붙는다.
- prefix 없는 라우트에서 저장된 선호 locale이 `ja`면 조회 URL에 `lang=ja`가 붙는다.
- prefix도 저장값도 없으면 lang은 `ko`이거나 생략되어 현재(한국어) 동작이 유지된다.
- 백엔드가 해당 locale 재료 데이터를 미지원해도 에러 없이 ko 데이터로 표시된다(fallback).

### 슬라이스 2 — 유튜브 추출 결과가 active locale로 온다

`createExtractionJobV2`·`checkYoutubeDuplicate`(클라)에 active locale의 lang 부착 +
유튜브 페이지 서버 컴포넌트 `getTrendingYoutubeRecipesOnServer(lang)` 현지화.

**Acceptance Criteria**

- ja 사용자가 유튜브 추출을 시작하면 extract 생성 요청에 `lang=ja`가 실리고, 완료된 레시피 본문이 ja로
  온다(백엔드 ja 번역 존재 시).
- en 사용자는 extract 요청에 `lang=en`이 실린다.
- 중복 체크(check) 요청에도 active locale의 lang이 실린다.
- `/ja` 유튜브 페이지의 서버 렌더 trending 목록이 `lang=ja`로 조회되며, ko/ja/en 캐시 엔트리가 섞이지
  않는다.
- ko 라우트·ko 사용자는 lang 생략 또는 `ko`로 회귀 없이 동작한다.

### 슬라이스 3 — AI 생성 결과가 active locale로 온다

`createAIRecipeJobV2`(클라)에 active locale의 lang 부착.

**Acceptance Criteria**

- ja 사용자가 AI 생성을 시작하면 생성 요청에 `lang=ja`가 실리고, 완료된 레시피 본문이 ja로 온다.
- en 사용자는 생성 요청에 `lang=en`이 실린다.
- 4개 concept(`INGREDIENT_FOCUS`·`COST_EFFECTIVE`·`NUTRITION_BALANCE`·`FINE_DINING`) 모두 동일하게
  lang이 전파된다.
- ko 라우트·ko 사용자는 lang 생략 또는 `ko`로 회귀 없이 동작한다.

## 순서

walking skeleton(슬라이스 1, 리졸버 포함) → 슬라이스 2 → 슬라이스 3. 이 순서가 writing-plans의 task
순서가 된다.
