import { render, screen } from "@testing-library/react";

import { smartAppBannerMessages } from "@/shared/i18n/smartAppBannerMessages";

let mockPathname = "/";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

import { SmartAppBannerCard } from "../SmartAppBannerCard";

const ko = smartAppBannerMessages.ko;
const en = smartAppBannerMessages.en;
const ja = smartAppBannerMessages.ja;

describe("SmartAppBannerCard i18n", () => {
  it("T-B3: ko -> 한국어 카피", () => {
    mockPathname = "/recipes/r1";
    render(<SmartAppBannerCard onDismiss={jest.fn()} />);
    expect(screen.getByText(ko.message)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ko.cta })).toBeInTheDocument();
    expect(screen.getByLabelText(ko.dismissAria)).toBeInTheDocument();
  });

  it("T-B1: en -> 영어 카피", () => {
    mockPathname = "/en/recipes/r1";
    render(<SmartAppBannerCard onDismiss={jest.fn()} />);
    expect(screen.getByText(en.message)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: en.cta })).toBeInTheDocument();
    expect(screen.getByLabelText(en.dismissAria)).toBeInTheDocument();
  });

  it("T-B2: ja -> 일본어 카피", () => {
    mockPathname = "/ja/recipes/r1";
    render(<SmartAppBannerCard onDismiss={jest.fn()} />);
    expect(screen.getByText(ja.message)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ja.cta })).toBeInTheDocument();
    expect(screen.getByLabelText(ja.dismissAria)).toBeInTheDocument();
  });
});
