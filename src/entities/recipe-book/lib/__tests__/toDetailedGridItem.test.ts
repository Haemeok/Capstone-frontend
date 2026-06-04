import type { BookRecipe } from "../../api/types";
import { toDetailedGridItem } from "../toDetailedGridItem";

const baseBookRecipe: BookRecipe = {
  recipeId: "recipe-1",
  title: "유튜브 레시피",
  imageUrl: "https://img/recipe.webp",
  dishType: "한식",
  addedAt: "2026-06-01",
  authorId: "author-1",
  authorName: "작성자",
  profileImage: "https://img/author.webp",
  createdAt: "2026-06-01",
  source: "YOUTUBE",
};

describe("toDetailedGridItem", () => {
  it("유튜브 추출자 정보를 그리드 아이템으로 전달한다", () => {
    const item = toDetailedGridItem({
      ...baseBookRecipe,
      youtubeExtractorId: "extractor-1",
      youtubeExtractorName: "차경환",
      youtubeExtractorProfileImage: "https://img/extractor.webp",
    });

    expect(item.youtubeExtractorId).toBe("extractor-1");
    expect(item.youtubeExtractorName).toBe("차경환");
    expect(item.youtubeExtractorProfileImage).toBe(
      "https://img/extractor.webp"
    );
  });

  it("추출자 정보가 없으면 undefined로 둔다", () => {
    const item = toDetailedGridItem(baseBookRecipe);

    expect(item.youtubeExtractorId).toBeUndefined();
    expect(item.youtubeExtractorName).toBeUndefined();
    expect(item.youtubeExtractorProfileImage).toBeUndefined();
  });
});
