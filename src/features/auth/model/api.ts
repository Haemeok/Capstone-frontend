import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { TokenRefrechResponse } from "./types";

export const postTokenRefresh = async (): Promise<TokenRefrechResponse> => {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const postLogout = async () => {
  const data = await api.post(END_POINTS.LOGOUT);
  return data;
};
