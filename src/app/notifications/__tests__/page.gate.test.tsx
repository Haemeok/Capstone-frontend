import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { getNotifications } from "@/entities/notification/model/api";
import { useUserStore } from "@/entities/user/model/store";

import NotificationsPage from "../page";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/entities/notification/model/api", () => ({
  ...jest.requireActual("@/entities/notification/model/api"),
  getNotifications: jest.fn(),
}));

jest.mock("@/shared/ui/PrevButton", () => ({
  __esModule: true,
  default: () => <button>back</button>,
}));

jest.mock("@/shared/i18n", () => ({
  useLocalizedRouter: () => ({ push: jest.fn() }),
  useNotificationsDict: () => ({
    title: "알림",
    deleteAll: "전체 삭제",
    empty: "알림이 없어요",
    loadingMore: "불러오는 중",
    allLoaded: "모두 확인했어요",
  }),
}));

const mockedGetNotifications = getNotifications as jest.Mock;

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationsPage />
    </QueryClientProvider>
  );
};

it("비로그인이 /notifications에 직접 진입하면 요청 없이 빈 상태를 보여준다 (T-05)", async () => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: true,
  });
  renderPage();

  expect(mockedGetNotifications).not.toHaveBeenCalled();
  expect(await screen.findByText("알림이 없어요")).toBeInTheDocument();
});
