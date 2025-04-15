import { User } from './user';

export type Comment = {
  id: number;
  content: string;
  date: string;
  user: User;
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
};
