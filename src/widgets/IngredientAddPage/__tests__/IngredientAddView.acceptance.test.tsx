import { act } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { triggerHaptic } from "@/shared/lib/bridge";

import {
  getIngredients,
  getMyIngredientIds,
} from "@/entities/ingredient/model/api";
import { INGREDIENT_QUERY_KEYS } from "@/entities/ingredient/model/queryKeys";
import type {
  IngredientItem,
  IngredientsApiResponse,
} from "@/entities/ingredient/model/types";
import type { User } from "@/entities/user";
import { useUserStore } from "@/entities/user";

import { addIngredientBulk } from "@/features/ingredient-add-fridge/model/api";

import { IngredientAddView } from "../ui/IngredientAddView";

const mockPathname = jest.fn();
const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    replace: replaceMock,
    push: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/entities/ingredient/model/api", () => ({
  ...jest.requireActual("@/entities/ingredient/model/api"),
  getIngredients: jest.fn(),
  getMyIngredientIds: jest.fn(),
}));

jest.mock("@/features/ingredient-add-fridge/model/api", () => ({
  addIngredientBulk: jest.fn(),
  addIngredient: jest.fn(),
}));

const getIngredientsMock = jest.mocked(getIngredients);
const getMyIngredientIdsMock = jest.mocked(getMyIngredientIds);
const addIngredientBulkMock = jest.mocked(addIngredientBulk);
const triggerHapticMock = jest.mocked(triggerHaptic);

const authenticatedUser: User = {
  id: "u1",
  nickname: "테스터",
  profileImage: "",
  hasFirstRecord: false,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
};

const ingredient = (
  id: string,
  name: string,
  category: string
): IngredientItem => ({
  id,
  name,
  category,
  imageUrl: "",
  unit: "",
  inFridge: false,
  calories: 0,
});

const tomato = ingredient("tomato-1", "토마토", "채소");
const onion = ingredient("onion-2", "양파", "채소");
const pork = ingredient("pork-1", "돼지고기", "고기");
const tofu = ingredient("tofu-3", "두부", "콩/두부");
const tomatoJa = ingredient("tomato-1", "トマト", "野菜");
const onionJa = ingredient("onion-2", "玉ねぎ", "野菜");

const page = (content: IngredientItem[]): IngredientsApiResponse => ({
  content,
  page: {
    size: 20,
    number: 0,
    totalElements: content.length,
    totalPages: content.length === 0 ? 0 : 1,
  },
});

