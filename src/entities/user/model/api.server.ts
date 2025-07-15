import { serverApi } from "@/shared/api/serverApiClient.server";
import { END_POINTS } from "@/shared/config/constants/api";
import { User } from "./types";
import { ServerAuthResult } from "@/shared/types";

export const getMyInfoOnServer = async (): Promise<ServerAuthResult> => {
  try {
    const data = await serverApi.get<User>(END_POINTS.MY_INFO);
    return {
      status: "authenticated",
      user: data,
    };
  } catch (error) {
    // 리프레시 토큰 만료 감지
    if (error && typeof error === "object" && "isRefreshExpired" in error) {
      return { status: "expired" };
    }

    // 로그인되지 않은 상태 (로그 제거 - 정상적인 상황)
    return { status: "unauthenticated" };
  }
};
