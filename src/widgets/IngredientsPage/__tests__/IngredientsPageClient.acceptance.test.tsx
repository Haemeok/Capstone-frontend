import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { triggerHaptic } from "@/shared/lib/bridge";

import type {
  IngredientItem,
  IngredientsApiResponse,
} from "@/entities/ingredient";
import { getIngredients } from "@/entities/ingredient";
import type { User } from "@/entities/user";
import { useUserStore } from "@/entities/user/model/store";

import { deleteIngredientBulk } from "@/features/ingredient-delete-fridge/model/api";

import IngredientsPageClient from "../IngredientsPageClient";

const mockPathname = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/features/ingredient-delete-fridge/model/api", () => ({
  deleteIngredientBulk: jest.fn(),
  deleteIngredient: jest.fn(),
}));

jest.mock("@/entities/ingredient", () => ({
  ...jest.requireActual("@/entities/ingredient"),
  getIngredients: jest.fn(),
}));

const getIngredientsMock = jest.mocked(getIngredients);
const deleteIngredientBulkMock = jest.mocked(deleteIngredientBulk);
const triggerHapticMock = jest.mocked(triggerHaptic);

const authenticatedUser: User = {
  id: "user-1",
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
  inFridge: true,
  calories: 0,
});

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
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
};

const renderFridge = (pathname: string, user: User | null) => {
  mockPathname.mockReturnValue(pathname);
  useUserStore.setState({
    user,
    isAuthenticated: user !== null,
    isAuthReady: true,
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return render(<IngredientsPageClient />, { wrapper: Wrapper });
};

const tomato = ingredient("tomato-1", "토마토", "채소");
const pork = ingredient("pork-1", "돼지고기", "고기");
const porkJa = ingredient("pork-1", "豚肉", "肉");
const onion = ingredient("onion-2", "양파", "채소");
const egg = ingredient("egg-3", "달걀", "달걀");
const tofu = ingredient("tofu-4", "두부", "콩류");

const enterManageAndSelect = async (names: string[]) => {
  const user = userEvent.setup();
  await user.click(await screen.findByRole("button", { name: "관리" }));
  for (const name of names) {
    await user.click(screen.getByRole("checkbox", { name: `${name} 선택` }));
  }
  return user;
};

beforeEach(() => {
  jest.clearAllMocks();
  deleteIngredientBulkMock.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("FRT-01: 냉장고 위계를 제목부터 레시피 액션까지 순서대로 보여 준다", async () => {
  getIngredientsMock.mockResolvedValue(page([tomato, pork, onion]));
  renderFridge("/ingredients", authenticatedUser);

  const heading = await screen.findByRole("heading", { name: "내 냉장고" });
  const addEntry = screen.getByRole("link", {
    name: "재료를 검색해서 추가하세요",
  });
  const categoryGroup = screen.getByRole("group", {
    name: "재료 카테고리",
  });
  const ingredientLinks = await screen.findAllByRole("link", {
    name: /상세 보기/,
  });
  const recipeAction = screen.getByRole("link", {
    name: "이 재료로 레시피 찾기",
  });

  expect(screen.getByText("3개의 재료를 보관 중이에요")).toBeVisible();
  expect(addEntry).toHaveAttribute("href", "/ingredients/new");
  expect(ingredientLinks).toHaveLength(3);
  expect(recipeAction).toHaveAttribute("href", "/recipes/my-fridge");
  expect(heading.compareDocumentPosition(addEntry)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING
  );
  expect(addEntry.compareDocumentPosition(categoryGroup)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING
  );
  expect(categoryGroup.compareDocumentPosition(ingredientLinks[0])).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING
  );
  expect(ingredientLinks[0].compareDocumentPosition(recipeAction)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING
  );
});

it("FRT-02: 카테고리 선택이 pressed 상태와 보유 재료 결과를 함께 바꾼다", async () => {
  getIngredientsMock.mockImplementation(async ({ category }) =>
    category === "고기" ? page([pork]) : page([pork, onion])
  );
  renderFridge("/ingredients", authenticatedUser);
  const user = userEvent.setup();

  expect(await screen.findByText("양파")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "고기" }));

  expect(screen.getByRole("button", { name: "고기" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await waitFor(() =>
    expect(screen.queryByText("양파")).not.toBeInTheDocument()
  );
  expect(screen.getByText("돼지고기")).toBeVisible();
  expect(screen.getByText("2개의 재료를 보관 중이에요")).toBeVisible();
});

it("FRT-03: 일본어 냉장고의 상세와 레시피 링크가 locale을 유지한다", async () => {
  getIngredientsMock.mockResolvedValue(page([porkJa]));
  renderFridge("/ja/ingredients", authenticatedUser);

  expect(
    await screen.findByRole("link", { name: /豚肉.*詳細/ })
  ).toHaveAttribute("href", "/ja/ingredients/pork-1");
  expect(screen.getByRole("link", { name: /レシピ/ })).toHaveAttribute(
    "href",
    "/ja/recipes/my-fridge"
  );
});

it("FRT-04: 최초 로딩 중에도 2열 재료 목록 크기를 예약한다", () => {
  const request = deferred<IngredientsApiResponse>();
  getIngredientsMock.mockReturnValue(request.promise);
  renderFridge("/ingredients", authenticatedUser);

  expect(screen.getByTestId("fridge-grid-skeleton")).toHaveClass("grid-cols-2");
  expect(
    screen.getByRole("status", { name: "보유 재료 수 불러오는 중" })
  ).toBeVisible();
  expect(
    screen.queryByText("0개의 재료를 보관 중이에요")
  ).not.toBeInTheDocument();
  expect(getIngredientsMock).toHaveBeenCalledTimes(1);
});

it.each([
  ["/ingredients", "고기", "돼지고기", "보유 재료 수를 불러올 수 없어요"],
  ["/en/ingredients", "Meat", "Pork", "Ingredient count is unavailable"],
  ["/ja/ingredients", "肉", "豚肉", "食材数を読み込めませんでした"],
])(
  "FRT-04 count error: %s에서 필터 목록은 성공하고 전체 count만 실패하면 locale 오류 문구를 보여 준다",
  async (pathname, categoryLabel, ingredientName, unavailableMessage) => {
    getIngredientsMock.mockImplementation(async ({ category }) => {
      if (category === null) throw new Error("count unavailable");
      return page([ingredient("pork-1", ingredientName, "고기")]);
    });
    renderFridge(pathname, authenticatedUser);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: categoryLabel }));

    expect(await screen.findByText(ingredientName)).toBeVisible();
    expect(
      screen.queryByRole("status", { name: /재료 수|ingredient count|食材数/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(unavailableMessage);
  }
);

it("FRT-05: 빈 냉장고에서도 제목과 두 재료 추가 경로를 유지한다", async () => {
  getIngredientsMock.mockResolvedValue(page([]));
  renderFridge("/ingredients", authenticatedUser);

  expect(
    await screen.findByRole("heading", { name: "내 냉장고" })
  ).toBeVisible();
  expect(
    await screen.findByRole("heading", { name: "아직 등록된 재료가 없어요" })
  ).toBeVisible();
  expect(screen.getAllByRole("link", { name: /재료.*추가/ })).toHaveLength(2);
});

it("FRT-06: 비로그인은 냉장고 동작 없이 locale 로그인 경로만 본다", () => {
  renderFridge("/en/ingredients", null);

  expect(getIngredientsMock).not.toHaveBeenCalled();
  expect(screen.getByRole("link", { name: /Log in/ })).toHaveAttribute(
    "href",
    "/en/login?redirectUrl=/en/ingredients"
  );
  expect(
    screen.queryByRole("button", { name: /Manage|Delete/ })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /Add ingredients/ })
  ).not.toBeInTheDocument();
});

it("FRT-07 class contract: 필터와 주요 액션이 pressed 상태와 44px·focus utility를 제공한다", async () => {
  getIngredientsMock.mockResolvedValue(page([tomato]));
  renderFridge("/ingredients", authenticatedUser);

  const category = await screen.findByRole("button", { name: "전체" });
  expect(category).toHaveAttribute("aria-pressed", "true");
  expect(category).toHaveClass("min-h-11", "focus-visible:ring-2");
  expect(screen.getByRole("button", { name: "관리" })).toHaveClass(
    "min-h-11",
    "focus-visible:ring-2"
  );
  expect(
    screen.getByRole("link", { name: "재료를 검색해서 추가하세요" })
  ).toHaveClass("min-h-11", "focus-visible:ring-2");
  expect(
    await screen.findByRole("link", { name: /토마토.*상세 보기/ })
  ).toHaveClass("min-h-11", "focus-visible:ring-2");
});

it("FRT-07 contrast contract: 삭제와 오류 상태가 ink 기반 고대비 표면과 텍스트를 사용한다", async () => {
  getIngredientsMock.mockResolvedValue(page([tomato]));
  const view = renderFridge("/ingredients", authenticatedUser);
  const user = userEvent.setup();

  await user.click(await screen.findByRole("button", { name: "관리" }));
  await user.click(screen.getByRole("checkbox", { name: "토마토 선택" }));
  const deleteAction = screen.getByRole("button", { name: "1개 삭제" });
  expect(deleteAction).toHaveClass("bg-ink", "text-white");
  expect(deleteAction).not.toHaveClass("bg-red-500");
  view.unmount();

  getIngredientsMock.mockRejectedValue(new Error("boom"));
  renderFridge("/ingredients", authenticatedUser);
  const alert = await screen.findByText("오류 발생: boom");
  expect(alert).toHaveAttribute("role", "alert");
  expect(alert).toHaveClass("text-ink-sub");
  expect(alert).not.toHaveClass("text-red-500");
});

it("FRT-15, FRT-16, FRT-17: 관리 모드와 표시 재료 선택 개수를 동기화한다", async () => {
  getIngredientsMock.mockResolvedValue(page([tomato, onion, egg]));
  renderFridge("/ingredients", authenticatedUser);
  const user = userEvent.setup();

  await user.click(await screen.findByRole("button", { name: "관리" }));
  expect(triggerHapticMock).toHaveBeenLastCalledWith("Light");
  expect(
    screen.queryByRole("link", { name: "재료를 검색해서 추가하세요" })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "이 재료로 레시피 찾기" })
  ).not.toBeInTheDocument();

  const tomatoCheckbox = screen.getByRole("checkbox", {
    name: "토마토 선택",
  });
  await user.click(tomatoCheckbox);
  expect(tomatoCheckbox).toHaveAttribute("aria-checked", "true");
  expect(screen.getByRole("button", { name: "1개 삭제" })).toBeVisible();

  await user.click(screen.getByRole("button", { name: "전체 선택" }));
  expect(screen.getAllByRole("checkbox", { checked: true })).toHaveLength(3);
  expect(screen.getByRole("button", { name: "3개 삭제" })).toBeVisible();

  await user.click(tomatoCheckbox);
  expect(tomatoCheckbox).toHaveAttribute("aria-checked", "false");
  expect(screen.getByRole("button", { name: "2개 삭제" })).toBeVisible();

  await user.click(screen.getByRole("checkbox", { name: "양파 선택" }));
  await user.click(screen.getByRole("checkbox", { name: "달걀 선택" }));
  expect(
    screen.queryByRole("button", { name: /개 삭제/ })
  ).not.toBeInTheDocument();
});

