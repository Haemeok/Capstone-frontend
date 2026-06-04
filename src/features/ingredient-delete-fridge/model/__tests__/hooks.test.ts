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
import { useDeleteIngredientMutation } from "../hooks";

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
