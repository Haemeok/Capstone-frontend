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
  shareAria: string;
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
  heading: string;
  retry: string;
  goHome: string;
  goBack: string;
  sectionMessage: string;
  sectionRetry: string;
  context: {
    recipe: string;
    search: string;
    ingredients: string;
    edit: string;
    generic: string;
  };
};

export type NotFoundDict = {
  message: string;
  searchCta: string;
  goBack: string;
  goHome: string;
  recipe: { title: string; description: string };
  generic: { title: string; description: string };
};

export type RecipeDetailDict = {
  ingredientsHeader: string;
  nutritionHeader: string;
  copyAction: string;
  reportAction: string;
  completeRecording: string;
  completeAlready: string;
  completeCta: string;
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
  cookingTimeValue: string;
  servingsValue: string;
  caloriePrefix: string;
  calorieSuffix: string;
  activityPrefix: string;
  activitySuffix: string;
  costPrefix: string;
  costSuffix: string;
  savingsPrefix: string;
  savingsSuffix: string;
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

export type IngredientAddDict = {
  pageTitle: string;
  searchEntry: string;
  searchEntryAria: string;
  packsHeading: string;
  packsSubtitle: string;
  drawerTitle: string;
  drawerDescription: string;
  searchPlaceholder: string;
  searchAria: string;
  searchAction: string;
  loading: string;
  errorPrefix: string;
  added: string;
  add: string;
  allLoaded: string;
  noResults: string;
  close: string;
  packCountLabel: string;
  selectedCount: string;
  selectAll: string;
  deselectAll: string;
  owned: string;
  deleting: string;
  adding: string;
  deleteCount: string;
  addCount: string;
  cardOwned: string;
  cardCount: string;
  cardDetailAria: string;
};

export type IngredientsDict = {
  headerLoggedIn: string;
  headerLoggedOut: string;
  fabFindRecipes: string;
  actions: {
    delete: string;
    addIngredient: string;
    selectAll: string;
    cancel: string;
    done: string;
  };
  deleteFab: Plural;
  error: { prefix: string; unknown: string };
  empty: {
    heading: string;
    bodyLine1: string;
    bodyLine2: string;
    cta: string;
  };
  loginCta: {
    aiHeading: string;
    aiBody: string;
    searchHeading: string;
    searchBody: string;
    loginButton: string;
    signupNote: string;
    searchAlt: string;
  };
  itemAria: { select: string; detail: string };
};

export type FridgeDict = {
  pageTitle: string;
  pageSubtitle: string;
  sortLabel: string;
  lastPageEmpty: string;
  lastPageMore: string;
  emptyHeading: string;
  emptyBodyLine1: string;
  emptyBodyLine2: string;
  emptyCta: string;
  matchReady: string;
  matchMissing: Plural;
  collapse: string;
  aiGenerated: string;
  metaTitle: string;
  cookTimeMinutes: string;
};

import type { ContentPageId } from "@/shared/config/constants/content-pages";
import type {
  NutritionFilterKey,
  NutritionThemeKey,
  TagCode,
} from "@/shared/config/constants/recipe";

export type SearchDiscoveryDict = {
  searchInputAria: string;
  searchClearAria: string;
  recentSearchTitle: string;
  recentViewedTitle: string;
  clearAction: string;
  latestRecipesTitle: string;
  contentSectionTitle: string;
  nutritionSectionTitle: string;
  recipeSlideViewMore: string;
  recipeSlideEmpty: string;
  recipeSlideError: string;
  placeholders: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
  contentPages: Record<ContentPageId, { title: string; subtitle: string }>;
  nutritionThemes: Record<NutritionThemeKey, { label: string }>;
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

export type RecipeCreateDict = {
  hubTitle: string;
  hubSubtitle: string;
  manualCardTitle: string;
  manualCardBody: string;
  manualCardImageAlt: string;
  youtubeCardTitle: string;
  youtubeCardBody: string;
  youtubeCardImageAlt: string;
};

export type CategoryDict = {
  navAriaLabel: string;
  countAll: string;
  emptyTitle: string;
  emptySubtitle: string;
  emptyCta: string;
  meta: {
    fallbackTitle: string;
    titleTemplate: string;
    descriptionTemplate: string;
    keywordRecipe: string;
    keywordRecipeMethod: string;
    keywordByCategory: string;
    imageAltTemplate: string;
  };
};

export type UserPagesDict = {
  profile: {
    shareTitle: string;
    shareText: string;
    shareAria: string;
    loginAction: string;
    createRecipeAction: string;
    calendarLoadError: string;
    emptyTitle: string;
    emptyDescription: string;
    editAction: string;
    editAria: string;
    edit: {
      heading: string;
      cancel: string;
      submit: string;
      submitting: string;
      nameLabel: string;
      introLabel: string;
      introPlaceholder: string;
      nicknameRequired: string;
      nicknameTooLong: string;
      introTooLong: string;
      imageFormatError: string;
      updateError: string;
    };
    tabs: {
      recipes: string;
      saved: string;
      calendar: string;
      recipesOther: string;
    };
    metadata: {
      titleSuffix: string;
      fallbackDescription: string;
      introFallbackTemplate: string;
    };
  };
  recipeBooks: {
    heading: string;
    listLoadError: string;
    boundaryError: string;
    cardMenuAria: string;
    rename: string;
    delete: string;
    savedCount: string;
    createAria: string;
    createLabel: string;
    editButton: string;
    selectedCount: string;
    renameAria: string;
    grid: {
      emptyTitle: string;
      emptyCta: string;
      selectAria: string;
      deselectAria: string;
    };
    editMode: {
      selectAll: string;
      deselectAll: string;
      move: string;
      remove: string;
    };
    move: {
      heading: string;
      createNew: string;
      empty: string;
      emptyWithCreate: string;
      countSuffix: string;
      toast: string;
    };
    bulkDelete: {
      title: string;
      description: string;
      confirm: string;
      cancel: string;
      toast: string;
    };
  };
  calendar: {
    timelineHeading: string;
    timelineEmpty: string;
    detailAction: string;
    invalidAccess: string;
    recordHeadingSuffix: string;
    savingsHeading: string;
    nutritionHeading: string;
    totalCaloriesLabel: string;
    recommendedRatioPrefix: string;
    carbs: string;
    protein: string;
    fat: string;
    sodium: string;
    sodiumStatus: Record<
      "good" | "normal" | "warning",
      { label: string; description: string }
    >;
    recipeListHeading: string;
    recipeListEmpty: string;
    daySummaryEmpty: string;
    daySummaryRecipeCount: string;
    daySummarySavedSuffix: string;
    toggleRecord: string;
    toggleStreak: string;
    recordAlt: string;
    streakAlt: string;
    streakDays: Plural;
    streakMessages: {
      start: string;
      day1: string;
      streak: string;
      homeCooking: string;
      great: string;
      onFire: string;
      incredible: string;
    };
    viewAllRecords: string;
  };
};

export type TaxonomyDict = {
  recipeType: Record<"USER" | "AI" | "YOUTUBE", string>;
  sort: Record<
    "popularityScore,DESC" | "createdAt,DESC" | "createdAt,ASC",
    string
  >;
  dishType: Record<string, string>;
  tags: Record<TagCode, string>;
  ingredientCategory: Record<string, string>;
  nutritionTheme: Record<NutritionThemeKey, string>;
  nutritionLabel: Record<NutritionFilterKey, string>;
  country: Record<string, string>;
  recipeSort: Record<string, string>;
  filters: {
    sectionRecipeType: string;
    drawerTitle: string;
    drawerDescription: string;
    sortHeader: string;
    dishTypeHeader: string;
    dishTypeDescription: string;
    tagsHeader: string;
    tagsDescription: string;
    nutritionHeader: string;
    nutritionDescription: string;
    tagsChipDefault: string;
    reset: string;
    apply: string;
    themeSection: string;
    countrySection: string;
    sortAria: string;
  };
};

export type RecipeFormDict = {
  labels: Record<
    | "title"
    | "image"
    | "ingredients"
    | "cookingTime"
    | "servings"
    | "dishType"
    | "description"
    | "steps"
    | "cookingTools"
    | "tags",
    string
  >;
  validation: {
    titleMin: string;
    titleMax: string;
    imageRequired: string;
    imageType: string;
    imageSize: string;
    servingsMin: string;
    cookingTimeMin: string;
    descriptionMin: string;
    quantityRequired: string;
    unitRequired: string;
    ingredientsMin: string;
    stepsMin: string;
    instructionRequired: string;
    categoryRequired: string;
  };
  ui: {
    dishTypeRequired: string;
    dishTypePlaceholder: string;
    cookingTimeUnitSuffix: string;
    cookingTimePlaceholder: string;
    cookingTimeNumberOnly: string;
    cookingTimeMinValue: string;
    submitErrorPrefix: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    servingsLabel: string;
    servingsDecrease: string;
    servingsIncrease: string;
    servingsUnitSuffix: string;
    cookingToolRemove: string;
    cookingToolInputLabel: string;
    cookingToolPlaceholder: string;
    stepAdd: string;
    stepIngredientsHeading: string;
    stepIngredientsEmpty: string;
    stepInstructionLabel: string;
    stepInstructionPlaceholder: string;
    stepInstructionRequired: string;
    stepRemove: string;
    submitCreate: string;
    submitEdit: string;
    floatingCreateLabel: string;
    floatingCreateText: string;
    addIngredient: string;
    ingredientSearchTitle: string;
    ingredientSearchDescription: string;
    ingredientSearchPlaceholder: string;
    ingredientLoading: string;
    ingredientLoadError: string;
    unknownError: string;
    allIngredientsLoaded: string;
    ingredientNoResults: string;
    close: string;
    add: string;
    added: string;
    quantityUnitRequired: string;
    unitSelectAria: string;
    unitlessSlight: string;
    unitlessSome: string;
    customIngredientTrigger: string;
    customIngredientInputLabel: string;
    customIngredientPlaceholder: string;
    customIngredientCloseLabel: string;
    unitPlaceholder: string;
    unitLoading: string;
    myIngredients: string;
    imageUploadPlaceholder: string;
    imagePreviewAlt: string;
    imageRequiredFallback: string;
    missingFieldsPrefix: string;
  };
};

export type CookingUnitsDict = {
  tableTrigger: string;
  tableTitle: string;
  tableDescription: string;
  conversions: {
    unit: string;
    value: string;
    tip: string;
  }[];
};

export type IngredientPickerDict = {
  title: string;
  closeAria: string;
  searchAria: string;
  searchAction: string;
  searchPlaceholder: string;
  loading: string;
  errorPrefix: string;
  unknownError: string;
  allLoaded: string;
  noResults: string;
  myIngredients: string;
  cardSelect: string;
  cardDeselect: string;
  complete: string;
  removeAria: string;
};

export type CommonDict = {
  readMore: string;
  collapse: string;
  readMoreAria: string;
  collapseAria: string;
};

export type SettingsDict = {
  title: string;
  srDescription: string;
  adRemoval: string;
  adRemovalCta: string;
  adRemovalRemaining: string;
  notifications: string;
  notificationsOnAria: string;
  notificationsOffAria: string;
  privacy: string;
  reviews: string;
  reportError: string;
  copyrightReport: string;
  withdraw: string;
  logout: string;
  close: string;
  withdrawTitle: string;
  withdrawDescription: string;
  cancel: string;
  withdrawConfirm: string;
  withdrawDeleting: string;
};

export type RatingsDict = {
  empty: string;
  summary: string;
};

export type AuthDict = {
  browseWithoutLogin: string;
  recentLogin: string;
  loading: string;
  kakaoLabel: string;
  naverLabel: string;
  error: {
    title: string;
    description: string;
    retry: string;
  };
};

export type NotificationsDict = {
  title: string;
  deleteAll: string;
  empty: string;
  allLoaded: string;
  loadingMore: string;
  deleteAria: string;
  profileAlt: string;
  templates: Record<
    | "NEW_COMMENT"
    | "NEW_REPLY"
    | "AI_RECIPE_DONE"
    | "NEW_FAVORITE"
    | "NEW_RECIPE_LIKE"
    | "NEW_COMMENT_LIKE"
    | "NEW_RECIPE_RATING"
    | "REFERRAL_REWARD_GRANTED",
    string
  >;
  genericMessage: string;
};

export type ReferralDict = {
  giftAria: string;
  adFreeLabel: string;
  adFreeUntil: string;
  daysLeft: Plural;
  endsToday: string;
  sheetTitle: string;
  sheetTitleWithMonth: string;
  description: string;
  myCodeLabel: string;
  copyAria: string;
  copyAction: string;
  copiedToast: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputAria: string;
  applyAction: string;
  loadError: string;
  retry: string;
  referredBy: string;
  rewardLimit: string;
  redeemSuccessToast: string;
  status: {
    ALREADY_REDEEMED: string;
    NOT_ELIGIBLE_OLD_USER: string;
    REDEEM_WINDOW_EXPIRED: string;
    NO_ACTIVE_CAMPAIGN: string;
  };
  redeemErrors: Record<string, string>;
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
  fridge: FridgeDict;
  ingredientAdd: IngredientAddDict;
  ingredients: IngredientsDict;
  searchDiscovery: SearchDiscoveryDict;
  userPages: UserPagesDict;
  recipeCreate: RecipeCreateDict;
  recipeForm: RecipeFormDict;
  taxonomy: TaxonomyDict;
  category: CategoryDict;
  ingredientPicker: IngredientPickerDict;
  common: CommonDict;
  referral: ReferralDict;
  settings: SettingsDict;
  ratings: RatingsDict;
  auth: AuthDict;
  notifications: NotificationsDict;
};
