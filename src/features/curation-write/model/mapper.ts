import type { GenerateCurationOutput } from "@/entities/curation";

import type { PostCurationArticleRequest } from "./types";

export const mapResultToRequest = (
  result: GenerateCurationOutput,
): PostCurationArticleRequest => ({
  slug: result.slug,
  title: result.h1,
  description: result.dek.trim() === "" ? null : result.dek,
  coverImageKey: result.coverImageKey,
  contentMdx: result.markdown,
  category: result.category,
  generatedBy: result.provider,
  recipeIds: result.recipeIds,
});
