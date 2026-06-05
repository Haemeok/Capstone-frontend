"use client";

import { useQuery } from "@tanstack/react-query";

import { getReferralInfo } from "./api";
import { REFERRAL_QUERY_KEYS } from "./queryKeys";

export const useReferralInfoQuery = (enabled: boolean) =>
  useQuery({
    queryKey: REFERRAL_QUERY_KEYS.info(),
    queryFn: getReferralInfo,
    staleTime: 10 * 60 * 1000,
    enabled,
  });