const deferred = <T,>() => {
  let resolve: (value: T | PromiseLike<T>) => void = () => {
    throw new Error("deferred resolve is not initialized");
  };
  let reject: (reason?: unknown) => void = () => {
    throw new Error("deferred reject is not initialized");
  };
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

const renderAddPage = (
  pathname: string,
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
) => {
  mockPathname.mockReturnValue(pathname);
  useUserStore.setState({
    user: authenticatedUser,
    isAuthenticated: true,
    isAuthReady: true,
  });
  const view = render(
    <QueryClientProvider client={queryClient}>
      <IngredientAddView />
    </QueryClientProvider>
  );
  return { ...view, queryClient };
};

const selectCatalogIngredient = async (name: string) => {
  await userEvent.click(
    await screen.findByRole("button", {
      name: new RegExp(name),
    })
  );
};

describe("IngredientAddView acceptance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getMyIngredientIdsMock.mockResolvedValue([]);
    addIngredientBulkMock.mockResolvedValue(undefined);
    getIngredientsMock.mockImplementation(async ({ category, lang, q }) => {
      if (lang === "ja") return page([tomatoJa, onionJa]);
      if (q === "토마토") return page([tomato]);
      if (category === "고기" && !q) return page([pork]);
      if (q) return page([]);
      return page([tomato, onion, tofu]);
    });
  });

  it("FRT-08: 재료 추가는 drawer가 아닌 locale 전체 화면 content다", async () => {
    renderAddPage("/en/ingredients/new");

    expect(
      await screen.findByRole("heading", { name: "Add ingredients" })
    ).toBeVisible();
    expect(
      screen.getByRole("searchbox", { name: /Search ingredients/ })
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "All" })).toHaveClass(
      "min-h-11",
      "min-w-11"
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("FRT-09: 검색·카테고리·추천 묶음이 한 선택 재료 상태를 공유한다", async () => {
    renderAddPage("/ingredients/new");

    await userEvent.type(
      screen.getByRole("searchbox", { name: /재료를 검색/ }),
      "토마토"
    );
    await userEvent.click(screen.getByRole("button", { name: "검색" }));
    await selectCatalogIngredient("토마토");
    expect(screen.getByRole("button", { name: "토마토 제거" })).toHaveClass(
      "h-11",
      "w-11"
    );
    await userEvent.click(screen.getByRole("button", { name: "고기" }));
    await selectCatalogIngredient("돼지고기");
    await userEvent.click(
      screen.getByRole("button", { name: /한식 기본 베이스 상세 보기/ })
    );
    expect(screen.getByRole("button", { name: "닫기" })).toHaveClass(
      "h-11",
      "w-11"
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "양파 선택" }));

    expect(screen.getByRole("button", { name: "3개 추가하기" })).toBeEnabled();
  });

  it("선택 bar에서 재료를 제거하면 상태 변경과 함께 Light 햅틱을 한 번 보낸다", async () => {
    renderAddPage("/ingredients/new");
    await selectCatalogIngredient("토마토");
    triggerHapticMock.mockClear();

    await userEvent.click(screen.getByRole("button", { name: "토마토 제거" }));

    expect(
      screen.queryByRole("button", { name: "1개 추가하기" })
    ).not.toBeInTheDocument();
    expect(triggerHapticMock).toHaveBeenCalledTimes(1);
    expect(triggerHapticMock).toHaveBeenCalledWith("Light");
  });

  it("FRT-10: 보유 재료는 보유 중으로 표시되고 선택되지 않는다", async () => {
    getMyIngredientIdsMock.mockResolvedValue(["tofu-3"]);
    renderAddPage("/ingredients/new");

    const tofuButton = await screen.findByRole("button", {
      name: /두부.*보유 중/,
    });
    expect(tofuButton).toBeDisabled();
    await userEvent.click(tofuButton);
    expect(
      screen.queryByRole("button", { name: "1개 추가하기" })
    ).not.toBeInTheDocument();
  });

  it("FRT-11: 선택 ID를 한 번 제출하고 성공하면 일본어 냉장고로 돌아간다", async () => {
    const request = deferred<void>();
    addIngredientBulkMock.mockReturnValue(request.promise);
    renderAddPage("/ja/ingredients/new");

    await selectCatalogIngredient("トマト");
    await selectCatalogIngredient("玉ねぎ");
    const submit = screen.getByRole("button", { name: "2品を追加" });
    await userEvent.dblClick(submit);

    expect(addIngredientBulkMock).toHaveBeenCalledTimes(1);
    expect(addIngredientBulkMock).toHaveBeenCalledWith(["tomato-1", "onion-2"]);
    expect(submit).toBeDisabled();
    expect(triggerHapticMock).not.toHaveBeenCalledWith("Success");

    await act(async () => request.resolve());
    expect(replaceMock).toHaveBeenCalledWith("/ja/ingredients", undefined);
    expect(triggerHapticMock).toHaveBeenCalledTimes(3);
    expect(triggerHapticMock).toHaveBeenLastCalledWith("Success");
  });

  it("같은 QueryClient에서 ko에서 ja로 전환하면 locale cache를 분리해 다시 조회한다", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const view = renderAddPage("/ingredients/new", queryClient);
    await screen.findByRole("button", { name: /토마토/ });

    mockPathname.mockReturnValue("/ja/ingredients/new");
    view.rerender(
      <QueryClientProvider client={queryClient}>
        <IngredientAddView />
      </QueryClientProvider>
    );

    expect(await screen.findByRole("button", { name: /トマト/ })).toBeVisible();
    expect(getIngredientsMock).toHaveBeenCalledWith(
      expect.objectContaining({ lang: "ko" })
    );
    expect(getIngredientsMock).toHaveBeenCalledWith(
      expect.objectContaining({ lang: "ja" })
    );
    expect(
      queryClient.getQueryData(INGREDIENT_QUERY_KEYS.browse("전체", "", "ko"))
    ).toBeDefined();
    expect(
      queryClient.getQueryData(INGREDIENT_QUERY_KEYS.browse("전체", "", "ja"))
    ).toBeDefined();
  });
});
