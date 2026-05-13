import { render } from "@testing-library/react";

jest.mock("../config", () => ({
  ADSENSE_CLIENT_ID: "ca-pub-1",
  IS_AD_TEST_MODE: true,
  AD_SLOT_IDS: { recipeBottomAnchor: "1234567890" },
}));

jest.mock("../AdsGateContext", () => ({
  useAdsGate: jest.fn(() => ({ enabled: true, isTestUser: false })),
}));

jest.mock("@/shared/hooks/useIsBottomNavVisible", () => ({
  useIsBottomNavVisible: jest.fn(() => false),
}));

import { BottomAnchorAdSlot } from "../BottomAnchorAdSlot";
import { useAdsGate } from "../AdsGateContext";
import { useIsBottomNavVisible } from "@/shared/hooks/useIsBottomNavVisible";

const mockedUseAdsGate = jest.mocked(useAdsGate);
const mockedUseIsBottomNavVisible = jest.mocked(useIsBottomNavVisible);

describe("BottomAnchorAdSlot", () => {
  beforeEach(() => {
    delete (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle;
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    mockedUseIsBottomNavVisible.mockReturnValue(false);
  });

  it("게이트 enabled false 면 null 렌더", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: false, isTestUser: false });
    const { container } = render(<BottomAnchorAdSlot />);
    expect(container).toBeEmptyDOMElement();
  });

  it("enabled 면 모바일용 anchor 컨테이너와 ins 렌더", () => {
    const { container } = render(<BottomAnchorAdSlot />);
    const ins = container.querySelector("ins.adsbygoogle");
    expect(ins).not.toBeNull();
    expect(ins?.getAttribute("data-ad-slot")).toBe("1234567890");
  });

  it("nav 가 숨겨진 라우트에선 bottom 0 으로 렌더", () => {
    mockedUseIsBottomNavVisible.mockReturnValue(false);
    const { container } = render(<BottomAnchorAdSlot />);
    const slot = container.querySelector("div");
    expect(slot).toHaveStyle({ bottom: "0px" });
  });

  it("nav 가 보이는 라우트에선 nav 높이만큼 위로 offset", () => {
    mockedUseIsBottomNavVisible.mockReturnValue(true);
    const { container } = render(<BottomAnchorAdSlot />);
    const slot = container.querySelector("div");
    expect(slot).toHaveStyle({ bottom: "77px" });
  });
});
