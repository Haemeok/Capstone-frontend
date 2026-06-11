# Recipe Metadata Quality Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 레시피 상세 메타데이터에 국가 origin 브래킷을 최우선으로 넣고, 같은 패스에서 발견된 타이틀/설명/구조화 데이터 품질 버그(시간·비용 중복, 영양 누락, recipeCuisine 오기, 구독자수 100배 축소)를 함께 교정한다.

**Architecture:** 메타데이터는 순수함수 출력이 곧 제품(렌더 계층 없음). 모든 변경은 `src/entities/recipe/lib/metadata/` 내 순수함수(`recipeMetadata.ts`/`seo.ts`/`schema.ts`/`youtube.ts`)에 국한되고, 테스트는 그 출력에 대한 acceptance/unit 테스트다. 데이터 신규 적재 없음 — 기존 `creatorCountryTag`/`nutrition` 필드만 활용.

**Tech Stack:** Next.js 15, TypeScript, Jest(`@jest-environment node`), 기존 팩토리 `fixtures/recipeFactory.ts`.

**우선순위 불변식:** 국가 > 셰프 > 태그/시간/비용.

**브랜치:** 현재 `feature/17`에서 실행(워크트리/브랜치 전환 없음).

**참조 문서:** 설계 `docs/superpowers/specs/2026-06-11-origin-recipe-metadata-bracket-design.md`, 슬라이스 `...-slices.md`, 테스트설계 `...-test-design.md`.

---

## File Structure

- `src/entities/recipe/lib/metadata/recipeMetadata.ts` — 타이틀 브래킷/시간/설명/키워드 (Task 1, 2, 6, 7)
- `src/entities/recipe/lib/metadata/seo.ts` — youtube 설명의 영양 라인 (Task 5)
- `src/entities/recipe/lib/metadata/schema.ts` — Recipe JSON-LD의 `recipeCuisine` (Task 3)
- `src/entities/recipe/lib/metadata/youtube.ts` — `formatSubscriberCount` (Task 4)
- `src/entities/recipe/lib/metadata/__tests__/fixtures/recipeFactory.ts` — JP/OTHER 팩토리 (Task 1)
- `src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts` — origin/시간/영양/설명/키워드 테스트 추가 + 기존 1건 갱신
- `src/entities/recipe/lib/metadata/__tests__/recipeStructuredData.test.ts` — 신규, recipeCuisine
- `src/entities/recipe/lib/metadata/__tests__/formatSubscriberCount.test.ts` — 신규, 구독자 포맷 unit

---

## Task 1: Origin 브래킷 (JP/OTHER, 국가 > 셰프, 시간 생략)

커버: T-01~T-08, T-29.

**Files:**
- Modify: `src/entities/recipe/lib/metadata/__tests__/fixtures/recipeFactory.ts`
- Modify: `src/entities/recipe/lib/metadata/recipeMetadata.ts`
- Test: `src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`

- [ ] **Step 1: JP/OTHER 팩토리 추가**

`recipeFactory.ts` 끝에 추가:

```typescript
export const makeJpRecipe = (
  overrides?: Partial<StaticRecipe>
): StaticRecipe => {
  return makeYoutubeMediumRecipe({
    creatorCountryTag: "JP",
    youtubeChannelName: "きょうの料理",
    title: "오야코동",
    ...overrides,
  });
};

export const makeOtherRecipe = (
  overrides?: Partial<StaticRecipe>
): StaticRecipe => {
  return makeYoutubeMediumRecipe({
    creatorCountryTag: "OTHER",
    youtubeChannelName: "Spain on a Fork",
    title: "감바스",
    ...overrides,
  });
};
```

- [ ] **Step 2: 실패 테스트 작성**

`recipeMetadata.youtube.test.ts`의 import에 `makeJpRecipe, makeOtherRecipe` 추가하고, 파일 끝(마지막 `});` 앞)에 describe 추가:

