import { AxiosError, InternalAxiosRequestConfig } from "axios";

import { postTokenRefresh } from "@/features/auth/model/api";

import { axiosInstance } from "./axios";

interface ErrorResponseData {
  message: string;
  code: string;
}

export const checkAndSetToken = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (!config.useAuth || !config.headers) {
    return config;
  }

  if (config.headers.Authorization) {
    return config;
  }

  const accessToken = localStorage.getItem("accessToken");

  if (config.useAuth === true) {
    if (!accessToken) {
      throw new Error("토큰이 유효하지 않습니다");
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  }

  if (config.useAuth === "optional" && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

export type ForceLogoutEventDetail = {
  message: string;
  reason?: string; // 예: 'REFRESH_TOKEN_EXPIRED', 'ADMIN_FORCED_LOGOUT' 등
};

// 리프레시 토큰 만료 또는 강제 로그아웃 필요 시 호출
const dispatchForceLogoutEvent = (detail: ForceLogoutEventDetail) => {
  const event = new CustomEvent<ForceLogoutEventDetail>("forceLogout", {
    detail: detail,
  });
  window.dispatchEvent(event);
};

export const handleTokenError = async (
  error: AxiosError<ErrorResponseData>
) => {
  const originRequest = error.config;
  if (!originRequest) throw error;

  if (!error.response) throw error;

  const { data, status } = error.response;

  if (status === 401) {
    try {
      const { accessToken } = await postTokenRefresh();
      localStorage.setItem("accessToken", accessToken);
      originRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(originRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");

      dispatchForceLogoutEvent({
        message: "로그인이 만료되었습니다. 다시 로그인해주세요.",
        reason: "REFRESH_TOKEN_EXPIRED",
      });

      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

  if (data.code === "E500") {
    localStorage.removeItem("accessToken");
    throw new Error("로그인이 필요합니다.");
  }

  throw error;
};
