import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { PutUserInfoPayload, User, UserStreak } from "./types";

export const getUserInfo = async (userId: string) => {
  const data = await api.get<User>(END_POINTS.USER_INFO(userId));

  return data;
};

export const putUserInfo = async (payload: PutUserInfoPayload) => {
  const data = await api.patch<User>(END_POINTS.MY_INFO, payload);
  return data;
};

export const getUserStreak = async () => {
  const data = await api.get<UserStreak>(END_POINTS.USER_STREAK);
  return data;
};

export const getMyInfo = async () => {
  const data = await api.get<User>(END_POINTS.MY_INFO);

  return data;
};
