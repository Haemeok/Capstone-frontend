import { nav as en } from "./messages/en/nav";
import { nav as ja } from "./messages/ja/nav";
import { nav as ko } from "./messages/ko/nav";
import type { Locale, NavDict } from "./types";

export const navMessages: Record<Locale, NavDict> = { ko, ja, en };
