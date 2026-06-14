import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import UserInfoEditButton from "@/features/edit-user-profile/ui/UserInfoEditButton";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
const HANGUL = /[가-힣]/;

test("T-06 en: localized label + aria/title", () => {
  (usePathname as jest.Mock).mockReturnValue("/en/users/u1");
  const { rerender, container } = render(<UserInfoEditButton variant="bar" />);
  expect(screen.getByText("Edit profile")).toBeInTheDocument();
  expect(container.textContent ?? "").not.toMatch(HANGUL);
  rerender(<UserInfoEditButton variant="icon" />);
  expect(
    screen.getByRole("link", { name: "Edit profile" })
  ).toBeInTheDocument();
});

test("T-07 ko: Korean (regression)", () => {
  (usePathname as jest.Mock).mockReturnValue("/users/u1");
  render(<UserInfoEditButton variant="bar" />);
  expect(screen.getByText("프로필 수정")).toBeInTheDocument();
});
