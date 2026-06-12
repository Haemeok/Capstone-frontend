export type Plural = { one: string; other: string };

export type Locale = "ko" | "ja" | "en";
export const LOCALES: readonly Locale[] = ["ko", "ja", "en"];

export type Dictionary = {
  errors: {
    sectionGeneric: string;
    video: string;
    comments: string;
    ingredients: string;
    steps: string;
    searchResults: string;
  };
  recipeDetail: {
    ingredientsHeader: string;
    nutritionHeader: string;
    copyAction: string;
    reportAction: string;
    nutritionSodium: string;
    nutritionCarbs: string;
    nutritionProtein: string;
    nutritionFat: string;
    nutritionSugar: string;
    servingsDecrease: string;
    servingsIncrease: string;
    cookingTimeLabel: string;
    servingsLabel: string;
    cookingToolsLabel: string;
    noInfo: string;
    aiYoutubeBadge: string;
    aiAssistedBadge: string;
    platingGuide: string;
    subscriberLabel: string;
    subscribeAction: string;
    pinVideo: string;
    unpinVideo: string;
    originalVideo: string;
    videoDisclosure: string;
    coupangDisclosure: string;
    commentsReadMore: string;
    commentsWrite: string;
    recommendedTitle: string;
    recommendedChefTitle: string;
    remixesTitle: string;
  };
};
