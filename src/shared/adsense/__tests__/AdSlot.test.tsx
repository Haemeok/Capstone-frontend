import { act, StrictMode } from "react";

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

import { useAdsGate } from "../AdsGateContext";
import { AdSlot } from "../AdSlot";

const mockedUseAdsGate = jest.mocked(useAdsGate);

type IntersectionCallback = (entries: { isIntersecting: boolean }[]) => void;

let intersectionCallbacks: IntersectionCallback[] = [];

const enterViewport = () => {
  act(() => {
    intersectionCallbacks.forEach((cb) => cb([{ isIntersecting: true }]));
  });
};

describe("AdSlot", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    delete (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle;
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    intersectionCallbacks = [];
    class IntersectionObserverMock {
      constructor(cb: IntersectionCallback) {
        intersectionCallbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(globalThis, "IntersectionObserver", {
      writable: true,
      configurable: true,
      value: IntersectionObserverMock,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("게이트 enabled false 면 null 렌더", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: false, isTestUser: false });
    const { container } = render(
      <AdSlot slotId="1234567890" minHeight={280} />
    );
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

  it("첫 진입에서 광고가 활성화되면 모든 슬롯을 한 번씩 요청한다", () => {
    mockedUseAdsGate.mockReturnValue({ enabled: false, isTestUser: false });
    const slots = ["article-1", "article-2", "steps", "bottom"];
    const ads = () =>
      slots.map((slotId) => (
        <AdSlot key={slotId} slotId={slotId} minHeight={70} />
      ));
    const { container, rerender } = render(<>{ads()}</>);
    expect(window.adsbygoogle).toBeUndefined();
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    rerender(<>{ads()}</>);
    expect(container.querySelectorAll("ins")).toHaveLength(4);
    expect(window.adsbygoogle).toHaveLength(4);
  });

  it("Strict Mode와 재렌더에서는 중복 요청하지 않고 새 슬롯 DOM만 다시 요청한다", () => {
    const ad = (slotId: string) => (
      <StrictMode>
        <AdSlot slotId={slotId} minHeight={70} />
      </StrictMode>
    );
    const { container, rerender } = render(ad("bottom"));
    const original = container.querySelector("ins");
    rerender(ad("bottom"));
    expect(window.adsbygoogle).toHaveLength(1);
    mockedUseAdsGate.mockReturnValue({ enabled: false, isTestUser: false });
    rerender(ad("bottom"));
    expect(container).toBeEmptyDOMElement();
    mockedUseAdsGate.mockReturnValue({ enabled: true, isTestUser: false });
    rerender(ad("bottom"));
    expect(container.querySelector("ins")).not.toBe(original);
    expect(window.adsbygoogle).toHaveLength(2);
    const previous = container.querySelector("ins");
    rerender(ad("replacement"));
    expect(container.querySelector("ins")).not.toBe(previous);
    expect(window.adsbygoogle).toHaveLength(3);
  });

  it("화면 안에서 30초 뒤 광고가 도착해도 숨기지 않고 filled를 알린다", async () => {
    const onFillChange = jest.fn();
    const { container } = render(
      <AdSlot slotId="bottom" minHeight={70} onFillChange={onFillChange} />
    );
    const ins = container.querySelector("ins");
    if (!ins) throw new Error("Missing ad slot");
    enterViewport();
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    expect(ins).toBeVisible();
    await act(async () => {
      ins.append(document.createElement("iframe"));
      ins.setAttribute("data-ad-status", "filled");
    });
    expect(ins).toBeVisible();
    expect(onFillChange).toHaveBeenLastCalledWith(true);
  });

  it("iframe 생성만으로 filled가 되지 않고 Google 응답에 따라 숨김과 복구를 처리한다", async () => {
    const onFillChange = jest.fn();
    const { container, unmount } = render(
      <AdSlot slotId="bottom" minHeight={70} onFillChange={onFillChange} />
    );
    const ins = container.querySelector("ins");
    if (!ins) throw new Error("Missing ad slot");
    await act(async () => {
      ins.append(document.createElement("iframe"));
    });
    expect(onFillChange).not.toHaveBeenCalledWith(true);
    await act(async () => ins.setAttribute("data-ad-status", "unfilled"));
    expect(ins).not.toBeVisible();
    expect(onFillChange).toHaveBeenLastCalledWith(false);
    await act(async () =>
      ins.setAttribute("data-ad-status", "unfill-optimized")
    );
    expect(ins).toBeVisible();
    expect(onFillChange).toHaveBeenLastCalledWith(false);
    await act(async () => ins.setAttribute("data-ad-status", "filled"));
    expect(ins).toBeVisible();
    expect(onFillChange).toHaveBeenLastCalledWith(true);
    unmount();
    expect(onFillChange).toHaveBeenLastCalledWith(false);
    onFillChange.mockClear();
    await act(async () => ins.setAttribute("data-ad-status", "unfilled"));
    expect(onFillChange).not.toHaveBeenCalled();
  });
});
