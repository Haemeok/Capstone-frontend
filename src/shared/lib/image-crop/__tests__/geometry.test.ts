import type { CropPoint } from "../geometry";
import {
  clampCrop,
  getCropImageStyle,
  panCrop,
  pinchCrop,
  zoomCropAt,
} from "../geometry";

describe("image crop geometry", () => {
  it("가로 사진은 cover로 채운 뒤 좌우 빈 공간이 생기지 않는 범위로 중심을 제한한다", () => {
    expect(
      clampCrop(
        { centerX: 0, centerY: 0, zoom: 1 },
        { width: 2000, height: 1000 }
      )
    ).toEqual({ centerX: 0.25, centerY: 0.5, zoom: 1 });
    expect(
      clampCrop(
        { centerX: 1, centerY: 1, zoom: 1 },
        { width: 2000, height: 1000 }
      )
    ).toEqual({ centerX: 0.75, centerY: 0.5, zoom: 1 });
  });

  it("세로 사진은 cover로 채운 뒤 상하 빈 공간이 생기지 않는 범위로 중심을 제한한다", () => {
    expect(
      clampCrop(
        { centerX: 0, centerY: 0, zoom: 1 },
        { width: 1000, height: 2000 }
      )
    ).toEqual({ centerX: 0.5, centerY: 0.25, zoom: 1 });
    expect(
      clampCrop(
        { centerX: 1, centerY: 1, zoom: 1 },
        { width: 1000, height: 2000 }
      )
    ).toEqual({ centerX: 0.5, centerY: 0.75, zoom: 1 });
  });

  it("드래그한 화면 거리만큼 사진 중심을 옮기고 경계를 넘지 않는다", () => {
    expect(
      panCrop(
        { centerX: 0.5, centerY: 0.5, zoom: 1 },
        { width: 2000, height: 1000 },
        { width: 300, height: 300 },
        { x: 30, y: 100 }
      )
    ).toEqual({ centerX: 0.45, centerY: 0.5, zoom: 1 });
  });

  it("두 손가락의 거리가 변해도 중간점 아래의 원본 지점을 유지한다", () => {
    const initialCrop = { centerX: 0.5, centerY: 0.5, zoom: 1 };
    const imageSize = { width: 2000, height: 1000 };
    const viewportSize = { width: 300, height: 300 };
    const initialPointers: [CropPoint, CropPoint] = [
      { x: 90, y: 120 },
      { x: 190, y: 120 },
    ];
    const currentPointers: [CropPoint, CropPoint] = [
      { x: 80, y: 150 },
      { x: 230, y: 150 },
    ];

    const nextCrop = pinchCrop(
      initialCrop,
      imageSize,
      viewportSize,
      initialPointers,
      currentPointers
    );

    expect(nextCrop.zoom).toBeCloseTo(1.5);
    expect(nextCrop.centerX).toBeCloseTo(0.477778);
    expect(nextCrop.centerY).toBeCloseTo(0.4);
  });

  it("커서 위치를 기준으로 확대하며 최소 1배와 최대 4배를 지킨다", () => {
    const imageSize = { width: 1000, height: 1000 };
    const viewportSize = { width: 300, height: 300 };

    expect(
      zoomCropAt(
        { centerX: 0.5, centerY: 0.5, zoom: 1 },
        imageSize,
        viewportSize,
        { x: 225, y: 150 },
        2
      )
    ).toEqual({ centerX: 0.625, centerY: 0.5, zoom: 2 });
    expect(
      zoomCropAt(
        { centerX: 0.5, centerY: 0.5, zoom: 3 },
        imageSize,
        viewportSize,
        { x: 150, y: 150 },
        10
      ).zoom
    ).toBe(4);
  });

  it("표시용 스타일에도 편집기와 같은 cover 및 중심 좌표를 반영한다", () => {
    const style = getCropImageStyle(
      { width: 2000, height: 1000 },
      { centerX: 0.25, centerY: 0.5, zoom: 2 }
    );

    expect(style.width).toBe("400%");
    expect(style.height).toBe("200%");
    expect(style.left).toBe("-50%");
    expect(style.top).toBe("-50%");
  });
});
