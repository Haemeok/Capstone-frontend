import {
  NUTRITION_RANGES,
  NUTRITION_THEMES,
  NutritionFilterKey,
  NutritionThemeKey,
} from "@/shared/config/constants/recipe";
import { getTypedKeys, getTypedEntries } from "@/shared/lib/types/utils";

export type NutritionRangeValue = [number, number];

export type NutritionFilterValues = {
  [K in NutritionFilterKey]?: NutritionRangeValue;
};

export const createDefaultNutritionValues = (): NutritionFilterValues => {
  const defaultValues: NutritionFilterValues = {};
  const keys = getTypedKeys(NUTRITION_RANGES);

  keys.forEach((key) => {
    defaultValues[key] = [NUTRITION_RANGES[key].min, NUTRITION_RANGES[key].max];
  });

  return defaultValues;
};

export const isNutritionValueModified = (
  key: NutritionFilterKey,
  value: NutritionRangeValue | undefined
): boolean => {
  if (!value) return false;

  const range = NUTRITION_RANGES[key];
  return value[0] !== range.min || value[1] !== range.max;
};

export const filterModifiedNutritionValues = (
  values: NutritionFilterValues
): NutritionFilterValues => {
  const filteredValues: NutritionFilterValues = {};
  const keys = getTypedKeys(values);

  keys.forEach((key) => {
    const value = values[key];
    if (isNutritionValueModified(key, value)) {
      filteredValues[key] = value;
    }
  });

  return filteredValues;
};

export const applyNutritionTheme = (
  themeKey: NutritionThemeKey
): NutritionFilterValues => {
  const theme = NUTRITION_THEMES[themeKey];
  const newValues = createDefaultNutritionValues();
  const themeEntries = getTypedEntries(theme.values);

  themeEntries.forEach(([key, range]) => {
    newValues[key] = range;
  });

  return newValues;
};

export const hasModifiedNutritionValues = (
  values: NutritionFilterValues
): boolean => {
  return getTypedKeys(values).some((key) =>
    isNutritionValueModified(key, values[key])
  );
};
