const parseQuantity = (quantity: string): number | null => {
  const trimmed = quantity.trim();

  if (trimmed === "약간" || trimmed === "") {
    return null;
  }

  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const numerator = parseInt(mixedMatch[2], 10);
    const denominator = parseInt(mixedMatch[3], 10);
    return whole + numerator / denominator;
  }
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1], 10);
    const denominator = parseInt(fractionMatch[2], 10);
    return numerator / denominator;
  }

  const number = parseFloat(trimmed);
  if (!isNaN(number)) {
    return number;
  }

  return null;
};

const formatQuantity = (value: number): string => {
  const fractions = [
    { value: 0.125, text: "1/8" },
    { value: 0.25, text: "1/4" },
    { value: 0.333, text: "1/3" },
    { value: 0.5, text: "1/2" },
    { value: 0.667, text: "2/3" },
    { value: 0.75, text: "3/4" },
  ];

  const tolerance = 0.01;

  const whole = Math.floor(value);
  const decimal = value - whole;

  if (decimal < tolerance) {
    return whole.toString();
  }

  for (const fraction of fractions) {
    if (Math.abs(decimal - fraction.value) < tolerance) {
      return whole > 0 ? `${whole} ${fraction.text}` : fraction.text;
    }
  }

  return value.toFixed(1).replace(/\.0$/, "");
};

export const convertIngredientQuantity = (
  quantity: string | undefined,
  servingRatio: number
): string => {
  if (!quantity) {
    return "";
  }

  const parsed = parseQuantity(quantity);

  if (parsed === null) {
    return quantity;
  }

  const scaled = parsed * servingRatio;
  return formatQuantity(scaled);
};
