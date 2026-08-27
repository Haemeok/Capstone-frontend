import { render, screen } from "@testing-library/react";

import { AdsGateContext, useAdsGate } from "@/shared/adsense/AdsGateContext";
import { useIsApp } from "@/shared/hooks/useIsApp";

import { HomeAdsGate } from "../HomeAdsGate";

jest.mock("@/shared/hooks/useIsApp", () => ({
  useIsApp: jest.fn(),
}));

const mockedUseIsApp = jest.mocked(useIsApp);

const AdSurface = () => {
  const { enabled } = useAdsGate();
  return enabled ? (
    <div data-testid="home-ad-surface" className="my-2" />
  ) : null;
};

const renderGate = () =>
  render(
    <AdsGateContext.Provider value={{ enabled: true, isTestUser: false }}>
      <HomeAdsGate>
        <AdSurface />
      </HomeAdsGate>
    </AdsGateContext.Provider>
  );

describe("HomeAdsGate", () => {
  it("앱 WebView의 홈에서는 중첩된 광고와 여백까지 렌더하지 않습니다", () => {
    mockedUseIsApp.mockReturnValue(true);

    const { container } = renderGate();

    expect(screen.queryByTestId("home-ad-surface")).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it("일반 웹 홈에서는 기존 광고 설정을 유지합니다", () => {
    mockedUseIsApp.mockReturnValue(false);

    renderGate();

    expect(screen.getByTestId("home-ad-surface")).toHaveClass("my-2");
  });
});
