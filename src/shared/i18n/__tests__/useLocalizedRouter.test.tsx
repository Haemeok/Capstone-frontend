import { renderHook } from "@testing-library/react";

import { useLocalizedRouter } from "../useLocalizedRouter";

const pushMock = jest.fn();
const replaceMock = jest.fn();
const prefetchMock = jest.fn();
let pathname = "/";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
    prefetch: prefetchMock,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => pathname,
}));

describe("useLocalizedRouter", () => {
  beforeEach(() => jest.clearAllMocks());

  it("ja 경로에서 push가 active locale prefix를 붙인다", () => {
    pathname = "/ja/recipes";
    const { result } = renderHook(() => useLocalizedRouter());
    result.current.push("/recipes/new/ai/ingredient");
    expect(pushMock).toHaveBeenCalledWith(
      "/ja/recipes/new/ai/ingredient",
      undefined
    );
  });

  it("en 경로에서 replace가 en prefix를 붙인다", () => {
    pathname = "/en/recipes";
    const { result } = renderHook(() => useLocalizedRouter());
    result.current.replace("/recipes/new/ai/price");
    expect(replaceMock).toHaveBeenCalledWith(
      "/en/recipes/new/ai/price",
      undefined
    );
  });

  it("ko 경로에서는 prefix 없이 그대로 보낸다", () => {
    pathname = "/recipes";
    const { result } = renderHook(() => useLocalizedRouter());
    result.current.push("/recipes/new/ai/ingredient");
    expect(pushMock).toHaveBeenCalledWith(
      "/recipes/new/ai/ingredient",
      undefined
    );
  });

  it("이미 prefix된 경로는 이중 prefix하지 않는다", () => {
    pathname = "/ja/recipes";
    const { result } = renderHook(() => useLocalizedRouter());
    result.current.push("/ja/users/123");
    expect(pushMock).toHaveBeenCalledWith("/ja/users/123", undefined);
  });
});
