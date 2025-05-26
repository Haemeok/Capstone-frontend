import { axiosAuthInstance, axiosInstance } from '@/api/axios';

import { END_POINTS, PAGE_SIZE } from '@/constants/api';
import { User } from '@/type/user';
import { BaseRecipeGridItem, UserRecipeGridItem } from '@/type/recipe';
import { PageResponse } from '@/type/query';
type TokenRefrechResponse = {
  accessToken: string;
  refreshToken: string;
};

export const getUserInfo = async (userId: number) => {
  if (typeof userId !== 'number') {
    throw new Error('userId is not a number');
  }
  const { data } = await axiosInstance.get<User>(END_POINTS.USER_INFO(userId));

  return data;
};

type UserRecipesApiResponse = PageResponse<UserRecipeGridItem>;

export const getUserRecipes = async ({
  userId,
  pageParam = 0,
}: {
  userId: number;
  pageParam?: number;
}) => {
  const { data } = await axiosInstance.get<UserRecipesApiResponse>(
    END_POINTS.USER_RECIPES(userId),
    {
      useAuth: true,
      params: {
        page: pageParam,
        size: PAGE_SIZE,
      },
    },
  );

  return data;
};

export const getMyInfo = async () => {
  const { data } = await axiosInstance.get<User>(END_POINTS.MY_INFO, {
    useAuth: true,
  });
  console.log('getMyInfo', data);
  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post(END_POINTS.LOGOUT, {
    useAuth: true,
  });
  return data;
};

export const postTokenRefresh = async () => {
  const { data } = await axiosAuthInstance.post<TokenRefrechResponse>(
    END_POINTS.TOKEN_REFRESH,
  );
  return data;
};
