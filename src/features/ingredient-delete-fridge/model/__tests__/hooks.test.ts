import React from "react";

import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { getNextPageParam } from "@/shared/lib/utils";

import { INGREDIENT_QUERY_KEYS } from "@/entities/ingredient/model/queryKeys";
import { RECIPE_QUERY_KEYS } from "@/entities/recipe/model/queryKeys";

import * as api from "../api";
import {
  useDeleteIngredientBulkMutation,
  useDeleteIngredientMutation,
} from "../hooks";

jest.mock("../api");
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return Wrapper;
};

const makeBrowsePage = () => ({
  content: [
    { id: "i1", name: "양파", inFridge: true },
    { id: "i2", name: "마늘", inFridge: true },
  ],
  page: { size: 10, number: 0, totalElements: 2, totalPages: 1 },
});

describe("useDeleteIngredientMutation (browse single delete)", () => {
  it("flips inFridge=false but keeps the item in the browse list (T-04)", async () => {
    (api.deleteIngredient as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const listQueryFn = jest.fn(async () => makeBrowsePage());

    const { result } = renderHook(
      () => {
        const list = useInfiniteQuery({
          queryKey: INGREDIENT_QUERY_KEYS.browse("전체", ""),
          queryFn: listQueryFn,
          initialPageParam: 0,
          getNextPageParam,
        });
        const remove = useDeleteIngredientMutation({ category: "전체", q: "" });
        return { list, remove };
      },
      { wrapper: createWrapper(queryClient) }
    );

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    act(() => result.current.remove.mutate("i1"));
    await waitFor(() => expect(result.current.remove.isSuccess).toBe(true));

    const data = queryClient.getQueryData<{
      pages: { content: { id: string; inFridge: boolean }[] }[];
    }>(INGREDIENT_QUERY_KEYS.browse("전체", ""));
    expect(data?.pages[0].content).toHaveLength(2);
    expect(data?.pages[0].content.find((i) => i.id === "i1")?.inFridge).toBe(
      false
    );
  });

  it("does not refetch the browse list after delete (T-05)", async () => {
    (api.deleteIngredient as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const listQueryFn = jest.fn(async () => makeBrowsePage());

    const { result } = renderHook(
      () => {
        const list = useInfiniteQuery({
          queryKey: INGREDIENT_QUERY_KEYS.browse("전체", ""),
          queryFn: listQueryFn,
          initialPageParam: 0,
          getNextPageParam,
        });
        const remove = useDeleteIngredientMutation({ category: "전체", q: "" });
        return { list, remove };
      },
      { wrapper: createWrapper(queryClient) }
    );

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    const before = listQueryFn.mock.calls.length;

    act(() => result.current.remove.mutate("i1"));
    await waitFor(() => expect(result.current.remove.isSuccess).toBe(true));
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));

    expect(listQueryFn).toHaveBeenCalledTimes(before);
  });
});

const makeFridgePage = () => ({
  content: [
    { id: "f1", name: "당근", inFridge: true },
    { id: "f2", name: "감자", inFridge: true },
  ],
  page: { size: 10, number: 0, totalElements: 12, totalPages: 2 },
});

const makeFridgePageAfterF1Removed = () => ({
  content: [{ id: "f2", name: "감자", inFridge: true }],
  page: { size: 10, number: 0, totalElements: 11, totalPages: 2 },
});

const makeFridgeQueryFnRemovingF1 = () => {
  let calls = 0;
  return jest.fn(async () => {
    calls += 1;
    return calls === 1 ? makeFridgePage() : makeFridgePageAfterF1Removed();
  });
};

