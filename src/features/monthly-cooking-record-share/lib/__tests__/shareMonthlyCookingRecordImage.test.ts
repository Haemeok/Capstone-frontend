import { shareMonthlyCookingRecordImage } from "../shareMonthlyCookingRecordImage";

const blob = new Blob(["png"], { type: "image/png" });
const downloadFallback = jest.fn();

describe("shareMonthlyCookingRecordImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("파일 공유를 지원하면 PNG File을 OS 공유 창에 전달합니다", async () => {
    const share = jest.fn().mockResolvedValue(undefined);
    Object.defineProperties(navigator, {
      canShare: { configurable: true, value: jest.fn().mockReturnValue(true) },
      share: { configurable: true, value: share },
    });

    await expect(
      shareMonthlyCookingRecordImage({
        blob,
        monthKey: "2026-08",
        title: "8월 요리 기록",
        text: "나의 요리 기록",
        downloadFallback,
      })
    ).resolves.toBe("shared");

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        files: [expect.any(File)],
        title: "8월 요리 기록",
        text: "나의 요리 기록",
      })
    );
    expect(downloadFallback).not.toHaveBeenCalled();
  });

  it("파일 공유를 지원하지 않으면 PNG 다운로드로 대체합니다", async () => {
    Object.defineProperties(navigator, {
      canShare: { configurable: true, value: jest.fn().mockReturnValue(false) },
      share: { configurable: true, value: jest.fn() },
    });

    await expect(
      shareMonthlyCookingRecordImage({
        blob,
        monthKey: "2026-08",
        title: "8월 요리 기록",
        text: "나의 요리 기록",
        downloadFallback,
      })
    ).resolves.toBe("downloaded");

    expect(downloadFallback).toHaveBeenCalledWith(blob, "2026-08");
  });

  it("File 객체가 없는 오래된 WebView에서도 다운로드로 대체합니다", async () => {
    const originalFile = Object.getOwnPropertyDescriptor(globalThis, "File");
    Reflect.deleteProperty(globalThis, "File");

    try {
      await expect(
        shareMonthlyCookingRecordImage({
          blob,
          monthKey: "2026-08",
          title: "8월 요리 기록",
          text: "나의 요리 기록",
          downloadFallback,
        })
      ).resolves.toBe("downloaded");

      expect(downloadFallback).toHaveBeenCalledWith(blob, "2026-08");
    } finally {
      if (originalFile) {
        Object.defineProperty(globalThis, "File", originalFile);
      }
    }
  });

  it("파일 공유 가능 여부 확인이 실패해도 다운로드로 대체합니다", async () => {
    Object.defineProperties(navigator, {
      canShare: {
        configurable: true,
        value: jest.fn(() => {
          throw new TypeError("files are not supported");
        }),
      },
      share: { configurable: true, value: jest.fn() },
    });

    await expect(
      shareMonthlyCookingRecordImage({
        blob,
        monthKey: "2026-08",
        title: "8월 요리 기록",
        text: "나의 요리 기록",
        downloadFallback,
      })
    ).resolves.toBe("downloaded");

    expect(downloadFallback).toHaveBeenCalledWith(blob, "2026-08");
  });

  it("사용자가 공유 창을 닫으면 오류나 다운로드로 처리하지 않습니다", async () => {
    const share = jest
      .fn()
      .mockRejectedValue(new DOMException("cancelled", "AbortError"));
    Object.defineProperties(navigator, {
      canShare: { configurable: true, value: jest.fn().mockReturnValue(true) },
      share: { configurable: true, value: share },
    });

    await expect(
      shareMonthlyCookingRecordImage({
        blob,
        monthKey: "2026-08",
        title: "8월 요리 기록",
        text: "나의 요리 기록",
        downloadFallback,
      })
    ).resolves.toBe("cancelled");
    expect(downloadFallback).not.toHaveBeenCalled();
  });
});
