---
title: Separate Public and API Page Numbers in Pagination Metadata
impact: HIGH
impactDescription: self-canonical과 페이지 제목의 번호 어긋남 방지
tags: seo, metadata, pagination, canonical, nextjs
---

## 페이지네이션 metadata에는 공개 페이지 번호만 전달한다

사람과 검색엔진이 보는 URL은 보통 1부터 시작하고, 목록 API는 0부터 시작합니다. 하나의 `page` 값이 두 의미를 오가면 첫 페이지에 `?page=1` canonical이 생기거나 제목의 페이지 번호가 한 칸 밀립니다. URL을 해석하는 경계에서 두 값을 분리하고 metadata에는 `publicPage`만 전달합니다.

**Incorrect — 하나의 page를 URL과 API 의미로 함께 사용:**

```ts
const page = Number(searchParams.page ?? 0);

await fetchRecipes({ page });

return {
  title: page > 0 ? `Recipes (Page ${page + 1})` : "Recipes",
  alternates: {
    canonical: page > 0 ? `/recipes?page=${page}` : "/recipes",
  },
};
```

같은 값에 `+1`을 적용하는 곳과 적용하지 않는 곳이 생겨 제목과 canonical의 기준이 달라집니다.

**Correct — 공개 번호와 API 번호를 파싱 시점에 분리:**

```ts
const publicPage = parsePositivePage(searchParams.page); // 1, 2, 3...
const apiPage = publicPage - 1; // 0, 1, 2...

await fetchRecipes({ page: apiPage });

return {
  title: publicPage > 1 ? `Recipes (Page ${publicPage})` : "Recipes",
  alternates: {
    canonical:
      publicPage === 1 ? "/recipes" : `/recipes?page=${publicPage}`,
  },
};
```

Key points:

- 파서의 반환 타입부터 `publicPage`와 `apiPage`를 다른 필드로 표현합니다.
- metadata, 페이지 링크, 화면 라벨은 `publicPage`만 사용합니다.
- API 요청과 infinite query의 시작점은 `apiPage`만 사용합니다.
- 첫 페이지, 중간 페이지, 잘못된 입력에 대해 self-canonical과 제목 번호를 함께 테스트합니다.
