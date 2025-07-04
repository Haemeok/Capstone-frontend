import { axiosAuthInstance, axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

import { TokenRefrechResponse } from "./types";

export const postTokenRefresh = async () => {
  const { data } = await axiosAuthInstance.post<TokenRefrechResponse>(
    END_POINTS.TOKEN_REFRESH
  );
  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post(END_POINTS.LOGOUT, {
    useAuth: true,
  });
  return data;
};
