// AI prompt에 "이 큐레이션의 공통 재료"를 명시적으로 박기 위한 헬퍼.
// ingredientIds(예: "NjeW51wD")는 모델 입장에서 의미 없는 토큰이라,
// 모델이 레시피 제목에서 임의로 테마를 추론(2/5가 토마토면 "토마토 큐레이션"으로 환각)한다.
// 실제 recipe.ingredients를 교차해 모든 레시피에 등장하는 재료를 뽑아 그대로 prompt에 주입한다.

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
