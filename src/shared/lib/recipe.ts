import { PRICE_BRACKETS } from "../config/constants/recipe";

export const getProductByPrice = (price: number) => {
  const product = PRICE_BRACKETS.find((bracket) => price >= bracket.min);

  if (!product) {
    const defaultProduct = PRICE_BRACKETS[PRICE_BRACKETS.length - 1];
    return defaultProduct;
  }

  return product;
};
