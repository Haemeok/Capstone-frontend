# 다국어 UI 문구 셋 (ko/ja/en) — Vertical Slices

> Design: `2026-06-12-multilingual-ui-copy-design.md` · Date: 2026-06-12 · Branch: feature/17

## Glossary (Ubiquitous Language)

한 개념 = 한 단어. AC·코드 식별자·테스트 이름이 이 단어를 공유한다.

- **locale**: `"ko" | "ja" | "en"`. URL prefix와 1:1 (ko=루트 `/`, ja=`/ja`, en=`/en`).
- **dictionary**: 한 locale의 UI 문자열 정적 객체. `getDictionary(locale)` 반환물.
- **namespace**: dictionary 안의 묶음 키 (`common` · `recipeDetail` · `search` · `errors` · `meta`).
- **read path (읽기 경로)**: 레시피를 읽고 탐색하는 주 동선의 chrome — nav, 섹션 헤더, 핵심 CTA,
  에러/빈/로딩, 메타. 인터랙션 시트 제외.
- **chrome**: 레시피 데이터가 아닌, 앱이 렌더하는 정적 UI 문구.
- **notTranslated gating**: 백엔드가 해당 locale 번역본 없음(code 213) 통지 시 KO 폴백 + noindex + 배너.
- **hreflang alternate**: 한 페이지가 자기 locale 형제들(ko/ja/en + x-default)을 SEO로 링크.

## Non-goals (이번 피처가 하지 않는 것)

테스트 없음(coverage gate가 "누락 테스트"와 구분하도록 명시).

- `[locale]` 세그먼트 재구조화 / next-intl 도입.
- ko 루트(`/`)를 `/ko`로 이동.
- **깊은 인터랙션 시트 번역** — 재료 신고/복사 시트, 평점, 댓글, 챗. KO 잔존 허용.
- ja/en 외 추가 언어.
- 백엔드 콘텐츠 번역 품질/커버리지.
- 런타임 locale 스위처 UI (URL로만 진입).

## Cross-cutting invariant

- **ko 무회귀**: 컴포넌트를 inline 문자열 → dictionary 읽기로 바꿔도 `/`(ko) 렌더 카피는
  바이트 동일. ko dict = 현재 문자열 추출본. (이 invariant는 shared 컴포넌트를 건드리는
  모든 슬라이스의 AC에 포함된다.)

---

## Slice 0 — Walking skeleton: 사전 인프라 + ja 한 가닥

**Thread**: 일본어 유저가 레시피 상세에서 섹션 로드 실패 시, 폴백 문구를 **일본어로** 본다 —
dictionary가 구동. 전 경로(locale 모델 → `shared/i18n` → 서버 접근 패턴 → `ja.ts`)를 얇게 증명.

**범위**: `shared/i18n` 인프라(`types.ts` Locale·Dictionary, `getDictionary`,
`DictionaryProvider`+`useT`) + `ko.ts`/`ja.ts`에 `errors` namespace 하나 + `RecipeDetailView`의
`SectionErrorFallback` 메시지들을 `getDictionary(locale)`로 전환. `/ja/recipes/[id]`에서만 시연.

**AC**
- AC0.1: `/ja/recipes/{id}`에서 한 섹션이 로드 실패하면 폴백 문구가 **일본어**로 렌더된다.
- AC0.2: `/`(ko)의 같은 폴백은 **현재 한국어 문자열과 동일**하다 (무회귀).
- AC0.3: `ja.ts`가 `Dictionary`(ko 파생 형태)를 미충족하면 **타입체크가 실패**한다 (누락 키 차단).

---

## Slice 1 — /ja 레시피 상세 읽기 경로 전부 일본어

**Thread**: 일본어 유저가 레시피 상세를 열면 읽기 경로 chrome 전체(navbar, 섹션 헤더, 핵심 CTA,
notTranslated 배너, 빈/로딩)가 자연스러운 일본어로 읽힌다.

**범위**: read-path namespace(`common`·`recipeDetail`)를 `ko.ts`/`ja.ts`에 채우고, 해당 read-path
서버/클라 컴포넌트들을 dictionary 읽기로 전환. 깊은 시트는 건드리지 않음. (상세 메타데이터는 이미
`ja_JP`로 동작 — 이 슬라이스 범위 밖, en 일반화는 Slice 3.)

**AC**
- AC1.1: `/ja/recipes/{번역된id}`의 읽기 경로 chrome가 **전부 일본어**다 (navbar·섹션 헤더·핵심
  CTA·빈/로딩).
- AC1.2: `/ja/recipes/{미번역id}`는 KO 콘텐츠 폴백 + **일본어 notTranslated 배너**를 보인다.
- AC1.3: 깊은 인터랙션 시트(신고·복사·평점·댓글·챗)는 KO로 남는다 (의도된 경계, non-goal).
- AC1.4: `/`(ko) 상세 읽기 경로 카피는 무회귀.

---

## Slice 2 — /ja 검색 결과 읽기 경로 + SEO 메타 일본어

