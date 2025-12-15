import { AVERAGE_MEAL_PRICE } from "@/shared/config/constants/budget";

export const calculateSavings = (budget: number): number => {
  return Math.max(0, AVERAGE_MEAL_PRICE - budget);
};

export const calculateMonthlySavings = (budget: number): number => {
  const dailySavings = calculateSavings(budget);
  return dailySavings * 30;
};

export const getSavingsMessage = (budget: number): string => {
  const savings = calculateSavings(budget);

  if (savings <= 0) {
    return "직장인 평균 한끼 예산이에요";
  }

  const monthlySavings = calculateMonthlySavings(budget);

  return `직장인 평균 한끼보다 ${savings.toLocaleString()}원 절약해요!\n매일 이렇게 드시면 한 달에 ${Math.floor(monthlySavings / 10000)}만 원 아껴요`;
};
