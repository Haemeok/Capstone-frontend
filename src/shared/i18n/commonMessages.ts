import { common as en } from "./messages/en/common";
import { common as ja } from "./messages/ja/common";
import { common as ko } from "./messages/ko/common";
import type { CommonDict, Locale } from "./types";

export const commonMessages: Record<Locale, CommonDict> = { ko, ja, en };
