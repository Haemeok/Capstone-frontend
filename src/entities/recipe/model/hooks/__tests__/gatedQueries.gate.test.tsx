import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import {
  getMyFridgeRecipes,
  getRecipeHistoryItems,
  getRecordsTimeline,
} from "../../api";
import { useMyFridgeRecipesInfiniteQuery } from "../useMyFridgeQueries";
import { useRecipeHistoryItemsQuery } from "../useRecipeHistoryItemsQuery";
import { useRecordsTimelineInfiniteQuery } from "../useRecordsTimelineInfiniteQuery";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("../../api", () => ({
  ...jest.requireActual("../../api"),
  getRecordsTimeline: jest.fn(),
  getMyFridgeRecipes: jest.fn(),
  getRecipeHistoryItems: jest.fn(),
}));

jest.mock("@/shared/i18n", () => ({
  useUserPagesLocale: () => "ko",
  useChromeLocale: () => "ko",
}));

const mockedTimeline = getRecordsTimeline as jest.Mock;
const mockedFridge = getMyFridgeRecipes as jest.Mock;
const mockedHistoryItems = getRecipeHistoryItems as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const DISABLED = { enabled: false };

beforeEach(() => {
  mockedTimeline.mockReset().mockResolvedValue({ groups: [], hasNext: false });
  mockedFridge
    .mockReset()
    .mockResolvedValue({ content: [], last: true, number: 0 });
  mockedHistoryItems.mockReset().mockResolvedValue({ items: [] });
});

it("게이트가 닫히면 records timeline을 호출하지 않는다 (T-13)", () => {
  renderHook(() => useRecordsTimelineInfiniteQuery(DISABLED), {
    wrapper: createWrapper(),
  });
  expect(mockedTimeline).not.toHaveBeenCalled();
});

it("게이트가 닫히면 my-fridge 레시피를 호출하지 않는다 (T-14)", () => {
  renderHook(() => useMyFridgeRecipesInfiniteQuery(undefined, DISABLED), {
    wrapper: createWrapper(),
  });
  expect(mockedFridge).not.toHaveBeenCalled();
});

it("recipeHistoryItems: 게이트∧date는 AND로 결합된다 (T-16)", async () => {
  const { unmount } = renderHook(
    () => useRecipeHistoryItemsQuery("2026-07-20", false),
    { wrapper: createWrapper() }
  );
  expect(mockedHistoryItems).not.toHaveBeenCalled();
  unmount();

  renderHook(() => useRecipeHistoryItemsQuery("2026-07-20", true), {
    wrapper: createWrapper(),
  });
  await waitFor(() => expect(mockedHistoryItems).toHaveBeenCalledTimes(1));
});
