import {
  hasImageLoaded,
  markImageLoaded,
} from "@/shared/lib/loadedImageRegistry";

describe("loadedImageRegistry", () => {
  test("T-01: 로드 성공으로 기록한 src만 기억한다", () => {
    markImageLoaded("https://cdn.recipio.kr/a.jpg");

    expect(hasImageLoaded("https://cdn.recipio.kr/a.jpg")).toBe(true);
    expect(hasImageLoaded("https://cdn.recipio.kr/b.jpg")).toBe(false);
  });

  test("T-02: 새 세션(새 모듈 인스턴스)에서는 기억이 비어 있다", () => {
    markImageLoaded("https://cdn.recipio.kr/a.jpg");

    jest.isolateModules(() => {
      const fresh =
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("@/shared/lib/loadedImageRegistry") as typeof import("@/shared/lib/loadedImageRegistry");
      expect(fresh.hasImageLoaded("https://cdn.recipio.kr/a.jpg")).toBe(false);
    });
  });
});
