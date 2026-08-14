import type { DetailedRecipesApiResponse } from "@/entities/recipe/model/types";

export const makeCategoryPage = (
  apiPage: number,
  hasNext: boolean,
  count = 20
): DetailedRecipesApiResponse => ({
  content: Array.from({ length: count }, (_, index) => {
    const position = String(index + 1).padStart(2, "0");

    return {
      id: `chef-p${apiPage}-${position}`,
      title: `셰프 레시피 ${apiPage}-${position}`,
      imageUrl: "https://images.example.com/recipe.webp",
      authorName: "테스트 셰프",
      authorId: "chef-author",
      profileImage: "",
      cookingTime: 15,
      createdAt: "2026-08-14T00:00:00Z",
      favoriteByCurrentUser: false,
      avgRating: 4.5,
      ratingCount: 10,
    };
  }),
  slice: {
    size: count,
    number: apiPage,
    numberOfElements: count,
    hasNext,
  },
});
