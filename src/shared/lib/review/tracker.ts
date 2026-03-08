import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { isAppWebView } from "@/shared/lib/bridge";
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

export const shouldShowReviewGate = (): boolean => {
  if (!isAppWebView()) return false;
  if (storage.getBooleanItem(STORAGE_KEYS.REVIEW_REQUESTED)) return false;
  const isDeclined = storage.getItemWithExpiry<boolean>(
    STORAGE_KEYS.REVIEW_GATE_DECLINED
  );
  if (isDeclined) return false;
  return isAnyThresholdMet();
};

// 액션 카운트 증가 후 리뷰 게이트 표시 여부 반환
export const trackReviewAction = (action: ReviewAction): boolean => {
  if (storage.getBooleanItem(STORAGE_KEYS.REVIEW_REQUESTED)) return false;
  incrementActionCount(action);
  return shouldShowReviewGate();
};

// threshold 충족 시 콜백 호출 (테스트용)
export const checkAndTriggerReviewGate = (onShouldShow: () => void): void => {
  if (storage.getBooleanItem(STORAGE_KEYS.REVIEW_REQUESTED)) return;
  if (isAnyThresholdMet()) {
    onShouldShow();
  }
};
