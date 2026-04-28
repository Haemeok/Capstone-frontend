import { prepareRemixPayload } from "@/features/recipe-create/lib/prepareRemixPayload";
import type { Recipe } from "@/entities/recipe/model/types";

const baseRecipe = (): Recipe => ({
  id: "test-recipe-1",
  title: "김치찌개",
  description: "얼큰한 김치찌개 만드는 법",
  dishType: "한식",
  cookingTime: 30,
  servings: 2,
  totalIngredientCost: 8000,
  marketPrice: 12000,
  imageUrl: "https://example.com/kimchi.jpg",
  imageKey: null,
  tags: ["한식", "찌개"],
  ingredients: [],
  steps: [],
  ratingInfo: { avgRating: 4.5, ratingCount: 100, myRating: 0 },
  author: {
    id: "1",
    nickname: "요리왕",
    email: "test@test.com",
    profileImage: "https://example.com/profile.jpg",
    hasFirstRecord: false,
    remainingAiQuota: 10,
    remainingYoutubeQuota: 10,
  },
  totalCalories: 350,
  nutrition: {
    protein: 15,
    carbohydrate: 20,
    fat: 10,
    sugar: 5,
    sodium: 800,
  },
  private: false,
  aiGenerated: false,
  isCloneable: true,
  cookingTools: ["냄비"],
  comments: [],
  likeCount: 0,
  likedByCurrentUser: false,
  favoriteByCurrentUser: false,
  createdAt: "2024-01-01T00:00:00Z",
});

describe("prepareRemixPayload", () => {
  it("attaches originRecipeId to the payload", () => {
    const recipe = baseRecipe();
    const result = prepareRemixPayload(recipe, "ORIGIN_ID");
    expect(result.originRecipeId).toBe("ORIGIN_ID");
  });

  it("strips extractorId from the payload", () => {
    const recipe = {
      ...baseRecipe(),
      extractorId: "should-be-removed",
    } as Recipe & { extractorId?: string };
    const result = prepareRemixPayload(recipe, "ORIGIN_ID") as Record<
      string,
      unknown
    >;
    expect(result).not.toHaveProperty("extractorId");
  });

  it("preserves youtube meta fields for round-trip", () => {
    // All youtube meta fields must round-trip for remix cards/lists per backend spec.
    // youtubeUrl is optional on RecipePayload (defaultRecipeKeys omits it from the
    // base Omit, but it is re-added explicitly to support remix submission).
    const recipe = {
      ...baseRecipe(),
      youtubeUrl: "https://youtu.be/abc",
      youtubeChannelName: "ch",
      youtubeVideoTitle: "비빔밥 만들기",
    } as Recipe;
    const result = prepareRemixPayload(recipe, "ORIGIN_ID");
    expect(result.youtubeUrl).toBe("https://youtu.be/abc");
    expect(result.youtubeChannelName).toBe("ch");
    expect(result.youtubeVideoTitle).toBe("비빔밥 만들기");
  });

  it("preserves user edits to title and dishType", () => {
    const recipe = baseRecipe();
    const result = prepareRemixPayload(
      { ...recipe, title: "내 버전", dishType: "찌개/국" },
      "ORIGIN_ID",
    );
    expect(result.title).toBe("내 버전");
    expect(result.dishType).toBe("찌개/국");
  });
});
