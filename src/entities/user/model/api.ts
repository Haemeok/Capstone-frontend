import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import {
  PutUserInfoPayload,
  RecipeHistoryDetailResponse,
  RecipeHistoryResponse,
  User,
  UserStreak,
} from "./types";

export const getUserInfo = async (userId: number) => {
  if (typeof userId !== "number" || isNaN(userId) || !isFinite(userId)) {
    throw new Error("userId must be a valid number");
  }
  const data = await api.get<User>(END_POINTS.USER_INFO(userId));

  return data;
};

export const getRecipeHistoryDetail = async (date: string) => {
  const response = await api.get<RecipeHistoryDetailResponse[]>(
    END_POINTS.RECIPE_HISTORY,
    {
      params: {
        date,
      },
    }
  );
  return response;
};

export const putUserInfo = async (payload: PutUserInfoPayload) => {
  const data = await api.patch<User>(END_POINTS.MY_INFO, payload);
  return data;
};

export const getUserStreak = async () => {
  const data = await api.get<UserStreak>(END_POINTS.USER_STREAK);
  return data;
};

export const getRecipeHistory = async ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const response = await api.get<RecipeHistoryResponse>(
    END_POINTS.RECIPE_HISTORY,
    {
      params: {
        year,
        month,
      },
    }
  );
  return response;
};

export const getMyInfo = async () => {
  const data = await api.get<User>(END_POINTS.MY_INFO);
  console.log("getMyInfo", data);
  return data;
};
