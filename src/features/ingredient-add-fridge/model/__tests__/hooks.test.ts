import React from "react";

import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { getNextPageParam } from "@/shared/lib/utils";

import { INGREDIENT_QUERY_KEYS } from "@/entities/ingredient/model/queryKeys";

import * as api from "../api";
import {
  useAddIngredientBulkMutation,
  useAddIngredientMutation,
} from "../hooks";

jest.mock("../api");

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return Wrapper;
};

const makeListPage = () => ({
  content: [
    { id: "i1", name: "양파", inFridge: false },
    { id: "i2", name: "마늘", inFridge: false },
  ],
  page: { size: 10, number: 0, totalElements: 2, totalPages: 1 },
});

describe("useAddIngredientMutation (browse single add)", () => {
  it("patches the factory-derived browse list and flips inFridge (T-01, T-03)", async () => {
    (api.addIngredient as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const listQueryFn = jest.fn(async () => makeListPage());

    const { result } = renderHook(
      () => {
        const list = useInfiniteQuery({
          queryKey: INGREDIENT_QUERY_KEYS.browse("전체", ""),
          queryFn: listQueryFn,
          initialPageParam: 0,
          getNextPageParam,
        });
        const add = useAddIngredientMutation({ category: "전체", q: "" });
        return { list, add };
      },
      { wrapper: createWrapper(queryClient) }
    );

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    act(() => result.current.add.mutate("i1"));
    await waitFor(() => expect(result.current.add.isSuccess).toBe(true));

    const data = queryClient.getQueryData<{
      pages: { content: { id: string; inFridge: boolean }[] }[];
    }>(INGREDIENT_QUERY_KEYS.browse("전체", ""));
    const i1 = data?.pages[0].content.find((i) => i.id === "i1");
    expect(i1?.inFridge).toBe(true);
  });

  it("does not refetch the browse list after add (T-02)", async () => {
    (api.addIngredient as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const listQueryFn = jest.fn(async () => makeListPage());

    const { result } = renderHook(
      () => {
        const list = useInfiniteQuery({
          queryKey: INGREDIENT_QUERY_KEYS.browse("전체", ""),
          queryFn: listQueryFn,
          initialPageParam: 0,
          getNextPageParam,
        });
        const add = useAddIngredientMutation({ category: "전체", q: "" });
        return { list, add };
      },
      { wrapper: createWrapper(queryClient) }
    );

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    const before = listQueryFn.mock.calls.length;

    act(() => result.current.add.mutate("i1"));
    await waitFor(() => expect(result.current.add.isSuccess).toBe(true));
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));

    expect(listQueryFn).toHaveBeenCalledTimes(before);
  });

  it("does not patch a different-category browse list (T-03b)", async () => {
    (api.addIngredient as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    queryClient.setQueryData(INGREDIENT_QUERY_KEYS.browse("육류", ""), {
      pages: [makeListPage()],
      pageParams: [0],
    });

    const { result } = renderHook(
      () => useAddIngredientMutation({ category: "전체", q: "" }),
      { wrapper: createWrapper(queryClient) }
    );

    act(() => result.current.mutate("i1"));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const meat = queryClient.getQueryData<{
      pages: { content: { id: string; inFridge: boolean }[] }[];
    }>(INGREDIENT_QUERY_KEYS.browse("육류", ""));
    expect(meat?.pages[0].content.find((i) => i.id === "i1")?.inFridge).toBe(
      false
    );
  });
});

describe("useAddIngredientBulkMutation (browse bulk add)", () => {
  it("flips inFridge=true for all selected ids via prefix match (T-06)", async () => {
    (api.addIngredientBulk as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const listQueryFn = jest.fn(async () => makeListPage());

    const { result } = renderHook(
      () => {
        const list = useInfiniteQuery({
          queryKey: INGREDIENT_QUERY_KEYS.browse("전체", ""),
          queryFn: listQueryFn,
          initialPageParam: 0,
          getNextPageParam,
        });
        const bulk = useAddIngredientBulkMutation();
        return { list, bulk };
      },
      { wrapper: createWrapper(queryClient) }
    );

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    act(() => result.current.bulk.mutate(["i1", "i2"]));
    await waitFor(() => expect(result.current.bulk.isSuccess).toBe(true));

    const data = queryClient.getQueryData<{
      pages: { content: { id: string; inFridge: boolean }[] }[];
    }>(INGREDIENT_QUERY_KEYS.browse("전체", ""));
    expect(data?.pages[0].content.every((i) => i.inFridge)).toBe(true);
  });

  it("does not refetch the browse list after bulk add (T-07)", async () => {
    (api.addIngredientBulk as jest.Mock).mockResolvedValue(undefined);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const listQueryFn = jest.fn(async () => makeListPage());

    const { result } = renderHook(
      () => {
        const list = useInfiniteQuery({
          queryKey: INGREDIENT_QUERY_KEYS.browse("전체", ""),
          queryFn: listQueryFn,
          initialPageParam: 0,
          getNextPageParam,
        });
        const bulk = useAddIngredientBulkMutation();
        return { list, bulk };
      },
      { wrapper: createWrapper(queryClient) }
    );

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    const before = listQueryFn.mock.calls.length;

    act(() => result.current.bulk.mutate(["i1", "i2"]));
    await waitFor(() => expect(result.current.bulk.isSuccess).toBe(true));
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));

    expect(listQueryFn).toHaveBeenCalledTimes(before);
  });

  it("refetches my-ingredient-ids so ownership badges stay correct (T-08)", async () => {
    (api.addIngredientBulk as jest.Mock).mockResolvedValue(undefined);
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
        const bulk = useAddIngredientBulkMutation();
        return { ids, bulk };
      },
      { wrapper: createWrapper(queryClient) }
    );

    await waitFor(() => expect(result.current.ids.isSuccess).toBe(true));
    const before = idsQueryFn.mock.calls.length;

    act(() => result.current.bulk.mutate(["i1"]));
    await waitFor(() => expect(result.current.bulk.isSuccess).toBe(true));
    await waitFor(() =>
      expect(idsQueryFn.mock.calls.length).toBeGreaterThan(before)
    );
  });
});

