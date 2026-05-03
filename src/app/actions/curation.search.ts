"use server";

import { END_POINTS } from "@/shared/config/constants/api";

export const searchRecipeIds = async (
  params: Record<string, string | number>,
  opts: { limit: number },
): Promise<string[]> => {
  const qs = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
    limit: String(opts.limit),
    youtubeOnly: "true",
  });
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}${END_POINTS.RECIPE_SEARCH}?${qs}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`searchRecipeIds failed: ${res.status}`);
  const json = (await res.json()) as {
    ids?: string[];
    data?: Array<{ id: string }>;
  };
  return json.ids ?? json.data?.map((r) => r.id) ?? [];
};
