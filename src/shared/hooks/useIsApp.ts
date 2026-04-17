"use client";

import { useEffect,useState } from "react";

import { isAppWebView } from "@/shared/lib/bridge";

export const useIsApp = (): boolean => {
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    setIsApp(isAppWebView());
  }, []);

  return isApp;
};
