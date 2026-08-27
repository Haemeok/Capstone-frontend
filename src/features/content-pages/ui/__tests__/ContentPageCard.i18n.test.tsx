import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ aspectRatio }: { aspectRatio?: string }) => (
    <span data-testid="content-page-image" data-aspect-ratio={aspectRatio} />
  ),
}));
jest.mock("@/shared/ui/badge/YouTubeIconBadge", () => () => null);
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

import ContentPageCard from "../ContentPageCard";

const page = {
  id: "diet-healthy" as const,
  imageUrl: "https://example.com/healthy.webp",
  searchParams: { tags: ["HEALTHY"] as string[], maxCalories: 400 },
};

const copy = { title: "다이어트", subtitle: "건강식" };

it("T-link-ja: /ja에서 카드 링크 href가 /ja/search/results로 시작", () => {
  setPath("/ja");
  render(<ContentPageCard page={page} copy={copy} />);
  const link = screen.getByRole("link");
  expect(link.getAttribute("href")).toMatch(/^\/ja\/search\/results/);
});

it("T-link-ko: 루트에서 카드 링크 href가 /search/results로 시작 (prefix 없음)", () => {
  setPath("/");
  render(<ContentPageCard page={page} copy={copy} />);
  const link = screen.getByRole("link");
  expect(link.getAttribute("href")).toMatch(/^\/search\/results/);
  expect(link.getAttribute("href")).not.toMatch(/^\/ko\//);
});

it("T-08: 홈 카드는 데스크톱에서 세로형 이미지와 큰 라벨을 사용한다", () => {
  setPath("/");
  render(<ContentPageCard page={page} copy={copy} layout="home" />);

  expect(screen.getByTestId("content-page-image-frame")).toHaveClass(
    "aspect-[5/3]",
    "md:aspect-[4/5]"
  );
  expect(screen.getByText(copy.title)).toHaveClass(
    "md:text-[15px]",
    "md:font-medium"
  );
  expect(screen.getByTestId("content-page-image")).toHaveAttribute(
    "data-aspect-ratio",
    "4 / 5"
  );
});

it("T-08: 검색 기본 카드는 기존 가로 비율을 유지한다", () => {
  setPath("/search");
  render(<ContentPageCard page={page} copy={copy} />);

  expect(screen.getByTestId("content-page-image-frame")).toHaveClass(
    "aspect-[5/3]"
  );
  expect(screen.getByTestId("content-page-image-frame")).not.toHaveClass(
    "md:aspect-[4/5]"
  );
  expect(screen.getByTestId("content-page-image")).toHaveAttribute(
    "data-aspect-ratio",
    "5 / 3"
  );
});
