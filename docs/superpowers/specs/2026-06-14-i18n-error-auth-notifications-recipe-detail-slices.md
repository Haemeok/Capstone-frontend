# i18n B+C — Vertical Slices

> 날짜: 2026-06-14 · 브랜치: feature/17
> 상위 설계: `2026-06-14-i18n-error-auth-notifications-recipe-detail-design.md`
> 각 슬라이스는 product owner에게 demo 가능한 사용자 가치 thread. 레이어 분해 아님.

## Glossary (Ubiquitous Language — 한 개념 = 한 단어)

| 단어 | 의미 | 코드 식별자 |
| --- | --- | --- |
| **locale** | 표시 언어 (ko/ja/en) | `locale`, `Locale` |
| **chrome** | 콘텐츠가 아닌 UI 골격 문자열 (헤더·버튼·빈상태) | — |
| **namespace** | 사전 묶음 단위 (`errors`/`auth`/`notifications`) | `messages/{locale}/<ns>.ts` |
| **self-detect** | client에서 `usePathname → resolveChromeLocale`로 locale 판정 | `useChromeDict` 류 |
| **context** | 에러 화면이 어느 페이지인지 가리키는 키 (recipe/search/ingredients/edit/generic) | `context` prop |
| **fallback** | 라우트/섹션 에러 시 보여줄 UI | `ErrorFallback`, `SectionErrorFallback` |
| **notFound** | 404 화면 | `NotFound` |
| **recent-login** | 마지막 사용 제공자에 붙는 "최근 로그인" 배지 | `isRecent` |
| **notification template** | 알림 타입별 메시지 골격 문장 (변수 런타임 주입) | `NotificationType` |
| **savings copy** | 레시피 상세 절약/칼로리 마케팅 카피 | — |

> drift 금지: "에러 화면"은 항상 **fallback**, "404"는 항상 **notFound**, locale 판정은 항상 **self-detect**.

## Out of Scope (비목표 — 테스트 없음)

- 캘린더(`/calendar/*`, SavingsCard, 통화 円/원 분기) — 다른 에이전트 소유
- 레시피 상세 재료 복사 시트(`IngredientCopySheet`)·신고 시트(`IngredientReportSheet`)·평점·댓글 폼·챗
- `<html lang>` per-locale, sitemap 로케일 분리, 자동 리다이렉트
- 자유 텍스트(닉네임·소개·재료/레시피 데이터) 번역 — 백엔드
- search/results 가격라벨(`만원 이하`) — KRW 필터 ko 전용 의도 유지
- 카카오/네이버 제공자명 — 고유명사, 비번역

---

## Slice 1 (Walking Skeleton): 레시피 상세 에러 화면이 locale로 표시

가장 얇은 end-to-end thread — `errors` namespace + `ErrorFallback` self-detect 전환 +
`/recipes/[id]/error.tsx`가 `context="recipe"`로 호출. 이 thread가 자가판정 에러 경로
전체(namespace → self-detect 훅 → context 키 → 렌더)를 증명한다.

**AC:**
- 사용자가 `/ja/recipes/{id}`(또는 `/en`)에서 라우트 에러를 만나면, fallback의 heading·메시지·버튼("다시 시도"/"홈으로")이 해당 locale로 표시된다.
- 사용자가 `/recipes/{id}`(ko)에서 에러를 만나면 기존 한글 문구가 회귀 없이 표시된다.
- locale 판정은 pathname의 `/ja`·`/en` prefix로 self-detect되며, prefix 없으면 ko.

## Slice 2: 나머지 에러/notFound 컨텍스트가 locale로 표시

walking skeleton을 `NotFound`·`SectionErrorFallback`·나머지 context(search/ingredients/edit/generic)로 확장.
search/results 한글 주석 제거(같은 영역 손대는 김에)도 포함.

**AC:**
- 존재하지 않는 `/ja/recipes/{id}` 접근 시 notFound의 title·description·버튼("뒤로 가기"/"홈으로")이 ja로 표시된다.
- 섹션 에러(`SectionErrorFallback`) 문구("이 영역을 불러올 수 없어요"/"재시도")가 현재 locale로 표시된다.
- `/search/results`·`/ingredients`·`/recipes/[id]/edit` 에러 화면이 현재 locale로 표시된다.
- ko 라우트의 notFound·섹션 에러는 기존 한글로 회귀 없이 표시된다.
- `search/results/page.tsx`에 한글 주석이 남지 않는다(가격라벨 ko 전용은 허용).

