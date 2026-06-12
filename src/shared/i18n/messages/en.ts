import type { Dictionary } from "../types";

export const en: Dictionary = {
  search: {
    lastPage: "You've reached the end.",
    noResults: "No recipes to show.",
  },
  meta: {
    search: {
      queryNoun: "",
      pageSuffix: " (page {page})",
      titleNoQuery: "Recipe Search Results{page} - Recipio",
      titleWithQuery: {
        one: "{q} — {count} recipe{page} | Recipio",
        other: "{q} — {count} recipes{page} | Recipio",
      },
      descNoQuery:
        "Filter by ingredients, calories, cook time, and more. Find the recipe that fits your day.",
      descWithQuery: {
        one: "Browse {count} {q} recipe. Compare ingredients, nutrition, and cook time at a glance.",
        other:
          "Browse {count} {q} recipes. Compare ingredients, nutrition, and cook time at a glance.",
      },
    },
  },
  errors: {
    sectionGeneric: "This section couldn't be loaded",
    video: "The video couldn't be loaded",
    comments: "Comments couldn't be loaded",
    ingredients: "Ingredient info couldn't be loaded",
    steps: "Cooking steps couldn't be loaded",
    searchResults: "Search results couldn't be displayed",
  },
  recipeDetail: {
    ingredientsHeader: "Ingredients",
    nutritionHeader: "Nutrition",
    copyAction: "Copy",
    reportAction: "Report",
    nutritionSodium: "Sodium",
    nutritionCarbs: "Carbs",
    nutritionProtein: "Protein",
    nutritionFat: "Fat",
    nutritionSugar: "Sugar",
    servingsDecrease: "Decrease servings",
    servingsIncrease: "Increase servings",
    cookingTimeLabel: "Cook time",
    servingsLabel: "Servings",
    cookingToolsLabel: "Equipment",
    noInfo: "N/A",
    aiYoutubeBadge: "Recipe extracted by AI from a YouTube video (Beta)",
    aiAssistedBadge: "Created with AI assistance",
    platingGuide: "Plating guide",
    subscriberLabel: "subscribers",
    subscribeAction: "Subscribe",
    pinVideo: "Pin video",
    unpinVideo: "Unpin video",
    originalVideo: "Watch original",
    videoDisclosure:
      "This video plays via the official YouTube player. All views and revenue go 100% to the original creator.",
    coupangDisclosure:
      "This post is part of the Coupang Partners program, through which a commission may be earned.",
    commentsReadMore: "Read more",
    commentsWrite: "Write a comment",
    recommendedTitle: "You might also like",
    recommendedChefTitle: "More chef recipes",
    remixesTitle: "Remixes of this recipe",
  },
};
