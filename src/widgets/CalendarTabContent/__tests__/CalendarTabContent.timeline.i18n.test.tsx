import { usePathname } from "next/navigation";

import { render } from "@testing-library/react";

import { TimelineDateGroup } from "@/app/calendar/timeline/components/TimelineDateGroup";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const group = {
  date: "2024-01-15",
  records: [],
};

test("T-i18n-timeline ja: detail link gets /ja prefix", () => {
  (usePathname as jest.Mock).mockReturnValue("/ja/calendar/timeline");
  const { getByRole } = render(<TimelineDateGroup group={group} />);
  const link = getByRole("link");
  expect(link.getAttribute("href")).toMatch(/^\/ja\/calendar\//);
});

test("T-i18n-timeline ko: detail link has no locale prefix", () => {
  (usePathname as jest.Mock).mockReturnValue("/calendar/timeline");
  const { getByRole } = render(<TimelineDateGroup group={group} />);
  const link = getByRole("link");
  const href = link.getAttribute("href");
  expect(href).toMatch(/^\/calendar\//);
  expect(href).not.toMatch(/^\/(ja|en)\//);
});
