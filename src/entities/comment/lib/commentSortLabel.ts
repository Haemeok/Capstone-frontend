import type { CommentsDict } from "@/shared/i18n";

export const COMMENT_SORT_STATES = ["최신순", "인기순"] as const;
export type CommentSortState = (typeof COMMENT_SORT_STATES)[number];

export const resolveCommentSortLabel = (
  sort: CommentSortState,
  labels: CommentsDict["sort"]
): string => (sort === "최신순" ? labels.latest : labels.popular);
