export type ValidateTitleCountInput = {
  h1: string;
  dek: string;
  expected: number;
};

export type ValidateTitleCountResult =
  | { ok: true }
  | { ok: false; errors: string[] };

const COUNT_PATTERNS: ReadonlyArray<RegExp> = [
  /(\d+)\s*(?:선|가지|개|편|추천|모음)/g,
  /(?:TOP|BEST)\s*(\d+)\b/gi,
];

const findMismatchedNumbers = (text: string, expected: number): number[] => {
  const found: number[] = [];
  for (const re of COUNT_PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n !== expected) found.push(n);
    }
  }
  return found;
};

export const validateTitleCount = ({
  h1,
  dek,
  expected,
}: ValidateTitleCountInput): ValidateTitleCountResult => {
  const errors: string[] = [];
  const h1Mismatches = findMismatchedNumbers(h1, expected);
  if (h1Mismatches.length > 0) {
    errors.push(
      `h1 에 본문 레시피 개수와 다른 숫자가 등장: ${h1Mismatches.join(", ")} (expected ${expected})`
    );
  }
  const dekMismatches = findMismatchedNumbers(dek, expected);
  if (dekMismatches.length > 0) {
    errors.push(
      `dek 에 본문 레시피 개수와 다른 숫자가 등장: ${dekMismatches.join(", ")} (expected ${expected})`
    );
  }
  return errors.length === 0 ? { ok: true } : { ok: false, errors };
};
