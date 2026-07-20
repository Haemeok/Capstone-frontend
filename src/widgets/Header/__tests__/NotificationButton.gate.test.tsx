import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";

import { getNotifications } from "@/entities/notification/model/api";
import type { User } from "@/entities/user";
import { useUserStore } from "@/entities/user/model/store";

import NotificationButton from "../NotificationButton";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/entities/notification/model/api", () => ({
  ...jest.requireActual("@/entities/notification/model/api"),
  getNotifications: jest.fn(),
}));

jest.mock("@/shared/i18n", () => ({
  useChromeDict: () => ({
    notificationsAria: "알림",
    notificationsUnreadAria: { other: "안 읽은 알림 {count}개" },
    unreadBadgeAria: { other: "안 읽은 알림 {count}개" },
  }),
  format: (message: string, values: Record<string, unknown>) =>
    message.replace("{count}", String(values.count)),
  plural: (_count: number, forms: { other: string }) => forms.other,
  LocalizedLink: ({
    children,
    href,
    ...rest
  }: {
    children: ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const mockedGetNotifications = getNotifications as jest.Mock;

const renderButton = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationButton />
    </QueryClientProvider>
  );
};

beforeEach(() => {
  mockedGetNotifications.mockReset();
  mockedGetNotifications.mockResolvedValue({
    content: [],
    page: { size: 10, number: 0, totalElements: 3, totalPages: 1 },
  });
});

it("비로그인이면 getNotifications를 호출하지 않는다 (T-01)", () => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: true,
  });
  renderButton();
  expect(mockedGetNotifications).not.toHaveBeenCalled();
});

it("프로브 응답 전(isAuthReady:false)에도 호출하지 않는다 (T-02)", () => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: false,
  });
  renderButton();
  expect(mockedGetNotifications).not.toHaveBeenCalled();
});

it("게이트가 닫힌 채 마운트 후 /me 성공(setUser)이 오면 알림 쿼리가 재개된다 (T-03)", async () => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: true,
  });
  renderButton();
  expect(mockedGetNotifications).not.toHaveBeenCalled();

  act(() => {
    useUserStore.getState().setUser({ id: "u1" } as User);
  });

  await waitFor(() => expect(mockedGetNotifications).toHaveBeenCalledTimes(1));
});

it("로그인 상태면 알림을 로드하고 안 읽은 배지를 표시한다 (T-04)", async () => {
  useUserStore.setState({
    user: { id: "u1" } as User,
    isAuthenticated: true,
    isAuthReady: true,
  });
  renderButton();
  await waitFor(() => expect(mockedGetNotifications).toHaveBeenCalledTimes(1));
  expect(await screen.findByRole("status")).toBeInTheDocument();
});
