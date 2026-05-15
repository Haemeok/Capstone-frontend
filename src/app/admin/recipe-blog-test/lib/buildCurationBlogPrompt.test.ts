import type { PublicCurationArticleDto } from "@/features/curation/model/api.server";
import type { StaticRecipe } from "@/entities/recipe/model/types";

import {
  buildCurationBlogBodySystemPrompt,
  buildCurationBlogBodyUserPrompt,
  buildCurationBlogMetaSystemPrompt,
  buildCurationBlogMetaUserPrompt,
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
  { id: "r1", title: "콩나물국", description: "맑은 콩나물국", imageUrl: "x" } as StaticRecipe,
  { id: "r2", title: "된장찌개", description: "구수한 된장찌개", imageUrl: "x" } as StaticRecipe,
];

describe("buildCurationBlogBodySystemPrompt", () => {
  const sys = buildCurationBlogBodySystemPrompt();
  it("'그대로 복사 금지' 와 토큰 형식을 포함한다", () => {
    expect(sys).toMatch(/그대로 복사/);
    expect(sys).toMatch(/\{\{recipe:\{recipeId\}\}\}/);
  });
  it("JSON / 코드펜스 금지 지시를 포함한다", () => {
    expect(sys).toMatch(/JSON/);
    expect(sys).toMatch(/코드펜스/);
  });
});

describe("buildCurationBlogBodyUserPrompt", () => {
  it("큐레이션 markdown 과 레시피 id/title 을 포함한다", () => {
    const p = buildCurationBlogBodyUserPrompt({
      article: FAKE_ARTICLE,
      recipes: FAKE_RECIPES,
      lastErrors: [],
    });
    expect(p).toContain("환절기 식탁에 자주 올라가는");
    expect(p).toContain("r1");
    expect(p).toContain("콩나물국");
    expect(p).toContain("recipio.kr/curation/spring-soups");
  });

  it("lastErrors 가 있으면 되먹임 블록을 포함한다", () => {
    const p = buildCurationBlogBodyUserPrompt({
      article: FAKE_ARTICLE,
      recipes: FAKE_RECIPES,
      lastErrors: ["recipeId r2 토큰 누락"],
    });
    expect(p).toContain("이전 시도에서 다음이 잘못되었습니다");
    expect(p).toContain("recipeId r2 토큰 누락");
  });
});

describe("buildCurationBlogMetaSystemPrompt", () => {
  it("schema 이름을 포함하고 JSON 출력을 지시한다", () => {
    const sys = buildCurationBlogMetaSystemPrompt();
    expect(sys).toMatch(/CurationBlogMetaSchema/);
    expect(sys).toMatch(/JSON/);
  });
});

describe("buildCurationBlogMetaUserPrompt", () => {
  it("본문 markdown 과 레시피 목록을 포함한다", () => {
    const p = buildCurationBlogMetaUserPrompt({
      article: FAKE_ARTICLE,
      recipes: FAKE_RECIPES,
      bodyMarkdown: "# 새 본문\n\n{{recipe:r1}}\n\n{{recipe:r2}}",
    });
    expect(p).toContain("새 본문");
    expect(p).toContain("콩나물국");
    expect(p).toContain("된장찌개");
  });
});