it("FRT-16 교차 카테고리: 숨겨진 선택 이름과 ID를 삭제 확인까지 유지한다", async () => {
  getIngredientsMock.mockImplementation(async ({ category }) =>
    category === "고기" ? page([pork]) : page([tomato])
  );
  renderFridge("/ingredients", authenticatedUser);
  const user = userEvent.setup();

  await user.click(await screen.findByRole("button", { name: "관리" }));
  await user.click(screen.getByRole("checkbox", { name: "토마토 선택" }));
  await user.click(screen.getByRole("button", { name: "고기" }));
  await user.click(
    await screen.findByRole("checkbox", { name: "돼지고기 선택" })
  );

  await user.click(screen.getByRole("button", { name: "2개 삭제" }));
  expect(screen.getByRole("dialog")).toHaveTextContent("토마토, 돼지고기");
  await user.click(screen.getByRole("button", { name: "삭제" }));

  expect(deleteIngredientBulkMock).toHaveBeenCalledWith(["tomato-1", "pork-1"]);
});

it("삭제 확인 snapshot: dialog 이후 선택 변경이 최초 이름과 payload를 바꾸지 않는다", async () => {
  getIngredientsMock.mockResolvedValue(page([tomato, onion, egg]));
  renderFridge("/ingredients", authenticatedUser);
  const user = await enterManageAndSelect(["토마토", "양파"]);
  const tomatoCheckbox = screen.getByRole("checkbox", {
    name: "토마토 선택",
  });

  await user.click(screen.getByRole("button", { name: "2개 삭제" }));
  fireEvent.click(tomatoCheckbox);

  expect(screen.getByRole("dialog")).toHaveTextContent("토마토, 양파");
  await user.click(screen.getByRole("button", { name: "삭제" }));
  expect(deleteIngredientBulkMock).toHaveBeenCalledWith([
    "tomato-1",
    "onion-2",
  ]);
});

