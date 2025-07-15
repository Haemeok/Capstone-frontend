import type { ApiConfig, Environment } from "./types";

export const isServer = typeof window === "undefined";
export const isClient = typeof window !== "undefined";

// 현재 환경 확인
export const getCurrentEnvironment = (): Environment => {
  return (process.env.NODE_ENV as Environment) || "development";
};

// 환경별 기본 URL 가져오기
const getBaseURL = (): string => {
  const environment = getCurrentEnvironment();

  if (isServer) {
    // 서버에서는 내부 URL 사용
    return environment === "production"
      ? process.env.NEXT_PUBLIC_AXIOS_PROD_BASE_URL ||
          "https://www.haemeok.com/api"
      : process.env.NEXT_PUBLIC_AXIOS_DEV_BASE_URL ||
          "https://www.haemeok.com/api";
  } else {
    // 클라이언트에서는 상대 경로로 프록시 사용 또는 직접 URL
    return environment === "production"
      ? process.env.NEXT_PUBLIC_API_URL || "https://www.haemeok.com/api"
      : process.env.NEXT_PUBLIC_API_URL_DEV || "/api";
  }
};

// API 기본 설정
export const API_CONFIG: ApiConfig = {
  baseURL: getBaseURL(),
  timeout: 15000,
} as const;
