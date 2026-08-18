"use client";

import { useQuery } from "@tanstack/react-query";

import { getStickerBookBackgrounds } from "../recordApi";
import { COOKING_RECORD_QUERY_KEYS } from "../recordQueryKeys";

export const useStickerBookBackgroundsQuery = ({
  enabled,
}: {
  enabled: boolean;
}) =>
  useQuery({
    queryKey: COOKING_RECORD_QUERY_KEYS.backgrounds,
    queryFn: getStickerBookBackgrounds,
    enabled,
    retry: false,
  });
