import type { StaticRecipe } from "@/entities/recipe/model/types";

const COMMON_SEASONINGS = new Set([
  "물",
  "소금",
  "설탕",
  "식용유",
  "후추",
  "대파",
]);

const compact = (value: string): string => value.trim().replace(/\s+/g, "");

const isAlreadyInTitle = (title: string, ingredientName: string): boolean => {
  const compactTitle = compact(title);
  const compactName = compact(ingredientName);
  const withoutNoodleSuffix = compactName.endsWith("면")
    ? compactName.slice(0, -1)
    : compactName;

  return (
    compactTitle.includes(compactName) ||
    (withoutNoodleSuffix.length >= 2 &&
      compactTitle.includes(withoutNoodleSuffix))
  );
};

export const selectDistinctiveIngredient = (
  recipe: Pick<StaticRecipe, "title" | "ingredients">
): string | null => {
  const seen = new Set<string>();

  for (const ingredient of recipe.ingredients) {
    const name = ingredient.name.trim().replace(/\s+/g, " ");
    const compactName = compact(name);

    if (!compactName || seen.has(compactName)) continue;
    seen.add(compactName);

    if (COMMON_SEASONINGS.has(compactName)) continue;
    if (isAlreadyInTitle(recipe.title, name)) continue;

    return name;
  }

  return null;
};