it("빈 관리 모드: 재료 추가 CTA를 숨기고 전체 선택을 비활성화한다", async () => {
  getIngredientsMock.mockResolvedValue(page([]));
  renderFridge("/ingredients", authenticatedUser);
  const user = userEvent.setup();

  await user.click(await screen.findByRole("button", { name: "관리" }));
  const selectAll = screen.getByRole("button", { name: "전체 선택" });
  expect(selectAll).toBeDisabled();
  expect(
    screen.queryByRole("link", { name: /재료.*추가/ })
  ).not.toBeInTheDocument();

  triggerHapticMock.mockClear();
  await user.click(selectAll);
  expect(triggerHapticMock).not.toHaveBeenCalled();
});

it("관리 완료는 실제 mode 변경에 Light 한 번만 내고 삭제 열기와 취소는 무햅틱이다", async () => {
  getIngredientsMock.mockResolvedValue(page([tomato]));
  renderFridge("/ingredients", authenticatedUser);
  const user = userEvent.setup();

  await user.click(await screen.findByRole("button", { name: "관리" }));
  triggerHapticMock.mockClear();
  await user.click(screen.getByRole("button", { name: "완료" }));
  expect(triggerHapticMock).toHaveBeenCalledTimes(1);
  expect(triggerHapticMock).toHaveBeenCalledWith("Light");

  await user.click(screen.getByRole("button", { name: "관리" }));
  await user.click(screen.getByRole("checkbox", { name: "토마토 선택" }));
  triggerHapticMock.mockClear();
  await user.click(screen.getByRole("button", { name: "1개 삭제" }));
  await user.click(screen.getByRole("button", { name: "취소" }));
  expect(triggerHapticMock).not.toHaveBeenCalled();
});

