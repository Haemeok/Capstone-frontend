import axios from 'axios';

import { checkAndSetToken, handleTokenError } from '@/api/interceptors';

const PROD = import.meta.env.PROD;

const AXIOS_BASE_URL = PROD
  ? import.meta.env.VITE_AXIOS_PROD_BASE_URL
  : import.meta.env.VITE_AXIOS_DEV_BASE_URL || '/';

const NETWORK = {
  TIMEOUT: 15 * 1000,
} as const;

export const axiosInstance = axios.create({
  baseURL: AXIOS_BASE_URL,
  timeout: NETWORK.TIMEOUT,
  withCredentials: true,
  useAuth: true,
});

export const axiosAuthInstance = axios.create({
  baseURL: AXIOS_BASE_URL,
  timeout: NETWORK.TIMEOUT,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(checkAndSetToken);

axiosInstance.interceptors.response.use(
  (response) => response,
  handleTokenError,
);
