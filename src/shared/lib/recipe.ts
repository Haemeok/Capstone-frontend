import {
  PRICE_BRACKETS,
  DEFAULT_WEIGHT_KG,
  CALORIE_ACTIVITIES,
  Activity,
} from "../config/constants/recipe";

export const getProductByPrice = (price: number) => {
  const product = PRICE_BRACKETS.find((bracket) => price >= bracket.min);

  if (!product) {
    const defaultProduct = PRICE_BRACKETS[PRICE_BRACKETS.length - 1];
    return defaultProduct;
  }

  return product;
};

export const calculateActivityTime = (
  totalCalories: number,
  activity: Activity
): number => {
  if (totalCalories <= 0 || activity.met <= 0) {
    return 0;
  }

  const timeInMinutes =
    (totalCalories / (activity.met * DEFAULT_WEIGHT_KG)) * 60;

  return Math.round(timeInMinutes);
};

export const getRandomActivity = (): Activity => {
  const randomIndex = Math.floor(Math.random() * CALORIE_ACTIVITIES.length);
  return CALORIE_ACTIVITIES[randomIndex];
};
