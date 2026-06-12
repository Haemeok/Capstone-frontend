import { en } from "./messages/en";
import { ja } from "./messages/ja";
import { ko } from "./messages/ko";
import type { Dictionary, Locale } from "./types";

const DICTIONARIES: Record<Locale, Dictionary> = { ko, ja, en };

export const getDictionary = (locale: Locale): Dictionary =>
  DICTIONARIES[locale];
