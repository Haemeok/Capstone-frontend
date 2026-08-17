---
title: Guard One-Character Ingredient Matches in Metadata Titles
impact: HIGH
impactDescription: 실제 구별 재료가 제목 부분 문자열 때문에 누락되는 문제 방지
tags: seo, metadata, title, ingredient, normalization, korean
---

## 한 글자 재료는 제목의 단순 부분 문자열로 중복 판정하지 않는다

재료를 제목에 추가하기 전에 `title.includes(ingredient)`만 검사하면 한 글자 재료가 더 긴 단어 안에 우연히 포함된 경우도 중복으로 처리됩니다. 예를 들어 `배`는 `양배추`의 일부이지만 두 재료는 다릅니다. 한국어 복합 명사는 공백 경계만으로 해결되지 않으므로, 한 글자 재료에는 별도의 허용 기준을 두고 실제 겹침 사례를 테스트합니다.

**Incorrect — 모든 재료에 부분 문자열 검사를 적용:**

```ts
const isAlreadyInTitle = (title: string, ingredient: string): boolean =>
  title.replaceAll(" ", "").includes(ingredient.replaceAll(" ", ""));
```

이 방식은 `배`와 `양배추`를 같은 재료로 오판해 `배 물김치` 같은 유효한 검색 제목을 만들지 못합니다.

**Correct — 긴 재료와 명시적으로 허용한 한 글자 재료를 분리:**

```ts
const SHORT_TITLE_INGREDIENTS = new Set(["밥", "닭", "쌀", "면"]);

const isAlreadyInTitle = (title: string, ingredient: string): boolean => {
  const compactTitle = title.replaceAll(" ", "");
  const compactIngredient = ingredient.replaceAll(" ", "");
  const canUseSubstring =
    compactIngredient.length >= 2 ||
    SHORT_TITLE_INGREDIENTS.has(compactIngredient);

  return canUseSubstring && compactTitle.includes(compactIngredient);
};
```

Key points:

- 한 글자 재료는 기본적으로 부분 문자열 중복 판정에서 제외합니다.
- `밥`, `닭`처럼 메뉴명에서 독립된 재료 의미가 강한 값만 명시적으로 허용합니다.
- 허용 목록에는 `배`/`양배추`처럼 오탐이 나는 음성 사례를 함께 테스트합니다.
- 다단어 재료는 공백 토큰도 비교해 `닭볶음탕용 닭`과 `닭한마리` 같은 주재료 중복을 따로 막습니다.
