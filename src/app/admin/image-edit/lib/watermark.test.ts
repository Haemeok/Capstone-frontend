import { positionToStyle, WATERMARK_POSITIONS } from "./watermark";

describe("positionToStyle", () => {
  it("9개 위치를 모두 정의한다", () => {
    expect(WATERMARK_POSITIONS).toHaveLength(9);
  });

  it("top-left: padding을 top/left에 적용", () => {
    expect(positionToStyle("top-left", 24)).toEqual({
      position: "absolute",
      top: 24,
      left: 24,
    });
  });

  it("bottom-right: padding을 bottom/right에 적용", () => {
    expect(positionToStyle("bottom-right", 30)).toEqual({
      position: "absolute",
      bottom: 30,
      right: 30,
    });
  });

  it("top-center: 가로 중앙 정렬", () => {
    expect(positionToStyle("top-center", 12)).toEqual({
      position: "absolute",
      top: 12,
      left: "50%",
      transform: "translateX(-50%)",
    });
  });

  it("middle-left: 세로 중앙 정렬", () => {
    expect(positionToStyle("middle-left", 12)).toEqual({
      position: "absolute",
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
    });
  });

  it("middle-center: 양방향 중앙 정렬", () => {
    expect(positionToStyle("middle-center", 0)).toEqual({
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translateY(-50%) translateX(-50%)",
    });
  });
});
