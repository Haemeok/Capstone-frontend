import { User } from './user';

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  author: User;
  likeCount: number;
  replyCount: number;
  likedByCurrentUser: boolean;
};
