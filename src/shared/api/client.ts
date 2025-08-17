import { handle401Error } from "./auth";
import { API_CONFIG, isClient } from "./config";
import { ApiError, createApiError, isErrorResponse } from "./errors";
import type { ApiRequestOptions, BatchRequestFunction } from "./types";

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

  const fullUrl = url.startsWith("http")
    ? url
    : `${baseURL || API_CONFIG.baseURL}${url}`;

  let finalUrl = fullUrl;

  if (params) {
    if (paramsSerializer) {
      finalUrl = `${finalUrl}?${paramsSerializer(params)}`;
    } else {
      const urlObj = new URL(fullUrl, window.location.origin);
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
      throw await createApiError(response);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.text() as any;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(0, "Request timeout", error);
    }

    if (!(error instanceof ApiError)) {
      throw new ApiError(0, "Network Error", error);
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
      headers: data ? { "Content-Type": "application/json" } : {},
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
      headers: data ? { "Content-Type": "application/json" } : {},
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
      headers: data ? { "Content-Type": "application/json" } : {},
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
