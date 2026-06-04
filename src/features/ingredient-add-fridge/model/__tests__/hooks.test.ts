import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { INGREDIENT_QUERY_KEYS } from "@/entities/ingredient/model/queryKeys";
import { getNextPageParam } from "@/shared/lib/utils";

import * as api from "../api";
import { useAddIngredientMutation } from "../hooks";

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
