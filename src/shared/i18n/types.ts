export type Plural = { one: string; other: string };

export type Locale = "ko" | "ja" | "en";
export const LOCALES: readonly Locale[] = ["ko", "ja", "en"];

export type SearchDict = {
  lastPage: string;
  noResults: string;
};

export type MetaDict = {
  search: {
    queryNoun: string;
    pageSuffix: string;
    titleNoQuery: string;
    titleWithQuery: Plural;
    descNoQuery: string;
    descWithQuery: Plural;
  };
};

export type ErrorsDict = {
  sectionGeneric: string;
  video: string;
  comments: string;
  ingredients: string;
  steps: string;
  searchResults: string;
};

export type NotFoundDict = {
  message: string;
  searchCta: string;
};

export type RecipeDetailDict = {
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
  commentsHeading: string;
  commentsEmpty: string;
  commentsReadMore: string;
  commentsWrite: string;
  platingVessel: string;
  videoPinned: string;
  recommendedTitle: string;
  recommendedChefTitle: string;
  remixesTitle: string;
};

export type YoutubeDict = {
  heroTitle: string;
  heroDescLead: string;
  heroDescHighlight: string;
  heroDescTail: string;
  inputPlaceholder: string;
  inputClearLabel: string;
  invalidUrl: string;
};

export type Dictionary = {
  search: SearchDict;
  meta: MetaDict;
  errors: ErrorsDict;
  notFound: NotFoundDict;
  recipeDetail: RecipeDetailDict;
  youtube: YoutubeDict;
};
