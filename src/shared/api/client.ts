import { BASE_API_URL } from "@/shared/config/constants/api";
import { resolveClientRequestLocale } from "@/shared/i18n/resolveClientRequestLocale";
import { captureException as sentryCaptureException } from "@/shared/lib/sentry";
import { createApiErrorTags } from "@/shared/lib/sentry";

import { handle401Error } from "./auth";
import { API_CONFIG, isClient, isServer } from "./config";
import { ApiError, createApiError, isErrorResponse } from "./errors";
import { getErrorData } from "./errors";
import { getClientTimeZone } from "./timezone";
import type { ApiRequestOptions, BatchRequestFunction } from "./types";

export async function apiClient<T = unknown>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    params,
    timeout = API_CONFIG.timeout,
    baseURL,
    headers = {},
    paramsSerializer,
    ...restOptions
  } = options;

  const defaultBaseURL = isServer ? BASE_API_URL : API_CONFIG.baseURL;
  const fullUrl = url.startsWith("http")
    ? url
    : `${baseURL || defaultBaseURL}${url}`;

  let effectiveParams = params;
  const isExternal = url.startsWith("http") || Boolean(baseURL);
  if (isClient && !isExternal && effectiveParams?.lang === undefined) {
    const locale = resolveClientRequestLocale();
    if (locale && locale !== "ko") {
      effectiveParams = { ...(effectiveParams ?? {}), lang: locale };
    }
  }

  let finalUrl = fullUrl;

  if (effectiveParams) {
    if (paramsSerializer) {
      finalUrl = `${finalUrl}?${paramsSerializer(effectiveParams)}`;
    } else {
      const urlObj = new URL(
        fullUrl,
        isServer ? fullUrl : window.location.origin
      );
      Object.entries(effectiveParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => urlObj.searchParams.append(key, String(v)));
          } else {
            urlObj.searchParams.append(key, String(value));
          }
        }
      });
      finalUrl = urlObj.toString();
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const timeZone = getClientTimeZone();
  const mergedHeaders: Record<string, string> = {
    ...(timeZone ? { "X-Timezone": timeZone } : {}),
    // 코드베이스 호출부는 전부 plain object 헤더
    ...(headers as Record<string, string>),
  };

  const requestOptions: RequestInit = {
    credentials: "include",
    signal: controller.signal,
    headers: mergedHeaders,
    ...restOptions,
  };

  const executeRequest = async (): Promise<Response> => {
    return fetch(finalUrl, requestOptions);
  };

  try {
    let response = await executeRequest();

    if (response.status === 401 && isClient) {
      console.log("[Auth] 401-detected", {
        url,
        timestamp: new Date().toISOString(),
        cookieNames: document.cookie
          .split(";")
          .map((c) => c.trim().split("=")[0])
          .filter(Boolean),
      });
      const retryResponse = await handle401Error(executeRequest);
      if (retryResponse) {
        console.log("[Auth] 401-retry-success", { url });
        response = retryResponse;
      } else {
        console.log("[Auth] 401-retry-failed", { url });
      }
    }

    if (isErrorResponse(response)) {
      const apiError = await createApiError(response);

      const shouldCapture =
        ApiError.isServerError(apiError) || ApiError.isForbidden(apiError);

      if (shouldCapture) {
        const errorData = getErrorData(apiError);
        const method = (restOptions as RequestInit).method || "GET";
        const tags = createApiErrorTags(
          url,
          method,
          errorData?.code?.toString()
        );
        sentryCaptureException(apiError, tags);
      }

      throw apiError;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    // 비 JSON 응답은 문자열이며 호출자가 선언한 T로 좁힐 수 없음
    return response.text() as Promise<T>;
  } catch (error) {
    const method = (restOptions as RequestInit).method || "GET";

    if (error instanceof Error && error.name === "AbortError") {
      const timeoutError = new ApiError(0, "Request timeout", error);
      sentryCaptureException(timeoutError, createApiErrorTags(url, method));
      throw timeoutError;
    }

    if (!(error instanceof ApiError)) {
      const networkError = new ApiError(0, "Network Error", error);
      sentryCaptureException(networkError, createApiErrorTags(url, method));
      throw networkError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  get: <T = unknown>(
    url: string,
    options?: Omit<ApiRequestOptions, "method">
  ) => apiClient<T>(url, { ...options, method: "GET" }),

  post: <T = unknown>(
    url: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ) =>
    apiClient<T>(url, {
      ...options,
      method: "POST",
      headers: {
        ...options?.headers,
        ...(data ? { "Content-Type": "application/json" } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = unknown>(
    url: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ) =>
    apiClient<T>(url, {
      ...options,
      method: "PUT",
      headers: {
        ...options?.headers,
        ...(data ? { "Content-Type": "application/json" } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ) =>
    apiClient<T>(url, {
      ...options,
      method: "PATCH",
      headers: {
        ...options?.headers,
        ...(data ? { "Content-Type": "application/json" } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = unknown>(
    url: string,
    options?: Omit<ApiRequestOptions, "method">
  ) => apiClient<T>(url, { ...options, method: "DELETE" }),
};

export const batchRequests = async <T>(
  requests: BatchRequestFunction<T>[]
): Promise<T[]> => {
  return Promise.all(requests.map((request) => request()));
};

export { ApiError };

export default api;
