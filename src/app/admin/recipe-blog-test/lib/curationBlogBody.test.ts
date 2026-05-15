import type { StaticRecipe } from "@/entities/recipe/model/types";

import {
  hydrateCurationBlogMarkdown,
  normalizeMarkdown,
  stripCodeFence,
  validateCurationBlogMarkdown,
} from "./curationBlogBody";

const URL = "https://recipio.kr/curation/spring-soups";

describe("validateCurationBlogMarkdown", () => {
  it("모든 recipeId 토큰 1회 + curationUrl 있으면 ok", () => {
    const md = `리드 단락…\n\n## 콩나물국\n{{recipe:r1}}\n\n## 된장찌개\n{{recipe:r2}}\n\n## 김치찌개\n{{recipe:r3}}\n\n닫는 단락에서 ${URL} 로 안내합니다.`;
    const r = validateCurationBlogMarkdown(md, {
      expectedRecipeIds: ["r1", "r2", "r3"],
      curationUrl: URL,
    });
    expect(r.ok).toBe(true);
  });

  it("토큰 누락 → 에러", () => {
    const md = `{{recipe:r1}} ${URL} {{recipe:r2}}`;
    const r = validateCurationBlogMarkdown(md, {
      expectedRecipeIds: ["r1", "r2", "r3"],
      curationUrl: URL,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.some((e) => e.includes("r3"))).toBe(true);
  });

  it("토큰 중복 → 에러", () => {
    const md = `{{recipe:r1}} {{recipe:r1}} {{recipe:r2}} ${URL}`;
    const r = validateCurationBlogMarkdown(md, {
      expectedRecipeIds: ["r1", "r2"],
      curationUrl: URL,
    });
    expect(r.ok).toBe(false);
  });

  it("미허용 recipeId 토큰 → 에러", () => {
    const md = `{{recipe:r1}} {{recipe:r2}} {{recipe:rZ}} ${URL}`;
    const r = validateCurationBlogMarkdown(md, {
      expectedRecipeIds: ["r1", "r2"],
      curationUrl: URL,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.some((e) => e.includes("rZ"))).toBe(true);
  });

  it("curationUrl 누락 → 에러", () => {
    const md = `{{recipe:r1}} {{recipe:r2}}`;
    const r = validateCurationBlogMarkdown(md, {
      expectedRecipeIds: ["r1", "r2"],
      curationUrl: URL,
    });
    expect(r.ok).toBe(false);
  });
});

describe("hydrateCurationBlogMarkdown", () => {
  const RECIPES: StaticRecipe[] = [
    { id: "r1", title: "콩나물국", imageUrl: "https://cdn/r1.jpg" } as StaticRecipe,
    { id: "r2", title: "된장찌개", imageUrl: "https://cdn/r2.jpg" } as StaticRecipe,
  ];

  it("토큰을 markdown image 로 치환한다 (alt 매핑)", () => {
    const md = `{{recipe:r1}}\n\n{{recipe:r2}}`;
    const out = hydrateCurationBlogMarkdown(md, RECIPES, {
      "recipe-r1": "콩나물국 한 그릇",
    });
    expect(out).toContain("![콩나물국 한 그릇](https://cdn/r1.jpg)");
    expect(out).toContain("![된장찌개](https://cdn/r2.jpg)"); // alt fallback = recipe.title
  });

  it("imageUrl 없는 레시피 토큰은 빈 문자열로 제거", () => {
    const md = `{{recipe:r1}}\n\n{{recipe:rX}}`;
    const out = hydrateCurationBlogMarkdown(md, RECIPES, {});
    expect(out).not.toContain("rX");
  });
});

describe("stripCodeFence", () => {
  it("```markdown ... ``` 를 벗긴다", () => {
    expect(stripCodeFence("```markdown\n# 제목\n본문\n```")).toBe("# 제목\n본문");
  });
  it("fence 가 없으면 trim 만", () => {
    expect(stripCodeFence("  hello  ")).toBe("hello");
  });
});

describe("normalizeMarkdown", () => {
  it("인라인 헤더를 줄바꿈으로 복원", () => {
    expect(normalizeMarkdown("문장. ## 소제목")).toContain("\n\n## 소제목");
  });
});
