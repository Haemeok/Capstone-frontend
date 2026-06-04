import type { RecipeSource } from "../model/types";
import { isYoutubeRecipe } from "./visibility";

type GridItemAuthorInput = {
  authorId: string;
  authorName: string;
  profileImage: string;
  source?: RecipeSource | null;
  youtubeExtractorId?: string;
  youtubeExtractorName?: string;
  youtubeExtractorProfileImage?: string;
};

type GridItemAuthor = {
  authorId: string;
  authorName: string;
  profileImage: string;
};

export const getGridItemAuthor = (
  recipe: GridItemAuthorInput
): GridItemAuthor => {
  if (isYoutubeRecipe(recipe) && recipe.youtubeExtractorName) {
    return {
      authorId: recipe.youtubeExtractorId ?? recipe.authorId,
      authorName: recipe.youtubeExtractorName,
      profileImage: recipe.youtubeExtractorProfileImage ?? recipe.profileImage,
    };
  }

  return {
    authorId: recipe.authorId,
    authorName: recipe.authorName,
    profileImage: recipe.profileImage,
  };
};
