import { toBlob } from "html-to-image";

import { createMonthlyCookingRecordImage } from "../createMonthlyCookingRecordImage";

jest.mock("html-to-image", () => ({
  toBlob: jest.fn(),
}));

const mockedToBlob = jest.mocked(toBlob);

describe("createMonthlyCookingRecordImage", () => {
  beforeEach(() => {
    mockedToBlob.mockReset();
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("모든 스티커가 화면에 반영된 뒤 1080 정사각형 PNG Blob을 만듭니다", async () => {
    const fontReady = Promise.resolve();
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: fontReady },
    });
    const node = document.createElement("div");
    const stickerPaths = ["/records/sticker-1.webp", "/records/sticker-2.webp"];
    stickerPaths.forEach((src) => {
      const image = document.createElement("img");
      image.src = src;
      Object.defineProperties(image, {
        complete: { configurable: true, value: true },
        naturalWidth: { configurable: true, value: 256 },
      });
      node.append(image);
    });
    const blob = new Blob(["png"], { type: "image/png" });
    mockedToBlob.mockImplementation(async (captureNode) => {
      const capturedPaths = Array.from(
        captureNode.querySelectorAll("img"),
        (image) => new URL(image.src).pathname
      );
      expect(capturedPaths).toEqual(stickerPaths);
      return blob;
    });

    await expect(createMonthlyCookingRecordImage(node)).resolves.toBe(blob);

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);
    expect(mockedToBlob).toHaveBeenCalledWith(node, {
      cacheBust: true,
      canvasHeight: 360,
      canvasWidth: 360,
      pixelRatio: 3,
      skipAutoScale: true,
    });
  });

  it("픽셀이 없는 이미지는 빈 공유 이미지로 처리하지 않습니다", async () => {
    const node = document.createElement("div");
    const image = document.createElement("img");
    Object.defineProperties(image, {
      complete: { configurable: true, value: true },
      naturalWidth: { configurable: true, value: 0 },
    });
    node.append(image);
    mockedToBlob.mockResolvedValue(new Blob(["png"], { type: "image/png" }));

    await expect(createMonthlyCookingRecordImage(node)).rejects.toThrow(
      "MONTHLY_COOKING_RECORD_IMAGE_ASSET_FAILED"
    );
    expect(mockedToBlob).not.toHaveBeenCalled();
  });

  it("이미지 생성 결과가 비어 있으면 실패로 처리합니다", async () => {
    mockedToBlob.mockResolvedValue(null);

    await expect(
      createMonthlyCookingRecordImage(document.createElement("div"))
    ).rejects.toThrow("MONTHLY_COOKING_RECORD_IMAGE_EMPTY");
  });
});
