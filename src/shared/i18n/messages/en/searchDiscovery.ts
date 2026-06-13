import type { SearchDiscoveryDict } from "../../types";

export const searchDiscovery: SearchDiscoveryDict = {
  searchInputAria: "Search recipes",
  searchClearAria: "Clear input",
  recentSearchTitle: "Recent searches",
  recentViewedTitle: "Recently viewed",
  clearAction: "Clear",
  latestRecipesTitle: "Freshly added recipes",
  contentSectionTitle: "Recipes you might like",
  nutritionSectionTitle: "What are you in the mood for?",
  recipeSlideViewMore: "View more",
  recipeSlideEmpty: "No recipes yet.",
  recipeSlideError: "Something went wrong. Please try again later.",
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
  contentPages: {
    "diet-healthy": {
      title: "🥗 Light and healthy meals",
      subtitle: "Low-calorie, high-protein",
    },
    "ai-creative": {
      title: "🤖 AI-invented combinations",
      subtitle: "Recipes you wouldn't think of",
    },
    "chef-secret": {
      title: "👨‍🍳 Signature chef recipes",
      subtitle: "From million-subscriber channels",
    },
    "solo-drink": {
      title: "🍶 Cozy night-in snacks",
      subtitle: "Ready in 10 minutes",
    },
    "budget-gourmet": {
      title: "💰 An affordable little treat",
      subtitle: "Great value recipes",
    },
    "late-night-guilty": {
      title: "🌙 Easy late-night bites",
      subtitle: "Low-calorie, guilt-free",
    },
    "youtube-mukbang": {
      title: "📺 That dish from the video",
      subtitle: "Make it yourself at home",
    },
    "hangover-soup": {
      title: "🍲 The morning after",
      subtitle: "Warm, soothing soups",
    },
    "air-fryer-legend": {
      title: "🔥 Air fryer favorites",
      subtitle: "Easy, popular recipes",
    },
    "kids-snack": {
      title: "🧒 Snacks kids love",
      subtitle: "Homemade for the family",
    },
    "home-party-flex": {
      title: "🏠 Home party menu",
      subtitle: "Dishes that impress",
    },
    "protein-bulk": {
      title: "💪 High-protein meals",
      subtitle: "30g+ protein",
    },
  },
  nutritionThemes: {
    KETO: { label: "Keto" },
    LOW_SUGAR: { label: "Low-sugar" },
    HIGH_PROTEIN: { label: "High-protein" },
    WEGOVY_FRIENDLY: { label: "GLP-1 friendly" },
    ANTI_AGING: { label: "Anti-aging" },
    LOW_CALORIE: { label: "Low-calorie" },
    LOW_FAT: { label: "Low-fat" },
    LOW_SODIUM: { label: "Low-sodium" },
    BALANCED: { label: "Balanced" },
    BUDGET: { label: "Budget" },
  },
};
