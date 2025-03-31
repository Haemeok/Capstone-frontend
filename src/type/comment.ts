import { User } from "./user";

export type Comment = {
  id: number;
  content: string;
  date: string;
  user: {
    name: string;
    imageURL: string;
  };
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
};
