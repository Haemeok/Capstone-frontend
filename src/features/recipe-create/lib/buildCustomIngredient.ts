import { IngredientPayload } from "@/entities/ingredient";

export const buildCustomIngredient = (
  name: string,
  existingNames: Set<string>
): IngredientPayload | null => {
  const trimmed = name.trim();
  if (!trimmed) return null;
  if (existingNames.has(trimmed)) return null;
  return { id: "", name: trimmed, quantity: "", unit: "" };
};
