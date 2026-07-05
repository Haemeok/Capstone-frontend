import { TOTAL_RECIPE_COUNT } from "@/shared/config/constants/siteStats";
import type { Locale, TranslatedLocale } from "@/shared/i18n/types";

export const OFFICIAL_ACCOUNT_ID = "Kelb9q6w";

type OfficialProfile = {
  nickname: string;
  introduction: string;
};

const buildOfficialProfile = (locale: TranslatedLocale): OfficialProfile => {
  const count = TOTAL_RECIPE_COUNT[locale];

  if (locale === "ja") {
    return {
      nickname: "レシピオ",
      introduction: `おいしい記録のはじまり、レシピオ公式アカウントです。\n📱 累計レシピ${count}品突破！\n\nあなたの料理ライフを変えるアプリを、今すぐダウンロード。\n\n#レシピオ #Recipio #料理アプリ #AIレシピ`,
    };
  }

  return {
    nickname: "Recipio",
    introduction: `Where every delicious moment gets saved — the official Recipio account.\n📱 Over ${count} recipes and counting!\n\nDownload the app that transforms the way you cook.\n\n#Recipio #CookingApp #AIRecipes`,
  };
};

export const getOfficialProfileOverride = (
  userId: string,
  locale: Locale
): OfficialProfile | null => {
  if (userId !== OFFICIAL_ACCOUNT_ID || locale === "ko") {
    return null;
  }

  return buildOfficialProfile(locale);
};
