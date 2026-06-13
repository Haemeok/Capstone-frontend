import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import ContentPageGrid from "../ContentPageGrid";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/ui/shadcn/carousel", () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CarouselNext: () => null,
  CarouselPrevious: () => null,
}));
jest.mock("@/shared/ui/image/Image", () => ({ Image: () => null }));
jest.mock("@/shared/ui/badge/YouTubeIconBadge", () => () => null);
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

it("T-10: /ja에서 첫 카드 title이 ja 사전 값", () => {
  setPath("/ja/search");
  render(<ContentPageGrid />);
  expect(
    screen.getByText(
      searchDiscoveryMessages.ja.contentPages["diet-healthy"].title
    )
  ).toBeInTheDocument();
});

it("T-02b(ko 회귀): 루트에서 ko 카드 title", () => {
  setPath("/search");
  render(<ContentPageGrid />);
  expect(
    screen.getByText(
      searchDiscoveryMessages.ko.contentPages["diet-healthy"].title
    )
  ).toBeInTheDocument();
});
