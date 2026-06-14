import { settings as en } from "./messages/en/settings";
import { settings as ja } from "./messages/ja/settings";
import { settings as ko } from "./messages/ko/settings";
import type { Locale, SettingsDict } from "./types";

export const settingsMessages: Record<Locale, SettingsDict> = { ko, ja, en };
