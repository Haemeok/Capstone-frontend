import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/ui/image/Image", () => ({ Image: () => null }));
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
