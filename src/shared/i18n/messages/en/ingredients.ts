import type { IngredientsDict } from "../../types";

export const ingredients: IngredientsDict = {
  title: "My fridge",
  ownedCount: "{count} ingredients in your fridge",
  ownedCountLoading: "Loading ingredient count",
  ownedCountUnavailable: "Ingredient count is unavailable",
  addEntry: "Search and add ingredients",
  categoryGroup: "Ingredient categories",
  fabFindRecipes: "Find recipes with these ingredients",
  actions: {
    manage: "Manage",
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
    title: "My fridge",
    body: "Log in to manage your ingredients and find recipes made for your fridge.",
    loginButton: "Log in to get started",
  },
  itemAria: { select: "Select {name}", detail: "View {name} details" },
};
