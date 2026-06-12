import { render } from "@testing-library/react";

import { useBottomAdFillStore } from "@/shared/adsense/bottomAdFillStore";
import { AD_HEIGHT } from "@/shared/adsense/config";

import { BottomLayoutController } from "../BottomLayoutController";

jest.mock("@/shared/adsense/AdsGateContext", () => ({
  useAdsGate: jest.fn(),
}));

jest.mock("@/shared/hooks/useIsBottomNavVisible", () => ({
  useIsBottomNavVisible: () => false,
}));

import { useAdsGate } from "@/shared/adsense/AdsGateContext";

const mockedUseAdsGate = jest.mocked(useAdsGate);
const adHeight = `${AD_HEIGHT.bottomAnchor}px`;
const mainPb = () =>
  document.documentElement.style.getPropertyValue("--main-pb");

describe("BottomLayoutController (광고 예약 공간)", () => {
  afterEach(() => {
    document.documentElement.style.removeProperty("--main-pb");
    useBottomAdFillStore.setState({ filled: false });
  });

  it("T-A7: enabled=false(광고 제거)면 --main-pb에 하단 앵커 높이를 포함하지 않는다", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: false, isTestUser: false });
    useBottomAdFillStore.setState({ filled: true });
    render(<BottomLayoutController />);
    expect(mainPb()).not.toContain(adHeight);
  });

  it("T-A7b: enabled=true이고 광고가 채워지면 --main-pb에 하단 앵커 높이를 포함한다", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    useBottomAdFillStore.setState({ filled: true });
    render(<BottomLayoutController />);
    expect(mainPb()).toContain(adHeight);
  });

  it("T-A7c: enabled=true여도 광고가 안 채워졌으면 높이를 예약하지 않는다", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    useBottomAdFillStore.setState({ filled: false });
    render(<BottomLayoutController />);
    expect(mainPb()).not.toContain(adHeight);
  });
});
