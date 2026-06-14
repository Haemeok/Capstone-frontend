import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";

import type { Locale } from "./types";

type PackMeta = { name: string; description: string };

const OVERLAY: Partial<Record<Locale, Record<string, PackMeta>>> = {
  ja: {
    "조미료/양념 모음": {
      name: "調味料・薬味セット",
      description: "どんな料理にも欠かせない基本の調味料",
    },
    "육류 기본 모음": {
      name: "基本の肉セット",
      description: "いろいろな料理に使える基本の肉",
    },
    "채소 기본 재료": {
      name: "基本の野菜セット",
      description: "いろいろな料理に使える基本の野菜",
    },
    "자취 기본 재료 모음": {
      name: "一人暮らしの常備食材",
      description: "一人暮らしの冷蔵庫に欠かせない必需食材",
    },
    "베이킹 기본 재료": {
      name: "基本のベーキング材料",
      description: "おうちベーキングに必要な基本材料",
    },
    "유제품 모음": {
      name: "乳製品セット",
      description: "料理にも飲み物にも使える乳製品",
    },
    "한식 기본 베이스": {
      name: "韓国料理の基本ベース",
      description: "韓国料理に欠かせない調味料と食材",
    },
    "양식 기본 베이스": {
      name: "洋食の基本ベース",
      description: "洋食づくりに欠かせない調味料と食材",
    },
  },
  en: {
    "조미료/양념 모음": {
      name: "Seasonings & sauces",
      description: "Everyday seasonings every dish starts with",
    },
    "육류 기본 모음": {
      name: "Basic meats",
      description: "Everyday cuts for all kinds of cooking",
    },
    "채소 기본 재료": {
      name: "Basic vegetables",
      description: "Everyday vegetables for all kinds of cooking",
    },
    "자취 기본 재료 모음": {
      name: "Solo-living staples",
      description: "Fridge essentials for living on your own",
    },
    "베이킹 기본 재료": {
      name: "Baking basics",
      description: "Core ingredients for home baking",
    },
    "유제품 모음": {
      name: "Dairy set",
      description: "Dairy for cooking and drinks alike",
    },
    "한식 기본 베이스": {
      name: "Korean cooking base",
      description: "Must-have seasonings and ingredients for Korean food",
    },
    "양식 기본 베이스": {
      name: "Western cooking base",
      description: "Must-have seasonings and ingredients for Western food",
    },
  },
};

export const localizePack = (
  pack: Pick<IngredientPack, "name" | "description">,
  locale: Locale
): PackMeta =>
  OVERLAY[locale]?.[pack.name] ?? {
    name: pack.name,
    description: pack.description,
  };
