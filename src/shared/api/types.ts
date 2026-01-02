import { PresignedUrlInfo } from "../types";

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, any>;
  timeout?: number;
  baseURL?: string;
  paramsSerializer?: (params: Record<string, any>) => string;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface ForceLogoutEventDetail {
  message: string;
  reason: string;
}

declare global {
  interface WindowEventMap {
    forceLogout: CustomEvent<ForceLogoutEventDetail>;
    tokenRefreshed: CustomEvent;
  }
}

export type BatchRequestFunction<T> = () => Promise<T>;

export interface ServerApiRequestOptions extends ApiRequestOptions {
  cookies?: string;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiConfig {
  readonly baseURL: string;
  readonly timeout: number;
}

export type Environment = "development" | "production" | "test";

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  path?: string;
  domain?: string;
}

export type BaseQueryParams = {
  page: number;
  size: number;
  sort: string;
  q?: string;
};

export type PageResponse<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type PresignedUrlResponse = {
  uploads: PresignedUrlInfo[];
  recipeId: string;
};
