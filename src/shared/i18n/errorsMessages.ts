import { errors as en } from "./messages/en/search";
import { errors as ja } from "./messages/ja/search";
import { errors as ko } from "./messages/ko/search";
import type { ErrorsDict, Locale } from "./types";

export const errorsMessages: Record<Locale, ErrorsDict> = { ko, ja, en };
