import type { StaticRecipe } from "@/entities/recipe/model/types";

export const makeBaseRecipe = (
  overrides?: Partial<StaticRecipe>
): StaticRecipe => {
  return {
    id: "test-recipe-1",
    title: "김치찌개",
    description: "얼큰한 김치찌개 만드는 법",
    dishType: "한식",
    cookingTime: 30,
    servings: 2,
    totalIngredientCost: 8000,
    marketPrice: 12000,
    imageUrl: "https://example.com/kimchi.jpg",
    tags: ["한식", "찌개"],
    ingredients: [],
    steps: [],
    ratingInfo: { avgRating: 4.5, ratingCount: 100, myRating: 0 },
    author: {
      id: "1",
      nickname: "요리왕",
      email: "test@test.com",
      profileImage: "https://example.com/profile.jpg",
      createdAt: "2024-01-01T00:00:00Z",
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
    cookingTools: ["냄비"],
    imageKey: null,
    createdAt: "2024-01-01T00:00:00Z",
    comments: [],
    ...overrides,
  };
};

export const makeYoutubeFamousRecipe = (
  overrides?: Partial<StaticRecipe>
): StaticRecipe => {
  return makeBaseRecipe({
    youtubeUrl: "https://youtube.com/watch?v=test",
    youtubeChannelName: "백종원",
    youtubeVideoTitle: "김치찌개 맛있게 끓이는 법",
    youtubeThumbnailUrl: "https://img.youtube.com/vi/test/maxresdefault.jpg",
    youtubeChannelProfileUrl: "https://yt3.ggpht.com/profile.jpg",
    youtubeSubscriberCount: 1500000, // 150만
    ...overrides,
  });
};

export const makeYoutubeMediumRecipe = (
  overrides?: Partial<StaticRecipe>
): StaticRecipe => {
  return makeBaseRecipe({
    youtubeUrl: "https://youtube.com/watch?v=test2",
    youtubeChannelName: "요리왕비룡",
    youtubeVideoTitle: "집에서 쉽게 만드는 김치찌개",
    youtubeThumbnailUrl: "https://img.youtube.com/vi/test2/maxresdefault.jpg",
    youtubeChannelProfileUrl: "https://yt3.ggpht.com/profile2.jpg",
    youtubeSubscriberCount: 45000, // 4.5만
    ...overrides,
  });
};

export const makeYoutubeStandardRecipe = (
  overrides?: Partial<StaticRecipe>
): StaticRecipe => {
  return makeBaseRecipe({
    youtubeUrl: "https://youtube.com/watch?v=test3",
    youtubeChannelName: "집밥요정",
    youtubeVideoTitle: "김치찌개 레시피",
    youtubeThumbnailUrl: "https://img.youtube.com/vi/test3/maxresdefault.jpg",
    youtubeChannelProfileUrl: "https://yt3.ggpht.com/profile3.jpg",
    youtubeSubscriberCount: 5000, // 5천
    ...overrides,
  });
};
