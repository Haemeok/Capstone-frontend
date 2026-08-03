import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock("@/shared/api/client", () => ({
  api: {
    get: (...a: unknown[]) => mockGet(...a),
    post: (...a: unknown[]) => mockPost(...a),
  },
}));
jest.mock("@/shared/hooks/useInViewOnce", () => ({
  useInViewOnce: () => ({ ref: { current: null }, inView: true }),
}));
let mockUser: unknown = { id: "u1" };
jest.mock("@/entities/user/model/store", () => ({
  useUserStore: (selector?: (state: unknown) => unknown) => {
    const state = {
      user: mockUser,
      isAuthReady: true,
      isAuthenticated: mockUser !== null,
    };
    return selector ? selector(state) : state;
  },
}));
jest.mock("@/shared/i18n", () => ({
  ...jest.requireActual("@/shared/i18n"),
  format: (tpl: string, vars: Record<string, string>) =>
    tpl.replace(/\{(\w+)\}/g, (_m, k) => String(vars[k] ?? "")),
}));
jest.mock("@/shared/i18n/useSearchDiscoveryDict", () => ({
  useSearchDiscoveryDict: () => ({
    fridgeIngredientTitle: "고객님 냉장고에 있는 {ingredientName} 활용 레시피",
    recipeSlideViewMore: "더보기",
    recipeSlideError: "에러",
    recipeSlideEmpty: "비어있음",
  }),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

import FridgeIngredientSlide from "../FridgeIngredientSlide";

const card = (id: string, title: string) => ({
  id,
  title,
  imageUrl: "",
  authorName: "a",
  authorId: "a1",
  profileImage: "",
  createdAt: "2026-01-01T00:00:00",
  avgRating: 0,
  ratingCount: 0,
  tags: [],
});
const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};
beforeEach(() => {
  mockGet.mockReset();
  mockPost.mockReset();
  mockPost.mockResolvedValue({});
  mockUser = { id: "u1" };
});

describe("FridgeIngredientSlide", () => {
  it("로그인 + ingredientName 있으면 보간된 타이틀을 보여준다 (T-C1)", async () => {
    mockGet.mockResolvedValue({
      ingredientName: "양파",
      content: [card("r1", "양파볶음")],
    });
    renderWithClient(<FridgeIngredientSlide locale="ko" />);
    expect(
      await screen.findByText("고객님 냉장고에 있는 양파 활용 레시피")
    ).toBeInTheDocument();
  });

  it("비로그인이면 렌더하지 않고 fetch도 안 한다 (T-C2)", async () => {
    mockUser = null;
    const { container } = renderWithClient(
      <FridgeIngredientSlide locale="ko" />
    );
    expect(container).toBeEmptyDOMElement();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("ingredientName이 null이면 숨긴다 (T-C3)", async () => {
    mockGet.mockResolvedValue({
      ingredientName: null,
      content: [card("r1", "양파볶음")],
    });
    renderWithClient(<FridgeIngredientSlide locale="ko" />);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText(/활용 레시피/)).not.toBeInTheDocument()
    );
  });

  it("로딩 중에는 빈 ingredientName 타이틀을 노출하지 않는다", async () => {
    let resolve: (v: unknown) => void = () => {};
    mockGet.mockReturnValue(
      new Promise((r) => {
        resolve = r;
      })
    );
    renderWithClient(<FridgeIngredientSlide locale="ko" />);
    expect(screen.queryByText(/활용 레시피/)).not.toBeInTheDocument();
    resolve({ ingredientName: "양파", content: [card("r1", "양파볶음")] });
    expect(
      await screen.findByText("고객님 냉장고에 있는 양파 활용 레시피")
    ).toBeInTheDocument();
  });

  it("401 에러면 조용히 숨긴다 (T-C5)", async () => {
    mockGet.mockRejectedValue(new Error("401"));
    renderWithClient(<FridgeIngredientSlide locale="ko" />);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText(/활용 레시피/)).not.toBeInTheDocument()
    );
    expect(screen.queryByText("에러")).not.toBeInTheDocument();
  });
});
