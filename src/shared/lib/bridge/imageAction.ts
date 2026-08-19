import { parseAppToWebMessage } from "./appMessageGuard";
import { isAppWebView, postMessage } from "./client";
import type {
  ImageActionPayload,
  ImageActionResultPayload,
  NativeImageAction,
  NativeImageActionErrorCode,
} from "./types";

const HANDSHAKE_TIMEOUT_MS = 2_500;
const COMPLETION_TIMEOUT_MS = 60_000;

export class NativeImageActionError extends Error {
  constructor(readonly code: NativeImageActionErrorCode) {
    super(code);
    this.name = "NativeImageActionError";
  }
}

export class NativeImageActionUnsupportedError extends Error {
  constructor() {
    super("NATIVE_IMAGE_ACTION_UNSUPPORTED");
    this.name = "NativeImageActionUnsupportedError";
  }
}

export const isNativeImageActionUnsupportedError = (
  error: unknown
): error is NativeImageActionUnsupportedError =>
  error instanceof NativeImageActionUnsupportedError;

type RequestNativeImageActionParams = {
  action: NativeImageAction;
  blob: Blob;
  fileName: string;
  captureTarget?: HTMLElement | null;
};

type NativeImageCaptureCapability = "native-crop-v1";

let nativeImageCaptureCapability: NativeImageCaptureCapability | null = null;

export const setNativeImageCaptureCapability = (
  capability: NativeImageCaptureCapability | null
): void => {
  nativeImageCaptureCapability = capability;
};

export const requestNativeImageAction = async ({
  action,
  blob,
  fileName,
  captureTarget,
}: RequestNativeImageActionParams): Promise<ImageActionResultPayload> => {
  if (!isAppWebView()) throw new NativeImageActionUnsupportedError();
  const payload = await createImageActionPayload({
    action,
    blob,
    fileName,
    captureTarget,
  });
  const response = waitForImageActionResult(payload.actionId, payload.action);
  postMessage("IMAGE_ACTION", payload);
  return response;
};

const createImageActionPayload = async ({
  action,
  blob,
  fileName,
  captureTarget,
}: RequestNativeImageActionParams): Promise<ImageActionPayload> => {
  const mimeType = "image/png" as const;
  const commonPayload = {
    actionId: createActionId(),
    action,
    fileName,
    mimeType,
  };
  if (nativeImageCaptureCapability === "native-crop-v1" && captureTarget) {
    return {
      v: 2,
      ...commonPayload,
      capture: getNativeCaptureGeometry(captureTarget),
    };
  }
  return {
    v: 1,
    ...commonPayload,
    base64: await blobToBase64(blob),
  };
};

const getNativeCaptureGeometry = (
  captureTarget: HTMLElement
): Extract<ImageActionPayload, { v: 2 }>["capture"] => {
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const bounds = captureTarget.getBoundingClientRect();
  const rect = {
    x: bounds.left,
    y: bounds.top,
    width: bounds.width,
    height: bounds.height,
  };
  if (
    viewport.width <= 0 ||
    viewport.height <= 0 ||
    rect.x < 0 ||
    rect.y < 0 ||
    rect.width <= 0 ||
    rect.height <= 0 ||
    rect.x + rect.width > viewport.width ||
    rect.y + rect.height > viewport.height
  ) {
    throw new NativeImageActionError("IMAGE_CAPTURE_FAILED");
  }
  return { viewport, rect };
};

const waitForImageActionResult = (
  actionId: string,
  action: NativeImageAction
): Promise<ImageActionResultPayload> =>
  new Promise((resolve, reject) => {
    let timeoutId: number;
    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timeoutId);
    };
    const rejectAfter = (delay: number, error: Error) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        cleanup();
        reject(error);
      }, delay);
    };
    const handleMessage = (event: MessageEvent) => {
      const message = parseAppToWebMessage(parseMessageData(event.data));
      if (
        message?.type !== "IMAGE_ACTION_RESULT" ||
        message.payload.actionId !== actionId ||
        message.payload.action !== action
      ) {
        return;
      }
      if (message.payload.status === "accepted") {
        rejectAfter(
          COMPLETION_TIMEOUT_MS,
          new Error("NATIVE_IMAGE_ACTION_TIMEOUT")
        );
        return;
      }
      cleanup();
      if (message.payload.status === "failed") {
        reject(
          new NativeImageActionError(
            message.payload.errorCode ?? "INVALID_PAYLOAD"
          )
        );
        return;
      }
      resolve(message.payload);
    };

    window.addEventListener("message", handleMessage);
    rejectAfter(HANDSHAKE_TIMEOUT_MS, new NativeImageActionUnsupportedError());
  });

const parseMessageData = (data: unknown): unknown => {
  if (typeof data !== "string") return data;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("IMAGE_BLOB_READ_FAILED"));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("IMAGE_BLOB_READ_FAILED"));
        return;
      }
      const delimiterIndex = result.indexOf(",");
      if (delimiterIndex < 0) {
        reject(new Error("IMAGE_BLOB_READ_FAILED"));
        return;
      }
      resolve(result.slice(delimiterIndex + 1));
    };
    reader.readAsDataURL(blob);
  });

const createActionId = (): string =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
