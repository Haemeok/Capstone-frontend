import type { StaticRecipe } from "@/entities/recipe/model/types";

const COMMON_SEASONINGS = new Set([
  "물",
  "정수",
  "소금",
  "천일염",
  "굵은소금",
  "꽃소금",
  "맛소금",
  "설탕",
  "백설탕",
  "황설탕",
  "흑설탕",
  "식용유",
  "카놀라유",
  "포도씨유",
  "해바라기유",
  "후추",
  "통후추",
  "마늘",
  "다진마늘",
  "생강",
  "다진생강",
  "대파",
  "쪽파",
  "양파",
  "통깨",
  "깨소금",
  "참깨",
  "간장",
  "진간장",
  "국간장",
  "양조간장",
  "맛술",
  "미림",
  "청주",
  "소주",
  "물엿",
  "올리고당",
  "식초",
  "고춧가루",
]);

const compact = (value: string): string => value.trim().replace(/\s+/g, "");
const SHORT_TITLE_INGREDIENTS = new Set(["밥", "닭", "쌀", "면"]);

const classify = (value: string): string =>
  compact(value).replace(/\([^)]*\)/g, "");

const isAlreadyInTitle = (title: string, ingredientName: string): boolean => {
  const compactTitle = compact(title);
  const compactName = compact(ingredientName);
  const withoutNoodleSuffix = compactName.endsWith("면")
    ? compactName.slice(0, -1)
    : compactName;
  const hasDirectTitleMatch =
    (compactName.length >= 2 || SHORT_TITLE_INGREDIENTS.has(compactName)) &&
    compactTitle.includes(compactName);
  const hasIngredientTokenMatch = ingredientName
    .trim()
    .split(/\s+/)
    .map(compact)
    .some(
      (token) =>
        (token.length >= 2 || SHORT_TITLE_INGREDIENTS.has(token)) &&
        compactTitle.includes(token)
    );

  return (
    hasDirectTitleMatch ||
    hasIngredientTokenMatch ||
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

    if (COMMON_SEASONINGS.has(classify(name))) continue;
    if (isAlreadyInTitle(recipe.title, name)) continue;

    return name;
  }

  return null;
};
