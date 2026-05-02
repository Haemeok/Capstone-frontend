import { act, render, screen, fireEvent } from "@testing-library/react";

jest.mock("../config", () => ({
  ADSENSE_CLIENT_ID: "ca-pub-1",
  IS_AD_TEST_MODE: true,
  AD_SLOT_IDS: {
    searchInFeed: "",
    recipeInArticle: "",
    recipeBottomAnchor: "",
  },
  SEARCH_AD_EVERY_N_CARDS: 10,
  AD_MIN_HEIGHT: { inFeed: 280, inArticle: 260, bottomAnchor: 70 },
}));

jest.mock("../lib/isAdsEnabled", () => ({
  isAdsEnabled: jest.fn(() => true),
}));

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

import { BottomAnchorAdSlot } from "../BottomAnchorAdSlot";
import { isAdsEnabled } from "../lib/isAdsEnabled";
import { triggerHaptic } from "@/shared/lib/bridge";

const mockedIsAdsEnabled = jest.mocked(isAdsEnabled);
const mockedTriggerHaptic = jest.mocked(triggerHaptic);

describe("BottomAnchorAdSlot", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    sessionStorage.clear();
    delete (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle;
    mockedIsAdsEnabled.mockReturnValue(true);
    mockedTriggerHaptic.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("isAdsEnabled false 면 null 렌더", () => {
    mockedIsAdsEnabled.mockReturnValue(false);
    const { container } = render(<BottomAnchorAdSlot />);
    expect(container).toBeEmptyDOMElement();
  });

  it("sessionStorage 에 dismissed 마크 있으면 null 렌더", () => {
    sessionStorage.setItem("ad:bottomAnchor:dismissed", "1");
    const { container } = render(<BottomAnchorAdSlot />);
    expect(container).toBeEmptyDOMElement();
  });

  it("정상 상태에서 닫기 버튼 + 광고 컨테이너 렌더", () => {
    render(<BottomAnchorAdSlot />);
    expect(screen.getByLabelText("광고 닫기")).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 sessionStorage set + haptic + 사라짐", () => {
    const { container } = render(<BottomAnchorAdSlot />);
    const closeBtn = screen.getByLabelText("광고 닫기");
    act(() => {
      fireEvent.click(closeBtn);
    });
    expect(sessionStorage.getItem("ad:bottomAnchor:dismissed")).toBe("1");
    expect(mockedTriggerHaptic).toHaveBeenCalledWith("Light");
    expect(container).toBeEmptyDOMElement();
  });
});
