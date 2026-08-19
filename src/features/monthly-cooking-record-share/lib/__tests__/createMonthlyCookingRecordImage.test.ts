import { toSvg } from "html-to-image";

import { createMonthlyCookingRecordImage } from "../createMonthlyCookingRecordImage";

jest.mock("html-to-image", () => ({
  toSvg: jest.fn(),
}));

const mockedToSvg = jest.mocked(toSvg);

describe("createMonthlyCookingRecordImage", () => {
  beforeEach(() => {
    mockedToSvg.mockReset();
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
      const sticker = document.createElement("div");
      sticker.dataset.shareSticker = "true";
      const image = document.createElement("img");
      image.src = src;
      Object.defineProperties(image, {
        complete: { configurable: true, value: true },
        naturalWidth: { configurable: true, value: 256 },
      });
      sticker.append(image);
      node.append(sticker);
    });
    const blob = new Blob(["png"], { type: "image/png" });
    mockSvgRasterization(blob);
    mockedToSvg.mockImplementation(async (captureNode) => {
      const capturedPaths = Array.from(
        captureNode.querySelectorAll("img"),
        (image) => new URL(image.src).pathname
      );
      expect(capturedPaths).toEqual(stickerPaths);
      return createSvgDataUrl(2);
    });

    const result = await createMonthlyCookingRecordImage(node);

    expect(result.blob).toBe(blob);
    expect(result.diagnostics).toEqual({
      sourceImageCount: 2,
      sourceLoadedImageCount: 2,
      sourceStickerCount: 2,
      sourceLoadedStickerCount: 2,
      svgImageCount: 2,
      svgEmbeddedImageCount: 2,
      svgStickerCount: 2,
      svgEmbeddedStickerCount: 2,
      blobSize: blob.size,
    });

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(3);
    expect(mockedToSvg).toHaveBeenCalledWith(node, {
      cacheBust: true,
      canvasHeight: 360,
      canvasWidth: 360,
      pixelRatio: 3,
      skipAutoScale: true,
    });
  });

  it("SVG 안의 스티커를 동기 디코딩한 뒤 PNG Blob을 만듭니다", async () => {
    const blob = new Blob(["png"], { type: "image/png" });
    const { decode, drawImage, rasterImage } = mockSvgRasterization(blob);
    mockedToSvg.mockResolvedValue("data:image/svg+xml;charset=utf-8,card");

    await expect(
      createMonthlyCookingRecordImage(document.createElement("div"))
    ).resolves.toEqual(expect.objectContaining({ blob }));

    expect(rasterImage.decoding).toBe("sync");
    expect(decode).toHaveBeenCalledTimes(1);
    expect(drawImage).toHaveBeenCalledWith(rasterImage, 0, 0, 1080, 1080);
  });

  it("픽셀이 없는 이미지는 빈 공유 이미지로 처리하지 않습니다", async () => {
    const node = document.createElement("div");
    const image = document.createElement("img");
    Object.defineProperties(image, {
      complete: { configurable: true, value: true },
      naturalWidth: { configurable: true, value: 0 },
    });
    node.append(image);

    await expect(createMonthlyCookingRecordImage(node)).rejects.toThrow(
      "MONTHLY_COOKING_RECORD_IMAGE_ASSET_FAILED"
    );
    expect(mockedToSvg).not.toHaveBeenCalled();
  });

  it("이미지 생성 결과가 비어 있으면 실패로 처리합니다", async () => {
    mockSvgRasterization(null);
    mockedToSvg.mockResolvedValue("data:image/svg+xml;charset=utf-8,card");

    await expect(
      createMonthlyCookingRecordImage(document.createElement("div"))
    ).rejects.toThrow("MONTHLY_COOKING_RECORD_IMAGE_EMPTY");
  });
});

const mockSvgRasterization = (blob: Blob | null) => {
  const rasterImage = document.createElement("img");
  const decode = jest.fn().mockResolvedValue(undefined);
  let source = "";
  rasterImage.decode = decode;
  Object.defineProperty(rasterImage, "src", {
    configurable: true,
    get: () => source,
    set: (value: string) => {
      source = value;
      queueMicrotask(() => rasterImage.onload?.(new Event("load")));
    },
  });
  jest.spyOn(window, "Image").mockImplementation(() => rasterImage);
  const drawImage = jest.fn();
  jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockImplementation(() => {
      // `as` permitted: the test only exercises drawImage on this canvas context double.
      return { drawImage } as unknown as CanvasRenderingContext2D;
    });
  jest
    .spyOn(HTMLCanvasElement.prototype, "toBlob")
    .mockImplementation((callback) => callback(blob));
  return { decode, drawImage, rasterImage };
};

const createSvgDataUrl = (stickerCount: number): string => {
  const stickers = Array.from(
    { length: stickerCount },
    (_, index) =>
      `<div data-share-sticker="true"><img src="data:image/webp;base64,sticker-${index}" /></div>`
  ).join("");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg"><foreignObject>${stickers}</foreignObject></svg>`
  )}`;
};
