import { SAME_ORIGIN_API_BASE_URL } from "../config/apiRouting";
import type { ApiConfig, Environment } from "./types";

export const isServer = typeof window === "undefined";
export const isClient = typeof window !== "undefined";

export const getCurrentEnvironment = (): Environment => {
  return (process.env.NODE_ENV as Environment) || "development";
};

export const API_CONFIG: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? SAME_ORIGIN_API_BASE_URL,
  timeout: 15000,
} as const;
