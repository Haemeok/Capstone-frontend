declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export type HapticStyle =
  | "Light"
  | "Medium"
  | "Heavy"
  | "Success"
  | "Warning"
  | "Error";

export type BridgeMessageType = "HAPTIC" | "NAVIGATION" | "SHARE" | "STORAGE";

export type BridgeMessage<T = unknown> = {
  type: BridgeMessageType;
  payload?: T;
};
