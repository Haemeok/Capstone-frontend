import type { StaticRecipe } from "@/entities/recipe/model/types";

import { resolveCoverUrl, toSavedRecord } from "../adapter";
import type { PublicCurationArticleDto } from "../api.server";

const baseDto: PublicCurationArticleDto = {
  id: "xJvY7aBp",
  slug: "summer-cucumber",
  title: "여름 오이 한 그릇",
  description: "수분 가득한 오이 모음",
  coverImageKey: "recipes/abc/img.webp",
  contentMdx: "# 본문\n\n...",
  category: "DIET & LIGHT",
  publishedAt: "2026-05-04T10:00:00",
  recipeIds: ["a1", "a2"],
};

const recipe = (over: Partial<StaticRecipe> = {}) =>
  ({
    id: "a1",
    title: "오이냉국",
    imageUrl: "https://cdn.example/recipes/a1.webp",
    ...over,
  }) as StaticRecipe;

describe("resolveCoverUrl", () => {
  it("recipes 배열에 살아있는 imageUrl이 있으면 그것을 반환", () => {
    expect(resolveCoverUrl("recipes/abc/img.webp", [recipe()])).toBe(
      "https://cdn.example/recipes/a1.webp"
    );
  });

  it("recipes가 모두 null이면 빈 문자열", () => {
    expect(resolveCoverUrl("recipes/abc/img.webp", [null, null])).toBe("");
  });

  it("첫 번째가 null이어도 살아있는 다른 레시피 imageUrl 사용", () => {
    expect(resolveCoverUrl(null, [null, recipe({ imageUrl: "X" })])).toBe("X");
  });
});

describe("toSavedRecord", () => {
  it("백엔드 DTO를 SavedCurationRecord로 매핑한다", () => {
    const rec = toSavedRecord(baseDto, [recipe()]);
    expect(rec).toMatchObject({
      slug: "summer-cucumber",
      h1: "여름 오이 한 그릇",
      dek: "수분 가득한 오이 모음",
      markdown: "# 본문\n\n...",
      recipeIds: ["a1", "a2"],
      category: "DIET & LIGHT",
      savedAt: "2026-05-04T10:00:00",
      thumbnailUrl: "https://cdn.example/recipes/a1.webp",
    });
  });

  it("description이 null이면 dek은 빈 문자열", () => {
    const rec = toSavedRecord({ ...baseDto, description: null }, [recipe()]);
    expect(rec.dek).toBe("");
  });

  it("category가 null이면 'FOOD & LIFE'로 폴백", () => {
    const rec = toSavedRecord({ ...baseDto, category: null }, [recipe()]);
    expect(rec.category).toBe("FOOD & LIFE");
  });
});
