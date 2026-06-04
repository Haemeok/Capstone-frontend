import { cookies } from "next/headers";

import { API_CONFIG } from "./config";
import type { ServerApiRequestOptions } from "./types";

import "server-only";

class RefreshExpiredError extends Error {
  readonly isRefreshExpired = true;

  constructor() {
    super("REFRESH_TOKEN_EXPIRED");
    this.name = "RefreshExpiredError";
  }
}

async function serverFetch<T = unknown>(
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
  // 비 JSON 응답은 문자열이며 호출자가 선언한 T로 좁힐 수 없음
  return response.text() as Promise<T>;
}

export async function serverApiClient<T = unknown>(
  url: string,
  options: Omit<ServerApiRequestOptions, "cookies"> = {}
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  console.log(
    "🔑 SSR serverApiClient - accessToken:",
    accessToken ? `${accessToken.substring(0, 20)}...` : "NONE"
  );
  console.log(
    "🔑 SSR serverApiClient - refreshToken:",
    refreshToken ? "EXISTS" : "NONE"
  );

  if (!accessToken) {
    console.log("⚠️ No accessToken, checking refreshToken...");
    if (!refreshToken) {
      console.log("❌ No refreshToken either, throwing 401");
      throw new Error("HTTP error! status: 401");
    }

    console.log("⚠️ No accessToken but refreshToken exists, returning EXPIRED");
    throw new RefreshExpiredError();
  }

  const { headers = {}, ...restOptions } = options;

  try {
    console.log("📡 SSR fetching:", url);
    return await serverFetch<T>(url, {
      ...restOptions,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
    });
  } catch (error) {
    console.log("❌ SSR fetch failed:", error);
    if (error && typeof error === "object" && "message" in error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("401")) {
        console.log("⚠️ Got 401 error, converting to EXPIRED");
        throw new RefreshExpiredError();
      }
    }

    throw error;
  }
}

export const serverApi = {
  get: <T = unknown>(
    url: string,
    options?: Omit<ServerApiRequestOptions, "method" | "cookies">
  ) => serverApiClient<T>(url, { ...options, method: "GET" }),
};
