# 다국어 UI 문구 셋 (ko/ja/en) — Design

> Status: approved (design) · Date: 2026-06-12 · Branch: feature/17

## 배경

현재 다국어화는 **콘텐츠(레시피 본문) 한정**이다. `/ja/recipes/[id]`·`/ja/search/results`가
백엔드 `lang=ja` 쿼리로 번역된 레시피 데이터를 받아오고, `notTranslated`(code 213) gating +
`noindex` 처리까지 되어 있다. 그러나 **UI chrome 문구는 여전히 하드코딩 한국어**다 — 에러 폴백
(`"비디오를 불러올 수 없어요"`), 버튼, 네비바, 섹션 헤더가 `/ja` 페이지에서도 한국어로 노출된다.
i18n 라이브러리도, UI 문자열 사전도 없다. `locale: "ko" | "ja"`는 prop으로 스레딩되지만
데이터 fetch와 href에만 쓰이고 chrome 텍스트는 구동하지 않는다.

이 작업은 두 가지를 쌓는다: (1) 없던 **UI 문자열 다국어화 레이어**를 만들고, (2) **`/en` 라우트**를
추가하며 ja/en 문구를 PM 페르소나 프롬프트로 자연스럽게 번역한다. 백엔드는 `lang=en`을
`lang=ja`와 동일하게 지원하므로 en 라우트는 ja 구조를 풀 미러링한다(콘텐츠+chrome+메타 전부 영어).

## 결정 사항 (확정)

| 축 | 결정 |
|---|---|
| 범위 | 기존 ja footprint = **recipe detail + search results 2개 라우트만** |
| en 콘텐츠 | 백엔드 `lang=en` 동일 지원 → en은 ja 구조 풀 미러링 |
| 메커니즘 | **경량 typed 사전 (`shared/i18n`)**, 명시 폴더 라우팅 유지 (`[locale]` 재구조화 안 함, next-intl 미도입) |
| 깊이 | **읽기 경로 우선** — 메타+nav+읽기+핵심 CTA+에러/빈/로딩. 깊은 인터랙션 시트는 후속 |

### next-intl을 안 쓰는 이유 (재확인 완료)

ISR은 차단 사유가 **아니다** — `setRequestLocale(locale)` + `generateStaticParams()`로 헤더 없이
static/ISR 유지 가능(공식 API). 진짜 비용은 라우팅이다: 현재 구조는 prefix 없는 ko 루트(`/`) +
명시 `/ja` 폴더인데, next-intl 정석은 `app/[locale]/*` 전면 재구조화(2 라우트 위해 전 폴더 이동 +
ko 루트 충돌 정리)를 요구하고, without-routing 모드는 locale을 쿠키로 받아 SEO용 구분 URL
(hreflang/canonical)과 안 맞는다. 2 라우트 footprint엔 과하다. next-intl의 단일 실익(ICU 복수형)은
경량 헬퍼로 대체한다.

## 아키텍처

### 1. Locale 모델

- `Locale = "ko" | "ja" | "en"`. ko = prefix 없는 루트(`/`), ja=`/ja/*`, en=`/en/*`.
- 기존 `"ko" | "ja"` union을 `en`까지 확장. 콘텐츠 fetch `getLocalizedRecipeOnServer`의
  `locale: "ja"` → `"ja" | "en"` widen (ko는 기존 static 엔드포인트, lang 없음 → localized = ja|en).

### 2. 사전 레이어 (`shared/i18n`)

```
shared/i18n/
  messages/ko.ts   ← 현재 하드코딩 한국어 추출 = shape의 source of truth
  messages/ja.ts   ← Dictionary 타입 만족 필수
  messages/en.ts   ← Dictionary 타입 만족 필수
  types.ts         ← Locale, Dictionary (ko에서 파생)
  getDictionary.ts ← 서버: getDictionary(locale) → 정적 객체 반환
  DictionaryProvider.tsx + useT()  ← 클라이언트 컨텍스트 (prop drilling 회피)
  format.ts        ← {count}/{q} 보간 + plural(n,{one,other}) 헬퍼 (en 복수형)
  index.ts         ← barrel
```

- namespace 키: `common`, `recipeDetail`, `search`, `errors`, `meta`.
- **접근 패턴 (서버/클라 혼합 — App Router 표준)**:
  - 서버 leaf: `locale` prop → `getDictionary(locale)` (정적 객체라 메모 불필요).
  - 클라 leaf(`SearchClient` 등): 페이지가 한 번 감싼 `<DictionaryProvider dict>`에서 `useT()`.
  - 두 경로 모두 같은 `getDictionary` 출력을 읽는다. 클라 provider엔 활성 locale dict 하나만
    넘어가 번들 누수 없음.
- **타입 enforcement**: `Dictionary`는 `ko.ts` 형태에서 파생. `ja.ts`/`en.ts`가 미충족이면
  컴파일 에러 → 누락 키 무료 차단. 런타임 ko 폴백은 안전망일 뿐, 타입 통과 시 미발동.

### 3. 라우팅 / en 페이지 (명시 폴더 유지)

