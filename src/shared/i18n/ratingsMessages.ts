import { ratings as en } from "./messages/en/ratings";
import { ratings as ja } from "./messages/ja/ratings";
import { ratings as ko } from "./messages/ko/ratings";
import type { Locale, RatingsDict } from "./types";

export const ratingsMessages: Record<Locale, RatingsDict> = { ko, ja, en };