```typescript
describe("Origin Country Bracket", () => {
  it("국가 태그가 JP면 제목이 [🇯🇵현지레시피]로 시작한다", () => {
    const recipe = makeJpRecipe();
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect((meta.title as string).startsWith("[🇯🇵현지레시피]")).toBe(true); // T-01
  });

  it("JP면 태그/시간/비용 브래킷보다 origin이 우선한다", () => {
    const recipe = makeJpRecipe({
      tags: ["다이어트"],
      cookingTime: 10,
      totalIngredientCost: 3000,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).toContain("[🇯🇵현지레시피]"); // T-02
    expect(meta.title).not.toContain("[다이어트🥗]");
    expect(meta.title).not.toContain("15분컷");
  });

  it("JP면 셰프 조건이어도 origin이 우선한다 (국가 > 셰프)", () => {
    const recipe = makeJpRecipe({ tags: ["셰프 레시피"] });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).toContain("[🇯🇵현지레시피]"); // T-03
    expect(meta.title).not.toContain("[셰프레시피👨‍🍳]");
  });

  it("JP 제목에는 N분 완성 시간 표기가 없다", () => {
    const recipe = makeJpRecipe({ cookingTime: 25 });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).not.toContain("완성"); // T-04
  });

  it("JP 제목에 출처 슬롯이 유지된다", () => {
    const recipe = makeJpRecipe();
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).toContain("(출처: きょうの料理 유튜브)"); // T-05
  });

  it("국가 태그가 OTHER면 제목이 [🌍전세계레시피]로 시작한다", () => {
    const recipe = makeOtherRecipe();
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect((meta.title as string).startsWith("[🌍전세계레시피]")).toBe(true); // T-06
  });

  it("OTHER 제목에는 N분 완성 시간 표기가 없다", () => {
    const recipe = makeOtherRecipe({ cookingTime: 20 });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).not.toContain("완성"); // T-07
  });

  it("OTHER면 셰프 조건이어도 origin이 우선한다", () => {
    const recipe = makeOtherRecipe({ tags: ["셰프 레시피"] });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).toContain("[🌍전세계레시피]"); // T-08
    expect(meta.title).not.toContain("[셰프레시피👨‍🍳]");
  });

  it("origin 레시피라도 keywords에 origin 검색어를 추가하지 않는다", () => {
    const recipe = makeJpRecipe();
    const meta = generateRecipeMetadata(recipe, "test-id");
    const keywords = meta.keywords as string[];
    expect(keywords).not.toContain("일본 가정식"); // T-29
    expect(keywords).not.toContain("전세계 레시피");
    expect(keywords).not.toContain("해외 레시피");
  });
});
```

- [ ] **Step 3: 테스트 실패 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts -t "Origin Country Bracket"`
Expected: FAIL (origin 브래킷 미구현 — `[🇯🇵현지레시피]` 없음)

- [ ] **Step 4: origin 브래킷 구현**

`recipeMetadata.ts`에서 `tagKeywordMap` 정의 직후, `let titleBracket = ""` 블록을 다음으로 교체.

기존:
```typescript
  // 키워드 우선순위: 태그 → 시간 → 비용 (1개만 선택)
  let titleBracket = "";

  for (const tag of recipe.tags) {
    const keyword = tagKeywordMap[tag];
    if (keyword) {
      titleBracket = keyword;
      break;
    }
  }
```

변경:
```typescript
  const ORIGIN_BRACKET: Record<string, string> = {
    JP: "[🇯🇵현지레시피]",
    OTHER: "[🌍전세계레시피]",
  };
  const originBracket = recipe.creatorCountryTag
    ? (ORIGIN_BRACKET[recipe.creatorCountryTag] ?? "")
    : "";

  // 키워드 우선순위: 국가 → 태그 → 시간 → 비용 (1개만 선택)
  let titleBracket = originBracket;
  const suppressTime = Boolean(originBracket);

  if (!titleBracket) {
    for (const tag of recipe.tags) {
      const keyword = tagKeywordMap[tag];
      if (keyword) {
        titleBracket = keyword;
        break;
      }
    }
  }
```

그리고 `timeText` 정의(기존 `const timeText = recipe.cookingTime > 0 ? ...`)를 교체:
```typescript
  const timeText =
    !suppressTime && recipe.cookingTime > 0
      ? `${recipe.cookingTime}분 완성`
      : "";
