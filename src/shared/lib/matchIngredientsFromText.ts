import { IngredientItem } from "@/entities/ingredient";

const KOREAN_PARTICLES =
  /^(?:을|를|에|과|와|도|만|이|의|은|는|으로|로|에서|까지|부터|이랑|랑|하고|에다|다가)/;
const SEPARATORS = /^[\s,.)]/;

/**
 * step.instruction 텍스트에서 레시피 재료 목록을 매칭하여 반환한다.
 * - 긴 재료명부터 우선 매칭 (대파 > 파)
 * - 매칭된 부분은 마스킹하여 중복 매칭 방지
 * - 재료명 뒤에 조사·공백·쉼표·문장끝이 와야 매칭 (물기, 파프리카 등 오탐 방지)
 */
export const matchIngredientsFromText = (
  instruction: string,
  recipeIngredients: Omit<IngredientItem, "inFridge">[]
): Omit<IngredientItem, "inFridge">[] => {
  const sorted = [...recipeIngredients].sort(
    (a, b) => b.name.length - a.name.length
  );

  const matched: Omit<IngredientItem, "inFridge">[] = [];
  let masked = instruction;

  for (const ingredient of sorted) {
    const { name } = ingredient;
    if (name.length === 0) continue;

    let searchFrom = 0;
    let found = false;

    while (searchFrom < masked.length) {
      const idx = masked.indexOf(name, searchFrom);
      if (idx === -1) break;

      const afterIdx = idx + name.length;
      const afterText = masked.slice(afterIdx);

      const isEndOfText = afterText.length === 0;
      const startsWithParticle = KOREAN_PARTICLES.test(afterText);
      const startsWithSeparator = SEPARATORS.test(afterText);

      if (isEndOfText || startsWithParticle || startsWithSeparator) {
        found = true;
        masked =
          masked.slice(0, idx) +
          "□".repeat(name.length) +
          masked.slice(afterIdx);
        break;
      }

      searchFrom = afterIdx;
    }

    if (found) {
      matched.push(ingredient);
    }
  }

  return matched;
};
