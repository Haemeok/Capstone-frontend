import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import type {
  IngredientItem,
  IngredientsApiResponse,
} from "@/entities/ingredient";
import { getIngredients } from "@/entities/ingredient";
import type { User } from "@/entities/user";
import { useUserStore } from "@/entities/user/model/store";

import { useInfiniteIngredients } from "../useInfiniteIngredients";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

const mockPathname = jest.fn(() => "/ingredients");
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

jest.mock("@/entities/ingredient", () => ({
  ...jest.requireActual("@/entities/ingredient"),
  getIngredients: jest.fn(),
}));

const mockedGetIngredients = jest.mocked(getIngredients);

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

const createWrapper = (queryClient = createQueryClient()) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const PARAMS = { category: "전체", sort: "asc" } as const;

beforeEach(() => {
  mockPathname.mockReturnValue("/ingredients");
  mockedGetIngredients.mockReset().mockResolvedValue({
    content: [],
    page: { size: 20, totalElements: 0, number: 0, totalPages: 1 },
  });
});

const localizedIngredient = (name: string): IngredientItem => ({
  id: "ingredient-1",
  name,
  category: "고기",
  imageUrl: "",
  unit: "",
  inFridge: true,
  calories: 0,
});

const ingredientPage = (name: string): IngredientsApiResponse => ({
  content: [localizedIngredient(name)],
  page: { size: 20, number: 0, totalElements: 1, totalPages: 1 },
});

it("비로그인이면 내 냉장고 재료를 호출하지 않는다 (T-17)", () => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: true,
  });
  renderHook(() => useInfiniteIngredients(PARAMS), {
    wrapper: createWrapper(),
  });
  expect(mockedGetIngredients).not.toHaveBeenCalled();
});

it("로그인이면 isMine:true로 호출한다 (T-17)", async () => {
  useUserStore.setState({
    user: { id: "u1" } as User,
    isAuthenticated: true,
    isAuthReady: true,
  });
  renderHook(() => useInfiniteIngredients(PARAMS), {
    wrapper: createWrapper(),
  });
  await waitFor(() =>
    expect(mockedGetIngredients).toHaveBeenCalledWith(
      expect.objectContaining({ isMine: true })
    )
  );
});

it("locale regression: 동일 QueryClient에서 ko에서 ja로 바뀌면 새 locale 데이터로 전환한다", async () => {
  useUserStore.setState({
    user: { id: "u1" } as User,
    isAuthenticated: true,
    isAuthReady: true,
  });
  mockedGetIngredients.mockImplementation(async ({ lang }) =>
    lang === "ja" ? ingredientPage("豚肉") : ingredientPage("돼지고기")
  );
  const queryClient = createQueryClient();
  const { result, rerender } = renderHook(
    () => useInfiniteIngredients(PARAMS),
    { wrapper: createWrapper(queryClient) }
  );

  await waitFor(() =>
    expect(result.current.ingredients?.[0]?.name).toBe("돼지고기")
  );
  mockPathname.mockReturnValue("/ja/ingredients");
  rerender();

  await waitFor(() =>
    expect(result.current.ingredients?.[0]?.name).toBe("豚肉")
  );
  expect(mockedGetIngredients).toHaveBeenLastCalledWith(
    expect.objectContaining({ lang: "ja" })
  );
});

it("전체 count 요청만 실패하면 성공한 필터 목록과 종료 오류 상태를 함께 반환한다", async () => {
  useUserStore.setState({
    user: { id: "u1" } as User,
    isAuthenticated: true,
    isAuthReady: true,
  });
  mockedGetIngredients.mockImplementation(async ({ category }) => {
    if (category === null) throw new Error("count unavailable");
    return ingredientPage("돼지고기");
  });

  const { result } = renderHook(
    () => useInfiniteIngredients({ category: "고기", sort: "asc" }),
    { wrapper: createWrapper() }
  );

  await waitFor(() =>
    expect(result.current.ingredients?.[0]?.name).toBe("돼지고기")
  );
  await waitFor(() => expect(result.current.isTotalCountError).toBe(true));
  expect(result.current.isTotalCountPending).toBe(false);
  expect(result.current.totalCount).toBeNull();
});
