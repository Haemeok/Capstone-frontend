import type {
  IngredientDetailApiResponse,
  IngredientDetailView,
  IngredientNutrition,
} from "../model/types";

const parseSlashList = (raw: string | null | undefined): string[] => {
  if (!raw) return [];
  return raw
    .split("/")
    .map((piece) => piece.trim())
    .filter((piece) => piece.length > 0);
};

const normalizeNutrition = (
  raw: IngredientNutrition | null | undefined
): IngredientNutrition | null => {
  if (!raw) return null;
  const hasMacro =
    Boolean(raw.calories) ||
    Boolean(raw.protein) ||
    Boolean(raw.carb) ||
    Boolean(raw.fat);
  return hasMacro ? raw : null;
};

export const parseIngredientDetail = (
  api: IngredientDetailApiResponse
): IngredientDetailView => ({
  id: api.id,
  name: api.name,
  imageUrl: api.imageUrl,
  categoryLabel: api.category,
  storage: {
    location: api.storageLocation,
    temperature: api.storageTemperature,
    duration: api.storageDuration,
    notes: api.storageNotes,
  },
  pairings: {
    good: parseSlashList(api.goodPairs),
    bad: parseSlashList(api.badPairs),
  },
  cookingMethods: parseSlashList(api.recommendedCookingMethods),
  shortDescription: api.shortDescription ?? null,
  coupangLink: api.coupangLink ?? null,
  nutrition: normalizeNutrition(api.nutritionPer100g),
  seasonMonths: api.seasonMonths ?? [],
  benefits: api.benefits ?? [],
  prepTip: api.prepTip ?? null,
  substitutes: parseSlashList(api.substitutes),
});
