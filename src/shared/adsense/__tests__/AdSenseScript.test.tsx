import { usePathname } from "next/navigation";

import { render, waitFor } from "@testing-library/react";

import { useIsApp } from "@/shared/hooks/useIsApp";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));

jest.mock("next/script", () => ({
  __esModule: true,
  default: ({ src }: { src: string }) => (
    <div data-testid="adsense-script" data-src={src} />
  ),
}));

jest.mock("../config", () => ({ ADSENSE_CLIENT_ID: "ca-pub-1" }));

jest.mock("../AdsGateContext", () => ({ useAdsGate: jest.fn() }));

jest.mock("@/shared/hooks/useIsApp", () => ({ useIsApp: jest.fn() }));

import { AdSenseScript } from "../AdSenseScript";
import { useAdsGate } from "../AdsGateContext";

const mockedUseAdsGate = jest.mocked(useAdsGate);
const mockedUseIsApp = jest.mocked(useIsApp);
const mockedUsePathname = jest.mocked(usePathname);

const adsenseScript = () =>
  document.querySelector('[data-testid="adsense-script"]');

describe("AdSenseScript (광고 제거 게이트)", () => {
  beforeEach(() => {
    mockedUseIsApp.mockReturnValue(false);
    mockedUsePathname.mockReturnValue("/");
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

  it("앱 WebView의 다국어 홈에서는 AdSense 스크립트를 주입하지 않는다", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    mockedUseIsApp.mockReturnValue(true);

    for (const pathname of ["/", "/en", "/ja"]) {
      mockedUsePathname.mockReturnValue(pathname);
      const view = render(<AdSenseScript />);
      expect(adsenseScript()).toBeNull();
      view.unmount();
    }
  });

  it("앱 WebView의 홈이 아닌 화면에서는 AdSense 스크립트를 유지한다", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    mockedUseIsApp.mockReturnValue(true);
    mockedUsePathname.mockReturnValue("/recipes/recipe-id");

    render(<AdSenseScript />);

    expect(adsenseScript()).not.toBeNull();
  });

  it("앱 홈으로 이동할 때 이미 삽입된 자동 광고를 제거한다", async () => {
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    mockedUseIsApp.mockReturnValue(true);
    mockedUsePathname.mockReturnValue("/");
    render(<AdSenseScript />);

    const autoAd = document.createElement("ins");
    autoAd.className = "adsbygoogle adsbygoogle-noablate";
    document.body.append(autoAd);

    await waitFor(() => {
      expect(document.querySelector("ins.adsbygoogle-noablate")).toBeNull();
    });
  });
});
