import type { StaticRecipe } from "@/entities/recipe/model/types";

import {
  hydrateCurationBlogMarkdown,
  normalizeMarkdown,
  stripCodeFence,
  validateCurationBlogMarkdown,
} from "./curationBlogBody";

const URL = "https://recipio.kr/curation/spring-soups";

const fullValidMd = (ids: string[]) =>
  `리드 단락…\n\n` +
  ids
    .map(
      (id) =>
        `## 메뉴 ${id}\n본문... {{link:${id}}} 한 번 보세요.\n\n{{recipe:${id}}}\n`,
    )
    .join("\n") +
  `\n닫는 단락에서 ${URL} 로 안내합니다.`;

describe("validateCurationBlogMarkdown", () => {
  it("모든 recipeId 의 이미지 + 링크 토큰 + curationUrl 있으면 ok", () => {
    const md = fullValidMd(["r1", "r2", "r3"]);
    const r = validateCurationBlogMarkdown(md, {
      expectedRecipeIds: ["r1", "r2", "r3"],
      curationUrl: URL,
    });
    expect(r.ok).toBe(true);
  });

  it("이미지 토큰 누락 → 에러", () => {
    const md = `{{recipe:r1}} {{link:r1}} {{link:r2}} {{link:r3}} ${URL}`;
    const r = validateCurationBlogMarkdown(md, {
      expectedRecipeIds: ["r1", "r2", "r3"],
      curationUrl: URL,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.some((e) => /r2.*이미지 토큰/.test(e))).toBe(true);
  });

  it("링크 토큰 누락 → 에러", () => {
    const md = `{{recipe:r1}} {{recipe:r2}} {{link:r1}} ${URL}`;
    const r = validateCurationBlogMarkdown(md, {
      expectedRecipeIds: ["r1", "r2"],
      curationUrl: URL,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.some((e) => /r2.*링크 토큰/.test(e))).toBe(true);
  });

  it("이미지 토큰 중복 → 에러", () => {
    const md = `{{recipe:r1}} {{recipe:r1}} {{recipe:r2}} {{link:r1}} {{link:r2}} ${URL}`;
    const r = validateCurationBlogMarkdown(md, {
      expectedRecipeIds: ["r1", "r2"],
      curationUrl: URL,
    });
    expect(r.ok).toBe(false);
  });

  it("미허용 recipeId 토큰 → 에러", () => {
    const md = `{{recipe:r1}} {{recipe:r2}} {{recipe:rZ}} {{link:r1}} {{link:r2}} ${URL}`;
    const r = validateCurationBlogMarkdown(md, {
      expectedRecipeIds: ["r1", "r2"],
      curationUrl: URL,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.some((e) => e.includes("rZ"))).toBe(true);
  });

  it("curationUrl 누락 → 에러", () => {
    const md = `{{recipe:r1}} {{recipe:r2}} {{link:r1}} {{link:r2}}`;
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

  it("이미지 토큰을 markdown image 로 치환 (alt 매핑)", () => {
    const md = `{{recipe:r1}}\n\n{{recipe:r2}}`;
    const out = hydrateCurationBlogMarkdown(md, RECIPES, {
      "recipe-r1": "콩나물국 한 그릇",
    });
    expect(out).toContain("![콩나물국 한 그릇](https://cdn/r1.jpg)");
    expect(out).toContain("![된장찌개](https://cdn/r2.jpg)");
  });

  it("link 토큰을 markdown link 로 치환", () => {
    const md = `본문에서 {{link:r1}} 보세요.\n\n{{link:r2}} 도요.`;
    const out = hydrateCurationBlogMarkdown(md, RECIPES, {});
    expect(out).toContain("[콩나물국 레시피 자세히 보기 →](https://recipio.kr/recipes/r1)");
    expect(out).toContain("[된장찌개 레시피 자세히 보기 →](https://recipio.kr/recipes/r2)");
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
