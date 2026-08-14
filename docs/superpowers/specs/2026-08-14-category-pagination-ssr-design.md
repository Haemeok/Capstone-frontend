# 카테고리 페이지 SSR 페이지네이션 설계

- 작성일: 2026-08-14
- 대상 경로: `/recipes/category/[id]`, `/ja/recipes/category/[id]`, `/en/recipes/category/[id]`

## 배경

카테고리 페이지는 서버에서 레시피 목록을 조회하지만 응답의 `content`를 렌더링에 사용하지 않습니다. 서버는 `slice.hasNext`만 읽고, 브라우저가 마운트된 뒤 같은 페이지를 다시 요청합니다. `RecipeGrid`도 `ssr: false`로 불러오기 때문에 사용자가 보는 화면에는 카드가 나타나지만 초기 HTML에는 카드 링크가 없습니다.

2026-08-14 기준 프로덕션의 `CHEF_RECIPE` 1·2·3페이지를 확인한 결과, self-canonical은 페이지별로 정확했지만 초기 HTML의 `/recipes/{id}` 카드 링크와 이전·다음 페이지 링크는 모두 0개였습니다. 검색 API는 `size=20`을 지원하며 API 페이지 0·1·2에서 서로 다른 레시피 20개를 반환했습니다.

## 목표

- 카테고리 페이지의 첫 목록을 서버에서 렌더링합니다.
- 일반 페이지의 초기 HTML에 레시피 카드 20개와 실제 상세 링크를 포함합니다.
- URL은 1부터, 백엔드 API 페이지는 0부터 세도록 변환합니다.
- 각 페이지에 해당 페이지를 가리키는 canonical과 이전·다음 링크를 만듭니다.
- 서버에서 받은 목록을 TanStack Query에 hydrate하여 브라우저의 첫 요청을 없앱니다.
- SSR된 페이지 이후부터 기존 무한 스크롤을 이어갑니다.

## 선택한 접근

검색 결과 페이지에서 사용하는 `prefetchInfiniteQuery → dehydrate → HydrationBoundary` 구조를 카테고리 페이지에도 적용합니다. 서버와 클라이언트는 카테고리 query key와 요청 조건을 같은 빌더에서 가져옵니다.

서버 데이터를 단순 props로 전달하는 방식은 `useInfiniteQuery` 캐시와 별도 동기화가 필요하고 검색 페이지와 다른 패턴을 하나 더 만듭니다. 완전한 서버 페이지네이션은 초기 HTML 요구사항을 만족하지만 현재 무한 스크롤을 제거합니다. 기존 UX와 코드베이스의 검증된 패턴을 함께 유지할 수 있는 hydration 방식을 선택합니다.

## 페이지 번호 규칙

외부 URL의 페이지 번호를 `publicPage`, 백엔드에 전달하는 번호를 `apiPage`로 부릅니다.

| 사용자 위치 | URL | `publicPage` | `apiPage` |
|---|---|---:|---:|
| 1페이지 | `/recipes/category/CHEF_RECIPE` | 1 | 0 |
| 2페이지 | `/recipes/category/CHEF_RECIPE?page=2` | 2 | 1 |
| 3페이지 | `/recipes/category/CHEF_RECIPE?page=3` | 3 | 2 |

`page`가 없으면 1페이지로 처리합니다. 양의 정수가 아닌 값과 `0`은 1페이지로 처리합니다. 1페이지 canonical에는 `?page=1`을 붙이지 않습니다.

## 데이터 흐름

카테고리 페이지는 다음 순서로 렌더링합니다.

1. 서버가 URL의 `page`를 `publicPage`로 해석하고 `apiPage = publicPage - 1`을 계산합니다.
2. 카테고리 요청 조건을 만듭니다. 태그, 기본 정렬, locale, 공개 레시피 타입, `size=20`이 여기에 포함됩니다.
3. 서버가 카테고리 query key로 첫 API 페이지 한 개를 prefetch합니다.
4. 서버가 캐시된 응답에서 `slice.hasNext`를 읽어 이전·다음 URL을 계산합니다.
5. dehydrated cache와 페이지 링크를 `CategoryDetailClient`에 전달합니다.
6. 클라이언트는 같은 query key와 요청 조건을 사용합니다. hydrate된 첫 목록을 즉시 렌더링하므로 마운트 직후 같은 API 페이지를 다시 요청하지 않습니다.
7. 무한 스크롤이 발동하면 응답의 `slice.number + 1`부터 추가로 요청합니다.

카테고리 페이지 크기는 20으로 고정합니다. 전역 `PAGE_SIZE=10`과 검색 페이지의 페이지 크기는 변경하지 않습니다. 서버 조회 함수는 전달받은 `size`를 사용하되, 다른 호출자가 `size`를 생략하면 기존 기본값 10을 유지합니다.

## query key와 요청 조건

query key에는 레시피 목록 도메인, 카테고리 목록 구분, 태그 코드, 정렬, locale, 페이지 크기를 포함합니다. 서버와 클라이언트가 query key를 직접 조립하지 않고 같은 빌더를 호출합니다.

기본 정렬은 현재 카테고리 UI의 첫 정렬 옵션인 `createdAt,desc`입니다. 서버 요청과 `useSort("recipe")`의 초기 상태가 이 값으로 일치해야 합니다. 정렬을 바꾸면 새 query key로 클라이언트 요청을 시작하며, SSR 캐시는 기본 정렬 목록에만 사용됩니다.

