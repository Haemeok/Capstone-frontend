import type { RecipeCookingRecordCreateInput } from "@/entities/recipe/model/record";

type RecipeCookingRecordDraft = {
  recipeId: string;
  review: string;
  isPublic: boolean;
};

export const toRecipeCookingRecordInput = ({
  recipeId,
  review,
  isPublic,
}: RecipeCookingRecordDraft): RecipeCookingRecordCreateInput => {
  const content = review.trim();

  return {
    sourceType: "RECIPE",
    recipeId,
    ...(content ? { recordMemo: content } : {}),
    ...(isPublic && content ? { reviewContent: content } : {}),
    publishReview: isPublic,
  };
};
