"use client";

import { useState, useEffect } from "react";

import { isAppWebView } from "@/shared/lib/bridge";

export const useIsApp = (): boolean => {
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    setIsApp(isAppWebView());
  }, []);

  return isApp;
};