## 초기 HTML

`RecipeGrid`의 `ssr: false`를 제거하고 정적 import로 바꿉니다. hydrate된 목록이 서버 렌더링에 사용되므로 각 `DetailedRecipeGridItem`이 실제 `<a href="/recipes/{id}">`를 출력합니다. 일본어와 영어 경로에서는 기존 locale 상세 링크 규칙을 유지합니다.

`GridFooter`는 선택적인 이전 페이지 URL을 추가로 받습니다. 1페이지에서는 다음 링크만, 중간 페이지에서는 이전·다음 링크를 모두, 마지막 페이지에서는 이전 링크만 출력합니다. 링크는 자바스크립트 없이 이동할 수 있는 실제 `<a href>`여야 합니다.

## metadata

페이지의 `generateMetadata`는 `publicPage`를 기준으로 title과 canonical을 만듭니다.

- 1페이지 canonical: `/recipes/category/{id}`
- 2페이지 canonical: `/recipes/category/{id}?page=2`
- 3페이지 canonical: `/recipes/category/{id}?page=3`

현재 layout과 page에 나뉜 카테고리 metadata 생성 경로는 page의 `generateMetadata` 하나로 정리합니다. locale별 robots와 기존 카피 정책은 변경하지 않습니다. hreflang 정책 변경은 이 작업에 포함하지 않습니다.

## 빈 목록과 실패 처리

API가 빈 `content`를 반환하면 기존 카테고리 빈 상태를 표시하고 다음 링크를 만들지 않습니다. 마지막 페이지가 20개보다 적으면 반환된 카드만 렌더링하고 다음 링크를 만들지 않습니다.

현재 `getRecipesOnServer`는 네트워크 실패를 빈 응답으로 변환합니다. 이 작업에서는 해당 계약을 바꾸지 않습니다. 실패 시 잘못된 다음 링크나 이전 페이지의 캐시를 표시하지 않고 빈 상태로 끝냅니다.

## 적용 범위

한국어·일본어·영어 카테고리 페이지가 공유하는 렌더러에 같은 구조를 적용합니다. 한국어 카드 링크는 `/recipes/{id}`, 번역 페이지 카드 링크는 기존 locale prefix를 유지합니다.

다음 항목은 범위에 포함하지 않습니다.

- 검색 페이지 또는 전역 `PAGE_SIZE` 변경
- 무한 스크롤 제거
- 정렬 UI나 카테고리 화면 디자인 변경
- 백엔드 API 변경
- locale별 robots 또는 hreflang 정책 변경
- 다른 목록 페이지의 SSR 마이그레이션

## Acceptance Criteria

1. 사용자가 카테고리 1페이지를 요청하면 초기 HTML에 API 0페이지의 레시피 카드 20개와 실제 상세 링크가 포함됩니다.
2. 사용자가 `?page=2`를 요청하면 초기 HTML에 API 1페이지의 레시피 카드가 포함되며 1페이지 목록과 다릅니다.
3. 사용자가 `?page=3`을 요청하면 초기 HTML에 API 2페이지의 레시피 카드가 포함되며 1·2페이지 목록과 다릅니다.
4. 사용자가 1페이지를 요청하면 canonical은 쿼리 없는 기본 URL을 가리키고 다음 링크는 `?page=2`를 가리킵니다.
5. 사용자가 2페이지를 요청하면 canonical은 `?page=2`, 이전 링크는 기본 URL, 다음 링크는 `?page=3`을 가리킵니다.
6. 사용자가 마지막 페이지를 요청하면 초기 HTML에 이전 링크가 있고 다음 링크는 없습니다.
7. 사용자가 `page=0`, 음수, 소수 또는 문자열을 전달하면 1페이지 목록과 기본 canonical을 받습니다.
8. 브라우저가 SSR된 카테고리를 hydrate하면 같은 query key의 첫 API 페이지를 다시 요청하지 않습니다.
9. 사용자가 목록 끝까지 스크롤하면 SSR된 API 페이지의 다음 페이지부터 레시피가 추가됩니다.
10. 사용자가 정렬을 바꾸면 선택한 정렬의 목록을 별도 query key로 조회합니다.
11. API가 빈 목록을 반환하면 카드와 다음 링크 없이 기존 빈 상태가 표시됩니다.
12. 한국어·일본어·영어 카테고리 경로가 같은 페이지 번호 변환과 hydration 규칙을 사용합니다.

## 검증 방향

페이지 번호 파서는 경계값을 단위 테스트합니다. 서버와 클라이언트 query key가 같은지는 빈 필터와 locale별 사례로 고정합니다. 실제 QueryClient를 사용하는 렌더링 테스트에서 초기 카드 링크, 이전·다음 링크, hydrate 후 중복 요청 방지를 검증합니다. metadata 테스트는 1·2·3페이지 canonical을 각각 확인합니다.

구현 후 타입 검사와 관련 Jest 테스트를 실행합니다. 프로덕션과 같은 HTML 응답을 대상으로 1·2·3페이지의 카드 링크 수, canonical, 페이지 링크, 레시피 ID 집합도 확인합니다.
