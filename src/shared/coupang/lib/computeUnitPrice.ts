export type UnitPriceResult = { base: string; unitPrice: number };

const MEASURE_RE = /(\d+(?:\.\d+)?)\s*(kg|g|ml|l|cm|m)(?![a-z])/i;
const COUNT_RE = /(\d+)\s*(개입|개|구|입|매|장|포|팩|봉|단|알|미|마리|줄)/;
const MULT_RE = /[x×*]\s*(\d+)/i;

type Kind = "weight" | "volume" | "length";

const kindOf = (unit: string): { kind: Kind; toBase: number } => {
  switch (unit.toLowerCase()) {
    case "kg":
      return { kind: "weight", toBase: 1000 };
    case "g":
      return { kind: "weight", toBase: 1 };
    case "l":
      return { kind: "volume", toBase: 1000 };
    case "ml":
      return { kind: "volume", toBase: 1 };
    case "m":
      return { kind: "length", toBase: 100 };
    case "cm":
    default:
      return { kind: "length", toBase: 1 };
  }
};

export const computeUnitPrice = (
  name: string,
  price: number
): UnitPriceResult | null => {
  const measure = MEASURE_RE.exec(name);

  if (measure) {
    const value = Number(measure[1]);
    const { kind, toBase } = kindOf(measure[2]);

    const explicitMult = MULT_RE.exec(name);
    const packMult = COUNT_RE.exec(name);
    const multiplier = explicitMult
      ? Number(explicitMult[1])
      : packMult
        ? Number(packMult[1])
        : 1;

    const total = value * toBase * multiplier;

    if (kind === "length") {
      const baseAmount = total >= 100 ? 100 : 10;
      const base = total >= 100 ? "1m" : "10cm";
      return { base, unitPrice: Math.round((price / total) * baseAmount) };
    }

    const baseAmount = total >= 100 ? 100 : 10;
    const suffix = kind === "weight" ? "g" : "ml";
    const base = `${baseAmount}${suffix}`;
    return { base, unitPrice: Math.round((price / total) * baseAmount) };
  }

  const count = COUNT_RE.exec(name);
  if (count) {
    const total = Number(count[1]);
    return { base: "1개", unitPrice: Math.round(price / total) };
  }

  return null;
};
