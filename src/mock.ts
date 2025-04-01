import {
  Ingredient,
  Recipe,
  RecipeGridItem,
  RecipeStep,
  Recipe as RecipeType,
} from "./type/recipe";
import { User } from "./type/user";
import { Comment } from "./type/comment";

export const ingredients: Ingredient[] = [
  { quantity: "250", name: "red cabbage", unit: "g" },
  { quantity: "2", name: "scallions", unit: "개" },
  { quantity: "500", name: "oyster mushrooms", unit: "g" },
  { quantity: "8", name: "olive oil", unit: "큰술" },
  { quantity: "3", name: "garlic", unit: "쪽" },
  { quantity: "400", name: "full-fat Greek yogurt", unit: "g" },
  { quantity: "1", name: "lemon juice", unit: "tsp" },
  { quantity: "½", name: "maple syrup", unit: "tsp" },
  { quantity: "1", name: "maple syrup", unit: "큰술" },
  { quantity: "1", name: "ground cumin", unit: "tsp" },
  { quantity: "2", name: "sweet paprika powder", unit: "tsp" },
  { quantity: "1", name: "baharat spice mix", unit: "tsp" },
  { quantity: "4", name: "flatbreads (small)", unit: "개" },
  { quantity: "", name: "salt", unit: "tsp" },
];

export const categories = [
  "🏠홈파티",
  "🌼피크닉",
  "🏕️캠핑",
  "🥗다이어트/건강식",
  "🍽️혼밥",
  "🥐브런치",
  "🍶술안주",
];
export const categoriesItems = [
  {
    id: 1,
    name: "🏠홈파티",
    image: "/images/categories/salad.png",
    count: 10,
  },
  {
    id: 2,
    name: "🌼피크닉",
    image: "/images/categories/salad.png",
    count: 10,
  },
  {
    id: 3,
    name: "🏕️캠핑",
    image: "/images/categories/salad.png",
    count: 10,
  },
  {
    id: 4,
    name: "🥗다이어트/건강식",
    image: "/images/categories/salad.png",
    count: 10,
  },
  {
    id: 5,
    name: "👶아이와 함께",
    image: "/images/categories/salad.png",
    count: 10,
  },
  {
    id: 6,
    name: "🍽️혼밥",
    image: "/images/categories/salad.png",
    count: 10,
  },
  {
    id: 7,
    name: "🍶술안주",
    image: "/images/categories/salad.png",
    count: 10,
  },
  {
    id: 8,
    name: "🥐브런치",
    image: "/images/categories/salad.png",
    count: 10,
  },
  {},
];
export const cookingTimes = [
  "10분이내",
  "20분이내",
  "30분이내",
  "1시간이내",
  "2시간이내",
];
export const recommendedTags = [
  "건강한",
  "간편한",
  "영양가있는",
  "비건",
  "고단백",
];

export const RecipeSteps: RecipeStep[] = [
  {
    ingredients: [
      {
        quantity: "130",
        name: "margarine",
        unit: "g",
      },
      {
        quantity: "130",
        name: "margarine",
        unit: "g",
      },
      {
        quantity: "130",
        name: "margarine",
        unit: "g",
      },
    ],
    instruction:
      "To make vegan béchamel, melt margarine in saucepan. Whisk in flour, then slowly whisk in warm soymilk in a steady stream.",
    utensils: ["saucepan", "whisk"],
    action: "melt",
    stepImageUrl: "/images/recipes/step-1.jpg",
    stepNumber: 1,
    cookingTools: "oven",
  },
  {
    ingredients: [
      {
        quantity: "2",
        name: "nutritional yeast",
        unit: "tbsp",
      },
      {
        quantity: "",
        name: "salt",
        unit: "tsp",
      },
      {
        quantity: "",
        name: "pepper",
        unit: "tsp",
      },
    ],
    instruction:
      "Stir in nutritional yeast, nutmeg, and salt and pepper to taste.",
    utensils: [],
    action: "stir",
    stepImageUrl: "/images/recipes/step-2.jpg",
    stepNumber: 2,
    cookingTools: "oven",
  },
  {
    ingredients: [
      {
        quantity: "2",
        name: "nutritional yeast",
        unit: "tbsp",
      },
      {
        quantity: "",
        name: "salt",
        unit: "tsp",
      },
      {
        quantity: "",
        name: "pepper",
        unit: "tsp",
      },
    ],
    instruction:
      "Preheat oven to 200°C/400°F. Peel onion and garlic, clean mushrooms. Finely chop onion, garlic, and thyme and slice mushrooms.",
    utensils: [],
    action: "preheat",
    stepImageUrl: "/images/recipes/step-3.jpg",
    stepNumber: 3,
    cookingTools: "oven",
  },
  {
    ingredients: [
      {
        quantity: "2",
        name: "nutritional yeast",
        unit: "tbsp",
      },
      {
        quantity: "",
        name: "salt",
        unit: "tsp",
      },
      {
        quantity: "",
        name: "pepper",
        unit: "tsp",
      },
    ],
    instruction:
      "Add oil to frying pan, sauté onion, garlic and our VEGGIE WUNDER seasoning (if using) over medium heat until fragrant and softened. Add mushrooms and thyme and cook for a few minutes, until mushrooms start to brown; if needed, add a bit more oil. Add spinach and cook until wilted, stirring often. Season with salt and pepper. Set aside.",
    utensils: [],
    action: "sauté",
    stepImageUrl: "/images/recipes/step-4.jpg",
    stepNumber: 4,
    cookingTools: "oven",
  },
  {
    ingredients: [
      {
        quantity: "2",
        name: "nutritional yeast",
        unit: "tbsp",
      },
      {
        quantity: "",
        name: "salt",
        unit: "tsp",
      },
      {
        quantity: "",
        name: "pepper",
        unit: "tsp",
      },
    ],
    instruction:
      "Spread a layer of tomato sauce on bottom of casserole dish. Add a layer of noodles, then a layer of béchamel sauce, and a layer of vegetables. Top with another layer of noodles and tomato sauce, and repeat pattern until casserole dish is filled. Finish with a layer of béchamel sauce and remaining mushrooms and spinach. Garnish with thyme leaves. Bake for approx. 30–40 min. at 200°C/400°F, or until sides start to bubble and top turns golden brown. Let cool slightly before slicing and serving. Enjoy!",
    utensils: [],
    action: "bake",
    stepImageUrl: "/images/recipes/step-5.jpg",
    stepNumber: 5,
    cookingTools: "oven",
  },
];

