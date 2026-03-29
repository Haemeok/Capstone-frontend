import { handle401Error } from "./auth";
import { API_CONFIG, isClient, isServer } from "./config";
import { ApiError, createApiError, isErrorResponse } from "./errors";
import type { ApiRequestOptions, BatchRequestFunction } from "./types";

import { BASE_API_URL } from "@/shared/config/constants/api";
import { captureException as sentryCaptureException } from "@/shared/lib/sentry";
import { createApiErrorTags } from "@/shared/lib/sentry";
import { getErrorData } from "./errors";

export async function apiClient<T = any>(
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

  let finalUrl = fullUrl;

  if (params) {
    if (paramsSerializer) {
      finalUrl = `${finalUrl}?${paramsSerializer(params)}`;
    } else {
      const urlObj = new URL(fullUrl, isServer ? fullUrl : window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
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

  const requestOptions: RequestInit = {
    credentials: "include",
    signal: controller.signal,
    headers,
    ...restOptions,
  };

  const executeRequest = async (): Promise<Response> => {
    return fetch(finalUrl, requestOptions);
  };

  try {
    let response = await executeRequest();

    if (response.status === 401 && isClient) {
      const retryResponse = await handle401Error(executeRequest);
      if (retryResponse) {
        response = retryResponse;
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
    return response.text() as any;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      const timeoutError = new ApiError(0, "Request timeout", error);
      sentryCaptureException(timeoutError, {
        "api.endpoint": url,
        "api.method": (restOptions as RequestInit).method || "GET",
        "page.path": typeof window !== "undefined" ? window.location.pathname : "unknown",
      });
      throw timeoutError;
    }

    if (!(error instanceof ApiError)) {
      const networkError = new ApiError(0, "Network Error", error);
      sentryCaptureException(networkError, {
        "api.endpoint": url,
        "api.method": (restOptions as RequestInit).method || "GET",
        "page.path": typeof window !== "undefined" ? window.location.pathname : "unknown",
      });
      throw networkError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  get: <T = any>(url: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiClient<T>(url, { ...options, method: "GET" }),

  post: <T = any>(
    url: string,
    data?: any,
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

  put: <T = any>(
    url: string,
    data?: any,
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

  patch: <T = any>(
    url: string,
    data?: any,
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

  delete: <T = any>(url: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiClient<T>(url, { ...options, method: "DELETE" }),
};

export const batchRequests = async <T>(
  requests: BatchRequestFunction<T>[]
): Promise<T[]> => {
  return Promise.all(requests.map((request) => request()));
};

export { ApiError };

export default api;
