export type SearchResultsParams = {
  q?: string;
  ingredientIds?: string[] | null;
  dishType?: string | null;
  tags?: string[] | null;
  types?: string[];
  minCost?: number;
  maxCost?: number;
  minCalories?: number;
  maxCalories?: number;
  minCarb?: number;
  maxCarb?: number;
  minProtein?: number;
  maxProtein?: number;
  minFat?: number;
  maxFat?: number;
  minSugar?: number;
  maxSugar?: number;
  minSodium?: number;
  maxSodium?: number;
  sort?: string;
  page?: number;
};

const DEFAULT_TYPES = ["USER", "AI", "YOUTUBE"] as const;

// Canonical insertion order. Mirrors CANONICAL_PARAM_ORDER in
// app/search/results/page.tsx so links and canonical <link> agree.
const PARAM_ORDER: ReadonlyArray<keyof SearchResultsParams> = [
  "q",
  "ingredientIds",
  "dishType",
  "tags",
  "types",
  "minCost",
  "maxCost",
  "minCalories",
  "maxCalories",
  "minCarb",
  "maxCarb",
  "minProtein",
  "maxProtein",
  "minFat",
  "maxFat",
  "minSugar",
  "maxSugar",
  "minSodium",
  "maxSodium",
  "sort",
  "page",
];

const isEmpty = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "string") return value.length === 0;
  return false;
};

export const buildSearchResultsUrl = (
  params: SearchResultsParams,
  options: { defaultTypes?: readonly string[] } = {}
): string => {
  const { defaultTypes = DEFAULT_TYPES } = options;

  const merged: SearchResultsParams = {
    ...params,
    types:
      params.types && params.types.length > 0
        ? params.types
        : [...defaultTypes],
  };

  const search = new URLSearchParams();

  for (const key of PARAM_ORDER) {
    const value = merged[key];
    if (isEmpty(value)) continue;

    if (Array.isArray(value)) {
      search.set(key, value.join(","));
    } else {
      search.set(key, String(value));
    }
  }

  const qs = search.toString();
  return qs ? `/search/results?${qs}` : "/search/results";
};
