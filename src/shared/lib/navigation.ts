import {
  HIDDEN_NAVBAR_PATHS,
  HIDDEN_NAVBAR_PATTERNS,
} from "../config/constants/navigation";
import type { HiddenNavbarPath } from "../types";

export const isHiddenNavbarPath = (path: string): path is HiddenNavbarPath => {
  return (HIDDEN_NAVBAR_PATHS as readonly string[]).includes(path);
};

export const shouldHideNavbar = (pathname: string): boolean => {
  return (
    isHiddenNavbarPath(pathname) ||
    HIDDEN_NAVBAR_PATTERNS.some((pattern) => pattern.test(pathname))
  );
};
