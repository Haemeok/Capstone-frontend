import { search as en } from "./messages/en/search";
import { search as ja } from "./messages/ja/search";
import { search as ko } from "./messages/ko/search";
import type { Locale, SearchDict } from "./types";

export const searchMessages: Record<Locale, SearchDict> = { ko, ja, en };
