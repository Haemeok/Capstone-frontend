# i18n B+C — Test Design (Traceability Matrix)

> 날짜: 2026-06-14 · 브랜치: feature/17
> 상위: `...-slices.md` (글로서리·비목표·AC 출처)

## 설계 원칙 (이 피처 한정)

- **대부분 cosmetic 리스크** (표시 전용) → risk-weighted depth상 **invariant 중심**:
  ① ja/en 렌더 시 한글 미누출 / 현지 문구 표시, ② **ko 회귀 앵커**(기존 한글 보존).
  키프레임식 등식 N개 금지 — 슬라이스당 acceptance 렌더 1~2 + ko 앵커 1.
- **실제 로직만 경계/에러 추가:** 알림 타입별 템플릿 치환·미지 타입 폴백(Slice 9),
  코멘트 요약 N 치환(Slice 6), 에러 context→문구 매핑(Slice 2).
- **재검증 금지(이미 owner가 소유·테스트됨):** `resolveChromeLocale`(self-detect),
  `format()`/`plural()`(치환·복수형). 이들의 **조합**만 acceptance에서 확인.
- **Ubiquitous Language:** 테스트 설명·코드 식별자·AC가 글로서리 단어 공유
  (fallback/notFound/context/recent-login/notification template/savings copy).

## Traceability Matrix

| AC | Scenario (Given/When/Then) | Test ID | Owner layer | Risk |
|----|----------------------------|---------|-------------|------|
| **S1** /ja fallback locale | path=`/ja/recipes/x` 에러 → fallback heading·"다시 시도"·"홈으로"가 ja | T-01 | acceptance | cosmetic |
| **S1** ko 회귀 | path=`/recipes/x` 에러 → 기존 한글 그대로 | T-02 | acceptance | cosmetic |
| **S1** self-detect | path prefix 없음 → ko fallback (resolveChromeLocale 조합만) | T-03 | acceptance | integrity |
| **S2** notFound ja | path=`/ja/recipes/x` 404 → title·desc·"뒤로 가기"·"홈으로" ja | T-04 | acceptance | cosmetic |
| **S2** section ja | `SectionErrorFallback` ja path → "이 영역..."/"재시도" 현지화 | T-05 | acceptance | cosmetic |
| **S2** context 매핑 | context=`search`\|`ingredients`\|`edit` → 각 맞는 message 키 렌더 | T-06 | acceptance | integrity |
| **S2** ko 회귀 | ko notFound·section 기존 한글 | T-07 | acceptance | cosmetic |
| **S2** 주석 제거 | `search/results/page.tsx` 소스에 한글 주석 0 (no-Hangul 소스 스캔) | T-08 | unit | integrity |
| **S3** 카테고리 메타 ja | `generateMetadata(locale=ja)` → `<title>`/desc ja, noindex | T-09 | unit | integrity |
| **S3** ko 메타 회귀 | `generateMetadata(locale=ko)` → 기존 한글 | T-10 | unit | cosmetic |
| **S4** 단위 ja | RecipeCookingInfoSection ja → 조리시간/인분 ja 표기 (한글 `분` 미혼입) | T-11 | acceptance | cosmetic |
| **S4** savings copy ja | RecipeIngredientsSection ja → 칼로리/절약 문구 ja + 숫자 치환 | T-12 | acceptance | cosmetic |
| **S4** ko 회귀 | ko 단위·카피 기존 한글 | T-13 | acceptance | cosmetic |
| **S5** 액션버튼 ja | 저장/공유/완료 라벨 ja | T-14 | acceptance | cosmetic |
| **S5** ko 회귀 | ko 액션버튼 기존 한글 | T-15 | acceptance | cosmetic |
| **S6** 코멘트 요약 N=다수 | N=12 → "12명..." ja 치환 정확 | T-16 | acceptance | integrity |
| **S6** 코멘트 요약 경계 N=1/0 | N=1(복수형 경계)·N=0(빈) 처리 | T-17 | acceptance | integrity |
| **S6** ko 회귀 | ko 요약 기존 한글 | T-18 | acceptance | cosmetic |
| **S7** 로그인 ja | "로그인 없이 볼게요"·recent-login 배지·에러페이지·Suspense ja | T-19 | acceptance | cosmetic |
| **S7** 제공자명 비번역 | Kakao/Naver 라벨에 고유명사 유지(현지화 대상 아님) | T-20 | acceptance | integrity |
| **S7** ko 회귀 | ko `/login` 기존 한글 | T-21 | acceptance | cosmetic |
| **S8** 알림 chrome ja | 헤더·"모두 삭제"·빈/끝 상태·"Loading more" ja | T-22 | acceptance | cosmetic |
| **S8** ko 회귀 | ko `/notifications` chrome 기존 한글 | T-23 | acceptance | cosmetic |
| **S9** 템플릿 ja + 치환 | type별 message ja + 변수(유저명·레시피명) 치환 | T-24 | acceptance | integrity |
| **S9** 미지 타입 폴백 | 알 수 없는 type → generic 문구, 크래시 없음 | T-25 | unit | integrity |
| **S9** ko 회귀 | ko 알림 메시지 기존 한글 | T-26 | acceptance | cosmetic |

## Concrete examples (대표)

- **T-01:** Given pathname `/ja/recipes/abc`, render `<ErrorFallback context="recipe" reset={noop} />`.
  Then 화면에 ja heading + ja "retry"/"home" 라벨, 한글 미검출.
- **T-03:** Given pathname `/recipes/abc` (prefix 없음), render fallback. Then ko 문구 (default locale 분기).
- **T-06:** Given `context="search"`, render fallback at `/ja/...`. Then `errors.search.message`(ja) 텍스트 표시; `context="edit"`이면 edit 문구.
- **T-16:** Given `commentCount=12`, locale ja, render 요약. Then "12" 포함 + ja 골격 문장, 한글 미검출.
- **T-24:** Given notification `{type:"RECIPE_LIKED", actorName:"Yuki", recipeTitle:"カレー"}`, locale ja.
  Then ja 템플릿에 "Yuki"·"カレー" 치환된 한 문장.
- **T-25:** Given `{type:"__UNKNOWN__"}`. Then generic 문구 반환, throw 없음.

## Coverage gate

- 모든 AC → ≥1 test ID ✅ (S1~S9 전부 매핑)
- 각 슬라이스 happy + 관련 edge/error: 실로직 슬라이스(S2 context/S6 N경계/S9 미지타입)만 edge 추가, cosmetic은 invariant+ko앵커.
- acceptance-layer 테스트 존재 ✅ (대부분 렌더 acceptance). 순수 fn(메타·미지타입)만 unit owner.
- owner 중복 없음: self-detect/format/plural 재검증 안 함(기존 owner 소유).

## Non-goals (테스트 없음 — 의도적 부재)

- 캘린더 전부 · 재료 복사/신고 시트 · 평점/댓글 폼/챗
- 가격라벨(`만원 이하`) ko 전용
- `<html lang>`/sitemap/자동 리다이렉트
- 자유 텍스트(닉/소개/데이터) 번역
- 제공자 고유명사(번역 안 함 — 단 "비번역 유지"는 T-20으로 가드)

## TDD 순서 (= writing-plans task 순서)

T-01→02→03 (S1 skeleton) → T-04~08 (S2) → T-09~10 (S3) → T-11~13 (S4)
→ T-14~15 (S5) → T-16~18 (S6) → T-19~21 (S7) → T-22~23 (S8) → T-24~26 (S9)
