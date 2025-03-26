import { Ingredient, RecipeStep, Recipe as RecipeType } from "./type/recipe";
import { User } from "./type/user";
import { Comment } from "./type/comment";

export const ingredients: Ingredient[] = [
  { quantity: "250 g", name: "red cabbage" },
  { quantity: "2", name: "scallions" },
  { quantity: "500 g", name: "oyster mushrooms" },
  { quantity: "8 tbsp", name: "olive oil" },
  { quantity: "3 cloves", name: "garlic" },
  { quantity: "400 g", name: "full-fat Greek yogurt" },
  { quantity: "1 tsp", name: "lemon juice" },
  { quantity: "½ tsp", name: "maple syrup" },
  { quantity: "1 tbsp", name: "maple syrup" },
  { quantity: "1 tsp", name: "ground cumin" },
  { quantity: "2 tsp", name: "sweet paprika powder" },
  { quantity: "1 tsp", name: "baharat spice mix" },
  { quantity: "4", name: "flatbreads (small)" },
  { quantity: "", name: "salt" },
];

export const RecipeSteps: RecipeStep[] = [
  {
    ingredients: [
      {
        quantity: "130 g",
        name: "margarine",
      },
      {
        quantity: "130 g",
        name: "margarine",
      },
      {
        quantity: "130 g",
        name: "margarine",
      },
    ],
    instruction:
      "To make vegan béchamel, melt margarine in saucepan. Whisk in flour, then slowly whisk in warm soymilk in a steady stream.",
    utensils: ["saucepanwhisk"],
  },
  {
    ingredients: [
      {
        quantity: "2tbsp",
        name: "nutritional yeast",
      },
      {
        quantity: "",
        name: "salt",
      },
      {
        quantity: "",
        name: "pepper",
      },
    ],
    instruction:
      "Stir in nutritional yeast, nutmeg, and salt and pepper to taste.",
    utensils: [],
  },
  {
    ingredients: [
      {
        quantity: "2tbsp",
        name: "nutritional yeast",
      },
      {
        quantity: "",
        name: "salt",
      },
      {
        quantity: "",
        name: "pepper",
      },
    ],
    instruction:
      "Preheat oven to 200°C/400°F. Peel onion and garlic, clean mushrooms. Finely chop onion, garlic, and thyme and slice mushrooms.",
    utensils: [],
  },
  {
    ingredients: [
      {
        quantity: "2tbsp",
        name: "nutritional yeast",
      },
      {
        quantity: "",
        name: "salt",
      },
      {
        quantity: "",
        name: "pepper",
      },
    ],
    instruction:
      "Add oil to frying pan, sauté onion, garlic and our VEGGIE WUNDER seasoning (if using) over medium heat until fragrant and softened. Add mushrooms and thyme and cook for a few minutes, until mushrooms start to brown; if needed, add a bit more oil. Add spinach and cook until wilted, stirring often. Season with salt and pepper. Set aside.",
    utensils: [],
  },
  {
    ingredients: [
      {
        quantity: "2tbsp",
        name: "nutritional yeast",
      },
      {
        quantity: "",
        name: "salt",
      },
      {
        quantity: "",
        name: "pepper",
      },
    ],
    instruction:
      "Spread a layer of tomato sauce on bottom of casserole dish. Add a layer of noodles, then a layer of béchamel sauce, and a layer of vegetables. Top with another layer of noodles and tomato sauce, and repeat pattern until casserole dish is filled. Finish with a layer of béchamel sauce and remaining mushrooms and spinach. Garnish with thyme leaves. Bake for approx. 30–40 min. at 200°C/400°F, or until sides start to bubble and top turns golden brown. Let cool slightly before slicing and serving. Enjoy!",
    utensils: [],
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
};

export const comments: Comment[] = [
  {
    id: 1,
    content:
      "The creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushrooms",
    date: "2021-01-01",
    user: user,
  },
  {
    id: 2,
    content:
      "The creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushrooms",
    date: "2021-01-01",
    user: user,
  },
  {
    id: 3,
    content:
      "The creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushrooms",
    date: "2021-01-01",
    user: user,
  },
  {
    id: 4,
    content:
      "The creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushroomsThe creamiest vegan lasagna with spinach and mushrooms",
    date: "2021-01-01",
    user: user,
  },
];
