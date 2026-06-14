import { usePathname } from "next/navigation";

import { render } from "@testing-library/react";

import CalendarTabContent from "../index";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/shared/lib/gsap", () => ({
  gsap: { to: jest.fn(), fromTo: jest.fn(), set: jest.fn() },
  ScrollTrigger: { create: jest.fn(), refresh: jest.fn() },
}));

jest.mock("@/shared/hooks/useScrollAnimate", () => () => ({
  targetRef: { current: null },
  playAnimation: jest.fn(),
}));

jest.mock("@/widgets/CalendarTabContent/hooks", () => ({
  useUserStreakQuery: () => ({ data: { streak: 0 } }),
  useRecipeHistoryQuery: () => ({
    recipeHistorySummary: [],
    monthlyTotalSavings: 12000,
    isPending: false,
  }),
}));

jest.mock("@/entities/user", () => ({
  useUserStore: (sel: (s: { user: { hasFirstRecord: boolean } }) => unknown) =>
    sel({ user: { hasFirstRecord: true } }),
}));

jest.mock("@/widgets/MonthlySavingsSummary", () => ({
  __esModule: true,
  default: ({ year, month }: { year: number; month: number }) => (
    <div>
      {year}년 {month}월 레시피오 서비스로
    </div>
  ),
}));

test("T-11 ja: MonthlySavingsSummary not rendered, calendar still renders", () => {
  (usePathname as jest.Mock).mockReturnValue("/ja/users/u1");
  const { queryByText, getByText } = render(<CalendarTabContent />);
  expect(queryByText(/레시피오 서비스로/)).toBeNull();
  expect(getByText(/모든 요리 기록 보기/)).toBeInTheDocument();
});

test("T-12 ko: MonthlySavingsSummary present (over-hide guard)", () => {
  (usePathname as jest.Mock).mockReturnValue("/users/u1");
  const { getByText } = render(<CalendarTabContent />);
  expect(getByText(/레시피오 서비스로/)).toBeInTheDocument();
});
