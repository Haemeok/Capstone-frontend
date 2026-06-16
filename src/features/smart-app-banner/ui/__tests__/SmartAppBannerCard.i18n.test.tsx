import { render, screen } from "@testing-library/react";

let mockPathname = "/";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

import { SmartAppBannerCard } from "../SmartAppBannerCard";

describe("SmartAppBannerCard i18n", () => {
  it("T-B3: ko -> 한국어 카피", () => {
    mockPathname = "/recipes/r1";
    render(<SmartAppBannerCard onDismiss={jest.fn()} />);
    expect(
      screen.getByText("앱에서 더 편하게 사용해보세요")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "앱에서 열기" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("배너 닫기")).toBeInTheDocument();
  });

  it("T-B1: en -> 영어 카피", () => {
    mockPathname = "/en/recipes/r1";
    render(<SmartAppBannerCard onDismiss={jest.fn()} />);
    expect(
      screen.getByText("Enjoy a smoother experience in the app")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open in app" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Dismiss")).toBeInTheDocument();
  });

  it("T-B2: ja -> 일본어 카피", () => {
    mockPathname = "/ja/recipes/r1";
    render(<SmartAppBannerCard onDismiss={jest.fn()} />);
    expect(screen.getByText("アプリでもっと快適に")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "アプリで開く" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("閉じる")).toBeInTheDocument();
  });
});
