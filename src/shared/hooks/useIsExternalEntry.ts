"use client";

import { useEffect, useState } from "react";

export const INTERNAL_NAV_KEY = "recipio:hasInternalNav";
export const INITIAL_ENTRY_EXTERNAL_KEY = "recipio:initialEntryExternal";
export const LAST_PATH_KEY = "recipio:lastPath";

const detectExternalEntry = () => {
  const referrer = document.referrer;
  if (referrer) {
    try {
      if (new URL(referrer).origin !== window.location.origin) return true;
    } catch {
      return true;
    }
  }
  return window.history.length <= 1;
};

export const useIsExternalEntry = () => {
  const [isExternal, setIsExternal] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(INTERNAL_NAV_KEY)) return;

    const lastPath = sessionStorage.getItem(LAST_PATH_KEY);
    if (lastPath !== null && lastPath !== window.location.pathname) return;

    const cached = sessionStorage.getItem(INITIAL_ENTRY_EXTERNAL_KEY);
    if (cached !== null) {
      if (cached === "1") setIsExternal(true);
      return;
    }

    const external = detectExternalEntry();
    sessionStorage.setItem(INITIAL_ENTRY_EXTERNAL_KEY, external ? "1" : "0");
    if (external) setIsExternal(true);
  }, []);

  return isExternal;
};