it("삭제 취소와 Escape는 실제 하단 삭제 버튼으로 focus를 돌려준다", async () => {
  getIngredientsMock.mockResolvedValue(page([tomato]));
  renderFridge("/ingredients", authenticatedUser);
  const user = await enterManageAndSelect(["토마토"]);
  const deleteAction = screen.getByRole("button", { name: "1개 삭제" });

  await user.click(deleteAction);
  await user.click(screen.getByRole("button", { name: "취소" }));
  await waitFor(() => expect(deleteAction).toHaveFocus());

  await user.click(deleteAction);
  await user.keyboard("{Escape}");
  await waitFor(() => expect(deleteAction).toHaveFocus());
});

it("FRT-18, FRT-19: 완료는 요청 없이 끝나고 삭제 취소는 선택을 유지한다", async () => {
  getIngredientsMock.mockResolvedValue(page([tomato, onion, egg, tofu]));
  renderFridge("/ingredients", authenticatedUser);

  let user = await enterManageAndSelect(["토마토"]);
  await user.click(screen.getByRole("button", { name: "완료" }));
  expect(deleteIngredientBulkMock).not.toHaveBeenCalled();
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

  user = await enterManageAndSelect(["토마토", "양파", "달걀", "두부"]);
  await user.click(screen.getByRole("button", { name: "4개 삭제" }));
  expect(deleteIngredientBulkMock).not.toHaveBeenCalled();
  expect(screen.getByRole("dialog")).toHaveTextContent("토마토, 양파 외 2개");

  await user.click(screen.getByRole("button", { name: "취소" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getAllByRole("checkbox", { checked: true })).toHaveLength(4);
});

it("FRT-20: 확인 후 한 번만 삭제하고 일반 모드로 돌아간다", async () => {
  const request = deferred<void>();
  deleteIngredientBulkMock.mockReturnValue(request.promise);
  getIngredientsMock
    .mockResolvedValueOnce(page([tomato, onion, egg]))
    .mockResolvedValue(page([egg]));
  renderFridge("/ingredients", authenticatedUser);

  const user = await enterManageAndSelect(["토마토", "양파"]);
  await user.click(screen.getByRole("button", { name: "2개 삭제" }));
  const confirm = screen.getByRole("button", { name: "삭제" });
  await user.dblClick(confirm);

  expect(triggerHapticMock).toHaveBeenCalledWith("Medium");
  expect(deleteIngredientBulkMock).toHaveBeenCalledTimes(1);
  expect(confirm).toBeDisabled();

  await act(async () => request.resolve(undefined));
  await waitFor(() =>
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
  );
  expect(screen.getByRole("button", { name: "관리" })).toHaveFocus();
  expect(screen.queryByText("토마토")).not.toBeInTheDocument();
  expect(screen.queryByText("양파")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /달걀.*상세 보기/ })).toBeVisible();
});