- 신규 `/en/recipes/[recipeId]/{page,not-found}.tsx`, `/en/search/results/page.tsx` —
  ja 미러, `locale="en"`, `lang=en`, `og:locale=en_US`, `inLanguage=en`.
- **타깃 리팩터**: ja/en 페이지가 거의 동일 → 공유 본문을 locale 파라미터 함수
  (`renderLocalizedRecipePage({recipeId, locale})` 등)로 추출, `/ja`·`/en` 폴더는 얇은 wrapper.
  명분: 최근 커밋 히스토리의 locale 스레딩 drift 버그 재발 방지. (관련 없는 리팩터 아님 —
  이 작업이 직접 만드는 복제를 제거.)

### 4. 메타데이터 다국어화

- `buildSearchTitle`/`buildSearchDescription` → `(q, total, page, locale)` 시그니처, dict
  `meta.search.*` 템플릿 읽기. **ko는 현재 문자열 그대로(무회귀)**, ja/en은 번역 템플릿 + 보간,
  en은 복수형.
- `generateJaRecipeMetadata` → `generateLocalizedRecipeMetadata(recipe, id, {locale, translated})`로
  일반화 (og:locale, inLanguage, notTranslated일 때 noindex gating 유지).
- hreflang `alternates.languages` (ko/ja/en + x-default) 추가 — untranslated=noindex와 상호작용
  하므로 번역·indexable 버전만 가리키게. **별도 슬라이스 후보**.

### 5. 번역 저작 워크플로 (PM 페르소나)

- 각 타깃 언어로 **그 언어 프롬프트** 작성 + 네이티브 PM 페르소나 주입("당신은 일본/미국 레시피 앱
  PM…"). KO 원문 + 각 문자열의 **UI 맥락**(노출 위치, 버튼/타이틀 글자수 예산, 톤=오늘의집식
  따뜻·정갈)을 함께 줘 **직역 아닌 자연스러운 마이크로카피** 산출.
- 검수 기준: 라벨=동작 1:1, SERP 잘림 예산(seo-metadata 스킬), 문화적 톤.
- 산출물: 검수된 `ja.ts`/`en.ts`. 구현 시 슬라이스별로 (KO 추출 → 페르소나 번역 → 채움).

### 6. 테스트 (가장 낮은 한 층이 소유)

- **타입 레벨이 1차 커버리지**: ja/en `Dictionary` 미충족 = 컴파일 에러.
- 단위: `buildSearchTitle` locale별(ko 회귀 + ja/en + **en 복수형 1 vs N**),
  메타 빌더(og:locale/inLanguage/noindex per locale+translated), `format/plural` 헬퍼.
- 렌더: 대표 read-path 컴포넌트 1개가 locale별 문자열 렌더(기존 RecipeDetailView locale 테스트
  확장). leaf 전수 재검 안 함.

## Acceptance Criteria

- **AC1**: `/en/recipes/{번역된id}` → 콘텐츠 + 읽기경로 chrome 영어, `og:locale=en`, indexable.
- **AC2**: `/en/recipes/{미번역id}` → KO 콘텐츠 폴백 + 영어 notTranslated 배너 + noindex
  (ja gating 미러).
- **AC3**: `/ja/*` 읽기 경로가 이제 **일본어 chrome** 노출 (현재 한국어인 반쪽 상태 수정).
- **AC4**: `/en/search/results?q=…` → 영어 검색 chrome + 영어 SEO 제목/설명 +
  **복수형 정확**(1 recipe vs N recipes), noindex,follow.
- **AC5**: ko(`/`) 라우트 카피 **무회귀** (ko dict = 현재 문자열).
- **AC6**: ja.ts/en.ts 키 누락 시 **타입체크 실패** (read-path 문자열 런타임 침묵 폴백 없음).
- **AC7 (non-goal)**: 깊은 인터랙션 시트(재료 신고·복사, 평점, 댓글, 챗)는 이번 슬라이스 **범위 외**
  (KO 잔존 허용, 문서화).

## Non-goals

- `[locale]` 세그먼트 재구조화 / next-intl 도입.
- ko 루트(`/`)를 `/ko`로 옮기기.
- 깊은 인터랙션 시트(신고·복사·평점·댓글·챗) 번역 — 후속 슬라이스.
- ja/en 외 추가 언어.
- 백엔드 콘텐츠 번역 품질/커버리지 (프론트 범위 밖).

## Glossary (Ubiquitous Language)

- **locale**: `"ko" | "ja" | "en"`. URL prefix와 1:1 (ko=루트).
- **dictionary**: 한 locale의 UI 문자열 정적 객체. `getDictionary(locale)` 반환물.
- **read path (읽기 경로)**: 레시피를 읽고 탐색하는 주 동선의 chrome — nav, 섹션 헤더, 핵심 CTA,
  에러/빈/로딩, 메타. (인터랙션 시트 제외)
- **notTranslated gating**: 백엔드가 해당 locale 번역본 없음(code 213)을 알릴 때 KO 폴백 +
  noindex + 배너.
- **chrome**: 레시피 데이터가 아닌, 앱이 렌더하는 정적 UI 문구.
