import { usePathname } from "next/navigation";

import { fireEvent, render, screen } from "@testing-library/react";

import { settingsMessages } from "@/shared/i18n/settingsMessages";

import SettingsActionButton from "@/features/auth/ui/SettingsActionButton";

const ja = settingsMessages.ja;
const ko = settingsMessages.ko;

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/shared/lib/bridge", () => ({
  isAppWebView: () => false,
  requestNotificationPermission: jest.fn(),
}));

jest.mock("@/features/auth/model/hooks/useLogoutMutation", () => ({
  __esModule: true,
  default: () => ({ mutate: jest.fn() }),
}));

jest.mock("@/features/auth/model/hooks/useDeleteAccountMutation", () => ({
  __esModule: true,
  default: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock("@/entities/referral", () => ({
  useReferralSheetStore: { getState: () => ({ open: jest.fn() }) },
}));

jest.mock("@/features/notification-permission", () => ({
  useNotificationPermissionStore: () => "default",
}));

jest.mock("@/entities/user", () => ({
  useAdFreeStatus: () => ({ isActive: false, remaining: 0 }),
}));

jest.mock("@/shared/lib/hooks/useMediaQuery", () => ({
  useMediaQuery: () => false,
}));

jest.mock("@/features/auth/ui/LanguageSettingRow", () => ({
  LanguageSettingRow: () => null,
}));

test("T-19 ja: settings sheet items localized, no Hangul", () => {
  (usePathname as jest.Mock).mockReturnValue("/ja/users/u1");
  render(<SettingsActionButton />);
  fireEvent.click(screen.getByRole("button", { name: ja.title }));
  expect(screen.getByText(ja.privacy)).toBeInTheDocument();
  expect(screen.getByText(ja.withdraw)).toBeInTheDocument();
  expect(screen.getByText(ja.logout)).toBeInTheDocument();
});

test("T-19b ko: Korean (regression)", () => {
  (usePathname as jest.Mock).mockReturnValue("/users/u1");
  render(<SettingsActionButton />);
  fireEvent.click(screen.getByRole("button", { name: ko.title }));
  expect(screen.getByText(ko.privacy)).toBeInTheDocument();
});
