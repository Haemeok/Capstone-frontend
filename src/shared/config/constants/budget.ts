export const BUDGET_MIN = 3000;
export const BUDGET_MAX = 20000;
export const BUDGET_DEFAULT = 5000;
export const BUDGET_STEP = 1000;

export const AVERAGE_MEAL_PRICE = 8000;

type CategoryOption = {
  id: string;
  label: string;
  image: string;
  value: string;
};

export const BUDGET_CATEGORIES: Record<number, CategoryOption[]> = {
  3000: [
    { id: "noodle", label: "면 요리가 땡겨요", image: "noodle_craving.webp", value: "면요리" },
    {
      id: "simple",
      label: "가볍게 먹고 싶어",
      image: "diet_light.webp",
      value: "간단한 식사",
    },
    {
      id: "any",
      label: "아무거나 상관없어",
      image: "random.webp",
      value: "상관없음",
    },
  ],
  5000: [
    { id: "meat", label: "고기 없인 못 살아", image: "meat_lover.webp", value: "고기요리" },
    { id: "noodle", label: "면 요리가 땡겨요", image: "noodle_craving.webp", value: "면요리" },
    { id: "rice", label: "밥심으로 산다", image: "rice_main.webp", value: "밥요리" },
    { id: "simple", label: "가볍게 먹고 싶어", image: "diet_light.webp", value: "간단한 식사" },
    {
      id: "any",
      label: "아무거나 상관없어",
      image: "random.webp",
      value: "상관없음",
    },
  ],
  10000: [
    { id: "meat", label: "고기 없인 못 살아", image: "meat_lover.webp", value: "고기요리" },
    { id: "noodle", label: "면 요리가 땡겨요", image: "noodle_craving.webp", value: "면요리" },
    { id: "rice", label: "밥심으로 산다", image: "rice_main.webp", value: "밥요리" },
    { id: "healthy", label: "관리하는 날", image: "diet_light.webp", value: "건강요리" },
    {
      id: "any",
      label: "아무거나 상관없어",
      image: "random.webp",
      value: "상관없음",
    },
  ],
  15000: [
    { id: "meat", label: "고기 없인 못 살아", image: "meat_lover.webp", value: "고기요리" },
    {
      id: "seafood",
      label: "해산물 없인 못 살아",
      image: "seafood.webp",
      value: "해산물요리",
    },
    { id: "alcohol", label: "홈술/안주", image: "drinking_snacks.webp", value: "술안주" },
    {
      id: "any",
      label: "아무거나 상관없어",
      image: "random.webp",
      value: "상관없음",
    },
  ],
};

export const getCategoriesForBudget = (budget: number): CategoryOption[] => {
  if (budget < 5000) return BUDGET_CATEGORIES[3000];
  if (budget < 10000) return BUDGET_CATEGORIES[5000];
  if (budget < 15000) return BUDGET_CATEGORIES[10000];
  return BUDGET_CATEGORIES[15000];
};
