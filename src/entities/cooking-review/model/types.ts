export type CookingReviewImage = {
  url: string;
};

export type CookingReviewImageRequest = {
  originalKey: string;
};

export type PublicCookingReview = {
  reviewId: string;
  nickname: string;
  profileImageUrl: string | null;
  content: string;
  images: CookingReviewImage[];
  createdAt: string;
  mine: boolean;
};

export type PublicCookingReviewsResponse = {
  totalCount: number;
  items: PublicCookingReview[];
  hasNext: boolean;
};

export type CookingReviewPublicationStatus = "PUBLISHED" | "PRIVATE";

export type CookingReviewModerationStatus = "VISIBLE" | "HIDDEN";

export type MyCookingReview = {
  reviewId: string;
  recipeId: string;
  recipeTitle: string;
  sourceRecordId: string | null;
  content: string | null;
  imageUrl: string | null;
  publicationStatus: CookingReviewPublicationStatus;
  moderationStatus: CookingReviewModerationStatus;
  createdAt: string;
  updatedAt: string;
};

export type MyCookingReviewsResponse = {
  items: MyCookingReview[];
  hasNext: boolean;
};

export type CookingReviewMessageResponse = {
  message: string;
};