describe("add error paths roll back the optimistic inFridge change", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  const seedBrowse = (queryClient: QueryClient) =>
    queryClient.setQueryData(INGREDIENT_QUERY_KEYS.browse("전체", ""), {
      pages: [makeListPage()],
      pageParams: [0],
    });

  it("single add reverts inFridge to false on failure", async () => {
    (api.addIngredient as jest.Mock).mockRejectedValue(new Error("fail"));
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    seedBrowse(queryClient);

    const { result } = renderHook(
      () => useAddIngredientMutation({ category: "전체", q: "" }),
      { wrapper: createWrapper(queryClient) }
    );

    act(() => result.current.mutate("i1"));
    await waitFor(() => expect(result.current.isError).toBe(true));

    const data = queryClient.getQueryData<{
      pages: { content: { id: string; inFridge: boolean }[] }[];
    }>(INGREDIENT_QUERY_KEYS.browse("전체", ""));
    expect(data?.pages[0].content.find((i) => i.id === "i1")?.inFridge).toBe(
      false
    );
  });

  it("bulk add reverts inFridge to false on failure", async () => {
    (api.addIngredientBulk as jest.Mock).mockRejectedValue(new Error("fail"));
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    seedBrowse(queryClient);

    const { result } = renderHook(() => useAddIngredientBulkMutation(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => result.current.mutate(["i1", "i2"]));
    await waitFor(() => expect(result.current.isError).toBe(true));

    const data = queryClient.getQueryData<{
      pages: { content: { inFridge: boolean }[] }[];
    }>(INGREDIENT_QUERY_KEYS.browse("전체", ""));
    expect(data?.pages[0].content.every((i) => i.inFridge === false)).toBe(
      true
    );
  });
});
