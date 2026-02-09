export type IngredientFocusRequest = {
  ingredientIds: string[];
  dishType: string;
  cookingTime: number;
  servings: number;
};

export type CostEffectiveRequest = {
  targetBudget: number;
  targetCategory: string;
};

export type NutritionBalanceRequest = {
  targetStyle: string;
  targetCalories: string;
  targetCarbs: string;
  targetProtein: string;
  targetFat: string;
};

export type FineDiningRequest = {
  ingredientIds: string[];
  diningTier: "WHITE" | "BLACK";
};

export type AIRecommendedRecipeRequest =
  | IngredientFocusRequest
  | CostEffectiveRequest
  | NutritionBalanceRequest
  | FineDiningRequest;

export type AIModelId =
  | "INGREDIENT_FOCUS"
  | "COST_EFFECTIVE"
  | "NUTRITION_BALANCE"
  | "FINE_DINING";

export type AIModelRequestMap = {
  INGREDIENT_FOCUS: IngredientFocusRequest;
  COST_EFFECTIVE: CostEffectiveRequest;
  NUTRITION_BALANCE: NutritionBalanceRequest;
  FINE_DINING: FineDiningRequest;
};

export type AIRecommendedRecipe = {
  recipeId: string;
};

// ========== Job Polling Types (V2 API) ==========

export type AIJobStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type AIJobCreationResponse = {
  jobId: string;
};

export type AIJobStatusResponse = {
  jobId: string;
  status: AIJobStatus;
  progress?: number;
  resultRecipeId?: string;
  code?: string;
  message?: string;
  retryAfter?: number;
};

export type AIJobMeta = {
  concept: AIModelId;
  displayName: string;
  requestSummary: string;
};

export type PersistedAIJob = {
  idempotencyKey: string;
  concept: AIModelId;
  meta: AIJobMeta;
  request: AIRecommendedRecipeRequest;
  jobId: string | null;
  startTime: number;
  lastPollTime: number;
  retryCount: number;
};

export type AIJobState = "creating" | "polling" | "completed" | "failed";

export type ActiveAIJob = PersistedAIJob & {
  state: AIJobState;
  progress: number;
  resultRecipeId?: string;
  code?: string;
  message?: string;
  retryAfter?: number;
};
