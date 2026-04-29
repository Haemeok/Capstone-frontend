import type { RecipeStep } from "@/entities/recipe/model/types";

import { translateAction } from "./translate";

export type ActionShot = {
  actionKey: string;
  label: string;
};

const MAX_ACTION_SHOTS = 5;

const ACTION_LABEL_BY_KEY: Record<string, string> = {
  cutting_board: "도마 위 손질",
  stir_fry: "볶기",
  simmer: "끓이기",
  mix_bowl: "그릇에 무치기",
  deep_fry: "튀기기",
  steam_action: "찌기",
};

export const deriveActionShots = (steps: RecipeStep[]): ActionShot[] => {
  const seen = new Set<string>();
  const result: ActionShot[] = [];

  const sorted = steps.slice().sort((a, b) => a.stepNumber - b.stepNumber);
  for (const s of sorted) {
    if (!s.action) continue;
    const key = translateAction(s.action);
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      actionKey: key,
      label: ACTION_LABEL_BY_KEY[key] ?? s.action,
    });
    if (result.length >= MAX_ACTION_SHOTS) break;
  }

  return result;
};
