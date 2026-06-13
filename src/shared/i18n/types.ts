export type Plural = { one: string; other: string };

export type Locale = "ko" | "ja" | "en";
export const LOCALES: readonly Locale[] = ["ko", "ja", "en"];

export type NavDict = {
  home: string;
  search: string;
  fridge: string;
  aiRecipe: string;
  my: string;
  recipeSearch: string;
  youtubeRecipe: string;
  login: string;
  install: string;
  installAria: string;
  notificationsAria: string;
  notificationsUnreadAria: Plural;
  unreadBadgeAria: Plural;
  savedBooksAria: string;
  savedBooksToast: string;
  profile: string;
  footer: {
    sectionService: string;
    sectionSupport: string;
    tagline: string;
    businessInfoToggleAria: string;
    terms: string;
    privacy: string;
    reportError: string;
    adInquiry: string;
    copyrightReport: string;
    ceoLabel: string;
    csLabel: string;
    adLabel: string;
  };
};

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

export type IngredientDetailDict = {
  nutritionHeader: string;
  nutritionBasis: string;
  nutritionProtein: string;
  nutritionCarbs: string;
  nutritionFat: string;
  nutritionSugar: string;
  nutritionSodium: string;
  benefitsHeader: string;
  benefitsSubtitle: string;
  pairingHeader: string;
  pairingGood: string;
  pairingBad: string;
  cookingHeader: string;
  storageHeader: string;
  storageLocation: string;
  storageTemperature: string;
  storageDuration: string;
  storageNotes: string;
  seasonHeader: string;
  seasonSubtitle: string;
  seasonNow: string;
  popularRecipesTitle: string;
};

export type HomeDict = {
  categoryTitle: string;
  bannerError: string;
  popularSectionTitle: string;
  budgetSectionTitle: string;
  youtubeBannerChip: string;
  youtubeBannerTitle: string;
};

import type { AIModelId, DiningTier } from "@/shared/config/constants/aiModel";

export type AiRecipeDict = {
  modelSelectHeading: string;
  loginDrawerMessage: string;
  backToModelSelect: string;
  generateRecipe: string;
  errorFallback: string;
  loading: {
    titleSuffix: string;
    progressLabel: string;
    tipHeading: string;
    tipBody: string[];
    eta: string;
  };
  error: {
    defaultMessage: string;
    failureHeading: string;
    failureBody: string;
    retryButton: string;
    persistentTip: string;
  };
  models: Record<AIModelId, { name: string; description: string }>;
  steps: string[];
  diningTiers: Record<
    DiningTier,
    { label: string; description: string; features: string[] }
  >;
  price: {
    pageTitle: string;
    pageDescription: string;
    headerTitle: string;
    headerDescription: string;
    budgetLabel: string;
    foodPickHeading: string;
    foodPickDescription: string;
    averageMealInfo: string;
    savingsMessage: string;
    monthlySavingsMessage: string;
    savingsBadgeLabel: string;
    savingsBadgeSuffix: string;
    dailyPracticeTip: string;
  };
  ingredient: {
    pickerInitialCategory: string;
    pickerMineCategory: string;
    submitToastSuffix: string;
  };
  nutrition: {
    pageHeading: string;
    cookingStyleLabel: string;
    macroModeLabel: string;
    calorieModeLabel: string;
    macroSliderSetLabel: string;
    macroSliderAutoLabel: string;
    unlimitedValue: string;
    macroCarbs: string;
    macroProtein: string;
    macroFat: string;
    macroCalories: string;
    styles: Record<string, { label: string; description: string }>;
    guidance: {
      calories: { low: string; mid: string; high: string; max: string };
      protein: { low: string; mid: string; high: string };
      carbs: { low: string; mid: string; high: string };
      fat: { low: string; mid: string; high: string };
    };
  };
  fineDining: {
    pageTitle: string;
    pageDescription: string;
    ingredientSectionHeading: string;
    ingredientSectionDescription: string;
    ingredientSearchPlaceholder: string;
    ingredientSearchAriaLabel: string;
    ingredientCountSuffix: string;
    selectedIngredientsHeading: string;
    removeAllLabel: string;
    removeAllAriaLabel: string;
    removeIngredientAriaLabel: string;
    tierSectionHeading: string;
    tierSectionDescription: string;
  };
  form: {
    dishType: {
      sectionTitle: string;
      options: string[];
    };
    servings: {
      sectionTitle: string;
      decreaseLabel: string;
      increaseLabel: string;
      unit: string;
    };
    cookingTime: {
      sectionTitle: string;
    };
    aiCharacter: {
      withSuffix: string;
      subtitle: string;
    };
    progressButton: {
      label: string;
    };
    usageLimitBanner: {
      message: string;
      subMessage: string;
    };
    ingredientManager: {
      addButtonLabel: string;
      addButtonAriaLabel: string;
      ingredientsAddedCount: string;
      addPrompt: string;
      selectedHeading: string;
      removeAllLabel: string;
    };
  };
};

export type Dictionary = {
  search: SearchDict;
  meta: MetaDict;
  errors: ErrorsDict;
  notFound: NotFoundDict;
  recipeDetail: RecipeDetailDict;
  youtube: YoutubeDict;
  ingredientDetail: IngredientDetailDict;
  aiRecipe: AiRecipeDict;
  nav: NavDict;
  home: HomeDict;
};
