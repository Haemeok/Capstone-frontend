import { appGlobal as en } from "./messages/en/appGlobal";
import { appGlobal as ja } from "./messages/ja/appGlobal";
import { appGlobal as ko } from "./messages/ko/appGlobal";
import type { AppGlobalDict, Locale } from "./types";

export const appGlobalMessages: Record<Locale, AppGlobalDict> = { ko, ja, en };
