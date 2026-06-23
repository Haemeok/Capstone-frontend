import { fireEvent, render, screen } from "@testing-library/react";

let mockPathname = "/landing";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
  isAppWebView: () => false,
}));
const mockSendGAEvent = jest.fn();
jest.mock("@next/third-parties/google", () => ({
  sendGAEvent: (...args: unknown[]) => mockSendGAEvent(...args),
}));

import { StoreBadges } from "../StoreBadges";

describe("StoreBadges app_open_click tracking", () => {
  beforeEach(() => {
    mockPathname = "/landing";
    mockSendGAEvent.mockReset();
  });

  it("T-S1: 앱스토어 배지 클릭 -> app_open_click({store: app_store, locale})", () => {
    mockPathname = "/en/landing";
    render(<StoreBadges />);
    fireEvent.click(screen.getAllByRole("link")[0]);
    expect(mockSendGAEvent).toHaveBeenCalledTimes(1);
    expect(mockSendGAEvent).toHaveBeenCalledWith("event", "app_open_click", {
      store: "app_store",
      locale: "en",
    });
  });

  it("T-S2: 플레이스토어 배지 클릭 -> app_open_click({store: google_play, locale})", () => {
    mockPathname = "/ja/landing";
    render(<StoreBadges />);
    fireEvent.click(screen.getAllByRole("link")[1]);
    expect(mockSendGAEvent).toHaveBeenCalledTimes(1);
    expect(mockSendGAEvent).toHaveBeenCalledWith("event", "app_open_click", {
      store: "google_play",
      locale: "ja",
    });
  });
});
