# 택소노미 현지화 + 생성/프로필 페이지 i18n — Vertical Slices

> 작성일: 2026-06-13 · 브랜치: feature/17
> 설계: `2026-06-13-i18n-taxonomy-filters-create-profile-design.md`

행동(behavior) 단위로 자른 슬라이스. 각 슬라이스는 product owner에게 데모 가능한
사용자 가치의 실. **레이어 task 없음**(타입/사전/리졸버는 그걸 처음 쓰는 슬라이스 안에서
필요한 sliver만 만든다).

---

## 글로서리 (Ubiquitous Language)

| 단어 | 코드 식별자 | 뜻 |
| --- | --- | --- |
| 택소노미 라벨 (taxonomy label) | `taxonomyLabel` | 코드에 대응하는 표시 문자열. 코드가 canonical, 라벨이 locale 가변 |
| 코드 (code) | `code` | 백엔드/URL이 쓰는 불변 식별자(`USER`, `SOUP_STEW`, `meat`…) |
| 리졸버 (resolver) | `useTaxonomyLabel` / `localizeTaxonomy` | code(또는 ko canonical) + locale → 표시 라벨 |
| chrome | `userEdit`/`recipeCreate`/`category` dict | 페이지 정적 UI 문자열(헤더·버튼·라벨·placeholder·toast) |
| 미러 라우트 (mirror route) | `app/{ja,en}/...` | 동일 트리를 렌더하는 얇은 래퍼 |
| sticky 링크 | `localizedHref` | 현재 locale prefix를 유지하는 내부 이동 링크 |
| 정렬 (sort) | `sort` | 인기순/최신순/오래된순 |
| 요리 유형 (dish type) | `dishType` | 볶음/국·찌개·탕… |
| 태그 (tag) | `tags` | 셰프 레시피/홈파티/야식… (= 카테고리 칩) |
| 레시피 유형 (recipe type) | `recipeType` | USER/AI/YOUTUBE |
| 재료 카테고리 (ingredient category) | `ingredientCategory` | 고기/채소/해산물… |

---

## Non-goals (테스트 없음 — 의도적 부재)

- user-pages 광범위 스펙의 나머지: 공개 프로필 `/users/[userId]`·레시피북·캘린더.
- youtube/AI 추출·생성 **본문 데이터** lang 및 그 페이지 **기능**(타 작업/에이전트 소유).
- 접근법 B(상수 코드 키 전면 이관).
- 자동 locale 리다이렉트 / 통화(원↔円) 변환 / `<html lang>` per-locale.
- 재료 **데이터**(재료명·카테고리 데이터 필드) 번역 — 백엔드 lang 소관. 탭 **라벨**만.
- `/recipes/new/ai/*` 하위 플로우 chrome(타 에이전트 기능 영역 — 후속).
- ko 카피 재작성/개선(순수 이동만, 문구 불변).

---

## 슬라이스

### S1 — (Walking skeleton) 레시피 유형 필터 라벨 현지화

foundation(코드 키 사전 + 리졸버 + 렌더 + ko 보존)을 가장 얇게 끝까지 증명한다.
`recipeType` 도메인만(코드를 이미 손에 든 가장 단순한 렌더 지점). 이 슬라이스가
`TaxonomyDict` 타입·`taxonomyMessages` 애그리게이터·`useTaxonomyLabel` 훅의 sliver를
만든다.

**AC**

1. `/ja/search/results`·`/en/...` 필터의 레시피 유형 라벨(사용자/AI/유튜브 레시피)이
   해당 언어로 표시된다.
2. ko 라우트(`/search/results`)에서 레시피 유형 라벨이 한글 그대로이고 선택 동작이
   회귀 없다(리졸버가 `ko` 입력을 그대로 반환).
3. 레시피 유형을 선택하면 ja/en/ko 모두 동일하게 `USER`/`AI`/`YOUTUBE` 코드가 쿼리에
   실린다(라벨 현지화가 코드 경로를 안 건드림).

### S2 — 검색 필터 나머지 라벨 현지화 (정렬·요리유형·태그·재료·영양) + 재료비 숨김

검색 결과 필터 섹션을 ja/en에서 **완전히** 현지화한다. 정렬·요리유형 칩은 상태에 ko
canonical을 들고 있어 `localizeTaxonomy`(ko→code→사전) 경로를 처음으로 행사한다.
사전에 `sort`·`dishType`·`tags`·`ingredientCategory`·`nutritionLabel`/`nutritionTheme`
도메인을 추가한다. 드로어 헤더/설명(정렬 방식 선택 등)도 chrome로 현지화.

**AC**

1. `/ja`·`/en` `/search/results` 필터 섹션의 모든 칩·드로어(정렬·요리유형·태그·재료
   필터·영양 테마/라벨)가 해당 언어로 표시되고 한글 잔존이 없다.
2. 정렬을 "최신순"에 해당하는 라벨로 바꾸면 ja/en/ko 모두 `createdAt,DESC` 코드로
   매핑되어 동일 결과를 부른다(상태는 ko canonical 유지, 표시만 현지화).
3. 요리 유형·태그를 선택하면 ja/en/ko 모두 동일 코드(`SOUP_STEW`, `LATE_NIGHT`…)가
   쿼리에 실린다.
4. ja/en에서는 영양 필터의 **재료비(원)** 부분이 렌더되지 않는다. ko에서는 그대로
   보인다. 칼로리·탄수화물·단백질·지방·당류·나트륨 범위는 ja/en에서도 유지된다.
