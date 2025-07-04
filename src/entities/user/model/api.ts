import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

import {
  PutUserInfoPayload,
  RecipeHistoryDetailResponse,
  RecipeHistoryResponse,
  User,
  UserStreak,
} from "./types";

export const getUserInfo = async (userId: number) => {
  if (typeof userId !== "number") {
    throw new Error("userId is not a number");
  }
  const { data } = await axiosInstance.get<User>(END_POINTS.USER_INFO(userId));

  return data;
};

export const getRecipeHistoryDetail = async (date: string) => {
  const response = await axiosInstance.get<RecipeHistoryDetailResponse[]>(
    END_POINTS.RECIPE_HISTORY,
    {
      params: {
        date,
      },
    }
  );
  return response.data;
};

export const putUserInfo = async (payload: PutUserInfoPayload) => {
  const { data } = await axiosInstance.patch<User>(
    END_POINTS.MY_INFO,
    payload,
    {
      useAuth: true,
    }
  );
  return data;
};

export const getUserStreak = async () => {
  const { data } = await axiosInstance.get<UserStreak>(END_POINTS.USER_STREAK, {
    useAuth: true,
  });
  return data;
};

export const getRecipeHistory = async ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const response = await axiosInstance.get<RecipeHistoryResponse>(
    END_POINTS.RECIPE_HISTORY,
    {
      params: {
        year,
        month,
      },
    }
  );
  return response.data;
};
