import type { Locale } from "@/shared/i18n";

export const CART_QUERY_KEYS = {
  all: ["cart"] as const,
  byLang: (lang: Locale) => ["cart", lang] as const,
};
