import type { Locale } from "@/shared/i18n/types";

import { PresignedUrlInfo } from "../types";

export type QueryParams = Record<string, unknown>;

export type ApiRequestOptions = RequestInit & {
  params?: QueryParams;
  lang?: Locale;
  timeout?: number;
  baseURL?: string;
  paramsSerializer?: (params: QueryParams) => string;
};

export type ApiResponse<T = unknown> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
};

export type ForceLogoutEventDetail = {
  message: string;
  reason: string;
};

declare global {
  interface WindowEventMap {
    forceLogout: CustomEvent<ForceLogoutEventDetail>;
    tokenRefreshed: CustomEvent;
  }
}

export type BatchRequestFunction<T> = () => Promise<T>;

export type ServerApiRequestOptions = ApiRequestOptions & {
  cookies?: string;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiConfig = {
  readonly baseURL: string;
  readonly timeout: number;
};

export type Environment = "development" | "production" | "test";

export type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  path?: string;
  domain?: string;
};

export type BaseQueryParams = {
  page: number;
  size: number;
  sort: string;
  q?: string;
  lang?: Locale;
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

export type SliceInfo = {
  size: number;
  number: number;
  numberOfElements: number;
  hasNext: boolean;
};

export type SliceResponse<T> = {
  content: T[];
  slice: SliceInfo;
};

export type PresignedUrlResponse = {
  uploads: PresignedUrlInfo[];
  recipeId: string;
};
