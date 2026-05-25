import type { StaticRecipe } from "@/entities/recipe/model/types";

import { assembleBlogBody, buildStepsBlock } from "./assembleBlogBody";
import type { ParsedBlogBody } from "./parseBlogBody";

const makeRecipe = (
  overrides: Partial<StaticRecipe> = {},
): StaticRecipe =>
  ({
    id: "r1",
    title: "콩나물국",
    servings: 2,
    totalCalories: 400,
    totalIngredientCost: 6000,
    nutrition: { protein: 20, carbohydrate: 30, fat: 5, sugar: 4, sodium: 800 },
    steps: [
      { stepNumber: 1, instruction: "물을 끓인다" },
      { stepNumber: 2, instruction: "콩나물을 넣고 5분 끓인다" },
    ],
    ingredients: [],
    ...overrides,
  } as unknown as StaticRecipe);

describe("buildStepsBlock", () => {
  it("steps 를 `N. ...` 라인으로 줄바꿈 결합", () => {
    const out = buildStepsBlock(makeRecipe());
    expect(out).toBe("1. 물을 끓인다\n2. 콩나물을 넣고 5분 끓인다");
  });

  it("steps 가 비어 있으면 빈 문자열", () => {
    const out = buildStepsBlock(makeRecipe({ steps: [] }));
    expect(out).toBe("");
  });

  it("instruction 이 비어 있는 step 은 건너뜀", () => {
    const out = buildStepsBlock(
      makeRecipe({
        steps: [
          { stepNumber: 1, instruction: "물을 끓인다" } as never,
          { stepNumber: 2, instruction: "  " } as never,
          { stepNumber: 3, instruction: "콩나물 투입" } as never,
        ],
      }),
    );
    expect(out).toBe("1. 물을 끓인다\n3. 콩나물 투입");
  });
});

describe("assembleBlogBody — 새 토큰 + 조리과정", () => {
  const parsed: ParsedBlogBody = {
    intro: "이번 모음 도입.",
    sections: [
      { headingText: "콩나물국", body: "산문 본문이에요." },
    ],
    outro: "닫는 단락.",
  };
  const recipes = [makeRecipe()];

  it("섹션 산문 직후에 `{{ingredients:id}}` 가 한 번 박힌다", () => {
    const out = assembleBlogBody(parsed, recipes, "ellymom", "test-slug");
    const ingIdx = out.indexOf("{{ingredients:r1}}");
    const bodyIdx = out.indexOf("산문 본문이에요.");
    expect(ingIdx).toBeGreaterThan(bodyIdx);
  });

  it("`{{ingredients:id}}` 직후에 조리과정 라인이 들어간다", () => {
    const out = assembleBlogBody(parsed, recipes, "ellymom", "test-slug");
    const ingIdx = out.indexOf("{{ingredients:r1}}");
    const stepIdx = out.indexOf("1. 물을 끓인다");
    expect(stepIdx).toBeGreaterThan(ingIdx);
  });

  it("`{{nutrition:id}}` 가 섹션 마지막(링크 안내 다음) 에 박힌다", () => {
    const out = assembleBlogBody(parsed, recipes, "ellymom", "test-slug");
    const nutIdx = out.indexOf("{{nutrition:r1}}");
    const linkIdx = out.indexOf("{{link:r1}}");
    expect(nutIdx).toBeGreaterThan(linkIdx);
  });

  it("조리과정이 비어 있으면 라인 자체가 없다", () => {
    const out = assembleBlogBody(
      parsed,
      [makeRecipe({ steps: [] })],
      "ellymom",
      "test-slug",
    );
    expect(out).not.toMatch(/^\d+\. /m);
    expect(out).toContain("{{ingredients:r1}}");
    expect(out).toContain("{{nutrition:r1}}");
  });

  it("기존 토큰 (recipe / link) 위치는 그대로", () => {
    const out = assembleBlogBody(parsed, recipes, "ellymom", "test-slug");
    expect(out).toContain("{{recipe:r1}}");
    expect(out).toContain("{{link:r1}}");
  });

  it("outro 와 톤별 suffix 가 마지막에 붙는다", () => {
    const out = assembleBlogBody(parsed, recipes, "ellymom", "test-slug");
    expect(out).toMatch(/닫는 단락\.[\s\S]*전체 모음은 https:\/\/recipio\.kr\/curation\/test-slug/);
  });
});
