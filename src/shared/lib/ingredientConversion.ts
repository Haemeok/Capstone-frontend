const SMALL_SPOON_TO_BIG_SPOON_THRESHOLD = 3;
const BIG_SPOON_TO_ML_THRESHOLD = 10;
const BIG_SPOON_TO_ML_RATIO = 15;
const SMALL_SPOON_TO_BIG_SPOON_RATIO = 3;

type ConvertedIngredient = {
  quantity: string;
  unit: string;
};

type Fraction = { n: number; d: number };

const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
};

const reduce = (f: Fraction): Fraction => {
  const g = gcd(f.n, f.d);
  return { n: f.n / g, d: f.d / g };
};

const multiplyFraction = (a: Fraction, b: Fraction): Fraction =>
  reduce({ n: a.n * b.n, d: a.d * b.d });

const fractionToNumber = (f: Fraction): number => f.n / f.d;

const parseQuantity = (str: string): Fraction | null => {
  const mixed = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const d = parseInt(mixed[3], 10);
    if (d === 0) return null;
    return reduce({
      n: parseInt(mixed[1], 10) * d + parseInt(mixed[2], 10),
      d,
    });
  }
  const simple = str.match(/^(\d+)\/(\d+)$/);
  if (simple) {
    const d = parseInt(simple[2], 10);
    if (d === 0) return null;
    return reduce({ n: parseInt(simple[1], 10), d });
  }
  const num = parseFloat(str);
  if (isNaN(num)) return null;
  if (Number.isInteger(num)) return { n: num, d: 1 };
  const decimals = str.split(".")[1]?.length ?? 0;
  const d = Math.pow(10, decimals);
  return reduce({ n: Math.round(num * d), d });
};

// servings are bounded small integers (1–20), so any ratio = a/b is recoverable
const numberToFraction = (n: number): Fraction => {
  if (Number.isInteger(n)) return { n, d: 1 };
  for (let d = 2; d <= 1000; d++) {
    const num = Math.round(n * d);
    if (Math.abs(num / d - n) < 1e-9) return reduce({ n: num, d });
  }
  return reduce({ n: Math.round(n * 1e6), d: 1e6 });
};

const formatFraction = (f: Fraction): string => {
  if (f.d === 1) return f.n.toString();
  const whole = Math.floor(f.n / f.d);
  const remainder = f.n - whole * f.d;
  if (whole === 0) return `${remainder}/${f.d}`;
  return `${whole} ${remainder}/${f.d}`;
};

const formatDecimal = (n: number): string => {
  if (Math.abs(n - Math.round(n)) < 1e-9) return Math.round(n).toString();
  return n.toFixed(2).replace(/\.?0+$/, "");
};

const convertUnitIfNeeded = (
  value: Fraction,
  unit: string
): { value: Fraction; unit: string } => {
  let currentValue = value;
  let currentUnit = unit;

  if (
    currentUnit === "작은술" &&
    fractionToNumber(currentValue) >= SMALL_SPOON_TO_BIG_SPOON_THRESHOLD
  ) {
    currentValue = multiplyFraction(currentValue, {
      n: 1,
      d: SMALL_SPOON_TO_BIG_SPOON_RATIO,
    });
    currentUnit = "큰술";
  }

  if (
    currentUnit === "큰술" &&
    fractionToNumber(currentValue) >= BIG_SPOON_TO_ML_THRESHOLD
  ) {
    currentValue = multiplyFraction(currentValue, {
      n: BIG_SPOON_TO_ML_RATIO,
      d: 1,
    });
    currentUnit = "ml";
  }

  return { value: currentValue, unit: currentUnit };
};

export const convertIngredientQuantity = (
  quantity: string | undefined,
  unit: string,
  servingRatio: number
): ConvertedIngredient => {
  if (!quantity || quantity.trim() === "") {
    return { quantity: "", unit };
  }

  const trimmed = quantity.trim();
  if (trimmed === "약간") {
    return { quantity: "약간", unit };
  }

  const parsed = parseQuantity(trimmed);
  if (!parsed) {
    return { quantity, unit };
  }

  const isFractionInput = trimmed.includes("/");
  const scaled = multiplyFraction(parsed, numberToFraction(servingRatio));
  const { value, unit: convertedUnit } = convertUnitIfNeeded(scaled, unit);

  if (convertedUnit === "ml") {
    return {
      quantity: Math.round(fractionToNumber(value)).toString(),
      unit: convertedUnit,
    };
  }

  return {
    quantity: isFractionInput
      ? formatFraction(value)
      : formatDecimal(fractionToNumber(value)),
    unit: convertedUnit,
  };
};
