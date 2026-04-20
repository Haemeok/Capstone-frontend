import { PresignedUrlInfo } from "../types";

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, any>;
  timeout?: number;
  baseURL?: string;
  paramsSerializer?: (params: Record<string, any>) => string;
  /**
   * true면 이 요청의 401 → refresh 실패 시 forceLogout 이벤트를 발행하지 않는다.
   * optional-auth 엔드포인트(쿠키 있으면 개인화, 없으면 공개)에 사용.
   * refresh 시도 자체는 그대로 수행된다 — 진짜 만료 사용자는 정상 복구된다.
   * 계약 정의: docs/auth-contract.md
   */
  silentOn401?: boolean;
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
