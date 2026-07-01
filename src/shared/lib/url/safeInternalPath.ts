export const safeInternalPath = (
  value: string | null | undefined,
  fallback = "/"
): string => {
  if (!value) return fallback;
  if (value[0] !== "/") return fallback;
  if (value[1] === "/" || value[1] === "\\") return fallback;
  return value;
};
