import type { BridgeMessageType } from "./types";

export const isAppWebView = (): boolean => {
  return typeof window !== "undefined" && !!window.ReactNativeWebView;
};

export const postMessage = <T = unknown>(
  type: BridgeMessageType,
  payload?: T
): void => {
  if (!isAppWebView()) return;

  const message = JSON.stringify({ type, payload });
  window.ReactNativeWebView!.postMessage(message);
};
