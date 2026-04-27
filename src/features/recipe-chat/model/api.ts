import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { ChatQuota, ChatRequest, ChatResponse } from "./types";

export const postChat = async ({
  recipeId,
  question,
  sessionId,
}: ChatRequest): Promise<ChatResponse> => {
  return api.post<ChatResponse>(END_POINTS.CHAT(recipeId), {
    question,
    sessionId,
  });
};

export const getChatQuota = async (): Promise<ChatQuota> => {
  return api.get<ChatQuota>(END_POINTS.CHAT_QUOTA);
};
