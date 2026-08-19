import { waitFor } from "@testing-library/react";

import {
  isNativeImageActionUnsupportedError,
  NativeImageActionError,
  requestNativeImageAction,
  setNativeImageCaptureCapability,
} from "../imageAction";
import type {
  ImageActionPayload,
  ImageActionResultPayload,
  NativeImageActionErrorCode,
} from "../types";

const postMessage = jest.fn();

const createInput = (action: ImageActionPayload["action"]) => ({
  action,
  blob: new Blob(["png"], { type: "image/png" }),
  fileName: "recipio-cooking-record-2026-08.png",
});

type PostedImageAction = Pick<ImageActionPayload, "actionId" | "action">;

const getPostedPayload = async (): Promise<PostedImageAction> => {
  await waitFor(() => expect(postMessage).toHaveBeenCalledTimes(1));
  const message: unknown = JSON.parse(postMessage.mock.calls[0][0]);
  if (
    typeof message !== "object" ||
    message === null ||
    !("payload" in message)
  ) {
    throw new Error("missing payload");
  }
  const payload = message.payload;
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("actionId" in payload) ||
    !("action" in payload)
  ) {
    throw new Error("invalid payload");
  }
  return {
    actionId: String(payload.actionId),
    action: payload.action === "shareImage" ? "shareImage" : "saveImage",
  };
};

const dispatchResult = (
  payload: PostedImageAction,
  status: ImageActionResultPayload["status"],
  errorCode?: NativeImageActionErrorCode
) => {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: {
        type: "IMAGE_ACTION_RESULT",
        payload: {
          v: 1,
          actionId: payload.actionId,
          action: payload.action,
          status,
          ...(errorCode ? { errorCode } : {}),
        },
      },
    })
  );
};

describe("requestNativeImageAction", () => {
  beforeEach(() => {
    postMessage.mockReset();
    setNativeImageCaptureCapability(null);
    window.ReactNativeWebView = { postMessage };
  });

  afterEach(() => {
    delete window.ReactNativeWebView;
    jest.restoreAllMocks();
  });

  it.each(["saveImage", "shareImage"] as const)(
    "%s 요청에 PNG base64와 고유 ID가 든 버전 1 payload를 보냅니다",
    async (action) => {
      const resultPromise = requestNativeImageAction(createInput(action));
      const payload = await getPostedPayload();

      expect(JSON.parse(postMessage.mock.calls[0][0])).toEqual({
        type: "IMAGE_ACTION",
        payload: {
          v: 1,
          actionId: expect.any(String),
          action,
          fileName: "recipio-cooking-record-2026-08.png",
          mimeType: "image/png",
          base64: "cG5n",
        },
      });

      dispatchResult(payload, "accepted");
      dispatchResult(payload, action === "saveImage" ? "saved" : "presented");
      await expect(resultPromise).resolves.toMatchObject({
        actionId: payload.actionId,
        action,
      });
    }
  );

  it("native-crop-v1 앱에는 base64 대신 카드 좌표가 든 버전 2 payload를 보냅니다", async () => {
    setNativeImageCaptureCapability("native-crop-v1");
    const captureTarget = document.createElement("div");
    jest.spyOn(captureTarget, "getBoundingClientRect").mockReturnValue({
      x: 20,
      y: 80,
      left: 20,
      top: 80,
      width: 360,
      height: 360,
      right: 380,
      bottom: 440,
      toJSON: () => ({}),
    });

    const resultPromise = requestNativeImageAction({
      ...createInput("saveImage"),
      captureTarget,
    });
    const payload = await getPostedPayload();

    expect(JSON.parse(postMessage.mock.calls[0][0])).toEqual({
      type: "IMAGE_ACTION",
      payload: {
        v: 2,
        actionId: expect.any(String),
        action: "saveImage",
        fileName: "recipio-cooking-record-2026-08.png",
        mimeType: "image/png",
        capture: {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          rect: { x: 20, y: 80, width: 360, height: 360 },
        },
      },
    });

    dispatchResult(payload, "accepted");
    dispatchResult(payload, "saved");
    await expect(resultPromise).resolves.toMatchObject({ status: "saved" });
  });

  it("accepted 응답만으로 완료하지 않고 같은 요청의 최종 응답을 기다립니다", async () => {
    let isSettled = false;
    const resultPromise = requestNativeImageAction(
      createInput("saveImage")
    ).finally(() => {
      isSettled = true;
    });
    const payload = await getPostedPayload();

    dispatchResult(payload, "accepted");
    await Promise.resolve();
    expect(isSettled).toBe(false);

    dispatchResult(payload, "saved");
    await expect(resultPromise).resolves.toMatchObject({ status: "saved" });
  });

  it("다른 요청과 중복 최종 응답을 무시하고 첫 최종 결과만 반환합니다", async () => {
    const resultPromise = requestNativeImageAction(createInput("saveImage"));
    const payload = await getPostedPayload();
    const otherPayload = { ...payload, actionId: "other-action" };

    dispatchResult(otherPayload, "saved");
    dispatchResult(payload, "accepted");
    dispatchResult(payload, "saved");
    dispatchResult(payload, "failed", "PHOTO_SAVE_FAILED");

    await expect(resultPromise).resolves.toMatchObject({ status: "saved" });
  });

  it("같은 요청 ID라도 요청한 작업과 다른 결과는 무시합니다", async () => {
    const resultPromise = requestNativeImageAction(createInput("saveImage"));
    const payload = await getPostedPayload();

    dispatchResult({ ...payload, action: "shareImage" }, "presented");
    dispatchResult(payload, "accepted");
    dispatchResult(payload, "saved");

    await expect(resultPromise).resolves.toMatchObject({
      action: "saveImage",
      status: "saved",
    });
  });

  it("네이티브 실패 응답의 errorCode를 보존해 거부합니다", async () => {
    const resultPromise = requestNativeImageAction(createInput("saveImage"));
    const payload = await getPostedPayload();

    dispatchResult(payload, "accepted");
    dispatchResult(payload, "failed", "PHOTO_SAVE_FAILED");

    await expect(resultPromise).rejects.toEqual(
      new NativeImageActionError("PHOTO_SAVE_FAILED")
    );
  });

  it("초기 응답이 없는 구버전 앱은 지원하지 않는 오류로 종료합니다", async () => {
    const resultPromise = requestNativeImageAction(createInput("saveImage"));
    await getPostedPayload();

    const error: unknown = await resultPromise.catch(
      (reason: unknown) => reason
    );
    expect(isNativeImageActionUnsupportedError(error)).toBe(true);
  });
});
