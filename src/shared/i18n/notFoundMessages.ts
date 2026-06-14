import { notFound as en } from "./messages/en/search";
import { notFound as ja } from "./messages/ja/search";
import { notFound as ko } from "./messages/ko/search";
import type { Locale, NotFoundDict } from "./types";

export const notFoundMessages: Record<Locale, NotFoundDict> = { ko, ja, en };
