import { youtube as en } from "./messages/en/youtube";
import { youtube as ja } from "./messages/ja/youtube";
import { youtube as ko } from "./messages/ko/youtube";
import type { Locale, YoutubeDict } from "./types";

export const youtubeMessages: Record<Locale, YoutubeDict> = { ko, ja, en };
