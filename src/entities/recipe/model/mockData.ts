import { IngredientItem } from "@/entities/ingredient";

import { Recipe, RecipeStep } from "./types";

// Mock 재료 데이터 (칼로리 포함)
const mockIngredients: IngredientItem[] = [
  {
    id: 1,
    name: "닭가슴살",
    imageUrl:
      "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
    category: "육류",
    quantity: "200",
    price: 3000,
    unit: "g",
    inFridge: false,
    calories: 231,
  },
  {
    id: 2,
    name: "브로콜리",
    imageUrl:
      "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
    category: "채소",
    quantity: "100",
    price: 1500,
    unit: "g",
    inFridge: true,
    calories: 34,
  },
  {
    id: 3,
    name: "현미밥",
    imageUrl:
      "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
    category: "곡물",
    quantity: "150",
    price: 800,
    unit: "g",
    inFridge: false,
    calories: 174,
  },
  {
    id: 4,
    name: "올리브오일",
    imageUrl:
      "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
    category: "조미료",
    quantity: "10",
    price: 200,
    unit: "ml",
    inFridge: true,
    calories: 88,
  },
];

// Mock 조리 단계 데이터
const mockSteps: RecipeStep[] = [
  {
    stepNumber: 1,
    instruction: "닭가슴살을 적당한 크기로 자릅니다.",
    stepImageUrl:
      "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
    stepImageKey: "step1.jpg",
    ingredients: [mockIngredients[0]],
  },
  {
    stepNumber: 2,
    instruction: "브로콜리를 끓는 물에 2분간 데칩니다.",
    stepImageUrl:
      "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
    stepImageKey: "step2.jpg",
    ingredients: [mockIngredients[1]],
  },
  {
    stepNumber: 3,
    instruction: "팬에 올리브오일을 두르고 닭가슴살을 구워줍니다.",
    stepImageUrl:
      "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
    stepImageKey: "step3.jpg",
    ingredients: [mockIngredients[0], mockIngredients[3]],
  },
  {
    stepNumber: 4,
    instruction: "현미밥과 함께 플레이팅하여 완성합니다.",
    stepImageUrl:
      "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
    stepImageKey: "step4.jpg",
    ingredients: [mockIngredients[2]],
  },
];

// Mock 레시피 데이터
export const mockRecipeData: Recipe = {
  id: 1,
  title: "헬시 닭가슴살 샐러드 보울",
  dishType: "건강식",
  description:
    "단백질이 풍부한 닭가슴살과 신선한 채소로 만든 영양만점 샐러드 보울입니다. 다이어트에도 좋고 맛도 훌륭해요!",
  cookingTime: 30,
  imageUrl: "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
  youtubeUrl: "https://youtube.com/watch?v=example",
  cookingTools: ["팬", "냄비", "도마", "칼"],
  servings: 2,
  totalIngredientCost: 5500,
  marketPrice: 12000,
  totalCalories: 527, // 재료별 칼로리 합계
  imageKey: "recipe_image.jpg",
  ratingInfo: {
    avgRating: 4.5,
    myRating: 5,
    ratingCount: 24,
  },
  ingredients: mockIngredients,
  steps: mockSteps,
  tagNames: ["건강식", "다이어트", "고단백"],
  comments: [
    {
      id: 1,
      content: "정말 맛있고 건강한 레시피네요! 다이어트에 도움이 많이 됐어요.",
      createdAt: "2024-01-15T10:30:00Z",
      likeCount: 8,
      likedByCurrentUser: false,
      replyCount: 0,
      author: {
        id: 2,
        email: "user@example.com",
        nickname: "건강요리러버",
        profileImage:
          "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
      },
    },
  ],
  author: {
    id: 1,
    email: "chef@example.com",
    nickname: "헬시셰프",
    profileImage:
      "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
  },
  likeCount: 42,
  likedByCurrentUser: true,
  favoriteByCurrentUser: false,
  private: false,
  aiGenerated: false,
};
