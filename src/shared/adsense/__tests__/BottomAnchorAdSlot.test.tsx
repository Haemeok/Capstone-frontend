import { render } from "@testing-library/react";

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

import { BottomAnchorAdSlot } from "../BottomAnchorAdSlot";
import { isAdsEnabled } from "../lib/isAdsEnabled";

const mockedIsAdsEnabled = jest.mocked(isAdsEnabled);

describe("BottomAnchorAdSlot", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    delete (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle;
    mockedIsAdsEnabled.mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("isAdsEnabled false 면 null 렌더", () => {
    mockedIsAdsEnabled.mockReturnValue(false);
    const { container } = render(<BottomAnchorAdSlot />);
    expect(container).toBeEmptyDOMElement();
  });

  it("정상 상태에서 광고 컨테이너 렌더", () => {
    const { container } = render(<BottomAnchorAdSlot />);
    expect(container.querySelector(".fixed.bottom-0")).toBeInTheDocument();
  });
});
