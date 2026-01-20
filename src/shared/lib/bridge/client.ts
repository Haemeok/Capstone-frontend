import type { BridgeMessageType } from "./types";

export const isAppWebView = (): boolean => {
  return typeof window !== "undefined" && !!window.ReactNativeWebView;
};

export const postMessage = <T = unknown>(
  type: BridgeMessageType,
  payload?: T
): void => {
  if (!isAppWebView()) return;

  window.ReactNativeWebView!.postMessage(JSON.stringify({ type, payload }));
};
