import { render } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  usePathname: () => "/ja/users/u1",
  useParams: () => ({ userId: "u1" }),
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: jest.fn(),
}));

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
  isAppWebView: () => false,
  triggerNativeShare: jest.fn(),
}));

jest.mock("@/entities/user", () => ({
  useUserQuery: () => ({ user: undefined }),
  useUserStore: () => ({ user: null }),
}));

jest.mock("@/shared/adsense", () => ({
  HomeAnchorAdSlot: () => null,
}));

jest.mock("@/entities/referral", () => ({
  useReferralInfoQuery: () => ({ data: undefined }),
  useReferralSheetStore: (
    sel?: (s: { open: () => void; lastOpenedAt: null }) => unknown
  ) => {
    const state = { open: jest.fn(), lastOpenedAt: null };
    return sel ? sel(state) : state;
  },
  shouldShowNudge: () => false,
}));

jest.mock("@/widgets/Header/UserProfileHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/widgets/UserProfile/UserProfileDisplay", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/widgets/UserTab/UserTab", () => ({
  __esModule: true,
  default: () => null,
}));

test("T-20 ja user route renders without throwing", async () => {
  const Page = (await import("@/app/ja/users/[userId]/page")).default;
  expect(() => render(<Page />)).not.toThrow();
});