## Slice 3: 카테고리 메타데이터가 locale로 생성

`category/[id]/layout.tsx`의 `generateMetadata` locale-aware 전환.

**AC:**
- `/ja/recipes/category/{id}`의 `<title>`·메타 description이 ja로 생성된다(noindex 유지).
- ko `/recipes/category/{id}` 메타는 기존 한글로 회귀 없이 생성된다.

## Slice 4: 레시피 상세 단위·숫자·절약 카피가 locale로 표시

기존 `recipeDetail` namespace 확장. `RecipeCookingInfoSection`(분/인분),
`RecipeIngredientsSection`(칼로리/절약 savings copy + 숫자 format).

**AC:**
- `/ja|/en` 레시피 상세에서 조리시간·인분 단위가 해당 locale 표기로 보인다(`40분`이 ja/en에서 한글 `분`으로 섞이지 않음).
- savings copy(칼로리·절약 문장)가 현재 locale로 표시되며 숫자(소모 분·절약액)가 올바로 치환된다.
- ko 레시피 상세 단위·카피는 기존 한글로 회귀 없이 표시된다.

## Slice 5: 레시피 상세 액션버튼이 locale로 표시

저장/공유/완료 등 액션버튼 라벨(`RecipeCompleteButton`, nav 버튼).

**AC:**
- 레시피 상세 액션버튼(저장/공유/완료) 라벨이 현재 locale로 표시된다.
- ko 액션버튼은 기존 한글로 회귀 없이 표시된다.

## Slice 6: 레시피 상세 코멘트 요약이 locale로 표시

"N명의 사람들이 평균 ~" 요약 문장(치환 format).

**AC:**
- 코멘트 요약 문장이 현재 locale로 표시되며 N(인원수)이 올바로 치환된다.
- ko 코멘트 요약은 기존 한글로 회귀 없이 표시된다.

## Slice 7: 로그인 화면이 locale로 표시

새 `auth` namespace + `app/{ja,en}/login`·`.../login/error` 라우트 래퍼.

**AC:**
- `/ja/login`·`/en/login`에서 "로그인 없이 볼게요"·recent-login 배지·에러페이지(title/description)·Suspense 문구가 해당 locale로 표시된다.
- 소셜 버튼은 노출 유지되고 라벨만 현지화되며 제공자명(Kakao/Naver)은 고유명사로 비번역.
- ko `/login`은 기존 한글로 회귀 없이 표시된다.

## Slice 8: 알림 페이지 chrome이 locale로 표시

새 `notifications` namespace(chrome) + `app/{ja,en}/notifications` 라우트 래퍼. self-detect 훅.

**AC:**
- `/ja/notifications`·`/en/notifications`에서 헤더("알림")·"모두 삭제"·빈 상태·끝 상태·"Loading more" 문구가 해당 locale로 표시된다.
- ko `/notifications` chrome은 기존 한글로 회귀 없이 표시된다.

## Slice 9: 알림 타입별 메시지가 locale로 조립

`NotificationItem`의 `NotificationType`별 notification template를 사전 치환으로 이전.

**AC:**
- 알림 아이템의 타입별 메시지가 해당 locale template로 조립되고, 변수(유저명·레시피명)가 올바로 치환된다.
- 알 수 없는/신규 타입은 안전한 generic 문구로 폴백한다(크래시 없음).
- ko 알림 메시지는 기존 한글로 회귀 없이 표시된다.

---

## 슬라이스 순서 (= 구현/task 순서)

1. Slice 1 (walking skeleton — 에러 경로 증명)
2. Slice 2 (에러/notFound 확장)
3. Slice 3 (카테고리 메타)
4. Slice 4 → 5 → 6 (레시피 상세 콘텐츠)
5. Slice 7 (로그인)
6. Slice 8 → 9 (알림)

> 검증 공통: 영역별 `npx tsc --noEmit` + no-Hangul 렌더 스캔(의도된 ko 전용 제외).
> 번역: ja/en 각각 네이티브 IT PM 톤 프롬프트로 생성(직역 금지).