**Thread**: 일본어 유저가 `/ja/search/results?q=…`를 열면 검색 chrome와 **SERP 제목/설명**이
일본어로 읽힌다.

**범위**: `search` namespace + `SearchClient` read-path chrome(빈 상태·정렬 라벨·헤더 등) 전환.
`buildSearchTitle`/`buildSearchDescription`를 `(q, total, page, locale)`로 locale-aware화 —
**ko는 현재 문자열 그대로**, `meta.search.*` 템플릿에서 보간.

**AC**
- AC2.1: `/ja/search/results?q=라멘`의 검색 chrome가 **전부 일본어**다.
- AC2.2: 같은 페이지의 SEO `<title>`/`description`이 **일본어** 템플릿으로 렌더되고 `q`·건수가
  보간된다.
- AC2.3: `q` 없음 → 일본어 기본 제목/설명. 결과 0건 → 일본어 빈 상태.
- AC2.4: `/`(ko) 검색 chrome·SERP 카피는 무회귀 (`buildSearchTitle("라멘",…,"ko")` = 기존 출력).

---

## Slice 3 — /en 레시피 상세 (라우트 신설 + 메타 일반화)

**Thread**: 영어 유저가 `/en/recipes/{id}`를 열면 콘텐츠 + 읽기 경로 chrome가 영어로 읽히고,
페이지가 indexable·`og:locale=en_US`다.

**범위**: `/en/recipes/[recipeId]/{page,not-found}.tsx` 신설. **공유 본문 추출 리팩터** —
`renderLocalizedRecipePage({recipeId, locale})`로 `/ja`·`/en`을 얇은 wrapper화(복제 제거).
`getLocalizedRecipeOnServer` locale을 `"ja"|"en"`로 widen. `generateJaRecipeMetadata` →
`generateLocalizedRecipeMetadata(recipe, id, {locale, translated})` 일반화(og:locale·inLanguage·
noindex gating 보존). `en.ts`의 detail namespace 채움.

**AC**
- AC3.1: `/en/recipes/{번역된id}` → 콘텐츠 + 읽기 경로 chrome **영어**, `og:locale=en_US`,
  `inLanguage` en, **indexable**.
- AC3.2: `/en/recipes/{미번역id}` → KO 콘텐츠 폴백 + **영어 notTranslated 배너** + **noindex**
  (ja gating 미러).
- AC3.3: `/en/recipes/{없는id}` → 영어 not-found, noindex/nofollow.
- AC3.4: 리팩터 후 `/ja/recipes/{id}`(Slice 1 결과)는 동작·문구 **무회귀**.

---

## Slice 4 — /en 검색 결과 (복수형 포함)

**Thread**: 영어 유저가 `/en/search/results?q=…`를 열면 검색 chrome와 SERP 제목/설명이 영어로
읽히고 **복수형이 정확**하다 (1 recipe vs N recipes).

**범위**: `/en/search/results/page.tsx` 신설(+ 검색 본문 공유 추출). `format.ts`의 `plural(n,{one,
other})` 헬퍼 도입. `en.ts` search namespace 채움. `buildSearchTitle`/`Description`가 en 복수형
경로 사용.

**AC**
- AC4.1: `/en/search/results?q=ramen`의 검색 chrome·SEO 제목/설명이 **전부 영어**, noindex,follow.
- AC4.2: 결과 1건 → `"1 recipe"`, N건(>1) → `"N recipes"`로 렌더 (복수형 정확).
- AC4.3: `q` 없음 → 영어 기본 제목/설명.
- AC4.4: `/ja`·`/`(ko) 검색 SERP는 무회귀 (복수형 헬퍼 도입이 ja/ko 출력을 바꾸지 않음).

---

## Slice 5 — hreflang alternates (edges, 마지막)

**Thread**: 검색엔진이 ko/ja/en 형제 페이지를 연결하도록, 각 indexable 로컬라이즈 페이지가
hreflang alternates를 노출한다.

**범위**: 로컬라이즈 페이지 메타에 `alternates.languages`(ko/ja/en + x-default) 추가.
untranslated=noindex 페이지는 자신을 indexable alternate로 광고하지 않음.

**AC**
- AC5.1: `/en/recipes/{번역된id}` 응답에 ko/ja/en + x-default hreflang 링크가 있다.
- AC5.2: `/en/recipes/{미번역id}`(noindex)는 자신을 다른 형제의 indexable alternate로 내세우지
  않는다.
- AC5.3: `/`(ko) 페이지에 hreflang 추가가 ko 본문 카피를 바꾸지 않는다 (무회귀).

> Slice 5는 design에서 "별도 슬라이스 후보"로 표시된 선택지. 시간/우선순위에 따라 후속으로
> 미뤄도 Slice 0–4가 독립적으로 시연 가능.

---

## 순서

Slice 0 (skeleton) → 1 (ja detail) → 2 (ja search) → 3 (en detail) → 4 (en search) → 5 (hreflang).
각 슬라이스 끝마다 시연 가능. en 슬라이스(3·4)는 0–2가 추출해 둔 dict 키 위에 번역만 채우고
라우트를 미러링한다.
