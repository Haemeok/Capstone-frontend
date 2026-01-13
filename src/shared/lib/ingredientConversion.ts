const TOLERANCE = 0.01;
const SMALL_SPOON_TO_BIG_SPOON_THRESHOLD = 3;
const BIG_SPOON_TO_ML_THRESHOLD = 10;
const BIG_SPOON_TO_ML_RATIO = 15;
const SMALL_SPOON_TO_BIG_SPOON_RATIO = 3;

type ConvertedIngredient = {
  quantity: string;
  unit: string;
};

const formatDecimalToString = (value: number): string => {
  const whole = Math.floor(value);
  const decimal = value - whole;

  if (decimal < TOLERANCE) {
    return whole.toString();
  }

  return value.toFixed(2).replace(/\.?0+$/, "");
};

const convertUnitIfNeeded = (
  quantity: number,
  unit: string
): { quantity: number; unit: string } => {
  let convertedQuantity = quantity;
  let convertedUnit = unit;

  if (unit === "작은술" && quantity >= SMALL_SPOON_TO_BIG_SPOON_THRESHOLD) {
    convertedQuantity = quantity / SMALL_SPOON_TO_BIG_SPOON_RATIO;
    convertedUnit = "큰술";
  }

  if (convertedUnit === "큰술" && convertedQuantity >= BIG_SPOON_TO_ML_THRESHOLD) {
    convertedQuantity = convertedQuantity * BIG_SPOON_TO_ML_RATIO;
    convertedUnit = "ml";
  }

  return { quantity: convertedQuantity, unit: convertedUnit };
};

export const convertIngredientQuantity = (
  quantity: string | undefined,
  unit: string,
  servingRatio: number
): ConvertedIngredient => {
  if (!quantity || quantity.trim() === "") {
    return { quantity: "", unit };
  }

  const trimmedQuantity = quantity.trim();

  if (trimmedQuantity === "약간") {
    return { quantity: "약간", unit };
  }

  const parsedQuantity = parseFloat(trimmedQuantity);

  if (isNaN(parsedQuantity)) {
    return { quantity, unit };
  }

  const scaledQuantity = parsedQuantity * servingRatio;
  const { quantity: convertedQuantity, unit: convertedUnit } = convertUnitIfNeeded(scaledQuantity, unit);

  const formattedQuantity =
    convertedUnit === "ml"
      ? Math.round(convertedQuantity).toString()
      : formatDecimalToString(convertedQuantity);

  return { quantity: formattedQuantity, unit: convertedUnit };
};
