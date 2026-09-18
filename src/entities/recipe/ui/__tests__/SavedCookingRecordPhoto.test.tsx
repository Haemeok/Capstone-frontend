import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { markImageLoaded } from "@/shared/lib/loadedImageRegistry";

import { RECORD_MASK_PATHS } from "../../model/recordMaskShapes";
import { SavedCookingRecordPhoto } from "../SavedCookingRecordPhoto";

jest.mock("next/navigation", () => ({
  usePathname: () => "/calendar/timeline",
}));

jest.mock("@/shared/hooks/useInViewOnce", () => ({
  useInViewOnce: () => ({ ref: jest.fn(), inView: true }),
}));

describe("SavedCookingRecordPhoto", () => {
  it("서버에서 완성된 접시 사진은 다시 자르지 않고 접시 위에 표시합니다", () => {
    render(
      <div className="size-40">
        <SavedCookingRecordPhoto
          alt="카레"
          record={{
            displayMode: "DISH",
            originalImageUrl: "/original.webp",
            croppedImageUrl: "/cropped.webp",
            displayStyle: {
              plateId: "plate-1",
              plateImageUrl: "/plate.webp",
              maskShape: "WAVY_CIRCLE_6",
              crop: { centerX: 0.3, centerY: 0.6, zoom: 2 },
            },
          }}
        />
      </div>
    );

    const photo = screen.getByRole("img", { name: "카레" });
    expect(photo.querySelector('img[src="/cropped.webp"]')).not.toBeNull();
    expect(photo.querySelector('img[src="/plate.webp"]')).not.toBeNull();
    expect(photo.querySelector('img[src="/original.webp"]')).toBeNull();
    expect(photo.querySelector("clipPath")).toBeNull();
  });

  it("캐시된 원본도 실제 비율과 저장한 구도 계산이 끝난 뒤 표시합니다", async () => {
    markImageLoaded("/wide.webp");
    render(
      <div className="size-40">
        <SavedCookingRecordPhoto
          alt="비빔밥"
          record={{
            displayMode: "DISH",
            originalImageUrl: "/wide.webp",
            displayStyle: {
              maskShape: "ROUNDED_HEXAGON",
              crop: { centerX: 0.6, centerY: 0.5, zoom: 1.5 },
            },
          }}
        />
      </div>
    );

    const photo = screen.getByRole("img", { name: "비빔밥" });
    const source = photo.querySelector<HTMLImageElement>(
      'img[src="/wide.webp"]'
    );
    expect(source).not.toBeNull();
    expect(source).not.toBeVisible();
    expect(photo.querySelector("clipPath path")).toHaveAttribute(
      "d",
      RECORD_MASK_PATHS.ROUNDED_HEXAGON
    );

    Object.defineProperties(source, {
      naturalWidth: { configurable: true, value: 1200 },
      naturalHeight: { configurable: true, value: 600 },
    });
    if (!source) throw new Error("Saved dish source was not rendered");
    fireEvent.load(source);

    await waitFor(() =>
      expect(source).toHaveStyle({
        width: "300%",
        height: "150%",
      })
    );
    expect(source).toBeVisible();
  });

  it("스티커 기록은 스티커 이미지를 원본보다 우선합니다", () => {
    render(
      <div className="size-40">
        <SavedCookingRecordPhoto
          alt="파스타"
          record={{
            displayMode: "STICKER",
            originalImageUrl: "/original.webp",
            stickerImageUrl: "/sticker.webp",
          }}
        />
      </div>
    );

    const photo = screen.getByRole("img", { name: "파스타" });
    expect(photo.querySelector('img[src="/sticker.webp"]')).not.toBeNull();
    expect(photo.querySelector('img[src="/original.webp"]')).toBeNull();
  });
});
