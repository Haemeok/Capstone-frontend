import type { PublicCurationArticleDto } from "@/features/curation/model/api.server";

import type { CurationBlogJsonLd } from "./curationBlogPost.schema";

export const buildCurationJsonLd = (
  article: PublicCurationArticleDto,
  recipeTitles: Map<string, string>
): CurationBlogJsonLd => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: article.title,
  description: article.description ?? undefined,
  itemListElement: article.recipeIds.map((id, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `https://recipio.kr/recipes/${id}`,
    name: recipeTitles.get(id) ?? id,
  })),
});
