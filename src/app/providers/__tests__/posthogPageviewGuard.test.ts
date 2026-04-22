import {
  __resetPageviewGuard,
  shouldCapturePageview,
} from "../posthogPageviewGuard";

describe("shouldCapturePageview", () => {
  beforeEach(() => {
    __resetPageviewGuard();
  });

  it("최초 호출은 true 를 반환한다", () => {
    expect(shouldCapturePageview("https://www.recipio.kr/")).toBe(true);
  });

  it("같은 URL 로 다시 호출하면 false 를 반환한다", () => {
    const url = "https://www.recipio.kr/recipes/abc";
    shouldCapturePageview(url);
    expect(shouldCapturePageview(url)).toBe(false);
  });

  it("URL 이 바뀌면 다시 true 를 반환한다", () => {
    shouldCapturePageview("https://www.recipio.kr/recipes/abc");
    expect(shouldCapturePageview("https://www.recipio.kr/recipes/def")).toBe(
      true
    );
  });

  it("쿼리 문자열만 다르면 새 URL 로 간주해 true 를 반환한다", () => {
    shouldCapturePageview("https://www.recipio.kr/search?q=a");
    expect(shouldCapturePageview("https://www.recipio.kr/search?q=b")).toBe(
      true
    );
  });

  it("동일 URL 을 3회 연속 호출하면 첫 호출만 true 다", () => {
    const url = "https://www.recipio.kr/";
    expect(shouldCapturePageview(url)).toBe(true);
    expect(shouldCapturePageview(url)).toBe(false);
    expect(shouldCapturePageview(url)).toBe(false);
  });

  it("__resetPageviewGuard 는 내부 상태를 초기화한다", () => {
    const url = "https://www.recipio.kr/";
    shouldCapturePageview(url);
    __resetPageviewGuard();
    expect(shouldCapturePageview(url)).toBe(true);
  });
});
