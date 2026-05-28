
type IngredientLite = {
  id?: string;
  name: string;
};

type RecipeLite = {
  ingredients?: IngredientLite[];
};

export const findCommonIngredientNames = (
  recipes: RecipeLite[],
): string[] => {
  if (recipes.length === 0) return [];

  // id 기반 교차. id가 없으면 name으로 fallback.
  const counts = new Map<string, { name: string; count: number }>();
  for (const r of recipes) {
    const seen = new Set<string>();
    for (const ing of r.ingredients ?? []) {
      const key = ing.id ?? ing.name;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { name: ing.name, count: 1 });
    }
  }

  return Array.from(counts.values())
    .filter((e) => e.count === recipes.length)
    .map((e) => e.name);
};
