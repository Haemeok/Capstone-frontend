import {
  HIDDEN_NAVBAR_PATHS,
  HIDDEN_NAVBAR_PATTERNS_ALWAYS,
  HIDDEN_NAVBAR_PATTERNS_APP_ONLY,
} from "../config/constants/navigation";
import type { HiddenNavbarPath } from "../types";

type ShouldHideNavbarOptions = {
  /** RN WebView (앱) 환경 여부. 웹이면 콘텐츠 상세에서 nav 를 노출한다. */
  isApp: boolean;
};

export const isHiddenNavbarPath = (path: string): path is HiddenNavbarPath => {
  return (HIDDEN_NAVBAR_PATHS as readonly string[]).includes(path);
};

export const shouldHideNavbar = (
  pathname: string,
  options: ShouldHideNavbarOptions
): boolean => {
  if (isHiddenNavbarPath(pathname)) return true;
  if (HIDDEN_NAVBAR_PATTERNS_ALWAYS.some((p) => p.test(pathname))) return true;
  if (options.isApp && HIDDEN_NAVBAR_PATTERNS_APP_ONLY.some((p) => p.test(pathname))) {
    return true;
  }
  return false;
};
