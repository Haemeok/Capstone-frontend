import { category as en } from "./messages/en/category";
import { category as ja } from "./messages/ja/category";
import { category as ko } from "./messages/ko/category";
import type { CategoryDict, Locale } from "./types";

export const categoryMessages: Record<Locale, CategoryDict> = { ko, ja, en };
