import { act, renderHook, waitFor } from "@testing-library/react";

import { createMonthlyCookingRecordImage } from "../../lib/createMonthlyCookingRecordImage";
import { useMonthlyCookingRecordImage } from "../useMonthlyCookingRecordImage";

jest.mock("../../lib/createMonthlyCookingRecordImage", () => ({
  createMonthlyCookingRecordImage: jest.fn(),
}));

const mockedCreateImage = jest.mocked(createMonthlyCookingRecordImage);
const mockedIsAppWebView = jest.fn();
const mockedCaptureAnalyticsEvent = jest.fn();

jest.mock("@/shared/lib/bridge", () => ({
  isAppWebView: () => mockedIsAppWebView(),
}));

jest.mock("@/shared/lib/analytics", () => ({
  captureAnalyticsEvent: (...args: unknown[]) =>
    mockedCaptureAnalyticsEvent(...args),
}));

describe("useMonthlyCookingRecordImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsAppWebView.mockReturnValue(false);
  });

  it("카드가 연결되면 PNG를 미리 만들고 준비 상태로 전환합니다", async () => {
    const blob = new Blob(["png"], { type: "image/png" });
    mockedCreateImage.mockResolvedValue({ blob, diagnostics: diagnostics() });
    const { result } = renderHook(() =>
      useMonthlyCookingRecordImage({
        enabled: true,
        generationKey: "2026-08:record-1",
      })
    );
    const node = document.createElement("div");

    act(() => result.current.captureRef(node));

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.blob).toBe(blob);
    expect(mockedCreateImage).toHaveBeenCalledWith(node);
    expect(mockedCaptureAnalyticsEvent).not.toHaveBeenCalled();
  });

  it("앱 WebView 캡처는 원본·SVG·PNG 단계 진단값을 기록합니다", async () => {
    mockedIsAppWebView.mockReturnValue(true);
    const blob = new Blob(["png"], { type: "image/png" });
    mockedCreateImage.mockResolvedValue({ blob, diagnostics: diagnostics() });
    const { result } = renderHook(() =>
      useMonthlyCookingRecordImage({
        enabled: true,
        generationKey: "2026-08:record-1",
      })
    );

    act(() => result.current.captureRef(document.createElement("div")));

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(mockedCaptureAnalyticsEvent).toHaveBeenCalledWith(
      "monthly_share_capture_diagnostic",
      { captureVersion: 1, status: "completed", ...diagnostics() }
    );
  });

  it("앱 WebView 캡처 실패 로그에는 이미지 주소를 남기지 않습니다", async () => {
    mockedIsAppWebView.mockReturnValue(true);
    mockedCreateImage.mockRejectedValue(
      new Error("https://secret.example/sticker.webp")
    );
    const { result } = renderHook(() =>
      useMonthlyCookingRecordImage({
        enabled: true,
        generationKey: "2026-08:record-1",
      })
    );

    act(() => result.current.captureRef(document.createElement("div")));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(mockedCaptureAnalyticsEvent).toHaveBeenCalledWith(
      "monthly_share_capture_diagnostic",
      { captureVersion: 1, status: "failed", errorCode: "Error" }
    );
  });

  it("생성 실패 후 재시도하면 같은 카드에서 PNG를 다시 만듭니다", async () => {
    const blob = new Blob(["png"], { type: "image/png" });
    mockedCreateImage
      .mockRejectedValueOnce(new Error("capture failed"))
      .mockResolvedValueOnce({ blob, diagnostics: diagnostics() });
    const { result } = renderHook(() =>
      useMonthlyCookingRecordImage({
        enabled: true,
        generationKey: "2026-08:record-1",
      })
    );

    act(() => result.current.captureRef(document.createElement("div")));
    await waitFor(() => expect(result.current.status).toBe("error"));

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.blob).toBe(blob);
    expect(mockedCreateImage).toHaveBeenCalledTimes(2);
  });
});

const diagnostics = () => ({
  sourceImageCount: 10,
  sourceLoadedImageCount: 10,
  sourceStickerCount: 9,
  sourceLoadedStickerCount: 9,
  svgImageCount: 10,
  svgEmbeddedImageCount: 10,
  svgStickerCount: 9,
  svgEmbeddedStickerCount: 9,
  blobSize: 12_345,
});
