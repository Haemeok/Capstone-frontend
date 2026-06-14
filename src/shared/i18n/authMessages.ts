import { auth as en } from "./messages/en/auth";
import { auth as ja } from "./messages/ja/auth";
import { auth as ko } from "./messages/ko/auth";
import type { AuthDict, Locale } from "./types";

export const authMessages: Record<Locale, AuthDict> = { ko, ja, en };
