import { fireEvent, render, screen } from "@testing-library/react";

let mockPathname = "/";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));
const mockSendGAEvent = jest.fn();
jest.mock("@next/third-parties/google", () => ({
  sendGAEvent: (...args: unknown[]) => mockSendGAEvent(...args),
}));

import { SmartAppBannerCard } from "../SmartAppBannerCard";

describe("SmartAppBannerCard app_open_click tracking", () => {
  const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);

  beforeEach(() => {
    mockPathname = "/";
    mockSendGAEvent.mockReset();
    openSpy.mockClear();
  });

  it("T-C1: cta 클릭 -> app_open_click({locale}) 1회 전송", () => {
    mockPathname = "/en/recipes/r1";
    render(<SmartAppBannerCard onDismiss={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Open in app" }));
    expect(mockSendGAEvent).toHaveBeenCalledTimes(1);
    expect(mockSendGAEvent).toHaveBeenCalledWith("event", "app_open_click", {
      locale: "en",
    });
  });

  it("T-C2: GA no-op이어도 window.open 호출 + 에러 없음", () => {
    mockPathname = "/recipes/r1";
    mockSendGAEvent.mockImplementation(() => undefined);
    render(<SmartAppBannerCard onDismiss={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "앱에서 열기" }));
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("http"),
      "_blank",
      "noopener,noreferrer"
    );
  });
});
