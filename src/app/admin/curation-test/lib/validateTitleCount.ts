export type ValidateTitleCountInput = {
  h1: string;
  dek: string;
  expected: number;
};

export type ValidateTitleCountResult =
  | { ok: true }
  | { ok: false; errors: string[] };

// 주의: `\b` 는 ASCII 단어 경계이고 한글은 \w 가 아니다. 따라서 한글 단위
// (선/가지/개/편/추천/모음) 뒤에 `\b` 를 붙이면 의도와 달리 매치가 깨진다.
// 단위 자체가 명시 리터럴이므로 boundary 없이 매치 — false-positive (예: "가지런히")
// 위험은 매거진 헤드라인 도메인에서 거의 없다.
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
      `h1 에 본문 레시피 개수와 다른 숫자가 등장: ${h1Mismatches.join(", ")} (expected ${expected})`,
    );
  }
  const dekMismatches = findMismatchedNumbers(dek, expected);
  if (dekMismatches.length > 0) {
    errors.push(
      `dek 에 본문 레시피 개수와 다른 숫자가 등장: ${dekMismatches.join(", ")} (expected ${expected})`,
    );
  }
  return errors.length === 0 ? { ok: true } : { ok: false, errors };
};
