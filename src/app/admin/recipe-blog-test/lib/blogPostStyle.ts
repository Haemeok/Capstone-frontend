export type LeadSeed = {
  id: string;
  hint: string;
};

export const LEAD_SEEDS: LeadSeed[] = [
  {
    id: "season",
    hint: "리드 첫 문장을 계절 또는 절기 컨텍스트로 시작하라. 메뉴명을 그 문장 안에 자연스럽게 박아라. 예: '늦가을 무는 단맛이 깊어지는 시기로, 이때의 무로 끓이는 ○○은 국물의 결이 다릅니다.'",
  },
  {
    id: "tableSeat",
    hint: "리드 첫 문장을 메뉴가 한국 가정 식탁에서 차지하는 자리로 시작하라. 예: '○○은 평일 저녁상에서 가장 자주 오르는 한 그릇 중 하나입니다.'",
  },
  {
    id: "ingredientNature",
    hint: "리드 첫 문장을 메뉴의 핵심 재료의 본성에서 시작하라. 예: '콩나물은 수분이 90%에 가까운 채소로, 익히는 시간보다 식히는 시간이 식감을 결정합니다.'",
  },
  {
    id: "traditionVariation",
    hint: "리드 첫 문장을 메뉴의 원형과 가정 변형의 차이에서 시작하라. 예: '원래 ○○은 ~로 끓이는 음식이지만, 가정에서는 ~로 줄여 잡는 편이 일반적입니다.'",
  },
];

export type ClosingSeed = {
  id: string;
  hint: string;
};

export const CLOSING_SEEDS: ClosingSeed[] = [
  {
    id: "menuSeat",
    hint: "메뉴가 가정 식탁에서 차지하는 자리를 평서형으로 한 번 더 짚으며 닫으라. 예: '○○은 결국 평일 저녁의 가장 단단한 자리입니다.'",
  },
  {
    id: "ingredientReturn",
    hint: "메뉴의 핵심 재료의 본성으로 회귀하며 닫으라. 예: '○○은 결국 시간을 들이지 않는 채소입니다.'",
  },
  {
    id: "seasonReturn",
    hint: "계절감으로 회귀하며 닫으라. 사람·인물 묘사 금지.",
  },
  {
    id: "tableImage",
    hint: "구체적인 식탁 풍경 한 컷으로 닫으라. 사람을 묘사하지 말고, 그릇과 곁들이 위주로.",
  },
  {
    id: "plainStatement",
    hint: "수식 없는 단문 평서로 닫으라. 한 줄, 길어도 두 줄.",
  },
];

export const CANONICAL_TERMS: Record<string, string> = {
  "마늘 다진것": "다진 마늘",
  "마늘다진것": "다진 마늘",
  "다진마늘": "다진 마늘",
  강불: "센 불",
  고불: "센 불",
  "강한 불": "센 불",
  "약한 불": "약불",
  "중간 불": "중불",
  큰술: "T",
  스푼: "T",
  Tbsp: "T",
  tbsp: "T",
  작은술: "t",
  tsp: "t",
  그램: "g",
  그람: "g",
  리터: "L",
  밀리리터: "ml",
};

export const pickSeedByRecipeId = <T>(seeds: readonly T[], recipeId: string): T => {
  let h = 0;
  for (let i = 0; i < recipeId.length; i++) {
    h = (h * 31 + recipeId.charCodeAt(i)) >>> 0;
  }
  return seeds[h % seeds.length];
};
