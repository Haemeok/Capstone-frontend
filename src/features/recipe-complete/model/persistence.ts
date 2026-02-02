import { storage } from "@/shared/lib/storage";
import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { getKSTDateString } from "../lib/dateUtils";

export type CompletedRecipeRecord = {
  recipeId: string;
  completedAt: number;
  completedDateKST: string;
};

type PersistedData = {
  records: CompletedRecipeRecord[];
};

/**
 * localStorage에서 오늘 완료한 레시피 기록만 로드
 * 이전 날짜의 기록은 자동으로 필터링됨
 */
export const loadCompletedRecipes = (): CompletedRecipeRecord[] => {
  const raw = storage.getItem(STORAGE_KEYS.COMPLETED_RECIPES);
  if (!raw) return [];

  try {
    const data: PersistedData = JSON.parse(raw);
    const todayKST = getKSTDateString();

    // 오늘 기록만 필터링
    const todayRecords = data.records.filter(
      (record) => record.completedDateKST === todayKST
    );

    // 이전 날짜 기록이 있었다면 정리된 데이터로 업데이트
    if (todayRecords.length !== data.records.length) {
      persistCompletedRecipes(todayRecords);
    }

    return todayRecords;
  } catch {
    // 잘못된 JSON 데이터는 삭제
    storage.removeItem(STORAGE_KEYS.COMPLETED_RECIPES);
    return [];
  }
};

/**
 * 완료된 레시피 목록을 localStorage에 저장
 */
export const persistCompletedRecipes = (
  records: CompletedRecipeRecord[]
): void => {
  const data: PersistedData = { records };
  storage.setItem(STORAGE_KEYS.COMPLETED_RECIPES, JSON.stringify(data));
};

/**
 * 새 레시피 완료 기록 추가
 * 이미 완료된 레시피는 중복 추가하지 않음
 */
export const addCompletedRecipeRecord = (recipeId: string): void => {
  const records = loadCompletedRecipes();

  // 중복 체크
  if (records.some((r) => r.recipeId === recipeId)) {
    return;
  }

  const now = Date.now();
  const newRecord: CompletedRecipeRecord = {
    recipeId,
    completedAt: now,
    completedDateKST: getKSTDateString(now),
  };

  persistCompletedRecipes([...records, newRecord]);
};

/**
 * 모든 완료 기록 삭제
 */
export const clearCompletedRecipes = (): void => {
  storage.removeItem(STORAGE_KEYS.COMPLETED_RECIPES);
};
