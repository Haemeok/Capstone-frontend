import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { RedeemResult, ReferralInfo } from "./types";

export const getReferralInfo = () =>
  api.get<ReferralInfo>(END_POINTS.REFERRAL_INFO);

export const redeemReferralCode = (referralCode: string) =>
  api.post<RedeemResult>(END_POINTS.REFERRAL_REDEEM, { referralCode });
