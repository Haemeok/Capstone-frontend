import { comments as en } from "./messages/en/comments";
import { comments as ja } from "./messages/ja/comments";
import { comments as ko } from "./messages/ko/comments";
import type { CommentsDict, Locale } from "./types";

export const commentsMessages: Record<Locale, CommentsDict> = { ko, ja, en };
