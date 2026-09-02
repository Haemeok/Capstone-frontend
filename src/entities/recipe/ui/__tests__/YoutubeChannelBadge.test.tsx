import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

import { YoutubeChannelBadge } from "../YoutubeChannelBadge";

const mockUsePathname = jest.mocked(usePathname);

describe("YoutubeChannelBadge", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  it("T-01: CHEF는 셰프 모자와 피스타치오 셰프 레시피 뱃지를 표시한다", () => {
    render(<YoutubeChannelBadge badgeType="CHEF" />);

    const label = screen.getByText("셰프 레시피");
    const badge = label.parentElement;

    expect(badge).toHaveClass(
      "border-[#aac968]",
      "bg-[#eef6d8]",
      "text-[#4c6b2f]"
    );
    expect(badge?.querySelector("svg")).toHaveClass("lucide-chef-hat");
  });

  it("T-02: POPULAR_CREATOR는 왕관과 망고 유명 크리에이터 뱃지를 표시한다", () => {
    render(<YoutubeChannelBadge badgeType="POPULAR_CREATOR" />);

    const label = screen.getByText("유명 크리에이터");
    const badge = label.parentElement;

    expect(badge).toHaveClass(
      "border-[#f2be50]",
      "bg-[#fff0c9]",
      "text-[#835508]"
    );
    expect(badge?.querySelector("svg")).toHaveClass("lucide-crown");
  });

  it("T-03: 없는 뱃지 타입과 알 수 없는 PARTNER는 DOM을 남기지 않는다", () => {
    const { container, rerender } = render(
      <YoutubeChannelBadge badgeType={undefined} />
    );

    expect(container).toBeEmptyDOMElement();

    rerender(<YoutubeChannelBadge badgeType="PARTNER" />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ["/", "유명 크리에이터"],
    ["/en", "Popular creator"],
    ["/ja", "人気クリエイター"],
  ])("T-06: %s 경로에서 현지화된 문구를 표시한다", (pathname, label) => {
    mockUsePathname.mockReturnValue(pathname);

    render(<YoutubeChannelBadge badgeType="POPULAR_CREATOR" />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("T-07: 뱃지는 줄어들지 않고 359px 이하에서 짧은 문구를 사용한다", () => {
    render(<YoutubeChannelBadge badgeType="POPULAR_CREATOR" />);

    const fullLabel = screen.getByText("유명 크리에이터");
    const shortLabel = screen.getByText("유명");

    expect(fullLabel.parentElement).toHaveClass("shrink-0");
    expect(fullLabel).toHaveClass("max-[359px]:hidden");
    expect(shortLabel).toHaveClass("hidden", "max-[359px]:inline");
  });
});
