import { userPages as en } from "./messages/en/userPages";
import { userPages as ja } from "./messages/ja/userPages";
import { userPages as ko } from "./messages/ko/userPages";
import type { Locale, UserPagesDict } from "./types";

export const userPagesMessages: Record<Locale, UserPagesDict> = { ko, ja, en };
