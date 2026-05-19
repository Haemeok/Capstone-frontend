import { PageResponse } from "@/shared/api/types";

import { User } from "@/entities/user";

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  likeCount: number;
  replyCount?: number;
  likedByCurrentUser: boolean;
  imageUrls?: string[];
};

export type CommentsApiResponse = PageResponse<Comment>;

export type RepliesApiResponse = PageResponse<Comment>;
export type TotalRepliesApiResponse = Comment & {
  replies: RepliesApiResponse;
};
