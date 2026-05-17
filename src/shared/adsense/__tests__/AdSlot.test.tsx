import { act } from "react";
import { render, screen } from "@testing-library/react";

jest.mock("../config", () => ({
  ADSENSE_CLIENT_ID: "ca-pub-1",
  IS_AD_TEST_MODE: true,
  AD_SLOT_IDS: { searchInFeed: "", recipeInArticle: "" },
  SEARCH_AD_EVERY_N_CARDS: 10,
  AD_MIN_HEIGHT: { inFeed: 280, inArticle: 260 },
}));

jest.mock("../AdsGateContext", () => ({
  useAdsGate: jest.fn(() => ({ enabled: true, isTestUser: false })),
}));

import { AdSlot } from "../AdSlot";
import { useAdsGate } from "../AdsGateContext";

const mockedUseAdsGate = jest.mocked(useAdsGate);

describe("AdSlot", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    delete (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle;
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("게이트 enabled false 면 null 렌더", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: false, isTestUser: false });
    const { container } = render(<AdSlot slotId="1234567890" minHeight={280} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("slotId 없고 test mode 면 플레이스홀더 렌더", () => {
    render(<AdSlot slotId={undefined} minHeight={280} />);
    expect(screen.getByText(/광고 영역 \(dev\)/i)).toBeInTheDocument();
  });

  it("slotId 있으면 <ins> 렌더 + adsbygoogle.push 1회", () => {
    const { container } = render(<AdSlot slotId="9999" minHeight={280} />);
    const ins = container.querySelector("ins.adsbygoogle");
    expect(ins).not.toBeNull();
    expect(ins?.getAttribute("data-ad-slot")).toBe("9999");
    expect((window.adsbygoogle as unknown[]).length).toBe(1);
  });

  it("타임아웃 내에 <ins> 빈 상태면 wrapper display:none 처리 (애드블록 대비)", () => {
    const { container } = render(<AdSlot slotId="9999" minHeight={280} />);
    const wrapper = container.firstChild as HTMLElement | null;
    expect(wrapper?.style.display).not.toBe("none");
    act(() => {
      jest.advanceTimersByTime(7100);
    });
    expect(wrapper?.style.display).toBe("none");
  });
});
