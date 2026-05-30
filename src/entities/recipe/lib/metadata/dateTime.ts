/** Normalize a backend datetime to ISO 8601 with timezone (Google requires an offset). */
export const toIso8601 = (value?: string | null): string => {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};
