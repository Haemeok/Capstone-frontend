import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { storage } from "@/shared/lib/storage";

type ReviewAction =
  | "recipe_save"
  | "youtube_extract"
  | "ai_generation"
  | "cooking_complete";

const ACTION_STORAGE_KEY_MAP: Record<ReviewAction, string> = {
  recipe_save: STORAGE_KEYS.REVIEW_ACTION_RECIPE_SAVE,
  youtube_extract: STORAGE_KEYS.REVIEW_ACTION_YOUTUBE_EXTRACT,
  ai_generation: STORAGE_KEYS.REVIEW_ACTION_AI_GENERATION,
  cooking_complete: STORAGE_KEYS.REVIEW_ACTION_COOKING_COMPLETE,
};

const ACTION_THRESHOLD_MAP: Record<ReviewAction, number> = {
  recipe_save: 5,
  youtube_extract: 3,
  ai_generation: 3,
  cooking_complete: 3,
};

const getActionCount = (action: ReviewAction): number => {
  const raw = storage.getItem(ACTION_STORAGE_KEY_MAP[action]);
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const incrementActionCount = (action: ReviewAction): number => {
  const newCount = getActionCount(action) + 1;
  storage.setItem(ACTION_STORAGE_KEY_MAP[action], String(newCount));
  return newCount;
};

const isAnyThresholdMet = (): boolean => {
  return (Object.keys(ACTION_THRESHOLD_MAP) as ReviewAction[]).some(
    (action) => getActionCount(action) >= ACTION_THRESHOLD_MAP[action]
  );
};

// 액션 카운트만 증가 (리뷰 요청 완료된 경우 패스)
export const trackReviewAction = (action: ReviewAction): void => {
  if (storage.getBooleanItem(STORAGE_KEYS.REVIEW_REQUESTED)) return;
  incrementActionCount(action);
};

// threshold 충족 시 콜백 호출 (Happiness Gate 다이얼로그 표시용)
export const checkAndTriggerReviewGate = (onShouldShow: () => void): void => {
  if (storage.getBooleanItem(STORAGE_KEYS.REVIEW_REQUESTED)) return;
  if (isAnyThresholdMet()) {
    onShouldShow();
  }
};
