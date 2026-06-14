# i18n B+C 설계 — 에러 바운더리 · 로그인 · 알림 · 레시피 상세 콘텐츠

> 날짜: 2026-06-14 · 브랜치: feature/17
> 출처: `I18N-STATUS.md` 교차검증으로 발견한 (B) "done 표시인데 한글 잔존" + (C) "유저 플로우 미착수".
> 캘린더(C-3)는 다른 에이전트 진행 중이라 **스코프 제외**.

## 배경

`I18N-STATUS.md`는 일부 페이지를 🟢(완료)로 표시하나, 실제 코드에는 한글이 남아 있다.
원인은 "콘텐츠 누락"이 아니라 **에러/메타 계층**과 **공유 컴포넌트**가 사전 시스템에
연결되지 않은 것. 본 설계는 두 묶음을 다룬다.

- **B** — 보드 done이지만 한글 잔존: 공유 에러 바운더리, 카테고리 메타데이터, search/results 정리, 레시피 상세 콘텐츠
- **C** — 유저 플로우 미착수: 로그인, 알림 (캘린더 제외)

## 공통 원칙

- **번역 품질:** ja/en은 현지 IT PM이 직접 작성한 톤. 직역 금지, 레시피 앱 도메인 어휘 사용.
  ja/en 각각 타깃 언어 프롬프트로 생성한다. (메모리 `feedback_i18n_native_pm_translation`)
- **패턴 답습:** 사전(`messages/{ko,ja,en}/<ns>.ts`) + `Dictionary` 타입 게이트.
  소비는 (a) 서버 `getDictionary(locale)` + `DictionaryProvider`(레시피 상세 경로),
  (b) 자가판정 client 훅(`usePathname → resolveChromeLocale`, `useChromeDict` 류) 둘 중 컨텍스트에 맞는 것.
- **검증:** 타입게이트는 키 누락만 잡고 미추출 inline 한글은 못 잡으므로
  (`policy-i18n-type-gate-misses-unextracted-strings`), 영역별 no-Hangul 렌더 스캔 + grep 병행.
- **코드값 불변:** 단위/카테고리/비교용 코드값은 ko canonical 유지, 표시만 현지화 (기존 규칙).

---

## B-1. 공유 에러 바운더리 (전 페이지 영향 — 최우선)

**문제:** `shared/ui/ErrorFallback`("문제가 발생했어요"/"다시 시도"/"홈으로 가기"),
`shared/ui/NotFound`("뒤로 가기"/"홈으로 가기"), `shared/ui/SectionErrorFallback`
("이 영역을 불러올 수 없어요"/"재시도")가 ko 하드코딩.
호출부(`error.tsx`/`not-found.tsx`)는 ko `message`/`title`/`description` 문자열 prop을 넘김.
이 컴포넌트들은 `/recipes/[id]`·`/search/results`·`/ingredients`·`/calendar/[date]`·
`/recipes/[id]/edit` 등 **다수 라우트가 공유**하므로 단일 수정이 전 페이지에 파급된다.

**접근 (자가판정 — 코드베이스 패턴 답습):**

1. 새 `errors` 네임스페이스:
   - chrome: `heading`("문제가 발생했어요"), `retry`("다시 시도"), `goHome`, `goBack`, `sectionRetry`, `sectionMessage`
   - context별 message/title/description: `recipe`, `search`, `ingredients`, `edit`, `generic`
     (캘린더는 스코프 제외이나 키는 선택적으로 추가 가능 — 다른 에이전트와 충돌 회피 위해 미포함)
2. `ErrorFallback`/`NotFound`/`SectionErrorFallback`를 `usePathname → resolveChromeLocale`
   자가판정 client 컴포넌트로 전환.
3. 호출부는 ko 문자열 대신 **context 키**를 넘긴다. 예:
   `<ErrorFallback reset={reset} context="recipe" />`.
   기존 `message?` prop은 임의 문자열 오버라이드용으로 남기되 신규 호출부는 키 사용.
4. ja/en 라우트는 현재 re-export 래퍼라 에러 시 ko 부모 바운더리로 버블된다.
   자가판정이 pathname 기준이므로 `/ja`·`/en` prefix에서 올바른 로케일을 잡는지 검증.
   필요한 경우에 한해 ja/en 세그먼트에 얇은 `error.tsx`/`not-found.tsx` 래퍼 추가.

## B-2. 카테고리 메타데이터

`app/recipes/category/[id]/layout.tsx`의 `generateMetadata`가 ko 하드코딩
(title/description/keywords/og:alt). → locale-aware 메타 빌더로 전환,
ja/en 카테고리 라우트가 자기 메타를 갖게 한다. **ja/en noindex 유지**(기존 결정).
번역값은 `category` 사전(또는 신규 meta 키)에 둔다.

## B-3. search/results 정리

`app/search/results/page.tsx`의 한글은 대부분 **주석**(CLAUDE.md 주석 금지 → 제거)과
ko 전용 가격라벨(`만원 이하`/`원 이하` — KRW 필터, 의도된 ko 전용). 가격라벨은 유지.
`error.tsx`는 B-1로 흡수.

## B-4. 레시피 상세 콘텐츠

기존 `recipeDetail` 사전 확장 + 기존 `DictionaryProvider` 경로 사용
(`RecipeDetailView`가 서버에서 `getDictionary(locale)` 후 자식에 `locale`/provider 전파).

