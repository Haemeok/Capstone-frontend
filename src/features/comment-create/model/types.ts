export type CommentImageUploadResponse = {
  uploadKey: string;
  imageKey: string;
  presignedUrl: string;
};

export type PostCommentParams = {
  recipeId: string;
  commentId?: string;
  comment: string;
  imageKeys?: string[];
};

export type CreateCommentMutationParams = Omit<PostCommentParams, "imageKeys"> & {
  file?: File;
};
