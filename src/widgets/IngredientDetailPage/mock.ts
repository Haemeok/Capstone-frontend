import type { DetailedRecipeGridItem } from "@/entities/recipe";
import type { IngredientDetail } from "@/entities/ingredient";

export const INGREDIENT_DETAIL_MOCKS: Record<string, IngredientDetail> = {
  onion: {
    id: "onion",
    name: "양파",
    imageUrl: "/mock/ingredients/onion.png",
    categoryLabel: "뿌리·구근류",
    storage: {
      temperatureLabel: "0–4℃",
      durationLabel: "7일",
      tip: "에틸렌 가스에 민감한 과일과는 분리해 보관하세요. 자른 양파는 밀폐 용기에 담아 냉장 3일 이내 사용.",
    },
    pairings: {
      good: [
        { id: "carrot", name: "당근" },
        { id: "tomato", name: "토마토" },
        { id: "chicken-breast", name: "닭가슴살" },
      ],
      bad: [{ id: "honey", name: "꿀" }],
    },
    cookingMethods: [
      { id: "grill", name: "구이", icon: "🔥" },
      { id: "boil", name: "삶기", icon: "💧" },
      { id: "stirfry", name: "볶기", icon: "🍳" },
      { id: "braise", name: "조림", icon: "🥘" },
    ],
  },
  "8LB1p7wk": {
    id: "8LB1p7wk",
    name: "당근",
    imageUrl: "/mock/ingredients/carrot.png",
    categoryLabel: "뿌리·구근류",
    storage: {
      temperatureLabel: "0–4℃",
      durationLabel: "14일",
      tip: "흙이 묻은 상태로 신문지에 싸서 세워 보관하면 더 오래갑니다. 수분이 닿으면 쉽게 물러져요.",
    },
    pairings: {
      good: [
        { id: "onion", name: "양파" },
        { id: "chicken-breast", name: "닭가슴살" },
      ],
      bad: [{ id: "cucumber", name: "오이" }],
    },
    cookingMethods: [
      { id: "grill", name: "구이", icon: "🔥" },
      { id: "boil", name: "삶기", icon: "💧" },
      { id: "juice", name: "착즙", icon: "🥤" },
    ],
  },
  tomato: {
    id: "tomato",
    name: "토마토",
    imageUrl: "/mock/ingredients/tomato.png",
    categoryLabel: "열매채소",
    storage: {
      temperatureLabel: "실온 후 냉장 10℃",
      durationLabel: "5일",
      tip: "완전히 익기 전에는 실온 보관하다 익으면 냉장으로 옮기세요. 꼭지 부분이 아래로 가도록 두면 더 오래 신선해요.",
    },
    pairings: {
      good: [
        { id: "onion", name: "양파" },
        { id: "cucumber", name: "오이" },
      ],
      bad: [{ id: "cheese", name: "치즈" }],
    },
    cookingMethods: [
      { id: "raw", name: "생식", icon: "🥗" },
      { id: "stirfry", name: "볶기", icon: "🍳" },
      { id: "stew", name: "끓이기", icon: "🍲" },
    ],
  },
  "chicken-breast": {
    id: "chicken-breast",
    name: "닭가슴살",
    imageUrl: "/mock/ingredients/chicken-breast.png",
    categoryLabel: "육류",
    storage: {
      temperatureLabel: "0–4℃ (냉동 -18℃)",
      durationLabel: "냉장 2일 / 냉동 30일",
      tip: "구입 후 즉시 소분해 냉동 보관하는 것이 좋아요. 해동은 반드시 냉장실에서 천천히.",
    },
    pairings: {
      good: [
        { id: "onion", name: "양파" },
        { id: "carrot", name: "당근" },
      ],
      bad: [],
    },
    cookingMethods: [
      { id: "grill", name: "구이", icon: "🔥" },
      { id: "boil", name: "삶기", icon: "💧" },
      { id: "stirfry", name: "볶기", icon: "🍳" },
    ],
  },
};

export const INGREDIENT_RECIPE_MOCKS: Record<string, DetailedRecipeGridItem[]> = {
  onion: [
    {
      id: "mock-recipe-1",
      title: "양파볶음",
      imageUrl: "/mock/recipes/onion-stirfry.jpg",
      authorName: "recipio",
      authorId: "mock-author",
      profileImage: "/mock/users/recipio.png",
      cookingTime: 15,
      createdAt: "2026-04-20T09:00:00Z",
      likeCount: 124,
      likedByCurrentUser: false,
      favoriteByCurrentUser: false,
      avgRating: 4.5,
      ratingCount: 32,
    },
    {
      id: "mock-recipe-2",
      title: "양파 크림 파스타",
      imageUrl: "/mock/recipes/onion-pasta.jpg",
      authorName: "recipio",
      authorId: "mock-author",
      profileImage: "/mock/users/recipio.png",
      cookingTime: 25,
      createdAt: "2026-04-18T09:00:00Z",
      likeCount: 89,
      likedByCurrentUser: false,
      favoriteByCurrentUser: false,
      avgRating: 4.2,
      ratingCount: 21,
    },
  ],
  carrot: [
    {
      id: "mock-recipe-3",
      title: "당근 라페",
      imageUrl: "/mock/recipes/carrot-rape.jpg",
      authorName: "recipio",
      authorId: "mock-author",
      profileImage: "/mock/users/recipio.png",
      cookingTime: 10,
      createdAt: "2026-04-15T09:00:00Z",
      likeCount: 56,
      likedByCurrentUser: false,
      favoriteByCurrentUser: false,
      avgRating: 4.0,
      ratingCount: 12,
    },
  ],
  tomato: [
    {
      id: "mock-recipe-4",
      title: "토마토 파스타",
      imageUrl: "/mock/recipes/tomato-pasta.jpg",
      authorName: "recipio",
      authorId: "mock-author",
      profileImage: "/mock/users/recipio.png",
      cookingTime: 20,
      createdAt: "2026-04-10T09:00:00Z",
      likeCount: 203,
      likedByCurrentUser: false,
      favoriteByCurrentUser: false,
      avgRating: 4.7,
      ratingCount: 58,
    },
  ],
  "chicken-breast": [
    {
      id: "mock-recipe-5",
      title: "닭가슴살 샐러드",
      imageUrl: "/mock/recipes/chicken-salad.jpg",
      authorName: "recipio",
      authorId: "mock-author",
      profileImage: "/mock/users/recipio.png",
      cookingTime: 15,
      createdAt: "2026-04-22T09:00:00Z",
      likeCount: 312,
      likedByCurrentUser: false,
      favoriteByCurrentUser: false,
      avgRating: 4.6,
      ratingCount: 74,
    },
  ],
};

export const getIngredientDetail = (id: string): IngredientDetail | undefined =>
  INGREDIENT_DETAIL_MOCKS[id];

export const getIngredientRecipes = (id: string): DetailedRecipeGridItem[] =>
  INGREDIENT_RECIPE_MOCKS[id] ?? [];
