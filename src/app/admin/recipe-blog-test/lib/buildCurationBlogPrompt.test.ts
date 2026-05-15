import type { PublicCurationArticleDto } from "@/features/curation/model/api.server";
import type { StaticRecipe } from "@/entities/recipe/model/types";

import {
  buildCurationBlogSystemPrompt,
  buildCurationBlogUserPrompt,
} from "./buildCurationBlogPrompt";

const FAKE_ARTICLE: PublicCurationArticleDto = {
  id: "a1",
  slug: "spring-soups",
  title: "환절기 한 그릇 모음",
  description: "환절기에 자주 올라가는 국·찌개",
  coverImageKey: null,
  contentMdx: "# 환절기 식탁\n\n오늘은 환절기 식탁에 자주 올라가는...",
  category: "season",
  publishedAt: "2026-04-01T00:00:00Z",
  recipeIds: ["r1", "r2"],
};

const FAKE_RECIPES: StaticRecipe[] = [
  {
    id: "r1",
    title: "콩나물국",
    description: "맑은 콩나물국",
    imageUrl: "https://cdn.recipio.kr/r1.jpg",
  } as StaticRecipe,
  {
    id: "r2",
    title: "된장찌개",
    description: "구수한 된장찌개",
    imageUrl: "https://cdn.recipio.kr/r2.jpg",
  } as StaticRecipe,
];

describe("buildCurationBlogSystemPrompt", () => {
  it("매거진 톤 가이드와 '복붙 금지' 지시를 포함한다", () => {
    const sys = buildCurationBlogSystemPrompt();
    expect(sys).toMatch(/매거진/);
    expect(sys).toMatch(/그대로 복사/);
    expect(sys).toMatch(/recipe-\{recipeId\}/);
  });
});

describe("buildCurationBlogUserPrompt", () => {
  const prompt = buildCurationBlogUserPrompt(FAKE_ARTICLE, FAKE_RECIPES);

  it("큐레이션 markdown 본문을 포함한다", () => {
    expect(prompt).toContain("환절기 식탁에 자주 올라가는");
  });

  it("각 레시피의 id, title 을 포함한다", () => {
    expect(prompt).toContain("r1");
    expect(prompt).toContain("콩나물국");
    expect(prompt).toContain("r2");
    expect(prompt).toContain("된장찌개");
  });

  it("큐레이션 slug 와 권유 URL 을 포함한다", () => {
    expect(prompt).toContain("spring-soups");
    expect(prompt).toContain("recipio.kr/curation/spring-soups");
  });
});
