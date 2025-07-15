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

  // AbortController로 타임아웃 처리
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // 요청 옵션 구성
  const requestOptions: RequestInit = {
    credentials: "include", // 쿠키 자동 전송
    headers: {
      "Content-Type": "application/json",
      ...headers, // fetch가 자동으로 병합
    },
    signal: controller.signal,
    ...restOptions,
  };

  // 요청 실행 함수
  const executeRequest = async (): Promise<Response> => {
    return fetch(finalUrl, requestOptions);
  };

  try {
    // 첫 번째 요청 시도
    let response = await executeRequest();

    // 401 에러 시 토큰 리프레시 후 재시도
    if (response.status === 401 && isClient) {
      const retryResponse = await handle401Error(executeRequest);
      if (retryResponse) {
        response = retryResponse;
      }
    }

    // 응답 에러 처리
    if (isErrorResponse(response)) {
      throw await createApiError(response);
    }

    // 응답 데이터 파싱 (직접 호출)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.text() as any;
  } catch (error) {
    // AbortError는 타임아웃으로 처리
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(0, "Request timeout", error);
    }

    // ApiError가 아닌 경우 네트워크 에러로 처리
    if (!(error instanceof ApiError)) {
      throw new ApiError(0, "Network Error", error);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// HTTP 메서드별 편의 함수들
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
