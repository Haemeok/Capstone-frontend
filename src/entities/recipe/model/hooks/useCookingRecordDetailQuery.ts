"use client";

import { useQuery } from "@tanstack/react-query";

import { useUserPagesLocale } from "@/shared/i18n";

import { getCookingRecord } from "../recordApi";
import { COOKING_RECORD_QUERY_KEYS } from "../recordQueryKeys";

export const useCookingRecordDetailQuery = ({
  recordId,
  enabled,
}: {
  recordId: string;
  enabled: boolean;
}) => {
  const locale = useUserPagesLocale();
  return useQuery({
    queryKey: COOKING_RECORD_QUERY_KEYS.detail(recordId, locale),
    queryFn: () => getCookingRecord(recordId, locale),
    enabled: enabled && recordId.length > 0,
    retry: false,
  });
};
