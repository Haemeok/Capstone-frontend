import { referral as en } from "./messages/en/referral";
import { referral as ja } from "./messages/ja/referral";
import { referral as ko } from "./messages/ko/referral";
import type { Locale, ReferralDict } from "./types";

export const referralMessages: Record<Locale, ReferralDict> = { ko, ja, en };
