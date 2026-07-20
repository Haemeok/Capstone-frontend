import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

import { getRecipeBooks } from "@/entities/recipe-book/api";
import type { User } from "@/entities/user";
import { useUserStore } from "@/entities/user/model/store";

import { RecipeBookGrid } from "../RecipeBookGrid";

jest.mock("@/entities/recipe-book/api", () => ({
  ...jest.requireActual("@/entities/recipe-book/api"),
  getRecipeBooks: jest.fn(),
}));

jest.mock("../RecipeBookCard", () => ({
  RecipeBookCard: ({ name }: { name: string }) => <div>{name}</div>,
}));

jest.mock("../CreateRecipeBookCard", () => ({
  CreateRecipeBookCard: () => <div data-testid="create-card" />,
}));

jest.mock("@/shared/i18n", () => ({
  useUserPagesDict: () => ({
    recipeBooks: { listLoadError: "목록 오류", boundaryError: "오류" },
  }),
  useUserPagesLocale: () => "ko",
}));

const mockedGetRecipeBooks = getRecipeBooks as jest.Mock;

const renderGrid = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RecipeBookGrid />
    </QueryClientProvider>
  );
};

beforeEach(() => {
  mockedGetRecipeBooks.mockReset();
  mockedGetRecipeBooks.mockResolvedValue([
    {
      id: "b1",
      name: "기본 북",
      recipeCount: 2,
      isDefault: true,
      displayOrder: 0,
    },
    {
      id: "b2",
      name: "두번째 북",
      recipeCount: 0,
      isDefault: false,
      displayOrder: 1,
    },
  ]);
});

it("비로그인이면 getRecipeBooks를 호출하지 않는다 (T-08)", () => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: true,
  });
  renderGrid();
  expect(mockedGetRecipeBooks).not.toHaveBeenCalled();
});

it("로그인 상태면 레시피북 목록을 렌더한다 (T-09)", async () => {
  useUserStore.setState({
    user: { id: "u1" } as User,
    isAuthenticated: true,
    isAuthReady: true,
  });
  renderGrid();
  await waitFor(() => expect(mockedGetRecipeBooks).toHaveBeenCalledTimes(1));
  expect(await screen.findByText("기본 북")).toBeInTheDocument();
  expect(screen.getByText("두번째 북")).toBeInTheDocument();
});

it("비로그인 직접 진입 시 무한 스켈레톤 없이 빈 그리드가 뜬다 (T-10)", () => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: true,
  });
  renderGrid();
  expect(screen.getByTestId("create-card")).toBeInTheDocument();
});
