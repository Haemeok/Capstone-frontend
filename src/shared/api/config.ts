import type { ApiConfig, Environment } from "./types";

export const isServer = typeof window === "undefined";
export const isClient = typeof window !== "undefined";

// 현재 환경 확인
export const getCurrentEnvironment = (): Environment => {
  return (process.env.NODE_ENV as Environment) || "development";
};

// API 기본 설정
export const API_CONFIG: ApiConfig = {
  baseURL: "/api",
  timeout: 15000,
} as const;
