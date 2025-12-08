import { serverApi } from "@/shared/api/serverApiClient.server";
import { BASE_API_URL } from "@/shared/config/constants/api";
import { ServerAuthResult } from "@/shared/types";

import { User } from "./types";

export const getMyInfoOnServer = async (): Promise<ServerAuthResult> => {
  const API_URL = `${BASE_API_URL}/me`;
  try {
    const data = await serverApi.get<User>(API_URL);
    console.log("✅ SSR getMyInfo SUCCESS:", data?.nickname);
    return {
      status: "authenticated",
      user: data,
    };
  } catch (error) {
    console.log("❌ SSR getMyInfo FAILED:", error);
    if (error && typeof error === "object" && "isRefreshExpired" in error) {
      console.log("⚠️ Returning EXPIRED status");
      return { status: "expired" };
    }

    console.log("⚠️ Returning UNAUTHENTICATED status");
    return { status: "unauthenticated" };
  }
};
