import type { SearchDiscoveryDict } from "../../types";

export const searchDiscovery: SearchDiscoveryDict = {
  searchInputAria: "Search recipes",
  searchClearAria: "Clear input",
  latestRecipesTitle: "Freshly added recipes",
  contentSectionTitle: "Recipes you might like",
  nutritionSectionTitle: "What are you in the mood for?",
  placeholders: {
    breakfast: [
      'Easy "scrambled eggs" recipe',
      '5-minute "avocado toast" recipe',
      'Light "Greek yogurt bowl" recipe',
      'Cozy "oatmeal" recipe',
    ],
    lunch: [
      'Hearty "grilled cheese" recipe',
      'Quick "chicken wrap" recipe',
      'Fresh "Cobb salad" recipe',
      'Crispy "quesadilla" recipe',
    ],
    dinner: [
      'Classic "spaghetti" recipe',
      'Weeknight "sheet-pan chicken" recipe',
      'Comfort "mac and cheese" recipe',
      'Spicy "beef tacos" recipe',
    ],
  },
};
