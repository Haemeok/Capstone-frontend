export const buildNextPageUrl = (
  searchParams: Record<string, string | string[] | undefined>,
  nextPage: number,
  basePath: string = "/search/results"
): string => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page" || value === undefined) continue;

    if (Array.isArray(value)) {
      params.set(key, value.join(","));
    } else {
      params.set(key, value);
    }
  }

  params.set("page", String(nextPage));

  return `${basePath}?${params.toString()}`;
};
