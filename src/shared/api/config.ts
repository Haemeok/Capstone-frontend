import type { ApiConfig, Environment } from "./types";

export const isServer = typeof window === "undefined";
export const isClient = typeof window !== "undefined";

export const getCurrentEnvironment = (): Environment => {
  return (process.env.NODE_ENV as Environment) || "development";
};

export const API_CONFIG: ApiConfig = {
  baseURL: "/api",
  timeout: 15000,
} as const;
