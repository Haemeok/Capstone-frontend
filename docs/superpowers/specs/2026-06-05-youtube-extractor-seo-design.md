# 유튜브 레시피 추출 페이지 SEO 설계

- **Route:** `/recipes/new/youtube`
- **Target keyword:** `유튜브 레시피 추출` (보조: 유튜브 레시피 변환, 영상 레시피 등 기존 keyword 배열)
- **Date:** 2026-06-05
- **Constraint:** 새 UI 섹션 0개. 기존 요소만 건드린다.

## 배경 / 문제 진단

1. `src/shared/lib/metadata/youtubeExtractorMetadata.ts`에 잘 작성된 title / description /
   keywords / OG / Twitter / robots / 4종 structured-data가 있으나, youtube `page.tsx`가
   이를 **import·export 하지 않는다**. 라우트는 루트 레이아웃의 제네릭 메타만 상속 중 →
   가장 큰 SEO 누수.
2. JSON-LD가 `metadata.other["application/ld+json"]`에 들어가 있어 Next가 `<meta>` 태그로
   렌더 → 구글이 structured data로 인식 못 함. 프로젝트 표준은 body에
   `<script type="application/ld+json" dangerouslySetInnerHTML>` (참고: `src/app/page.tsx`,
   `src/app/recipes/[recipeId]/page.tsx`, `<`→`<` 이스케이프).
3. 타겟 키워드 "유튜브 레시피 추출"이 **보이는 본문에 0회** 등장. 현재 H1은
   "유튜브 레시피 가져오기", 페이지는 hero + URL 폼 + 트렌딩 리스트로 구성된 thin 도구 페이지.

## 설계

기존 요소만 건드리는 4개 변경. 신규 섹션 없음.

### 1. 메타데이터 연결
- youtube `page.tsx`에 `export const metadata` 추가, 소스는 기존 `youtubeExtractorMetadata`.
- 단, 깨진 `other["application/ld+json"]` 필드는 메타데이터에서 제거(→ 2번으로 이동).
- 보이는 변화 없음. 변경 최소, 효과 최대.

### 2. JSON-LD 제대로 렌더
- 페이지 body에 프로젝트 표준 패턴으로 `<script type="application/ld+json">` 삽입.
- 기존 빌더 재사용: **WebApplication + HowTo + BreadcrumbList** 3종.
- **FAQPage는 제외**: 화면에 보이는 FAQ가 없어 "structured data = 가시 콘텐츠 반영"
  가이드와 어긋나고, FAQ 리치결과는 2023부터 일반 사이트에 거의 노출 안 됨. 위 3종은
  가시 콘텐츠 요구가 없어 안전.
- `<`→`<` 이스케이프 필수.

### 3. 보이는 키워드 1곳 (히어로 보조카피 재작성)
- `YoutubeImportHero.tsx`의 기존 `<p>`("영상만 보고 따라하기 힘드셨나요?…")를 사람 말투
  유지하며 "유튜브 레시피 추출"이 한 번 자연스럽게 들어가게 교체. 새 줄·섹션 없음.
- 예시 문구: "유튜브 영상 링크만 붙여넣으면 AI가 레시피를 추출해드려요. 영상과 레시피를
  한눈에 보며 더 편하게 요리하세요."

### 4. 헤딩 계층 정리 (공짜 시맨틱)
- 트렌딩 섹션의 `<span>요즘 뜨는 레시피</span>`를 `<h2>`로 승격(라벨 텍스트 유지).
- `TrendingRecipesClient.tsx`와 `features/.../TrendingRecipes.tsx` 둘 다 동일 마크업을
  가지므로, 실제 라우트에서 렌더되는 쪽(`TrendingRecipesClient`)을 기준으로 적용.
- H1→H2 구조 확보로 크롤러의 구조 파악 개선. 시각 변화 거의 없음.

## Non-goals

- FAQ / 사용법 / 소개 등 **본문 섹션 신규 추가 안 함** (사용자 의도: 자리 없음).
- H1 텍스트 변경 안 함 ("유튜브 레시피 가져오기" 브랜드 보이스 유지).
- WebView 분기 처리 안 함 (보이는 콘텐츠를 안 늘리므로 앱에서도 그대로 자연스러움).
- 트렌딩 라벨에 키워드 욱여넣지 않음 (키워드 떡칠 방지).
- `youtubeExtractorMetadata.ts`의 keyword 배열 내용 자체는 손대지 않음(이미 충분).

## Acceptance Criteria

- **AC1:** `/recipes/new/youtube`의 `<head>`에 `<title>`이 "유튜브 레시피 추출"을 포함하고,
  meta description·OG·keywords·canonical이 `youtubeExtractorMetadata` 값으로 렌더된다.
- **AC2:** 페이지 DOM에 `<script type="application/ld+json">`가 1개 이상 존재하고, 파싱 시
  `@type`이 `WebApplication`/`HowTo`/`BreadcrumbList`인 유효 JSON이며 `<`가 이스케이프돼 있다.
  FAQPage 타입은 렌더되지 않는다.
- **AC3:** 페이지의 보이는 본문 텍스트(히어로 보조카피)에 "유튜브 레시피 추출" 문구가
  1회 이상 사람 말투로 등장한다.
- **AC4:** 페이지에 `<h1>`이 정확히 1개, 그 하위 트렌딩 섹션에 `<h2>`가 존재한다.
- **AC5:** 신규 본문 섹션이 추가되지 않는다(hero / 폼 / 트렌딩 외 블록 증가 없음).

## 영향 파일

- `src/app/recipes/new/youtube/page.tsx` — metadata export + JSON-LD script
- `src/shared/lib/metadata/youtubeExtractorMetadata.ts` — `other` ld+json 필드 제거,
  JSON-LD 빌더를 페이지에서 쓸 수 있게 export 정리(FAQ 제외)
- `src/app/recipes/new/youtube/components/YoutubeImportHero.tsx` — 보조카피 교체
- `src/app/recipes/new/youtube/components/TrendingRecipesClient.tsx` — span→h2
