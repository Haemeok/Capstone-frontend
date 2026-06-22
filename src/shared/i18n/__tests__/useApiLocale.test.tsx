import { renderHook } from "@testing-library/react";

const usePathnameMock = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => usePathnameMock() }));

import { useApiLocale } from "../useApiLocale";

describe("useApiLocale", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "preferred_locale=; path=/; max-age=0";
  });

  it("T-08: bare ko 경로 → useApiLocale='ko' (검색 lang 생략 → 양배추 매칭)", () => {
    usePathnameMock.mockReturnValue("/search");
    const { result } = renderHook(() => useApiLocale());
    expect(result.current).toBe("ko");
  });

  it("/en 경로 → 'en'", () => {
    usePathnameMock.mockReturnValue("/en/search");
    const { result } = renderHook(() => useApiLocale());
    expect(result.current).toBe("en");
  });
});
