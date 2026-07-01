export const parseStoredArray = <T>(
  raw: string | null | undefined,
  isItem: (value: unknown) => value is T
): T[] => {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.every(isItem) ? (parsed as T[]) : [];
};
