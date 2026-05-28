"use server";

import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";
import { requireAdminAction } from "@/shared/lib/admin-guard";

const ARRAY_KEYS = new Set(["ingredientIds", "tags"]);

const normalizeApiParams = (
  params: Record<string, string | number>,
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (ARRAY_KEYS.has(k) && typeof v === "string") {
      out[k] = [v];
    } else {
      out[k] = v;
    }
  }
  return out;
};

export const searchRecipeIds = async (
  params: Record<string, string | number>,
  opts: { limit: number },
): Promise<string[]> => {
  await requireAdminAction();

  const apiParams = {
    ...normalizeApiParams(params),
    size: opts.limit,
    types: ["YOUTUBE"],
  };
  const res = await api.get<{
    content?: Array<{ id: string }>;
    ids?: string[];
    data?: Array<{ id: string }>;
  }>(END_POINTS.RECIPE_SEARCH, { params: apiParams });

  return (
    res.ids ??
    res.content?.map((r) => r.id) ??
    res.data?.map((r) => r.id) ??
    []
  );
};
