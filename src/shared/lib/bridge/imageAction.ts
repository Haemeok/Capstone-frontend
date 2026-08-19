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
};

export const requestNativeImageAction = async ({
  action,
  blob,
  fileName,
}: RequestNativeImageActionParams): Promise<ImageActionResultPayload> => {
  if (!isAppWebView()) throw new NativeImageActionUnsupportedError();
  const payload: ImageActionPayload = {
    v: 1,
    actionId: createActionId(),
    action,
    fileName,
    mimeType: "image/png",
    base64: await blobToBase64(blob),
  };
  const response = waitForImageActionResult(payload.actionId, payload.action);
  postMessage("IMAGE_ACTION", payload);
  return response;
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