```

마지막으로 chef-tv-show 분기 조건에 origin 가드 추가. 기존 `if (recipeType === "chef-tv-show") {` 를:
```typescript
  if (recipeType === "chef-tv-show" && !originBracket) {
```

- [ ] **Step 5: 테스트 통과 + 타입 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`
Expected: PASS (Origin describe 전부 통과, 기존 테스트 회귀 없음)

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 6: 커밋**

```bash
git add src/entities/recipe/lib/metadata/recipeMetadata.ts src/entities/recipe/lib/metadata/__tests__/fixtures/recipeFactory.ts src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts
git commit -m "feat(seo): lead recipe title with country origin bracket

JP -> [🇯🇵현지레시피], OTHER -> [🌍전세계레시피], ahead of chef and
tag/time/cost brackets. Origin titles drop the N분 완성 timeText so the
JP-language channel source survives SERP truncation; the source slot is
kept. Country tag denotes creator nationality, not cuisine.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: 타이틀 시간 표기 중복 제거 + 타이틀 불변

커버: T-09~T-12, T-27, T-28. (T-27/T-28은 비대상 레시피 회귀 가드 — Task 1·2 변경이 KR을 깨지 않았는지 확인하며 즉시 green일 수 있음)

**Files:**
- Modify: `src/entities/recipe/lib/metadata/recipeMetadata.ts`
- Test: `src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`

- [ ] **Step 1: 실패 테스트 작성**

`recipeMetadata.youtube.test.ts` 끝에 describe 추가:

```typescript
describe("Title Time De-duplication", () => {
  it("15분컷 브래킷이면 N분 완성이 제거된다 (cookingTime=15)", () => {
    const recipe = makeYoutubeFamousRecipe({ tags: ["한식"], cookingTime: 15 });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).toContain("[15분컷⏱️]"); // T-09
    expect(meta.title).not.toContain("완성");
  });

  it("15분컷 브래킷이면 N분 완성이 제거된다 (cookingTime<15)", () => {
    const recipe = makeYoutubeFamousRecipe({ tags: ["한식"], cookingTime: 10 });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).toContain("[15분컷⏱️]"); // T-10
    expect(meta.title).not.toContain("완성");
  });

  it("초간단 브래킷이면 N분 완성이 유지된다", () => {
    const recipe = makeYoutubeFamousRecipe({ tags: ["한식"], cookingTime: 25 });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).toContain("[초간단⚡]"); // T-11
    expect(meta.title).toContain("25분 완성");
  });

  it("비용 브래킷이면 N분 완성이 유지된다", () => {
    const recipe = makeYoutubeFamousRecipe({
      tags: ["한식"],
      cookingTime: 45,
      totalIngredientCost: 3000,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).toContain("[3천원💰]"); // T-12
    expect(meta.title).toContain("45분 완성");
  });

  it("KR/국가 없음이면 origin 브래킷이 나타나지 않는다", () => {
    const recipe = makeYoutubeFamousRecipe({ tags: ["다이어트"] });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).not.toContain("[🇯🇵"); // T-27
    expect(meta.title).not.toContain("[🌍");
    expect(meta.title).toContain("[다이어트🥗]");
  });

  it("KR + 셰프 조건이면 셰프 타이틀이 유지된다", () => {
    const recipe = makeYoutubeFamousRecipe({ tags: ["셰프 레시피"] });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.title).toContain("[셰프레시피👨‍🍳]"); // T-28
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts -t "Title Time De-duplication"`
Expected: T-09/T-10 FAIL (15분컷인데 `15분 완성`/`10분 완성`이 아직 붙음). T-11/T-12/T-27/T-28은 통과.

- [ ] **Step 3: 15분컷 시간 억제 구현**

`recipeMetadata.ts`에서 Task 1이 만든 `const suppressTime = Boolean(originBracket);`를 `let`으로 바꾸고, 시간 브래킷 분기에서 15분컷일 때 억제.

기존:
```typescript
  const suppressTime = Boolean(originBracket);
```
변경:
```typescript
  let suppressTime = Boolean(originBracket);
```

기존:
```typescript
  if (!titleBracket) {
    if (recipe.cookingTime <= QUICK_RECIPE_TIME) {
      titleBracket = "[15분컷⏱️]";
    } else if (recipe.cookingTime <= EASY_RECIPE_TIME) {
      titleBracket = "[초간단⚡]";
    }
  }
```
변경:
```typescript
  if (!titleBracket) {
    if (recipe.cookingTime <= QUICK_RECIPE_TIME) {
      titleBracket = "[15분컷⏱️]";
      suppressTime = true;
    } else if (recipe.cookingTime <= EASY_RECIPE_TIME) {
      titleBracket = "[초간단⚡]";
    }
  }
```

- [ ] **Step 4: 테스트 통과 + 타입 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`
Expected: PASS (전체). 단, 기존 `:186` "조리시간 … 30분 완성"(초간단, 시간 유지)도 그대로 통과해야 함.

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add src/entities/recipe/lib/metadata/recipeMetadata.ts src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts
git commit -m "fix(seo): drop redundant timeText when title bracket already states time

[15분컷⏱️] already encodes a time number, so the trailing 'N분 완성'
duplicated it (e.g. 15분컷 … 15분 완성). Suppress timeText for the
15분컷 bracket; 초간단 and tag/cost brackets keep it.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: recipeCuisine 크리에이터 국적 매핑

커버: T-18, T-19, T-20.

**Files:**
- Modify: `src/entities/recipe/lib/metadata/schema.ts`
- Test (create): `src/entities/recipe/lib/metadata/__tests__/recipeStructuredData.test.ts`

- [ ] **Step 1: 실패 테스트 작성**

신규 파일 `recipeStructuredData.test.ts`:

```typescript
/**
 * @jest-environment node
 */
import { createRecipeStructuredData } from "../schema";
import {
  makeBaseRecipe,
  makeJpRecipe,
  makeOtherRecipe,
} from "./fixtures/recipeFactory";

describe("Recipe structured data — recipeCuisine", () => {
  it("JP 레시피의 recipeCuisine은 Japanese다", () => {
    const data = createRecipeStructuredData(makeJpRecipe(), "test-id");
    expect(data.recipeCuisine).toBe("Japanese"); // T-18
  });

  it("KR/국가 없음 레시피의 recipeCuisine은 Korean이다", () => {
    const data = createRecipeStructuredData(makeBaseRecipe(), "test-id");
    expect(data.recipeCuisine).toBe("Korean"); // T-19
  });

  it("OTHER 레시피의 구조화 데이터에는 recipeCuisine 키가 없다", () => {
    const data = createRecipeStructuredData(makeOtherRecipe(), "test-id");
    expect("recipeCuisine" in data).toBe(false); // T-20
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeStructuredData.test.ts`
Expected: T-18 FAIL("Korean" 반환), T-20 FAIL(키 존재). T-19 통과.

- [ ] **Step 3: recipeCuisine 매핑 구현**

`schema.ts`의 `createRecipeStructuredData` 함수 내부, `return {` 직전에 추가:

```typescript
  const CUISINE_BY_COUNTRY: Record<string, string> = {
    KR: "Korean",
    JP: "Japanese",
  };
  const recipeCuisine = recipe.creatorCountryTag
    ? CUISINE_BY_COUNTRY[recipe.creatorCountryTag]
    : "Korean";
```

그리고 return 객체에서 기존 라인:
```typescript
    recipeCategory: recipe.dishType,
    recipeCuisine: "Korean",
```
교체:
```typescript
    recipeCategory: recipe.dishType,
    ...(recipeCuisine && { recipeCuisine }),
```

- [ ] **Step 4: 테스트 통과 + 타입 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeStructuredData.test.ts`
Expected: PASS (3개)

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add src/entities/recipe/lib/metadata/schema.ts src/entities/recipe/lib/metadata/__tests__/recipeStructuredData.test.ts
git commit -m "fix(seo): map recipeCuisine from creator nationality instead of hardcoding Korean

JSON-LD asserted recipeCuisine 'Korean' for every recipe, contradicting
international support. No cuisine data exists, so use the creator country
tag as a weak prior: KR/none -> Korean, JP -> Japanese, OTHER -> omit
(unknown country). Tag is creator nationality, not a cuisine guarantee.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: 구독자수 100만+ 표기 수정

커버: T-23, T-24, T-25 (unit), T-26 (acceptance 와이어링 + 기존 테스트 갱신).

**Files:**
- Modify: `src/entities/recipe/lib/metadata/youtube.ts`
- Test (create): `src/entities/recipe/lib/metadata/__tests__/formatSubscriberCount.test.ts`
- Modify: `src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts` (기존 `:27` 갱신 + 와이어링 추가)

- [ ] **Step 1: 실패 테스트(unit) 작성**

신규 파일 `formatSubscriberCount.test.ts`:

```typescript
/**
 * @jest-environment node
 */
import { formatSubscriberCount } from "../youtube";

describe("formatSubscriberCount", () => {
  it("100만 구독자는 100만명으로 표기된다", () => {
    expect(formatSubscriberCount(1_000_000)).toBe("100만명"); // T-23
  });

  it("150만 구독자는 150만명으로 표기된다", () => {
    expect(formatSubscriberCount(1_500_000)).toBe("150만명"); // T-24
  });

  it("2만 구독자는 2만명으로 표기된다 (회귀)", () => {
    expect(formatSubscriberCount(20_000)).toBe("2만명"); // T-25
  });
});
```

- [ ] **Step 2: 기존 테스트 갱신 + 와이어링 테스트 작성**

`recipeMetadata.youtube.test.ts`에서 기존 테스트(현재 `구독자 1.5만명`을 기대하는 "설명에 구독자 수와 채널 정보가 포함된다")의 해당 단언을 교체:

기존:
```typescript
      expect(meta.description).toContain("구독자 1.5만명");
```
변경(Famous 픽스처는 150만 구독자):
```typescript
      expect(meta.description).toContain("구독자 150만명");
```

그리고 같은 파일의 `describe("YouTube Famous ...")` 안에 와이어링 테스트 추가:

```typescript
    it("구독자 100만 채널 설명에 100만명으로 표기된다", () => {
      const recipe = makeYoutubeFamousRecipe({
        youtubeSubscriberCount: 1_000_000,
      });
      const meta = generateRecipeMetadata(recipe, "test-id");
      expect(meta.description).toContain("구독자 100만명"); // T-26
      expect(meta.description).not.toContain("구독자 1만명");
    });
```

- [ ] **Step 3: 테스트 실패 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/formatSubscriberCount.test.ts`
Expected: T-23/T-24 FAIL (현재 `1,000,000` → "1만명", `1,500,000` → "1.5만명")

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts -t "100만"`
Expected: FAIL (현재 "구독자 1만명")

- [ ] **Step 4: 버그 분기 제거 구현**

`youtube.ts` 상단 import에서 `YOUTUBE_SEO`를 제거(아래 변경 후 미사용이 됨):

기존:
```typescript
import { SEO_CONSTANTS, YOUTUBE_SEO } from "./constants";
```
변경:
```typescript
import { SEO_CONSTANTS } from "./constants";
```

`formatSubscriberCount` 전체 교체:

기존:
```typescript
export const formatSubscriberCount = (count: number): string => {
  if (count >= YOUTUBE_SEO.SUBSCRIBER_THRESHOLDS.MILLION) {
    const millions = Math.floor(count / 10000) / 100;
    return `${millions}만명`;
  } else if (count >= 10000) {
    const tenThousands = Math.floor(count / 10000);
    return `${tenThousands}만명`;
  } else if (count >= 1000) {
    const thousands = Math.floor(count / 1000);
    return `${thousands}천명`;
  }
  return `${count}명`;
};
```
변경:
```typescript
export const formatSubscriberCount = (count: number): string => {
  if (count >= 10000) {
    const tenThousands = Math.floor(count / 10000);
    return `${tenThousands}만명`;
  } else if (count >= 1000) {
    const thousands = Math.floor(count / 1000);
    return `${thousands}천명`;
  }
  return `${count}명`;
};
```

- [ ] **Step 5: 테스트 통과 + 타입 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/formatSubscriberCount.test.ts src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`
Expected: PASS (전부; 기존 "구독자 4만명"/"구독자 5천명" 회귀 없음)

Run: `npx tsc --noEmit`
Expected: 에러 없음 (YOUTUBE_SEO 미사용 import 제거됨)

- [ ] **Step 6: 커밋**

```bash
git add src/entities/recipe/lib/metadata/youtube.ts src/entities/recipe/lib/metadata/__tests__/formatSubscriberCount.test.ts src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts
git commit -m "fix(seo): correct subscriber count formatting for 1M+ channels

formatSubscriberCount divided by an extra 100 in the >=1,000,000 branch,
rendering a 1M-subscriber channel as '1만명' (100x understated). The
>=10000 branch already formats millions correctly (100만명), so remove
the buggy branch.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: description 영양 정보 보강

커버: T-13, T-14, T-15.

**Files:**
- Modify: `src/entities/recipe/lib/metadata/seo.ts`
- Test: `src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`

- [ ] **Step 1: 실패 테스트 작성**

`recipeMetadata.youtube.test.ts` 끝에 describe 추가:

```typescript
describe("Nutrition Line", () => {
  it("youtube 설명에 칼로리와 매크로(탄·단·지)가 표시된다", () => {
    const recipe = makeYoutubeFamousRecipe({
      totalCalories: 590,
      nutrition: {
        protein: 18,
        carbohydrate: 62,
        fat: 12,
        sugar: 5,
        sodium: 800,
      },
    });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.description).toContain("칼로리 590kcal"); // T-13
    expect(meta.description).toContain("탄수화물 62g");
    expect(meta.description).toContain("단백질 18g");
    expect(meta.description).toContain("지방 12g");
  });

  it("값이 0인 매크로는 라인에서 생략된다", () => {
    const recipe = makeYoutubeFamousRecipe({
      totalCalories: 590,
      nutrition: { protein: 18, carbohydrate: 0, fat: 12, sugar: 0, sodium: 0 },
    });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.description).not.toContain("탄수화물"); // T-14
    expect(meta.description).toContain("단백질 18g");
    expect(meta.description).toContain("지방 12g");
  });

  it("매크로가 모두 0이면 칼로리만 표시된다", () => {
    const recipe = makeYoutubeFamousRecipe({
      totalCalories: 590,
      nutrition: { protein: 0, carbohydrate: 0, fat: 0, sugar: 0, sodium: 0 },
    });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.description).toContain("칼로리 590kcal"); // T-15
    expect(meta.description).not.toContain("탄수화물");
    expect(meta.description).not.toContain("단백질");
    expect(meta.description).not.toContain("지방");
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts -t "Nutrition Line"`
Expected: T-13/T-14 FAIL (현재 칼로리만 표기, 매크로 없음)

- [ ] **Step 3: 영양 라인 보강 구현**

`seo.ts`의 `generateYoutubeDescription` 내부, 기존 칼로리 블록 교체:

기존:
```typescript
  if (recipe.totalCalories) {
    details.push(`🍽️ 1인분 기준: 칼로리 ${recipe.totalCalories}kcal`);
  }
```
변경:
```typescript
  if (recipe.totalCalories) {
    const nutritionParts = [`칼로리 ${recipe.totalCalories}kcal`];
    const nutrition = recipe.nutrition;
    if (nutrition?.carbohydrate) {
      nutritionParts.push(`탄수화물 ${nutrition.carbohydrate}g`);
    }
    if (nutrition?.protein) {
      nutritionParts.push(`단백질 ${nutrition.protein}g`);
    }
    if (nutrition?.fat) {
      nutritionParts.push(`지방 ${nutrition.fat}g`);
    }
    details.push(`🍽️ 1인분 기준: ${nutritionParts.join(" · ")}`);
  }
```

- [ ] **Step 4: 테스트 통과 + 타입 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`
Expected: PASS

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add src/entities/recipe/lib/metadata/seo.ts src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts
git commit -m "fix(seo): fill the nutrition line with macros, not just calories

The youtube description promised '영양정보' but printed only calories.
Add 탄수화물/단백질/지방 from recipe.nutrition, omitting any zero/missing
macro; all-zero falls back to calories only.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: description 비용·시간 중복 제거

커버: T-16, T-17.

**Files:**
- Modify: `src/entities/recipe/lib/metadata/recipeMetadata.ts`
- Test: `src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`

- [ ] **Step 1: 실패 테스트 작성**

`recipeMetadata.youtube.test.ts` 끝에 describe 추가:

```typescript
describe("Description Cost/Time De-duplication", () => {
  it("youtube 설명에서 비용·시간이 괄호로 중복 표기되지 않는다", () => {
    const recipe = makeYoutubeFamousRecipe({
      totalIngredientCost: 2685,
      cookingTime: 15,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.description).not.toContain("예상비용:"); // T-16
    expect(meta.description).not.toContain("분 소요");
    expect(meta.description).toContain("💰 예상 재료비:");
    expect(meta.description).toContain("⏱️ 조리 시간: 15분");
  });

  it("비-youtube 설명은 (예상비용: …, … 소요) 괄호를 유지한다", () => {
    const recipe = makeBaseRecipe({
      totalIngredientCost: 8000,
      cookingTime: 30,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.description).toContain("예상비용: 8,000원"); // T-17
    expect(meta.description).toContain("30분 소요");
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts -t "Description Cost/Time"`
Expected: T-16 FAIL (현재 youtube 설명에 `(예상비용: 2,685원, 15분 소요)` 괄호가 중복으로 존재)

- [ ] **Step 3: youtube 경로 괄호 제거 구현**

`recipeMetadata.ts`에서 `baseDescription`/`defaultDescription` 계산을 교체.

기존:
```typescript
  const baseDescription = recipe.description
    ? `${recipe.description}${additionalInfo ? ` (${additionalInfo})` : ""}`
    : `${recipe.title} 레시피! AI가 제안하는 ${recipe.totalIngredientCost.toLocaleString("ko-KR")}원 가성비 요리법을 확인하세요.`;

  const defaultDescription =
    youtubeMetadata && recipeType !== "chef-tv-show"
      ? generateYoutubeDescription(recipe, baseDescription, youtubeMetadata)
      : baseDescription;
```
변경:
```typescript
  const youtubeNarrative =
    youtubeMetadata && recipeType !== "chef-tv-show"
      ? youtubeMetadata
      : undefined;

  const baseDescription = recipe.description
    ? `${recipe.description}${!youtubeNarrative && additionalInfo ? ` (${additionalInfo})` : ""}`
    : `${recipe.title} 레시피! AI가 제안하는 ${recipe.totalIngredientCost.toLocaleString("ko-KR")}원 가성비 요리법을 확인하세요.`;

  const defaultDescription = youtubeNarrative
    ? generateYoutubeDescription(recipe, baseDescription, youtubeNarrative)
    : baseDescription;
```

- [ ] **Step 4: 테스트 통과 + 타입 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`
Expected: PASS (T-16/T-17 포함, 기존 설명 테스트 회귀 없음)

Run: `npx tsc --noEmit`
Expected: 에러 없음 (`youtubeNarrative`는 truthy 분기에서 `YoutubeMetadata`로 좁혀짐)

- [ ] **Step 5: 커밋**

```bash
git add src/entities/recipe/lib/metadata/recipeMetadata.ts src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts
git commit -m "fix(seo): stop printing cost/time twice in the youtube description

The base description's '(예상비용: …, … 소요)' parenthetical duplicated
the 💰/⏱️ detail lines below it. Drop the parenthetical on the youtube
narrative path; non-youtube descriptions keep it (no detail lines there).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: 비용 키워드 0원 가드

커버: T-21, T-22.

**Files:**
- Modify: `src/entities/recipe/lib/metadata/recipeMetadata.ts`
- Test: `src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`

- [ ] **Step 1: 실패 테스트 작성**

`recipeMetadata.youtube.test.ts` 끝에 describe 추가:

```typescript
describe("Cost Keyword Guard", () => {
  it("재료비 0원이면 비용 키워드가 keywords에 없다", () => {
    const recipe = makeYoutubeFamousRecipe({
      totalIngredientCost: 0,
      tags: ["한식"],
      cookingTime: 45,
    });
    const meta = generateRecipeMetadata(recipe, "test-id");
    const keywords = meta.keywords as string[];
    expect(keywords).not.toContain("가성비요리"); // T-21
    expect(keywords).not.toContain("3000원요리");
    expect(keywords).not.toContain("만원요리");
    expect(keywords).not.toContain("알뜰요리");
  });

  it("재료비 3000원이면 가성비 키워드가 포함된다", () => {
    const recipe = makeYoutubeFamousRecipe({ totalIngredientCost: 3000 });
    const meta = generateRecipeMetadata(recipe, "test-id");
    expect(meta.keywords as string[]).toContain("가성비요리"); // T-22
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts -t "Cost Keyword Guard"`
Expected: T-21 FAIL (현재 cost 0 → "가성비요리/3000원요리"가 붙음)

- [ ] **Step 3: 0원 가드 구현**

`recipeMetadata.ts`의 dynamicKeywords 비용 분기를 `totalIngredientCost > 0`로 감싼다.

기존:
```typescript
  if (recipe.totalIngredientCost <= BUDGET_FRIENDLY_THRESHOLD) {
    dynamicKeywords.push("가성비요리", "저렴한요리", "3000원요리");
  } else if (recipe.totalIngredientCost <= AFFORDABLE_THRESHOLD) {
    dynamicKeywords.push("만원요리", "알뜰요리");
  }
```
변경:
```typescript
  if (recipe.totalIngredientCost > 0) {
    if (recipe.totalIngredientCost <= BUDGET_FRIENDLY_THRESHOLD) {
      dynamicKeywords.push("가성비요리", "저렴한요리", "3000원요리");
    } else if (recipe.totalIngredientCost <= AFFORDABLE_THRESHOLD) {
      dynamicKeywords.push("만원요리", "알뜰요리");
    }
  }
```

- [ ] **Step 4: 테스트 통과 + 타입 확인**

Run: `npx jest src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts`
Expected: PASS

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 5: 전체 메타데이터 테스트 + 커밋**

Run: `npx jest src/entities/recipe/lib/metadata`
Expected: PASS (전체 메타데이터 스위트)

```bash
git add src/entities/recipe/lib/metadata/recipeMetadata.ts src/entities/recipe/lib/metadata/__tests__/recipeMetadata.youtube.test.ts
git commit -m "fix(seo): skip cost keywords when ingredient cost is unknown (0)

The title cost bracket guards on cost > 0 but the dynamic keyword branch
did not, so a recipe with no cost data got '가성비요리/3000원요리'
keywords — a fabricated price claim. Guard the keyword branch the same way.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**1. 요구사항 → 테스트 → 태스크 추적 (매트릭스 기준):**

| Test ID | Task | Test ID | Task |
|---|---|---|---|
| T-01~T-05 | 1 | T-16~T-17 | 6 |
| T-06~T-08 | 1 | T-18~T-20 | 3 |
| T-09~T-12 | 2 | T-21~T-22 | 7 |
| T-13~T-15 | 5 | T-23~T-25 | 4 |
| T-26 | 4 | T-27~T-28 | 2 |
| T-29 | 1 | | |

29개 테스트 ID 전부 어떤 태스크의 실패(또는 회귀 가드) 테스트로 매핑됨. 누락 AC 없음. non-goal(출처 재작성·OTHER cuisine·나트륨/당·F5/F6·비-youtube 영양)은 "no test"로 의도적 부재.

**2. Placeholder 스캔:** TBD/TODO/"적절히 처리" 없음. 모든 코드 스텝에 실제 코드 포함.

**3. 타입 일관성:** `originBracket`/`suppressTime`(Task 1 const → Task 2 let)·`youtubeNarrative`(Task 6, `YoutubeMetadata | undefined`로 narrowing)·`recipeCuisine`(Task 3) 식별자가 태스크 간 일치. `makeJpRecipe`/`makeOtherRecipe`는 Task 1에서 정의되어 Task 3에서 사용.

**주의(실행 순서):** Task 3가 Task 1의 팩토리(`makeJpRecipe`/`makeOtherRecipe`)에 의존하므로 Task 1을 먼저 실행한다. Task 2는 Task 1의 `suppressTime` 도입에 의존(Task 1 → 2 순서 고정). Task 4·5·6·7은 상호 독립.

---

## Execution Handoff

(아래 핸드오프는 계획 저장 후 사용자에게 선택을 요청하는 절차다.)
