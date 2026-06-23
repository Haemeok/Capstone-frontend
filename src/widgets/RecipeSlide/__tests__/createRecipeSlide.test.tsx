import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("@/shared/hooks/useInViewOnce", () => ({
  useInViewOnce: () => ({ ref: { current: null }, inView: true }),
}));

import { createRecipeSlide } from "../createRecipeSlide";

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe("createRecipeSlide", () => {
  it("inView이고 로딩 중이면 260px 예약 높이를 유지한다 (T-S1-1)", () => {
    const LoadingSlide = createRecipeSlide(() => ({
      title: "제목",
      items: [],
      isLoading: true,
      error: null,
    }));
    const { container } = renderWithClient(<LoadingSlide locale="ko" />);
    expect(container.querySelector(".h-\\[260px\\]")).toBeInTheDocument();
  });

  it("로드 완료 후 콘텐츠가 비면 placeholder 없이 완전히 숨긴다 (T-S1-2)", () => {
    const EmptySlide = createRecipeSlide(() => ({
      title: "제목",
      items: [],
      isLoading: false,
      error: null,
    }));
    const { container } = renderWithClient(<EmptySlide locale="ko" />);
    expect(container.querySelector("[aria-hidden]")).not.toBeInTheDocument();
    expect(screen.queryByText("제목")).not.toBeInTheDocument();
  });
});
