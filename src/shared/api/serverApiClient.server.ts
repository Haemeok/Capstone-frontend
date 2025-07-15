import "server-only";
import { cookies } from "next/headers";
import type { ServerApiRequestOptions } from "./types";
import { API_CONFIG } from "./config";

async function serverFetch<T = any>(
  url: string,
  options: ServerApiRequestOptions = {}
): Promise<T> {
  const {
    params,
    timeout = API_CONFIG.timeout,
    baseURL,
    headers = {},
    ...restOptions
  } = options;

  const fullUrl = url.startsWith("http")
    ? url
    : `${baseURL || API_CONFIG.baseURL}${url}`;

  let finalUrl = fullUrl;

  if (params) {
    const urlObj = new URL(fullUrl);
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

  const requestOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...restOptions,
  };

  const response = await fetch(finalUrl, requestOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text() as any;
}

export async function serverApiClient<T = any>(
  url: string,
  options: Omit<ServerApiRequestOptions, "cookies"> = {}
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // 토큰이 없으면 상태에 따라 구분
  if (!accessToken) {
    // 리프레시 토큰도 없으면 단순 비로그인 상태
    if (!refreshToken) {
      throw new Error("HTTP error! status: 401");
    }
    // 리프레시 토큰은 있지만 액세스 토큰이 없으면 만료 상태
    const error = new Error("REFRESH_TOKEN_EXPIRED");
    (error as any).isRefreshExpired = true;
    throw error;
  }

  const { headers = {}, ...restOptions } = options;

  try {
    return await serverFetch<T>(url, {
      ...restOptions,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
    });
  } catch (error) {
    // 401 에러인 경우 토큰 만료로 처리
    if (error && typeof error === "object" && "message" in error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("401")) {
        const refreshError = new Error("REFRESH_TOKEN_EXPIRED");
        (refreshError as any).isRefreshExpired = true;
        throw refreshError;
      }
    }

    throw error;
  }
}

export const serverApi = {
  get: <T = any>(
    url: string,
    options?: Omit<ServerApiRequestOptions, "method" | "cookies">
  ) => serverApiClient<T>(url, { ...options, method: "GET" }),
};
