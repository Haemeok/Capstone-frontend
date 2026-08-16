import { act } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ingredientAddMessages, type Locale } from "@/shared/i18n";
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
const mockIsInView = jest.fn(() => false);

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
  useInView: () => ({ ref: jest.fn(), inView: mockIsInView() }),
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
const tomatoEn = ingredient("tomato-1", "Tomato", "Vegetables");
const onionEn = ingredient("onion-2", "Onion", "Vegetables");

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

const expectToAppearBefore = (first: HTMLElement, second: HTMLElement) => {
  expect(
    first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
};

const getRailLabel = (locale: Locale, key: "previousPacks" | "nextPacks") =>
  ingredientAddMessages[locale][key];

describe("IngredientAddView acceptance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsInView.mockReturnValue(false);
    getMyIngredientIdsMock.mockResolvedValue([]);
    addIngredientBulkMock.mockResolvedValue(undefined);
    getIngredientsMock.mockImplementation(async ({ category, lang, q }) => {
      if (lang === "ja") return page([tomatoJa, onionJa]);
      if (lang === "en")
        return q === "tomato" ? page([tomatoEn]) : page([onionEn]);
      if (q === "토마토") return page([tomato]);
      if (category === "고기" && !q) return page([pork]);
      if (q) return page([]);
      return page([tomato, onion, tofu]);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("T-01: 재료 추가 화면에서 검색창에 바로 입력할 수 있다", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderAddPage("/en/ingredients/new");

    const searchbox = screen.getByRole("searchbox", {
      name: /Search ingredients/,
    });
    expect(searchbox).toBeVisible();
    expect(searchbox).toBeEnabled();
    expect(
      screen.queryByRole("button", { name: "Search" })
    ).not.toBeInTheDocument();
    getIngredientsMock.mockClear();
    await user.type(searchbox, "tomato{Enter}");
    expect(searchbox).toHaveValue("tomato");
    expect(getIngredientsMock).toHaveBeenCalledWith(
      expect.objectContaining({ q: "tomato", lang: "en" })
    );
    jest.useRealTimers();
    expect(await screen.findByRole("button", { name: /Tomato/ })).toBeVisible();
    expect(screen.getByRole("button", { name: "All" })).toHaveClass(
      "min-h-11",
      "min-w-11"
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("T-02: 기본 상태에서 추천 묶음이 직접 선택 catalog와 load-more보다 먼저 나온다", async () => {
    renderAddPage("/ingredients/new");

    const packHeading = screen.getByRole("heading", {
      name: "추천 재료 모음",
    });
    const catalogHeading = screen.getByRole("heading", {
      name: "재료 둘러보기",
    });
    await screen.findByRole("button", { name: /토마토/ });
    const loadMore = screen.getByTestId("ingredient-catalog-load-more");

    expectToAppearBefore(packHeading, catalogHeading);
    expectToAppearBefore(packHeading, loadMore);
  });

  it("T-03A: 검색어를 확정하면 추천 묶음을 숨기고 검색 결과를 보여 준다", async () => {
    renderAddPage("/ingredients/new");

    await userEvent.type(
      screen.getByRole("searchbox", { name: /재료를 검색/ }),
      "토마토{Enter}"
    );

    expect(
      screen.queryByRole("heading", { name: "추천 재료 모음" })
    ).not.toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /토마토/ })).toBeVisible();
  });

  it("T-03B: 전체가 아닌 카테고리를 고르면 추천 묶음을 숨기고 결과를 보여 준다", async () => {
    renderAddPage("/ingredients/new");

    await userEvent.click(screen.getByRole("button", { name: "고기" }));

    expect(
      screen.queryByRole("heading", { name: "추천 재료 모음" })
    ).not.toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /돼지고기/ })
    ).toBeVisible();
  });

  it("T-04: 빈 검색어와 전체 카테고리로 돌아오면 추천 묶음과 기존 선택을 유지한다", async () => {
    renderAddPage("/ingredients/new");
    await selectCatalogIngredient("토마토");

    await userEvent.click(screen.getByRole("button", { name: "고기" }));
    expect(
      screen.queryByRole("heading", { name: "추천 재료 모음" })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "전체" }));

    expect(
      screen.getByRole("heading", { name: "추천 재료 모음" })
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "토마토 제거" })).toHaveClass(
      "h-11",
      "w-11"
    );
    expect(screen.getByRole("button", { name: "1개 추가하기" })).toBeEnabled();
  });

  it.each([
    ["/ingredients/new", "ko"],
    ["/en/ingredients/new", "en"],
    ["/ja/ingredients/new", "ja"],
  ] as const)(
    "%s 추천 묶음 rail에 locale별 이전·다음 탐색 버튼을 연결한다",
    (pathname, locale) => {
      renderAddPage(pathname);

      expect(
        screen.getByRole("button", {
          name: getRailLabel(locale, "previousPacks"),
        })
      ).toHaveClass("h-11", "w-11", "hidden", "md:flex");
      expect(
        screen.getByRole("button", {
          name: getRailLabel(locale, "nextPacks"),
        })
      ).toHaveClass("h-11", "w-11", "hidden", "md:flex");
    }
  );

  it("추천 묶음 탐색 버튼은 rail 너비의 80%씩 양방향으로 이동하고 햅틱을 보내지 않는다", async () => {
    renderAddPage("/ingredients/new");
    const rail = screen.getByRole("group", { name: "추천 재료 모음" });
    const scrollBy = jest.fn();
    Object.defineProperty(rail, "clientWidth", { value: 500 });
    Object.defineProperty(rail, "scrollBy", { value: scrollBy });

    const previous = screen.getByRole("button", {
      name: getRailLabel("ko", "previousPacks"),
    });
    const next = screen.getByRole("button", {
      name: getRailLabel("ko", "nextPacks"),
    });
    await userEvent.click(previous);
    await userEvent.click(next);

    expect(scrollBy).toHaveBeenNthCalledWith(1, {
      left: -400,
      behavior: "smooth",
    });
    expect(scrollBy).toHaveBeenNthCalledWith(2, {
      left: 400,
      behavior: "smooth",
    });
    expect(triggerHapticMock).not.toHaveBeenCalled();
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

  it("FRT-12: bulk add 실패 후 선택과 전체 화면을 유지하고 오류를 알린다", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    addIngredientBulkMock.mockRejectedValue(new Error("503"));
    renderAddPage("/ingredients/new");

    await selectCatalogIngredient("토마토");
    await selectCatalogIngredient("양파");
    await userEvent.click(screen.getByRole("button", { name: "2개 추가하기" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "재료를 추가하지 못했어요"
    );
    expect(screen.getByRole("button", { name: "2개 추가하기" })).toBeEnabled();
    expect(screen.getByRole("heading", { name: "재료 추가" })).toBeVisible();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("drawer에서 추가 실패를 알리고 닫으면 page에서 다시 알리지 않는다", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    addIngredientBulkMock.mockRejectedValue(new Error("503"));
    renderAddPage("/ingredients/new");
    await selectCatalogIngredient("토마토");
    await userEvent.click(
      screen.getByRole("button", { name: /한식 기본 베이스 상세 보기/ })
    );
    await userEvent.click(screen.getByRole("button", { name: "1개 추가하기" }));

    const alert = screen.getByRole("alert");
    await waitFor(() =>
      expect(alert).toHaveTextContent("재료를 추가하지 못했어요")
    );
    expect(screen.getAllByRole("alert")).toHaveLength(1);

    await userEvent.click(screen.getByRole("button", { name: "닫기" }));
    await waitFor(() =>
      expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "closed")
    );

    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });

  it("추가 실패 후 선택을 실제로 변경하면 오류를 지운다", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    addIngredientBulkMock.mockRejectedValue(new Error("503"));
    renderAddPage("/ingredients/new");
    await selectCatalogIngredient("토마토");
    await selectCatalogIngredient("양파");
    await userEvent.click(screen.getByRole("button", { name: "2개 추가하기" }));

    const alert = screen.getByRole("alert");
    await waitFor(() =>
      expect(alert).toHaveTextContent("재료를 추가하지 못했어요")
    );
    await userEvent.click(screen.getByRole("button", { name: "토마토 제거" }));

    await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
    expect(screen.getByRole("button", { name: "1개 추가하기" })).toBeEnabled();
  });

  it("FRT-13: 검색 결과가 없으면 검색어와 다음 행동을 보여 준다", async () => {
    getIngredientsMock.mockResolvedValue(page([]));
    renderAddPage("/ingredients/new");

    await userEvent.type(screen.getByRole("searchbox"), "용과{Enter}");

    expect(
      await screen.findByText('"용과"에 해당하는 재료가 없어요')
    ).toBeVisible();
    expect(screen.getByText("검색어나 카테고리를 바꿔보세요")).toBeVisible();
  });

  it("검색 결과에서 카테고리를 바꾸면 과거 검색어 없이 바로 조회한다", async () => {
    renderAddPage("/ingredients/new");
    await userEvent.type(screen.getByRole("searchbox"), "용과{Enter}");
    expect(
      await screen.findByText('"용과"에 해당하는 재료가 없어요')
    ).toBeVisible();
    getIngredientsMock.mockClear();

    await userEvent.click(screen.getByRole("button", { name: "고기" }));

    await waitFor(() => expect(getIngredientsMock).toHaveBeenCalled());
    expect(getIngredientsMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({ category: "고기", q: "" })
    );
    expect(screen.queryByText('"용과"에 해당하는 재료가 없어요')).toBeNull();
    expect(
      await screen.findByRole("button", { name: /돼지고기/ })
    ).toBeVisible();
  });

  it("FRT-14: 첫 catalog 요청 동안 최종 3열 공간을 예약한다", () => {
    getIngredientsMock.mockReturnValue(
      deferred<IngredientsApiResponse>().promise
    );
    renderAddPage("/ingredients/new");

    expect(screen.getByTestId("ingredient-add-skeleton")).toHaveClass(
      "grid-cols-3"
    );
    expect(screen.getAllByTestId("ingredient-add-skeleton-card")).toHaveLength(
      6
    );
  });

  it("다음 catalog 요청 동안 기존 재료 아래 두 칸을 예약한다", async () => {
    const nextPageRequest = deferred<IngredientsApiResponse>();
    getIngredientsMock.mockImplementation(({ pageParam }) => {
      if (pageParam === 1) return nextPageRequest.promise;
      return Promise.resolve({
        ...page([tomato]),
        page: {
          size: 20,
          number: 0,
          totalElements: 2,
          totalPages: 2,
        },
      });
    });
    const view = renderAddPage("/ingredients/new");
    expect(await screen.findByRole("button", { name: /토마토/ })).toBeVisible();

    mockIsInView.mockReturnValue(true);
    view.rerender(
      <QueryClientProvider client={view.queryClient}>
        <IngredientAddView />
      </QueryClientProvider>
    );

    const skeletonCards = await screen.findAllByTestId(
      "ingredient-add-skeleton-card"
    );
    const tomatoButton = screen.getByRole("button", { name: /토마토/ });
    expect(skeletonCards).toHaveLength(2);
    expect(tomatoButton).toBeVisible();
    skeletonCards.forEach((card) => {
      expect(card.parentElement).toBe(tomatoButton.parentElement);
    });
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
