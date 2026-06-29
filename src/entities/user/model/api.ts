import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { PutUserInfoPayload, RawUserResponse, User, UserStreak } from "./types";

export const toUser = (raw: RawUserResponse): User => {
  const {
    remainingAiGenerationQuota,
    remainingYoutubeExtractionCredits,
    ...rest
  } = raw;
  return {
    ...rest,
    remainingAiQuota: remainingAiGenerationQuota ?? raw.remainingAiQuota ?? 0,
    remainingYoutubeQuota:
      remainingYoutubeExtractionCredits ?? raw.remainingYoutubeQuota ?? 0,
  };
};

export const getUserInfo = async (userId: string) =>
  toUser(await api.get<RawUserResponse>(END_POINTS.USER_INFO(userId)));
export const putUserInfo = async (payload: PutUserInfoPayload) =>
  toUser(await api.patch<RawUserResponse>(END_POINTS.MY_INFO, payload));
export const getUserStreak = async () =>
  api.get<UserStreak>(END_POINTS.USER_STREAK);
export const getMyInfo = async () =>
  toUser(await api.get<RawUserResponse>(END_POINTS.MY_INFO));
