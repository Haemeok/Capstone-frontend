import { renderHook } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: () => "/",
}));

// eslint-disable-next-line local/no-raw-router -- 테스트: next/navigation 모킹용 import
import { useRouter, useSearchParams } from "next/navigation";

import { useNutritionParams } from "../useNutritionParams";

const mockNavigation = (search: string) => {
  const replace = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ replace });
  (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(search));
  return replace;
};

describe("useNutritionParams 국가 적용", () => {
  it("적용 시 선택한 국가를 creatorCountryTags로 쓴다", () => {
    const replace = mockNavigation("");
    const { result } = renderHook(() => useNutritionParams());

    result.current.updateNutritionAndTypes({}, ["YOUTUBE"], ["일본"]);

    expect(replace).toHaveBeenCalledWith(
      expect.stringContaining("creatorCountryTags=JP"),
      undefined
    );
  });

  it("국가가 비면 creatorCountryTags 파라미터를 쓰지 않는다", () => {
    const replace = mockNavigation("");
    const { result } = renderHook(() => useNutritionParams());

    result.current.updateNutritionAndTypes({}, ["YOUTUBE"], []);

    expect(replace).toHaveBeenCalledWith(
      expect.not.stringContaining("creatorCountryTags"),
      undefined
    );
  });

  it("URL의 creatorCountryTags를 라벨로 읽는다", () => {
    mockNavigation("creatorCountryTags=JP,OTHER");
    const { result } = renderHook(() => useNutritionParams());

    expect(result.current.countries).toEqual(["일본", "기타"]);
  });
});
