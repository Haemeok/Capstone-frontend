import { renderHook } from "@testing-library/react";

jest.mock("../AdsGateContext", () => ({
  useAdsGate: jest.fn(() => ({ enabled: true, isTestUser: false })),
}));

import { useAdsGate } from "../AdsGateContext";
import { useFeedWithAds } from "../lib/useFeedWithAds";

const mockedUseAdsGate = jest.mocked(useAdsGate);

const RECIPES = [
  { id: "r1" },
  { id: "r2" },
  { id: "r3" },
  { id: "r4" },
  { id: "r5" },
  { id: "r6" },
];

describe("useFeedWithAds", () => {
  beforeEach(() => {
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
  });

  it("게이트 disabled 면 ad 아이템 0개 — admin/테스트 유저에서 빈 셀 회귀 방지", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: false, isTestUser: true });
    const { result } = renderHook(() => useFeedWithAds(RECIPES, 3, true));

    expect(result.current).toHaveLength(RECIPES.length);
    expect(result.current.every((item) => item.__kind === "recipe")).toBe(true);
  });

  it("surfaceEnabled false 면 ad 아이템 0개 — 페이지가 ad surface opt-out", () => {
    const { result } = renderHook(() => useFeedWithAds(RECIPES, 3, false));

    expect(result.current).toHaveLength(RECIPES.length);
    expect(result.current.every((item) => item.__kind === "recipe")).toBe(true);
  });

  it("enabled && surfaceEnabled 면 매 everyN 번째 뒤에 ad 삽입", () => {
    const { result } = renderHook(() => useFeedWithAds(RECIPES, 3, true));

    const kinds = result.current.map((item) => item.__kind);
    expect(kinds).toEqual([
      "recipe",
      "recipe",
      "recipe",
      "ad",
      "recipe",
      "recipe",
      "recipe",
      "ad",
    ]);
  });

  it("빈 입력은 빈 출력", () => {
    const { result } = renderHook(() => useFeedWithAds([], 3, true));
    expect(result.current).toEqual([]);
  });
});
