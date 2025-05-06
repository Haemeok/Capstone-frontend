import { axiosAuthInstance, axiosInstance } from '@/api/axios';

import { END_POINTS } from '@/constants/api';
import { User } from '@/type/user';

type TokenRefrechResponse = {
  accessToken: string;
  refreshToken: string;
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
  console.log('getMyInfo', data);
  return data;
};

export const postTokenRefresh = async () => {
  const { data } = await axiosAuthInstance.post<TokenRefrechResponse>(
    END_POINTS.TOKEN_REFRESH,
  );
  return data;
};
