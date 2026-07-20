import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { format, getDictionary, plural } from "@/shared/i18n";

import NotificationButton from "../NotificationButton";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: { id: "u1" } }),
  useAuthGate: () => true,
}));

const mockUnread = jest.fn();
jest.mock("@/entities/notification", () => ({
  useInfiniteNotificationsQuery: (_opts: { enabled: boolean }) => ({
    unreadCount: mockUnread(),
  }),
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

const en = getDictionary("en").nav;

describe("NotificationButton i18n", () => {
  it("T-07: /en, 미읽음 3 → 영어 plural aria + count", () => {
    setPath("/en");
    mockUnread.mockReturnValue(3);
    render(<NotificationButton />);
    expect(
      screen.getByLabelText(
        format(plural(3, en.notificationsUnreadAria), { count: 3 })
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(format(plural(3, en.unreadBadgeAria), { count: 3 }))
    ).toBeInTheDocument();
  });

  it("T-08: /en, 미읽음 0 → 기본 aria(미읽음 절 없음)", () => {
    setPath("/en");
    mockUnread.mockReturnValue(0);
    render(<NotificationButton />);
    expect(screen.getByLabelText(en.notificationsAria)).toBeInTheDocument();
  });
});
