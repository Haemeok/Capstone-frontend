import type { BridgeMessageType } from "./types";

export const isAppWebView = (): boolean => {
  return typeof window !== "undefined" && !!window.ReactNativeWebView;
};

export const postMessage = <T = unknown>(
  type: BridgeMessageType,
  payload?: T
): void => {
  console.log("[Bridge] postMessage called:", type, payload);
  console.log("[Bridge] isAppWebView:", isAppWebView());
  console.log(
    "[Bridge] ReactNativeWebView:",
    typeof window !== "undefined" ? !!window.ReactNativeWebView : "SSR"
  );

  if (!isAppWebView()) {
    console.log("[Bridge] Not in WebView, skipping");
    return;
  }

  const message = JSON.stringify({ type, payload });
  console.log("[Bridge] Sending:", message);
  window.ReactNativeWebView!.postMessage(message);
};