5. ko 필터 섹션은 라벨·드로어·동작이 회귀 없이 그대로다.

### S3 — 홈/검색 카테고리 칩(CategoryTabs) 현지화

S2가 만든 `tags` 도메인 사전을 다른 렌더 지점(CategoryTabs)에 적용한다.

**AC**

1. `/ja`·`/en`의 홈과 `/search` 진입에서 카테고리 칩(셰프 레시피·홈파티·야식…)이 해당
   언어로 표시된다.
2. 카테고리 칩을 누르면 ja/en/ko 모두 동일 태그 코드로 `/[locale]/recipes/category/{code}`
   로 이동하고, 링크가 현재 locale로 sticky하다.
3. ko 홈/검색의 칩 라벨·링크가 회귀 없이 그대로다.

### S4 — 재료 카테고리 탭 현지화

S2의 `ingredientCategory` 도메인을 `IngredientCategoryTabs`에 적용한다. 탭은 `selected`
상태에 ko canonical을 들고 있으므로 비교 경로는 불변, 표시만 현지화.

**AC**

1. `/ja`·`/en`에서 재료 카테고리 탭(전체·고기·채소·해산물…)이 해당 언어로 표시된다.
2. 탭을 선택하면 ja/en/ko 모두 동일하게 선택 상태가 잡히고(비교는 ko canonical) 동일
   재료 필터 결과를 부른다.
3. ko 재료 탭 라벨·동작이 회귀 없이 그대로다.

### S5 — 프로필 편집 `/users/edit` 현지화 (미러 라우트 + chrome)

`/ja`·`/en` 미러 라우트를 추가하고 `userEdit` chrome 사전으로 폼을 현지화한다.

**AC**

1. `/ja/users/edit`·`/en/users/edit`가 렌더되고(404 아님) 헤더(취소·프로필 변경·확인/
   저장 중…)·필드 라벨(이름·소개)·placeholder가 해당 언어로 표시된다.
2. 닉네임을 비우거나 길이를 초과하면 validation 메시지가 해당 언어로 뜬다.
3. 허용 외 이미지 형식을 올리면 "JPG/PNG/WebP만" 메시지가 해당 언어로 뜬다.
4. 중복 닉네임 저장 시 서버 에러 메시지가 닉네임 필드에 표시되고, 기타 실패 시 toast가
   해당 언어로 뜬다.
5. 닉네임·소개에 입력한 자유 텍스트는 번역되지 않고 입력값 그대로 렌더된다.
6. ko `/users/edit`는 chrome·동작이 회귀 없이 그대로다.

### S6 — 생성 허브 `/recipes/new` + `/manual` 현지화 (미러 라우트 + chrome)

`/ja`·`/en` 미러 라우트 추가, 서버 컴포넌트 허브를 `locale` prop + `getDictionary`로
현지화(본문은 `renderLocalized*`로 추출), `recipeCreate` chrome 사전.

**AC**

1. `/ja/recipes/new`·`/en/recipes/new`가 렌더되고 허브 제목·설명·두 카드("직접 입력하기"/
   "유튜브로 가져오기")의 제목·본문·이미지 `alt`가 해당 언어로 표시된다.
2. 카드 링크가 현재 locale로 sticky하다(`/ja/recipes/new/manual`·`/ja/recipes/new/youtube`).
3. `/ja/recipes/new/manual`·`/en/...`이 렌더되고 작성 폼 chrome이 해당 언어로 표시된다.
4. ja/en chrome에 한글 잔존이 없다.
5. ko `/recipes/new`(+`/manual`)는 chrome·링크·동작이 회귀 없이 그대로다.

### S7 — 카테고리 상세 `/recipes/category/[id]` 현지화 (라우트 + chrome + 데이터 lang + SEO)

가장 두꺼운 슬라이스: SEO 공개 페이지. 미러 라우트 + `category` chrome + 택소노미 라벨 +
데이터 `?lang` + 현지화 메타/hreflang/`inLanguage`.

**AC**

1. `/ja/recipes/category/{code}`·`/en/...`이 렌더되고(404 아님) 히어로·칩·카운트·빈 상태
   chrome과 태그 라벨이 해당 언어로 표시된다.
2. 레시피 리스트 데이터가 `?lang`으로 번역되어 내려온다(백엔드 번역 존재 시).
3. 언어 전환 시 리스트 데이터가 refetch된다(queryKey에 locale) — stale ko 콘텐츠 없음.
4. ja/en 페이지의 `generateMetadata` title/description이 현지화 템플릿(`{태그명} 모음`)이고
   hreflang alternates·JSON-LD `inLanguage`가 locale에 맞는다.
5. `CHEF_RECIPE`의 한국 셀럽 키워드(흑백요리사·안성재…)는 ja/en 메타에 들어가지 않는다
   (ko 전용 유지).
6. 백엔드 미번역 fallback 시 robots `noindex`가 적용된다.
7. ko `/recipes/category/[id]`는 chrome·메타·데이터·동작이 회귀 없이 그대로다.

---

## 순서 (writing-plans task 순서로 이어짐)

S1(skeleton) → S2 → S3 → S4 → S5 → S6 → S7.

S1이 foundation sliver를 깐다. S2가 ko→code 리졸버 경로와 나머지 도메인 사전을 확장하고,
S3·S4는 그 사전을 다른 렌더 지점에 적용(얇음). S5·S6는 독립 페이지 chrome(택소노미 비의존,
foundation과 병행 가능). S7은 데이터 lang + SEO까지 포함한 최대 슬라이스.
