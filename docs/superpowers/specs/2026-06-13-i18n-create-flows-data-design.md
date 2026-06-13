# 생성·추출·재료 fetch 흐름의 데이터 현지화 연결 (i18n data wiring)

> 작성일: 2026-06-13 · 브랜치: feature/17

## 배경

`2026-06-13-i18n-home-youtube-ai`는 홈·유튜브 추출·AI 생성 페이지의 **UI 카피**(정적 문구)를
ko/ja/en으로 번역했다. 이번 작업은 그 **데이터 레이어 보완**이다 — 국제 사용자(ja/en)가 아래 세
흐름을 실행할 때, API 호출에 활성 locale을 전파해 **결과 데이터 자체**가 현지 언어로 내려오게 한다.

- 유튜브 레시피 추출
- AI 레시피 생성
- 재료 fetch(검색·냉장고·AI 재료 선택)

카피 작업과 충돌 없음 — 그 설계의 데이터 전파는 홈 레시피 슬라이드(`getStaticRecipesOnServer`)만
다뤘고, 이 세 생성/추출 흐름의 호출은 손대지 않았다.

## 현재 상태 (코드 확인)

세 흐름 모두 이미 V3(`/dev/*`) i18n 엔드포인트 위에 있으나 **`lang`을 전파하지 않는다**:

| 흐름 | 현재 호출 | lang |
| --- | --- | --- |
| 유튜브 추출 | `POST /dev/recipes/youtube/extract` (params: url, imageGenModel)<br>`GET /dev/recipes/youtube/check` | ❌ |
| AI 생성 | `POST /dev/recipes/ai` (params: concept, imageGenModel) | ❌ |
| 재료 fetch | `GET /dev/search/ingredients`·`/ingredients`·`/me/fridge/items` | ❌ (`getIngredients`가 `Locale`을 import만 하고 미사용) |

- 읽기 흐름(레시피 상세·검색·재료 상세·홈 슬라이드)은 이미 명시적 `?lang`으로 현지화 완료.
- `apiClient`는 lang을 **전역 자동 주입하지 않음** — 호출부가 명시적으로 넘겨야 함.
- 클라이언트 locale 소스 존재: `useChromeLocale()`(pathname 해석) + `getStoredLocale()`(localStorage).
- 유튜브 페이지 서버 컴포넌트는 `getTrendingYoutubeRecipesOnServer()`를 **lang 없이** 호출 +
  `getDictionary("ko")` 하드코딩 → 이 흐름의 유일한 서버측 데이터 갭. AI 페이지는 `"use client"`라
  서버 fetch 없음.

## 백엔드 계약 (확정)

서버는 모든 `/api/**`에서 표시 언어를 우선순위로 결정한다:

```
?lang 쿼리 > 로그인 유저 preferred_locale > Accept-Language 헤더 > 기본 ko
```

- `?lang`이 **항상 최우선**이며 **비로그인도 동작**. 미지원 값은 무시하고 다음 단계로 fallback.
- 엔드포인트별 `@RequestParam`이 아니라 **전역 인터셉터** 처리라 Swagger 각 API에 lang이 안 보이는 게
  정상.

## 접근법 결정: 접근법 A (per-call `?lang`)

읽기 흐름이 이미 쓰는 명시적 `?lang` 패턴을 세 생성/추출 흐름에 그대로 확장한다.

- **앱 내 locale 선택을 우선순위 1로 확실히 honor** — pathname/저장값에서 고른 locale이 브라우저
  `Accept-Language`(우선순위 3)나 계정 `preferred_locale`(우선순위 2)을 덮는다.
- blast radius가 세 흐름에 국한, 기존 읽기 패턴과 일관.
- 기각: **B(전역 Accept-Language 주입)** = 우선순위 3이라 앱 선택을 못 덮고 전역 변경. **C(preferred_locale
  PUT)** = 로그인 전용 + 별 기능, 이번 범위 밖.

## 설계

### 1. 클라이언트 locale 소스 (신규)

- `resolveLocaleFromPath(pathname): Locale | null` — **명시적 prefix만**(`/ja`,`/en`) 해석, 없으면
  `null`. (기존 `resolveChromeLocale`은 prefix 없으면 `ko`를 반환해 저장값 fallback이 안 걸리므로 null
  반환 변형이 필요.)
