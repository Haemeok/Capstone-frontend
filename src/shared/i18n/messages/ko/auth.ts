import type { AuthDict } from "../../types";

export const auth: AuthDict = {
  browseWithoutLogin: "로그인 없이 볼게요",
  recentLogin: "최근 로그인",
  loading: "로딩 중...",
  kakaoLabel: "카카오로 시작하기",
  naverLabel: "네이버로 시작하기",
  error: {
    title: "로그인 실패",
    description:
      "소셜 로그인 인증 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    retry: "다시 로그인",
  },
};
