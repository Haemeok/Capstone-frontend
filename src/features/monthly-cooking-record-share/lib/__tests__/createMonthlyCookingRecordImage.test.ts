import { toBlob } from "html-to-image";

import { createMonthlyCookingRecordImage } from "../createMonthlyCookingRecordImage";

jest.mock("html-to-image", () => ({
  toBlob: jest.fn(),
}));

const mockedToBlob = jest.mocked(toBlob);

describe("createMonthlyCookingRecordImage", () => {
  it("폰트와 카드 이미지를 기다린 뒤 1080 정사각형 PNG Blob을 만듭니다", async () => {
    const fontReady = Promise.resolve();
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: fontReady },
    });
    const node = document.createElement("div");
    const image = document.createElement("img");
    const decode = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(image, "complete", { value: false });
    image.decode = decode;
    node.append(image);
    const blob = new Blob(["png"], { type: "image/png" });
    mockedToBlob.mockResolvedValue(blob);

    await expect(createMonthlyCookingRecordImage(node)).resolves.toBe(blob);

    expect(decode).toHaveBeenCalledTimes(1);
    expect(mockedToBlob).toHaveBeenCalledWith(node, {
      cacheBust: true,
      height: 360,
      pixelRatio: 3,
      skipAutoScale: true,
      width: 360,
    });
  });

  it("이미지 생성 결과가 비어 있으면 실패로 처리합니다", async () => {
    mockedToBlob.mockResolvedValue(null);

    await expect(
      createMonthlyCookingRecordImage(document.createElement("div"))
    ).rejects.toThrow("MONTHLY_COOKING_RECORD_IMAGE_EMPTY");
  });
});
