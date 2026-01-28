import crypto from "crypto";

const PLATFORM_SEPARATOR = ":";
const APP_PLATFORM = "app";

type CreateOAuthStateResult = {
  state: string;
  csrfToken: string;
};

type ParseOAuthStateResult = {
  csrfToken: string;
  isApp: boolean;
};

/**
 * OAuth state 파라미터 생성
 * - 웹: "{csrfToken}"
 * - 앱: "{csrfToken}:app"
 */
export const createOAuthState = (platform?: string): CreateOAuthStateResult => {
  const csrfToken = crypto.randomBytes(16).toString("hex");

  const state =
    platform === APP_PLATFORM
      ? `${csrfToken}${PLATFORM_SEPARATOR}${APP_PLATFORM}`
      : csrfToken;

  return { state, csrfToken };
};

/**
 * OAuth state 파라미터 파싱
 * - state에서 csrfToken과 플랫폼 정보 추출
 */
export const parseOAuthState = (
  state: string | null
): ParseOAuthStateResult => {
  if (!state) {
    return { csrfToken: "", isApp: false };
  }

  const parts = state.split(PLATFORM_SEPARATOR);
  const csrfToken = parts[0] || "";
  const isApp = parts[1] === APP_PLATFORM;

  return { csrfToken, isApp };
};
