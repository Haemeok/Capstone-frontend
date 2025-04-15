import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { postTokenRefresh } from './user';
import { axiosInstance } from './axios';

import { USER_ERROR_MESSAGE } from '@/constants/api';
import { CustomError } from './CustomError';

interface ErrorResponseData {
  message: string;
  code: string;
}

export const checkAndSetToken = (config: InternalAxiosRequestConfig) => {
  if (!config.useAuth || !config.headers || config.headers.Authorization) {
    return config;
  }

  const accessToken = localStorage.getItem('accessToken');
  console.log(config);
  if (!accessToken) {
    throw new Error('토큰이 유효하지 않습니다');
  }

  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

export const handleAPIError = (error: AxiosError<ErrorResponseData>) => {
  if (!error.response) throw error;

  const { data, status } = error.response;
  const code = Number(data.code.slice(1));
  const userMessage =
    USER_ERROR_MESSAGE[data.code as keyof typeof USER_ERROR_MESSAGE];

  throw new CustomError({ code, status, message: data.message, userMessage });
};

export const handleTokenError = async (
  error: AxiosError<ErrorResponseData>,
) => {
  const originRequest = error.config;
  if (!originRequest) throw error;

  if (!error.response) throw error;

  const { data, status } = error.response;

  if (status === 401 && data.message === '만료된 토큰입니다.') {
    try {
      const { token: accessToken } = await postTokenRefresh();
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
