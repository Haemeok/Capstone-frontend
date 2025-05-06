import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { postTokenRefresh } from './user';
import { axiosInstance } from './axios';

import { USER_ERROR_MESSAGE } from '@/constants/api';
import { CustomError } from './CustomError';

interface ErrorResponseData {
  message: string;
  code: string;
}

export const checkAndSetToken = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  if (!config.useAuth || !config.headers) {
    return config;
  }

  if (config.headers.Authorization) {
    return config;
  }

  const accessToken = localStorage.getItem('accessToken');

  if (config.useAuth === true) {
    if (!accessToken) {
      throw new Error('토큰이 유효하지 않습니다');
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  }

  if (config.useAuth === 'optional' && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

export const handleTokenError = async (
  error: AxiosError<ErrorResponseData>,
) => {
  const originRequest = error.config;
  if (!originRequest) throw error;

  if (!error.response) throw error;

  const { data, status } = error.response;

  if (status === 401) {
    try {
      const { accessToken } = await postTokenRefresh();
      localStorage.setItem('accessToken', accessToken);
      originRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(originRequest);
    } catch (refreshError) {
      localStorage.removeItem('accessToken');

      throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
    }
  }

  if (data.code === 'E500') {
    localStorage.removeItem('accessToken');
    throw new Error('로그인이 필요합니다.');
  }

  throw error;
};
