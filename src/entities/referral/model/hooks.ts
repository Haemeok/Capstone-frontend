"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getReferralInfo, redeemReferralCode } from "./api";
import { REFERRAL_QUERY_KEYS } from "./queryKeys";

export const useReferralInfoQuery = (enabled: boolean) =>
  useQuery({
    queryKey: REFERRAL_QUERY_KEYS.info(),
    queryFn: getReferralInfo,
    staleTime: 10 * 60 * 1000,
    enabled,
  });

export const useRedeemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => redeemReferralCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.all });
    },
  });
};
