import { render } from "@testing-library/react";

jest.mock("next/script", () => ({
  __esModule: true,
  default: ({ src }: { src: string }) => <script src={src} async />,
}));

jest.mock("../config", () => ({ ADSENSE_CLIENT_ID: "ca-pub-1" }));

jest.mock("../AdsGateContext", () => ({ useAdsGate: jest.fn() }));

import { AdSenseScript } from "../AdSenseScript";
import { useAdsGate } from "../AdsGateContext";

const mockedUseAdsGate = jest.mocked(useAdsGate);

const adsenseScript = () =>
  document.querySelector('script[src*="adsbygoogle"]');

describe("AdSenseScript (광고 제거 게이트)", () => {
  afterEach(() => {
    document
      .querySelectorAll('script[src*="adsbygoogle"]')
      .forEach((node) => node.remove());
  });

  it("T-A1: enabled=false(광고 제거)면 AdSense 스크립트를 주입하지 않는다", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: false, isTestUser: false });
    render(<AdSenseScript />);
    expect(adsenseScript()).toBeNull();
  });

  it("T-A2: enabled=true면 AdSense 스크립트를 주입한다", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    render(<AdSenseScript />);
    expect(adsenseScript()).not.toBeNull();
  });
});
