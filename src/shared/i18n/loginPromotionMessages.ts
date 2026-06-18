import { loginPromotion as en } from "./messages/en/loginPromotion";
import { loginPromotion as ja } from "./messages/ja/loginPromotion";
import { loginPromotion as ko } from "./messages/ko/loginPromotion";
import type { Locale, LoginPromotionDict } from "./types";

export const loginPromotionMessages: Record<Locale, LoginPromotionDict> = {
  ko,
  ja,
  en,
};
