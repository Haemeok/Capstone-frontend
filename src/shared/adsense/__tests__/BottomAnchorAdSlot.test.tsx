import { render } from "@testing-library/react";

jest.mock("../config", () => ({
  ADSENSE_CLIENT_ID: "ca-pub-1",
  IS_AD_TEST_MODE: true,
  AD_SLOT_IDS: { recipeBottomAnchor: "1234567890" },
  AD_HEIGHT: { homeAnchor: 90, bottomAnchor: 70 },
}));

jest.mock("../AdsGateContext", () => ({
  useAdsGate: jest.fn(() => ({ enabled: true, isTestUser: false })),
}));

jest.mock("@/shared/hooks/useIsBottomNavVisible", () => ({
  useIsBottomNavVisible: jest.fn(() => false),
}));

import { useIsBottomNavVisible } from "@/shared/hooks/useIsBottomNavVisible";

import { useAdsGate } from "../AdsGateContext";
import { useBottomAdFillStore } from "../bottomAdFillStore";
import { BottomAnchorAdSlot } from "../BottomAnchorAdSlot";

const mockedUseAdsGate = jest.mocked(useAdsGate);
const mockedUseIsBottomNavVisible = jest.mocked(useIsBottomNavVisible);

describe("BottomAnchorAdSlot", () => {
  beforeEach(() => {
    delete (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle;
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    mockedUseIsBottomNavVisible.mockReturnValue(false);
    useBottomAdFillStore.setState({ filled: false });
  });

  afterEach(() => {
    useBottomAdFillStore.setState({ filled: false });
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

  it("nav 가 숨겨진 라우트에선 모바일에서 맨 아래에 붙는다", () => {
    mockedUseIsBottomNavVisible.mockReturnValue(false);
    const { container } = render(<BottomAnchorAdSlot />);
    const slot = container.querySelector("div");
    expect(slot?.className).not.toContain("bottom-[var(--bottom-nav-h)]");
  });

  it("nav 가 보이는 라우트에선 모바일에서 nav 높이만큼 위로 올라간다", () => {
    mockedUseIsBottomNavVisible.mockReturnValue(true);
    const { container } = render(<BottomAnchorAdSlot />);
    const slot = container.querySelector("div");
    expect(slot?.className).toContain("bottom-[var(--bottom-nav-h)]");
  });

  it("데스크톱(md+)에선 컨테이너 폭으로 제한되고 맨 아래에 붙는다", () => {
    mockedUseIsBottomNavVisible.mockReturnValue(true);
    const { container } = render(<BottomAnchorAdSlot />);
    const slot = container.querySelector("div");
    expect(slot?.className).toContain("md:max-w-4xl");
    expect(slot?.className).toContain("md:mx-auto");
    expect(slot?.className).toContain("md:bottom-0");
  });

  it("광고가 안 채워졌으면 흰 바 chrome 대신 탭 통과(pointer-events-none) 처리", () => {
    useBottomAdFillStore.setState({ filled: false });
    const { container } = render(<BottomAnchorAdSlot />);
    const slot = container.querySelector("div");
    expect(slot?.className).not.toContain("bg-white");
    expect(slot?.className).not.toContain("border-t");
    expect(slot?.className).toContain("pointer-events-none");
  });

  it("광고가 채워지면 흰 바 chrome(border-t/bg-white) 노출", () => {
    useBottomAdFillStore.setState({ filled: true });
    const { container } = render(<BottomAnchorAdSlot />);
    const slot = container.querySelector("div");
    expect(slot?.className).toContain("bg-white");
    expect(slot?.className).toContain("border-t");
    expect(slot?.className).not.toContain("pointer-events-none");
  });
});
