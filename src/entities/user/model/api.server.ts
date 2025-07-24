import { serverApi } from "@/shared/api/serverApiClient.server";
import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";
import { ServerAuthResult } from "@/shared/types";

import { User } from "./types";

export const getMyInfoOnServer = async (): Promise<ServerAuthResult> => {
  const API_URL = `${BASE_API_URL}/me`;
  try {
    const data = await serverApi.get<User>(API_URL);
    return {
      status: "authenticated",
      user: data,
    };
  } catch (error) {
    if (error && typeof error === "object" && "isRefreshExpired" in error) {
      return { status: "expired" };
    }

    return { status: "unauthenticated" };
  }
};