- `useApiLocale(): Locale` = `resolveLocaleFromPath(pathname) ?? getStoredLocale() ?? "ko"`.
  → "pathname 우선, 저장값 fallback, 둘 다 없으면 ko".

### 2. lang 전파 (세 흐름)

| 흐름 | 변경 | locale 출처 |
| --- | --- | --- |
| 유튜브 추출 | `createExtractionJobV2`·`checkYoutubeDuplicate` params에 `lang`; 서버 `getTrendingYoutubeRecipesOnServer(lang)` | 클라: `useApiLocale()` / 서버: route locale |
| AI 생성 | `createAIRecipeJobV2` params에 `lang` | 클라: `useApiLocale()` |
| 재료 fetch | `getIngredients`(+ 이 흐름이 쓰는 names/units 호출) params에 `lang` | 클라: `useApiLocale()` |

- job 흐름(추출·AI)은 **생성(POST) 시점**에만 lang 필요 — 실제 추출/생성이 서버 job에서 일어나므로.
  status 폴링엔 불필요.

### 3. locale 값 정책 (ko/ja/en 균일)

활성 locale을 **그대로 전송**한다(특별 분기·필터 없음). ko/ja/en 모두 1급 타깃.

- 메커니즘이 locale-무관이라 백엔드가 어떤 locale을 지원하든 코드 변경 없이 작동.
- 백엔드가 특정 locale을 아직 미지원이면 인터셉터가 무시하고 fallback할 뿐(에러 아님) —
  FE는 그 경우에도 깨지지 않는다.

### 4. 캐시 / ISR 정합성

lang을 **항상 URL 쿼리에 포함**하므로 cross-locale 캐시 오염이 없다.

- fetch 캐시: Next App Router는 `fetch`를 URL(쿼리 포함) 기준으로 키잉 → `?lang=ja`·`?lang=ko`는 별개
  엔트리. (백엔드가 경고한 "static/revalidate 캐시에 locale 포함"을 이걸로 충족.)
- 라우트 ISR: `/ja/*`·`/en/*`·`/*`는 별개 라우트 세그먼트 → prerender/revalidate 엔트리도 별개.
- 세 흐름의 클라 mutation은 애초에 Next 캐시 대상이 아님(POST·client fetch).
- 무효화 태그는 locale-무관 유지(전 locale 동시 무효화, 허용).

### 5. 회귀(ko)

ko 사용자·ko 라우트(`/recipes/new/...`, `/`)는 `useApiLocale()`→`ko`, lang 생략 또는 `ko` → 현재 동작
불변.

## Acceptance Criteria

- ja 사용자가 유튜브 추출 시 생성 요청에 `lang=ja`가 실리고, 완료된 레시피 본문이 ja로 온다(백엔드 ja
  번역 존재 시).
- en 사용자 동일 흐름에 `lang=en`이 실린다.
- ja 사용자 AI 생성 요청에 `lang=ja`, 완료 본문 ja. en은 `lang=en`.
- ja 사용자가 재료 검색/냉장고/AI 재료 선택 시 재료명·카테고리가 ja로 온다. en은 `lang=en`.
- locale 소스: `/ja`·`/en` 라우트→해당 locale, prefix 없는 라우트→저장된 선호 locale, 둘 다 없으면 ko.
- ko 라우트·ko 사용자는 회귀 없이 동작(lang 생략 또는 `ko`).
- 유튜브 페이지의 서버 렌더 trending 데이터가 lang을 싣고, ko/ja/en 캐시 엔트리가 섞이지 않는다.
- 백엔드가 특정 locale을 미지원해도 FE는 에러 없이 동작한다(데이터만 fallback).

## Non-goals

- 백엔드 locale 지원 자체(데이터 번역 백필·en 추가는 BE 영역).
- 전역 apiClient locale 주입 / `preferred_locale` PUT (접근법 B/C 기각).
- 이 페이지들의 UI 카피 번역(`2026-06-13-i18n-home-youtube-ai`에서 처리).
- en 라우트 디렉토리 신설(별도 작업).
- 이 세 흐름 밖의 앱 전역 SSR locale 갭 정리.
