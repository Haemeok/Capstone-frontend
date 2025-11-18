export const PWA_STORAGE_KEYS = {
  INSTALLED: "pwa-installed",
  FIRST_LOGIN_PROMPTED: "pwaFirstLoginPrompted",
  INSTALL_SKIPPED: "pwaInstallSkipped",
} as const;

export const PWA_PROMPT_DELAY = 1000;

export const PWA_APP_INFO = {
  NAME: "레시피오 - 홈쿡 레시피 플랫폼",
  SHORT_NAME: "레시피오",
  DESCRIPTION: "AI가 추천하는 홈쿡 레시피로 집에서 맛있게 레시피오어보세요!",
  THEME_COLOR: "#ffffff",
} as const;

export const PWA_BENEFITS = [
  "빠른 접속으로 시간 절약",
  "오프라인에서도 레시피 확인 가능",
  "푸시 알림으로 새 레시피 소식 받기",
] as const;
