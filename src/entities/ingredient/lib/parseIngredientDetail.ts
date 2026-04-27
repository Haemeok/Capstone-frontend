import type {
  IngredientDetailApiResponse,
  IngredientDetailView,
} from "../model/types";

const parseSlashList = (raw: string | null): string[] => {
  if (!raw) return [];
  return raw
    .split("/")
    .map((piece) => piece.trim())
    .filter((piece) => piece.length > 0);
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
});
