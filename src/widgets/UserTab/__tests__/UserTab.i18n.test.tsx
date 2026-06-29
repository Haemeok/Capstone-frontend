import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

import type { User } from "@/entities/user/model/types";

import UserTab from "@/widgets/UserTab/UserTab";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/widgets/MyRecipesTabContent", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/features/view-saved-recipes", () => ({
  MySavedRecipesTabContent: () => null,
}));
jest.mock("@/widgets/CalendarTabContent", () => ({
  __esModule: true,
  default: () => null,
}));

const user: User = {
  id: "u1",
  nickname: "tester",
  profileImage: "",
  hasFirstRecord: true,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
};
const HANGUL = /[가-힣]/;
const setLocale = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

const jaTabs = getDictionary("ja").userPages.profile.tabs;
const enTabs = getDictionary("en").userPages.profile.tabs;

test("T-01 ja own profile: localized tabs, calendar present, no Hangul", () => {
  setLocale("/ja/users/u1");
  render(<UserTab user={user} isOwnProfile isLoggedIn />);
  expect(
    screen.getByRole("button", { name: jaTabs.recipes })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: jaTabs.saved })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: jaTabs.calendar })
  ).toBeInTheDocument();
  const nav = screen
    .getByRole("button", { name: jaTabs.recipes })
    .closest("div")!;
  expect(nav.textContent ?? "").not.toMatch(HANGUL);
});

test("T-02 ko own profile: Korean labels (regression)", () => {
  setLocale("/users/u1");
  render(<UserTab user={user} isOwnProfile isLoggedIn />);
  expect(
    screen.getByRole("button", { name: "나의 레시피" })
  ).toBeInTheDocument();
});

test("T-03 en other profile: single localized tab", () => {
  setLocale("/en/users/u1");
  render(<UserTab user={user} isOwnProfile={false} isLoggedIn />);
  expect(
    screen.getByRole("button", { name: enTabs.recipesOther })
  ).toBeInTheDocument();
});