it("FRT-21: 삭제 실패는 카드·선택·관리 모드와 오류를 복구한다", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  deleteIngredientBulkMock.mockRejectedValue(new Error("500"));
  getIngredientsMock.mockResolvedValue(page([tomato, onion, egg]));
  renderFridge("/ingredients", authenticatedUser);

  const user = await enterManageAndSelect(["토마토", "양파"]);
  await user.click(screen.getByRole("button", { name: "2개 삭제" }));
  await user.click(screen.getByRole("button", { name: "삭제" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "재료를 삭제하지 못했어요"
  );
  expect(screen.getByText("토마토")).toBeVisible();
  expect(screen.getByText("양파")).toBeVisible();
  expect(screen.getAllByRole("checkbox", { checked: true })).toHaveLength(2);
  expect(screen.getByRole("button", { name: "2개 삭제" })).toHaveFocus();
  (console.error as jest.Mock).mockRestore();
});

it("삭제 실패 뒤 개별 선택은 이전 오류를 지운다", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  deleteIngredientBulkMock.mockRejectedValue(new Error("500"));
  getIngredientsMock.mockResolvedValue(page([tomato, onion, egg]));
  renderFridge("/ingredients", authenticatedUser);
  const user = await enterManageAndSelect(["토마토", "양파"]);

  await user.click(screen.getByRole("button", { name: "2개 삭제" }));
  await user.click(screen.getByRole("button", { name: "삭제" }));
  expect(await screen.findByRole("alert")).toBeVisible();
  await user.click(screen.getByRole("checkbox", { name: "달걀 선택" }));

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("삭제 실패 뒤 표시 재료 전체 해제는 이전 오류를 지운다", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  deleteIngredientBulkMock.mockRejectedValue(new Error("500"));
  getIngredientsMock.mockResolvedValue(page([tomato, onion]));
  renderFridge("/ingredients", authenticatedUser);
  const user = await enterManageAndSelect(["토마토", "양파"]);

  await user.click(screen.getByRole("button", { name: "2개 삭제" }));
  await user.click(screen.getByRole("button", { name: "삭제" }));
  expect(await screen.findByRole("alert")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "취소" }));

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("삭제 실패 뒤 완료하고 관리에 재진입하면 이전 오류가 다시 나타나지 않는다", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  deleteIngredientBulkMock.mockRejectedValue(new Error("500"));
  getIngredientsMock.mockResolvedValue(page([tomato]));
  renderFridge("/ingredients", authenticatedUser);
  const user = await enterManageAndSelect(["토마토"]);

  await user.click(screen.getByRole("button", { name: "1개 삭제" }));
  await user.click(screen.getByRole("button", { name: "삭제" }));
  expect(await screen.findByRole("alert")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "완료" }));
  await user.click(screen.getByRole("button", { name: "관리" }));

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("삭제 실패 뒤 재시도 dialog를 열면 이전 오류를 지운다", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  deleteIngredientBulkMock.mockRejectedValue(new Error("500"));
  getIngredientsMock.mockResolvedValue(page([tomato]));
  renderFridge("/ingredients", authenticatedUser);
  const user = await enterManageAndSelect(["토마토"]);

  await user.click(screen.getByRole("button", { name: "1개 삭제" }));
  await user.click(screen.getByRole("button", { name: "삭제" }));
  expect(await screen.findByRole("alert")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "1개 삭제" }));

  expect(
    screen.queryByText("재료를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.")
  ).not.toBeInTheDocument();
});
