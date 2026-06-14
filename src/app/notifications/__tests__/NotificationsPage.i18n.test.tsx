import { render, screen } from "@testing-library/react";

import { notificationsMessages } from "@/shared/i18n/notificationsMessages";

import NotificationsPage from "../page";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPath(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/entities/notification", () => ({
  NotificationItem: () => null,
  NotificationSkeleton: () => null,
  useDeleteAllNotifications: () => ({ mutate: jest.fn() }),
  useDeleteNotification: () => ({ mutate: jest.fn() }),
  useMarkNotificationAsRead: () => ({ mutate: jest.fn() }),
  useInfiniteNotificationsQuery: () => ({
    notifications: [],
    hasNextPage: false,
    isFetching: false,
    isFetchingNextPage: false,
    ref: jest.fn(),
  }),
}));
jest.mock("@/shared/ui/Container", () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("@/shared/ui/PrevButton", () => () => null);
jest.mock("@/shared/ui/shadcn/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

describe("NotificationsPage chrome i18n", () => {
  it("T-22: ja -> header/empty localized, no Hangul", () => {
    mockPath.mockReturnValue("/ja/notifications");
    const { container } = render(<NotificationsPage />);
    expect(
      screen.getByText(notificationsMessages.ja.title)
    ).toBeInTheDocument();
    expect(
      screen.getByText(notificationsMessages.ja.empty)
    ).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-23: ko preserved", () => {
    mockPath.mockReturnValue("/notifications");
    render(<NotificationsPage />);
    expect(screen.getByText("알림")).toBeInTheDocument();
  });
});
