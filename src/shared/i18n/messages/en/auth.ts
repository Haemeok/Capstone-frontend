import type { AuthDict } from "../../types";

export const auth: AuthDict = {
  browseWithoutLogin: "Browse without signing in",
  dialogTitle: "Log in",
  recentLogin: "Recently used",
  loading: "Loading...",
  kakaoLabel: "Continue with Kakao",
  naverLabel: "Continue with Naver",
  error: {
    title: "Sign-in failed",
    description:
      "Something went wrong during social sign-in. Please try again in a moment.",
    retry: "Try signing in again",
  },
};
