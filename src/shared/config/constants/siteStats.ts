const COUNT = {
  ko: "20만",
  ja: "20万",
  en: "200,000",
} as const;

export const TOTAL_RECIPE_COUNT = COUNT;

export const TOTAL_RECIPE_COUNT_LABEL = {
  ko: `${COUNT.ko}+`,
  ja: `${COUNT.ja}+`,
  en: `${COUNT.en}+`,
} as const;

export const TOTAL_RECIPE_COUNT_PHRASE = {
  ko: `${COUNT.ko}개 이상`,
  ja: `${COUNT.ja}品以上`,
  en: `${COUNT.en}+ recipes`,
} as const;
