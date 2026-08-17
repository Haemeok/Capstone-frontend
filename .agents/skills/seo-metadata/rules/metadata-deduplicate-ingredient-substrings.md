---
title: Deduplicate Ingredient Names with Normalized Substring Matching
impact: HIGH
impactDescription: 재료가 반복된 검색 제목과 예외 목록 유지 비용 방지
tags: seo, metadata, title, ingredient, normalization, korean
---

## 글자 수와 관계없이 제목에 겹치는 재료 문자열은 중복으로 제외한다

재료를 제목에 추가할 때 한 글자 재료만 별도로 처리하면 `김 김말이`, `무 무조림`처럼 명백한 반복이 생기고 허용 목록을 계속 관리해야 합니다. 공백을 제거한 재료명이 제목 어느 위치에든 있으면 이미 포함된 것으로 처리합니다. 이 정책에서는 `배`가 `양배추`에 포함되는 사례도 중복으로 받아들여 규칙의 일관성과 정밀도를 우선합니다.

**Incorrect — 한 글자 재료에 별도 허용 목록을 적용:**

```ts
const SHORT_TITLE_INGREDIENTS = new Set(["김", "무"]);

const hasTitleMatch =
  ingredient.length >= 2 || SHORT_TITLE_INGREDIENTS.has(ingredient)
    ? title.includes(ingredient)
    : false;
```

이 방식은 목록에 없는 한 글자 재료가 반복되고, 새 사례가 나올 때마다 예외를 추가하게 만듭니다.

**Correct — 정규화한 문자열을 동일한 방식으로 비교:**

```ts
const compact = (value: string): string => value.replaceAll(" ", "");

const isAlreadyInTitle = (title: string, ingredient: string): boolean =>
  compact(title).includes(compact(ingredient));
```

Key points:

- 재료의 글자 수에 따라 제목 중복 기준을 바꾸지 않습니다.
- `김`/`김말이`, `무`/`무조림`, `배`/`양배추`를 모두 문자열 중복으로 처리합니다.
- `쌀` 같은 기본 재료 제외는 문자열 중복 검사와 별도의 후보 분류 단계에서 처리합니다.
- 다단어 재료는 각 토큰도 비교해 `닭볶음탕용 닭`과 `닭한마리` 같은 반복을 막습니다.