**스코프 (사용자 확정 = 단위·액션·코멘트·카피):**
- **단위/숫자:** `분`·`인분`·구독자 `만명`/`천명`·절약액 → `format()`/locale 단위.
  관련: `RecipeCookingInfoSection`(`${cookingTime}분`/`${servings}인분`), `RecipeIngredientsSection`.
- **액션버튼:** 저장/공유/완료 등 (`RecipeCompleteButton`, 레시피 nav 버튼).
- **코멘트 요약:** "N명의 사람들이 평균 ~" 형태(치환 format).
- **칼로리/절약 마케팅 카피:** `RecipeIngredientsSection`("이 레시피는 약~예요!" 등).

**비목표(옵션 후속):** 재료 복사 시트(`IngredientCopySheet`), 신고 시트(`IngredientReportSheet`),
평점/댓글 폼/챗. 큰 플로우 — 사용자가 별도로 당길 때 진행.

---

## C-1. 로그인

새 `auth` 네임스페이스 + ja/en 라우트 래퍼(`app/{ja,en}/login`, `.../login/error`).
대상 문자열:
- `LoginContent` "로그인 없이 볼게요"
- 소셜 로그인 버튼 "최근 로그인" 배지 (Google/Kakao/Naver/Apple 4종 공유)
- `login/error/page.tsx` title("로그인 실패")/description
- `login/page.tsx` Suspense fallback "로딩 중..."

소비: 로그인 페이지는 client 위주 → 자가판정 훅 또는 locale prop. 카카오/네이버는
한국 한정 제공자이나 버튼 자체는 노출 유지(라벨만 현지화, 제공자명은 고유명사).

## C-2. 알림 (chrome + 타입별 템플릿)

새 `notifications` 네임스페이스 + ja/en 라우트 래퍼(`app/{ja,en}/notifications`).
- **chrome:** "알림"(헤더), "모두 삭제", 빈 상태("알림이 없습니다."),
  끝 상태("모든 알림을 불러왔습니다."), "Loading more..."
- **타입별 메시지 템플릿:** `entities/notification`의 `NotificationItem`이 `NotificationType`별로
  조립하는 메시지 문구를 사전 치환 템플릿으로 이전(`format()` 치환). 각 타입의 변수
  (유저명·레시피명 등)는 런타임 주입, 골격 문장만 현지화.

소비: 알림 페이지/아이템은 client → 자가판정 훅.

## C-3. 캘린더 — 스코프 제외

다른 에이전트 진행 중. 본 작업에서 손대지 않는다(통화 円/원 분기 포함).

---

## Acceptance Criteria

- **AC-B1a:** `/ja/recipes/{id}` 또는 `/en/...`에서 라우트 에러 발생 시, 에러 화면의
  heading·메시지·버튼("다시 시도"/"홈으로")이 해당 로케일로 표시된다.
- **AC-B1b:** 존재하지 않는 `/ja/recipes/{id}` 접근 시 NotFound 화면 title/description/버튼이 ja로 표시된다.
- **AC-B1c:** ko 라우트(`/recipes/{id}`)의 에러/NotFound는 기존과 동일한 한글로 회귀 없이 표시된다.
- **AC-B1d:** 섹션 에러(`SectionErrorFallback`) 문구가 현재 로케일로 표시된다.
- **AC-B2:** `/ja/recipes/category/{id}`의 `<title>`/메타 description이 ja로 생성된다(noindex 유지).
- **AC-B3:** `search/results/page.tsx`에 한글 주석이 남지 않는다(가격라벨 ko 전용은 허용).
- **AC-B4a:** `/ja|/en` 레시피 상세에서 조리시간/인분 단위가 해당 로케일 표기로 보인다(`40분`이 ja/en에서 한글 `분`으로 섞이지 않음).
- **AC-B4b:** 레시피 상세 액션버튼(저장/공유/완료) 라벨이 현재 로케일로 표시된다.
- **AC-B4c:** 코멘트 요약 문장이 현재 로케일로 표시되며 N(인원수)이 올바로 치환된다.
- **AC-B4d:** ko 레시피 상세는 기존 한글로 회귀 없이 표시된다.
- **AC-C1a:** `/ja/login`·`/en/login`에서 "로그인 없이 볼게요"·"최근 로그인" 배지·에러페이지 문구가 해당 로케일로 표시된다.
- **AC-C1b:** ko `/login`은 기존 한글로 회귀 없이 표시된다.
- **AC-C2a:** `/ja/notifications`·`/en/notifications`에서 헤더·"모두 삭제"·빈/끝 상태 문구가 해당 로케일로 표시된다.
- **AC-C2b:** 알림 아이템의 타입별 메시지가 해당 로케일 템플릿으로 조립되고, 변수(유저명·레시피명)가 올바로 치환된다.
- **AC-C2c:** ko 알림은 기존 한글로 회귀 없이 표시된다.
- **AC-검증:** 각 영역 작업 후 `npx tsc --noEmit` 통과 + no-Hangul 렌더 스캔에서 의도된 ko 전용(가격라벨·고유명사) 외 한글 미검출.

## 비목표 (전체)

- 캘린더(통화 円/원 분기 포함) — 다른 에이전트
- 레시피 상세 재료 복사·신고 시트, 평점/댓글 폼, 챗
- `<html lang>` per-locale, sitemap 로케일 분리, 자동 리다이렉트 (기존 보드 비목표 유지)
- 자유 텍스트(닉네임·소개·재료 데이터) 번역 — 백엔드 영역
