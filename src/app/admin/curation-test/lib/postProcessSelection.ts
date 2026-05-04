export const postProcessSelection = (
  raw: number[] | undefined | null,
  count: number,
  poolSize: number,
): number[] => {
  const target = Math.min(count, poolSize);
  const result: number[] = [];
  const seen = new Set<number>();

  for (const i of raw ?? []) {
    if (result.length >= target) break;
    if (Number.isInteger(i) && i >= 0 && i < poolSize && !seen.has(i)) {
      seen.add(i);
      result.push(i);
    }
  }

  for (let i = 0; result.length < target && i < poolSize; i++) {
    if (!seen.has(i)) {
      seen.add(i);
      result.push(i);
    }
  }

  return result;
};
