export type PostCurationArticleRequest = {
  slug: string;
  title: string;
  description: string | null;
  coverImageKey: string | null;
  contentMdx: string;
  category: string;
  generatedBy: string;
  recipeIds: string[];
};

export type PostCurationArticleResponse = {
  articleId: number;
};
