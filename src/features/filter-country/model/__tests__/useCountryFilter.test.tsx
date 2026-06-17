import { renderHook } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ replace: jest.fn() })),
  useSearchParams: jest.fn(),
  usePathname: () => "/",
}));

import { useSearchParams } from "next/navigation";

import { useCountryCodes } from "../useCountryFilter";

const mockParams = (search: string) =>
  (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(search));

describe("useCountryCodes", () => {
  it("creatorCountryTags 파라미터를 코드 배열로 읽는다", () => {
    mockParams("creatorCountryTags=JP,OTHER");
    const { result } = renderHook(() => useCountryCodes());
    expect(result.current).toEqual(["JP", "OTHER"]);
  });

  it("국가 파라미터가 없으면 빈 배열이다", () => {
    mockParams("");
    const { result } = renderHook(() => useCountryCodes());
    expect(result.current).toEqual([]);
  });
});
