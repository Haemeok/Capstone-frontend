import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/api/errors";

import { getChatQuota, postChat } from "./api";
import type { ChatQuota, ChatRequest, ChatResponse } from "./types";

export const CHAT_QUOTA_QUERY_KEY = ["chat-quota"] as const;

export const useChatMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ChatResponse, ApiError, ChatRequest>({
    mutationFn: postChat,
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUOTA_QUERY_KEY });
    },
  });
};

type UseChatQuotaQueryArgs = {
  enabled: boolean;
};

export const useChatQuotaQuery = ({ enabled }: UseChatQuotaQueryArgs) => {
  return useQuery<ChatQuota, ApiError>({
    queryKey: CHAT_QUOTA_QUERY_KEY,
    queryFn: getChatQuota,
    staleTime: 60_000,
    enabled,
    refetchOnWindowFocus: false,
  });
};
