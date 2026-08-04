import { OFFICIAL_ACCOUNT_ID } from "@/shared/config/constants/account";
import type { Locale } from "@/shared/i18n";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import type { YoutubeMetadata } from "./youtube";

export const TITLE_BUDGET: Record<Locale, number> = { ko: 25, ja: 25, en: 55 };

const AUTHOR_SUFFIX_JOINER = " by ";
const HANDLE_TOKEN = /[@_]/;

export const normalizeAuthorName = (raw: string): string | null => {
  const tokens = raw.trim().split(/\s+/).filter(Boolean);
  const koreanTokens = tokens.filter((token) => /[가-힣]/.test(token));
  const picked =
    koreanTokens.length > 0
      ? koreanTokens
      : tokens.filter((token) => !HANDLE_TOKEN.test(token));
  const name = picked.join(" ");
  return name.length > 0 ? name : null;
};

export const resolveTitleAuthor = (
  recipe: StaticRecipe,
  youtubeMetadata?: YoutubeMetadata
): string | null => {
  if (youtubeMetadata?.channelName) {
    return normalizeAuthorName(youtubeMetadata.channelName);
  }
  if (!recipe.author?.nickname || recipe.author.id === OFFICIAL_ACCOUNT_ID) {
    return null;
  }
  return normalizeAuthorName(recipe.author.nickname);
};

export const withAuthorSuffix = (
  title: string,
  author: string | null,
  budget: number
): string => {
  if (!author || title.includes(author)) return title;

  const suffixed = `${title}${AUTHOR_SUFFIX_JOINER}${author}`;
  return suffixed.length <= budget ? suffixed : title;
};
