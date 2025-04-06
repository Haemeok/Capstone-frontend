import axios from "axios";

import {
  checkAndSetToken,
  handleAPIError,
  handleTokenError,
} from "@/api/interceptors";

const PROD = import.meta.env.PROD;

const AXIOS_BASE_URL = PROD
  ? import.meta.env.VITE_AXIOS_PROD_BASE_URL
  : import.meta.env.VITE_AXIOS_DEV_BASE_URL || "/";

const NETWORK = {
  RETRY_COUNT: 2,
  TIMEOUT: 10000,
} as const;

export const axiosInstance = axios.create({
  baseURL: AXIOS_BASE_URL,
  timeout: NETWORK.TIMEOUT,
  withCredentials: true,
  useAuth: true,
});

axiosInstance.interceptors.request.use(checkAndSetToken);

axiosInstance.interceptors.response.use(
  (response) => response,
  handleTokenError,
);
axiosInstance.interceptors.response.use((response) => response, handleAPIError);
