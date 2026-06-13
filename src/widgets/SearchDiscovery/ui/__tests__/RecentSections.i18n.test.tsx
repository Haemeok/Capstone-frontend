import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import RecentSearchChips from "../RecentSearchChips";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/shared/hooks/useRecentSearches", () => ({
  useRecentSearches: () => ({
    searches: ["a"],
    isLoaded: true,
    removeSearch: jest.fn(),
    clearAll: jest.fn(),
  }),
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

it("T-13: /ja focused 헤딩·지우기가 ja 사전 값", () => {
  setPath("/ja/search");
  render(<RecentSearchChips />);
  expect(
    screen.getByText(searchDiscoveryMessages.ja.recentSearchTitle)
  ).toBeInTheDocument();
  expect(
    screen.getByText(searchDiscoveryMessages.ja.clearAction)
  ).toBeInTheDocument();
});

it("T-14(ko 회귀): 루트에서 ko 헤딩", () => {
  setPath("/search");
  render(<RecentSearchChips />);
  expect(
    screen.getByText(searchDiscoveryMessages.ko.recentSearchTitle)
  ).toBeInTheDocument();
});
