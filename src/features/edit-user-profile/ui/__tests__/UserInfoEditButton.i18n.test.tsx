import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import UserInfoEditButton from "@/features/edit-user-profile/ui/UserInfoEditButton";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
const HANGUL = /[가-힣]/;
const en = userPagesMessages.en.profile;
const ko = userPagesMessages.ko.profile;

test("T-06 en: localized label + aria/title", () => {
  (usePathname as jest.Mock).mockReturnValue("/en/users/u1");
  const { rerender, container } = render(<UserInfoEditButton variant="bar" />);
  expect(screen.getByText(en.editAction)).toBeInTheDocument();
  expect(container.textContent ?? "").not.toMatch(HANGUL);
  rerender(<UserInfoEditButton variant="icon" />);
  expect(screen.getByRole("link", { name: en.editAria })).toBeInTheDocument();
});

test("T-07 ko: Korean (regression)", () => {
  (usePathname as jest.Mock).mockReturnValue("/users/u1");
  render(<UserInfoEditButton variant="bar" />);
  expect(screen.getByText(ko.editAction)).toBeInTheDocument();
});
