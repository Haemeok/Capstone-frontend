import { render, screen } from "@testing-library/react";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { guestUser } from "@/entities/user/model/guestUser";

import UserProfileDisplay from "../UserProfileDisplay";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
jest.mock("@/shared/hooks/useShare", () => ({
  useShare: () => ({ share: jest.fn() }),
}));
jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
jest.mock("../ActionButton", () => ({
  __esModule: true,
  default: () => <button type="button" aria-label="action" />,
}));
jest.mock("@/features/edit-user-profile/ui/UserInfoEditButton", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/features/referral", () => ({
  ReferralGiftButton: () => null,
}));
jest.mock("@/shared/ui/CollapsibleP", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));
jest.mock("@/shared/lib/colors", () => ({
  generateUserGradient: jest.fn(() => ({})),
  isDefaultProfileImage: jest.fn(() => false),
}));

const cases: [string, "ko" | "ja" | "en"][] = [
  ["/", "ko"],
  ["/ja/users/guestUser", "ja"],
  ["/en/users/guestUser", "en"],
];

describe("UserProfileDisplay 게스트 닉네임 (T-04)", () => {
  it.each(cases)(
    "%s 에서 게스트 닉네임이 locale값으로 표시",
    (path, locale) => {
      mockPathname.mockReturnValue(path);
      render(
        <UserProfileDisplay
          user={guestUser}
          isOwnProfile={false}
          loggedInUser={null}
        />
      );
      expect(
        screen.getByText(userPagesMessages[locale].profile.guestNickname)
      ).toBeInTheDocument();
    }
  );
});
