export const TITLE = { MIN: 5, MAX: 30 };
export const IMAGE = {
  MAX_MB: 5,
  MIME: /^image\/(png|jpe?g|webp|gif|avif)$/i,
};
export const SERVINGS = { MIN: 1 };
export const COOKING_TIME = { MIN: 1 };
export const DESCRIPTION = { MIN: 10 };
export const INGREDIENTS = { MIN: 1 };
export const STEPS = { MIN: 1 };

export const UNITLESS_QUANTITIES = ["약간", "적당량"] as const;

export const isUnitlessQuantity = (quantity: string): boolean =>
  (UNITLESS_QUANTITIES as readonly string[]).includes(quantity);
