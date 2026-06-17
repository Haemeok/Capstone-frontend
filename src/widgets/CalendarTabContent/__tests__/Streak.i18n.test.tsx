import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { format, getDictionary, plural } from "@/shared/i18n";

import { StreakInfoBanner } from "@/widgets/CalendarTabContent/components/StreakInfoBanner";
import { StreakModeToggle } from "@/widgets/CalendarTabContent/components/StreakModeToggle";

const en = getDictionary("en").userPages.calendar;
const ja = getDictionary("ja").userPages.calendar;

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/shared/hooks/useScrollAnimate", () => ({
  __esModule: true,
  default: () => ({ targetRef: { current: null }, playAnimation: jest.fn() }),
}));

jest.mock("@/shared/lib/gsap", () => ({
  gsap: { to: jest.fn(), fromTo: jest.fn(), set: jest.fn() },
  ScrollTrigger: { create: jest.fn(), refresh: jest.fn() },
}));

const HANGUL = /[가-힣]/;

test("T-14 en: toggle labels + alt localized", () => {
  (usePathname as jest.Mock).mockReturnValue("/en/users/u1");
  const { container } = render(
    <StreakModeToggle mode="photo" onModeChange={jest.fn()} />
  );
  expect(screen.getByText(en.toggleRecord)).toBeInTheDocument();
  expect(screen.getByText(en.toggleStreak)).toBeInTheDocument();
  expect(container.textContent ?? "").not.toMatch(HANGUL);
});

test("T-16 ja: message localized, no Korean cost terms, day unit", () => {
  (usePathname as jest.Mock).mockReturnValue("/ja/users/u1");
  const { container } = render(<StreakInfoBanner streakCount={5} />);
  expect(container.textContent).toContain(
    format(plural(5, ja.streakDays), { n: 5 })
  );
  expect(container.textContent).not.toMatch(/식비|배달/);
  expect(container.textContent ?? "").not.toMatch(HANGUL);
});

test("T-16b en plural: 1 day vs days", () => {
  (usePathname as jest.Mock).mockReturnValue("/en/users/u1");
  const { container: c1 } = render(<StreakInfoBanner streakCount={1} />);
  expect(c1.textContent).toContain("1 day");
  const { container: c5 } = render(<StreakInfoBanner streakCount={5} />);
  expect(c5.textContent).toContain("5 days");
});

test("T-16c ko: Korean preserved (regression)", () => {
  (usePathname as jest.Mock).mockReturnValue("/users/u1");
  const { container } = render(<StreakInfoBanner streakCount={0} />);
  expect(container.textContent).toContain("식비를 절약");
});
