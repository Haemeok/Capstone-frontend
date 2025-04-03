import { axiosInstance } from "@/api/axios";

import { END_POINTS } from "@/constants/api";
import { User } from "@/type/user";

type LogInResponse = {
  accessToken: string;
};

type TokenRefrechResponse = {
  token: string;
};

export const postLogIn = async (code: string) => {
  const { data } = await axiosInstance.post<LogInResponse>(
    END_POINTS.GOOGLE_LOGIN,
    { code },
    { useAuth: false }
  );
  return data;
};

export const getUserInfo = async () => {
  const { data } = await axiosInstance.get<User>(END_POINTS.USER_INFO, {
    useAuth: true,
  });

  return data;
};

export const getMyInfo = async () => {
  const { data } = await axiosInstance.get<User>(END_POINTS.MY_INFO, {
    useAuth: true,
  });

  return data;
};

export const postTokenRefresh = async () => {
  const { data } = await axiosInstance.post<TokenRefrechResponse>(
    END_POINTS.TOKEN_REFRESH
  );
  return data;
};