describe("useDeleteIngredientBulkMutation (fridge bulk delete — strategy A)", () => {
  const renderFridge = (queryClient: QueryClient, fridgeQueryFn: jest.Mock) =>
    renderHook(
      () => {
        const list = useInfiniteQuery({
          queryKey: INGREDIENT_QUERY_KEYS.myFridge("전체", "asc"),
          queryFn: fridgeQueryFn,
          initialPageParam: 0,
          getNextPageParam,
        });
        const bulk = useDeleteIngredientBulkMutation();
        return { list, bulk };
      },
      { wrapper: createWrapper(queryClient) }
    );

  it("removes deleted ids from the fridge list immediately, reaching the segmented key by prefix (T-09, T-09b)", async () => {
    (api.deleteIngredientBulk as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const fridgeQueryFn = makeFridgeQueryFnRemovingF1();
    const { result } = renderFridge(queryClient, fridgeQueryFn);

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    act(() => result.current.bulk.mutate(["f1"]));

    await waitFor(() => {
      const data = queryClient.getQueryData<{
        pages: { content: { id: string }[] }[];
      }>(INGREDIENT_QUERY_KEYS.myFridge("전체", "asc"));
      const ids = data?.pages[0].content.map((i) => i.id) ?? [];
      expect(ids).not.toContain("f1");
      expect(ids).toContain("f2");
    });
  });

  it("decrements totalElements by the number removed (T-10)", async () => {
    (api.deleteIngredientBulk as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const fridgeQueryFn = makeFridgeQueryFnRemovingF1();
    const { result } = renderFridge(queryClient, fridgeQueryFn);

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    act(() => result.current.bulk.mutate(["f1"]));

    await waitFor(() => {
      const data = queryClient.getQueryData<{
        pages: { page: { totalElements: number } }[];
      }>(INGREDIENT_QUERY_KEYS.myFridge("전체", "asc"));
      expect(data?.pages[0].page.totalElements).toBe(11);
    });
  });

  it("refetches the fridge list once to reconcile with the server (T-11)", async () => {
    (api.deleteIngredientBulk as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const fridgeQueryFn = jest.fn(async () => makeFridgePage());
    const { result } = renderFridge(queryClient, fridgeQueryFn);

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    const before = fridgeQueryFn.mock.calls.length;

    act(() => result.current.bulk.mutate(["f1"]));
    await waitFor(() => expect(result.current.bulk.isSuccess).toBe(true));
    await waitFor(() =>
      expect(fridgeQueryFn.mock.calls.length).toBeGreaterThan(before)
    );
  });

  it("refetches my-ingredient-ids so pack badges stay correct (T-12)", async () => {
    (api.deleteIngredientBulk as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const idsQueryFn = jest.fn(async () => ["x1"]);

    const { result } = renderHook(
      () => {
        const ids = useInfiniteQuery({
          queryKey: INGREDIENT_QUERY_KEYS.myIds,
          queryFn: idsQueryFn,
          initialPageParam: 0,
          getNextPageParam: () => null,
        });
        const bulk = useDeleteIngredientBulkMutation();
        return { ids, bulk };
      },
      { wrapper: createWrapper(queryClient) }
    );

    await waitFor(() => expect(result.current.ids.isSuccess).toBe(true));
    const before = idsQueryFn.mock.calls.length;

    act(() => result.current.bulk.mutate(["f1"]));
    await waitFor(() => expect(result.current.bulk.isSuccess).toBe(true));
    await waitFor(() =>
      expect(idsQueryFn.mock.calls.length).toBeGreaterThan(before)
    );
  });
});

describe("deleting an ingredient re-queries the my-fridge recipe list", () => {
  const makeEmptyRecipePage = () => ({ content: [], last: true, number: 0 });

  const mountRecipeListWithDelete = <T>(
    queryClient: QueryClient,
    recipeQueryFn: jest.Mock,
    del: () => T
  ) =>
    renderHook(
      () => {
        const recipes = useInfiniteQuery({
          queryKey: RECIPE_QUERY_KEYS.myFridge(undefined),
          queryFn: recipeQueryFn,
          initialPageParam: 0,
          getNextPageParam: () => null,
          staleTime: Infinity,
        });
        const mutation = del();
        return { recipes, mutation };
      },
      { wrapper: createWrapper(queryClient) }
    );

  it("invalidates the recipe list after a single delete (regression: stale result)", async () => {
    (api.deleteIngredient as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const recipeQueryFn = jest.fn(async () => makeEmptyRecipePage());

    const { result } = mountRecipeListWithDelete(
      queryClient,
      recipeQueryFn,
      () => useDeleteIngredientMutation({ category: "전체", q: "" })
    );

    await waitFor(() => expect(result.current.recipes.isSuccess).toBe(true));
    const before = recipeQueryFn.mock.calls.length;

    act(() => result.current.mutation.mutate("i1"));
    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));
    await waitFor(() =>
      expect(recipeQueryFn.mock.calls.length).toBeGreaterThan(before)
    );
  });

  it("invalidates the recipe list after a bulk delete", async () => {
    (api.deleteIngredientBulk as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const recipeQueryFn = jest.fn(async () => makeEmptyRecipePage());

    const { result } = mountRecipeListWithDelete(
      queryClient,
      recipeQueryFn,
      () => useDeleteIngredientBulkMutation()
    );

    await waitFor(() => expect(result.current.recipes.isSuccess).toBe(true));
    const before = recipeQueryFn.mock.calls.length;

    act(() => result.current.mutation.mutate(["i1"]));
    await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));
    await waitFor(() =>
      expect(recipeQueryFn.mock.calls.length).toBeGreaterThan(before)
    );
  });
});

describe("delete error paths roll back the optimistic changes", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("single delete reverts inFridge to true on failure", async () => {
    (api.deleteIngredient as jest.Mock).mockRejectedValue(new Error("fail"));
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    queryClient.setQueryData(INGREDIENT_QUERY_KEYS.browse("전체", ""), {
      pages: [makeBrowsePage()],
      pageParams: [0],
    });

    const { result } = renderHook(
      () => useDeleteIngredientMutation({ category: "전체", q: "" }),
      { wrapper: createWrapper(queryClient) }
    );

    act(() => result.current.mutate("i1"));
    await waitFor(() => expect(result.current.isError).toBe(true));

    const data = queryClient.getQueryData<{
      pages: { content: { id: string; inFridge: boolean }[] }[];
    }>(INGREDIENT_QUERY_KEYS.browse("전체", ""));
    expect(data?.pages[0].content.find((i) => i.id === "i1")?.inFridge).toBe(
      true
    );
  });

  it("bulk delete restores removed fridge items and the browse flag on failure", async () => {
    (api.deleteIngredientBulk as jest.Mock).mockRejectedValue(
      new Error("fail")
    );
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    queryClient.setQueryData(INGREDIENT_QUERY_KEYS.myFridge("전체", "asc"), {
      pages: [makeFridgePage()],
      pageParams: [0],
    });
    queryClient.setQueryData(INGREDIENT_QUERY_KEYS.browse("전체", ""), {
      pages: [
        {
          content: [{ id: "f1", name: "당근", inFridge: true }],
          page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
        },
      ],
      pageParams: [0],
    });

    const { result } = renderHook(() => useDeleteIngredientBulkMutation(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => result.current.mutate(["f1"]));
    await waitFor(() => expect(result.current.isError).toBe(true));

    const fridge = queryClient.getQueryData<{
      pages: { content: { id: string }[] }[];
    }>(INGREDIENT_QUERY_KEYS.myFridge("전체", "asc"));
    expect(fridge?.pages[0].content.map((i) => i.id)).toContain("f1");

    const browse = queryClient.getQueryData<{
      pages: { content: { id: string; inFridge: boolean }[] }[];
    }>(INGREDIENT_QUERY_KEYS.browse("전체", ""));
    expect(browse?.pages[0].content.find((i) => i.id === "f1")?.inFridge).toBe(
      true
    );
  });
});
