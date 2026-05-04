import {
  DEFAULT_CURATION_CATEGORY,
  isCurationCategory,
  type SavedCurationRecord,
} from "@/entities/curation";
import type { StaticRecipe } from "@/entities/recipe/model/types";

import type { PublicCurationArticleDto } from "./api.server";

export const resolveCoverUrl = (
  _coverImageKey: string | null,
  recipes: Array<StaticRecipe | null>,
): string => recipes.find((r) => r?.imageUrl)?.imageUrl ?? "";

export const toSavedRecord = (
  api: PublicCurationArticleDto,
  recipes: Array<StaticRecipe | null>,
): SavedCurationRecord => ({
  slug: api.slug,
  h1: api.title,
  dek: api.description ?? "",
  markdown: api.contentMdx,
  recipeIds: api.recipeIds,
  toneSeed: "editorial",
  thumbnailUrl: resolveCoverUrl(api.coverImageKey, recipes),
  provider: "grok",
  category: isCurationCategory(api.category)
    ? api.category
    : DEFAULT_CURATION_CATEGORY,
  coverImageKey: api.coverImageKey,
  savedAt: api.publishedAt,
});
