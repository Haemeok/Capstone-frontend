import type { IngredientsDict } from "../../types";

export const ingredients: IngredientsDict = {
  headerLoggedIn: "{nickname}'s fridge",
  headerLoggedOut: "Log in to manage your fridge",
  fabFindRecipes: "Find recipes from my fridge",
  actions: {
    delete: "Delete",
    addIngredient: "Add ingredients",
    selectAll: "Select all",
    cancel: "Cancel",
    done: "Done",
  },
  deleteFab: {
    one: "{count} item selected · Delete",
    other: "{count} items selected · Delete",
  },
  error: { prefix: "Something went wrong", unknown: "Unknown error" },
  empty: {
    heading: "No ingredients yet",
    bodyLine1: "Add ingredients to your fridge",
    bodyLine2: "and get personalized recipe picks",
    cta: "Add ingredients",
  },
  loginCta: {
    aiHeading: "AI recommends recipes for you",
    aiBody:
      "Create personalized recipes with AI using what's left in your fridge",
    searchHeading: "Search recipes by ingredient",
    searchBody:
      "Add your fridge ingredients to find recipes you can make with what you have",
    loginButton: "Log in to get started",
    signupNote: "Sign up to get free daily AI recipe credits",
    searchAlt: "Recipe search",
  },
  itemAria: { select: "Select {name}", detail: "View {name} details" },
};
