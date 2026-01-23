"use client";

import { useEffect } from "react";

import { isAppWebView } from "./client";

const APP_WEBVIEW_CLASS = "is-app-webview";

export const AppWebViewDetector = () => {
  useEffect(() => {
    if (isAppWebView()) {
      document.documentElement.classList.add(APP_WEBVIEW_CLASS);
    }

    return () => {
      document.documentElement.classList.remove(APP_WEBVIEW_CLASS);
    };
  }, []);

  return null;
};
