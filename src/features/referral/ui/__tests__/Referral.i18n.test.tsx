import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { referralMessages } from "@/shared/i18n/referralMessages";

import { AdFreeActiveNotice } from "@/features/referral/ui/AdFreeActiveNotice";
import { ReferralGiftButton } from "@/features/referral/ui/ReferralGiftButton";
import { ReferralSheet } from "@/features/referral/ui/ReferralSheet";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
  isAppWebView: () => false,
}));
jest.mock("@/entities/referral", () => ({
  useReferralInfoQuery: jest.fn(() => ({
    data: {
      myReferralCode: "ABC123",
      campaign: null,
      redeemStatus: {
        status: "AVAILABLE",
        redeemDeadline: null,
        redeemedAt: null,
        referrer: null,
      },
    },
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  })),
  useRedeemMutation: () => ({ mutate: jest.fn(), isPending: false }),
  useReferralSheetStore: (
    sel: (s: { open: jest.Mock; lastOpenedAt: null }) => unknown
  ) => sel({ open: jest.fn(), lastOpenedAt: null }),
  shouldShowNudge: () => false,
  canRedeem: () => true,
  campaignMonthLabel: () => null,
  normalizeCode: (x: string) => x,
  referrerRewardLimitReached: () => false,
  extractErrorCode: jest.fn(),
}));
jest.mock("@/entities/user", () => ({
  useAdFreeStatus: () => ({ isActive: false, remaining: 0, adFreeUntil: null }),
}));
jest.mock("@/shared/ui/toast/model/store", () => ({
  useToastStore: () => ({ addToast: jest.fn() }),
}));
jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => ({
  useResponsiveSheet: () => ({
    Container: ({
      children,
      open,
    }: {
      children: ReactNode;
      open: boolean;
      onOpenChange: (o: boolean) => void;
    }) => (open ? <div>{children}</div> : null),
    Content: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Header: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Title: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  }),
}));

const HANGUL = /[가-힣]/;
const ja = referralMessages.ja;
const en = referralMessages.en;
const ko = referralMessages.ko;

const renderSheet = (pathname: string) => {
  (usePathname as jest.Mock).mockReturnValue(pathname);
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ReferralSheet open onOpenChange={() => {}} />
    </QueryClientProvider>
  );
};

test("T-08 ja: gift button aria localized", () => {
  (usePathname as jest.Mock).mockReturnValue("/ja/users/u1");
  render(<ReferralGiftButton />);
  expect(screen.getByRole("button", { name: ja.giftAria })).toBeInTheDocument();
});

test("T-09 en: banner copy + en-US date + plural; today boundary", () => {
  (usePathname as jest.Mock).mockReturnValue("/en/users/u1");
  const { rerender, container } = render(
    <AdFreeActiveNotice
      remaining={3 * 86400000}
      adFreeUntil="2026-07-01T00:00:00Z"
    />
  );
  expect(container.textContent).toContain(en.adFreeLabel);
  expect(container.textContent).toContain("3 days left");
  expect(container.textContent).toMatch(/July|Jul/);
  expect(container.textContent ?? "").not.toMatch(HANGUL);
  rerender(
    <AdFreeActiveNotice remaining={0} adFreeUntil="2026-07-01T00:00:00Z" />
  );
  expect(container.textContent).toContain(en.endsToday);
});

test("T-09b ko: Korean banner (regression)", () => {
  (usePathname as jest.Mock).mockReturnValue("/users/u1");
  const { container } = render(
    <AdFreeActiveNotice
      remaining={86400000}
      adFreeUntil="2026-07-01T00:00:00Z"
    />
  );
  expect(container.textContent).toContain(ko.adFreeLabel);
});

test("T-10 ja: sheet body localized, no hangul", async () => {
  const { container } = renderSheet("/ja/users/u1");
  expect(await screen.findByText(ja.myCodeLabel)).toBeInTheDocument();
  expect(container.textContent).toContain(ja.description);
  expect(container.textContent ?? "").not.toMatch(HANGUL);
});

test("T-10b ko: Korean sheet anchor (regression)", async () => {
  renderSheet("/users/u1");
  expect(await screen.findByText(ko.myCodeLabel)).toBeInTheDocument();
});