export const user: User = {
  name: "Stefanie Hiekmann",
  email: "",
  profileContent: "Contributor",
  imageURL:
    "https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png",
  id: 1,
};

export const recipe: RecipeType = {
  id: 1,
  title: `The creamiest vegan lasagna with spinach and mushrooms`,
  imageURL:
    "https://images.services.kitchenstories.io/Q2f9UtDQHKs_yStKPdSqLyNtZl4=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R480-final-photo-_1.jpg",
  ingredients: ingredients,
  steps: RecipeSteps,
  dishType: "pasta",
  cookingTime: 30,
  cookingTools: "oven",
  isAigenerated: false,
};

export const comments: Comment[] = [
  {
    id: 1,
    content:
      "The creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushrooms",
    date: "2021-01-01",
    user: user,
    likeCount: 15,
    replyCount: 3,
    isLiked: false,
  },
  {
    id: 2,
    content:
      "The creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushrooms",
    date: "2021-01-01",
    user: user,
    likeCount: 7,
    replyCount: 0,
    isLiked: true,
  },
  {
    id: 3,
    content:
      "The creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushrooms",
    date: "2021-01-01",
    user: user,
    likeCount: 23,
    replyCount: 5,
    isLiked: true,
  },
  {
    id: 4,
    content:
      "The creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushrooms",
    date: "2021-01-01",
    user: user,
    likeCount: 4,
    replyCount: 1,
    isLiked: false,
  },
];

export const replies: Comment[] = [
  {
    id: 101,
    content: "정말 맛있어 보이는 요리네요! 이번 주말에 꼭 해볼게요.",
    date: "2021-01-02",
    user: {
      name: "홍길동",
      imageURL:
        "https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png",
    },
    likeCount: 3,
    replyCount: 0,
    isLiked: false,
  },
  {
    id: 102,
    content: "재료를 조금 변경해서 만들어도 될까요?",
    date: "2021-01-03",
    user: {
      name: "김철수",
      imageURL:
        "https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png",
    },
    likeCount: 1,
    replyCount: 0,
    isLiked: true,
  },
  {
    id: 103,
    content: "저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!",
    date: "2021-01-04",
    user: {
      name: "이영희",
      imageURL:
        "https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png",
    },
    likeCount: 5,
    replyCount: 0,
    isLiked: false,
  },
];

export const createdRecipes: RecipeGridItem[] = [
  {
    id: 1,
    title: "홈메이드 치킨 파프리카",
    imageUrl: "/recipes/chicken-paprika.jpg",
  },

  {
    id: 2,
    title: "치즈 수플레",
    imageUrl: "/recipes/cheese-souffle.jpg",
  },
  {
    id: 3,
    title: "타코 볼",
    imageUrl: "/recipes/taco-bowl.jpg",
  },
  {
    id: 4,
    title: "매콤한 베트남 쌀국수",
    imageUrl: "/recipes/spicy-pho.jpg",
  },
];

export const cookbookRecipes: RecipeGridItem[] = [
  {
    id: 5,
    title: "주말 브런치 컬렉션",
    imageUrl: "/recipes/brunch-collection.jpg",
  },

  {
    id: 6,
    title: "이탈리안 파스타 마스터리",
    imageUrl: "/recipes/pasta-collection.jpg",
  },
];

export const userDetail: User = {
  id: 1,
  name: "Stefanie Hiekmann",
  email: "",
  profileContent: "Contributor",
  imageURL:
    "https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png",
};
