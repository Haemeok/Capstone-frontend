import { PageResponse } from "@/shared/api/types";

import { User } from "@/entities/user";

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  likeCount: number;
  replyCount?: number;
  likedByCurrentUser: boolean;
};

export type CommentsApiResponse = PageResponse<Comment>;

export type RepliesApiResponse = PageResponse<Comment>;
export type TotalRepliesApiResponse = Comment & {
  replies: RepliesApiResponse;
};
