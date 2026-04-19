import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import * as api from "../api";
import { useToggleRecipeSave } from "../hooks";

jest.mock("../api");
jest.mock("@/features/auth/model/hooks/useAuthenticatedAction", () => ({
  __esModule: true,
  default: (fn: (variables: void) => void) => fn,
}));
jest.mock("@/shared/lib/review", () => ({
  trackReviewAction: () => false,
}));
jest.mock("@/features/review-gate", () => ({
  scheduleReviewGate: jest.fn(),
}));

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  return Wrapper;
};

describe("useToggleRecipeSave optimistic updates", () => {
  it("toggles favoriteByCurrentUser in recipes list cache", async () => {
    (api.postRecipeSave as jest.Mock).mockResolvedValue({ saved: true });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const recipeId = "r1";
    queryClient.setQueryData(["recipes", "all"], {
      pages: [
        {
          content: [
            { id: "r1", favoriteByCurrentUser: false },
            { id: "r2", favoriteByCurrentUser: false },
          ],
        },
      ],
    });

    const { result } = renderHook(() => useToggleRecipeSave(recipeId), {
      wrapper: createWrapper(queryClient),
    });

    act(() => result.current.mutate());

    await waitFor(() => {
      const data = queryClient.getQueryData<{
        pages: { content: { id: string; favoriteByCurrentUser: boolean }[] }[];
      }>(["recipes", "all"]);
      expect(data?.pages[0].content[0].favoriteByCurrentUser).toBe(true);
      expect(data?.pages[0].content[1].favoriteByCurrentUser).toBe(false);
    });
  });

  it("toggles favoriteByCurrentUser in non-infinite recipes cache (e.g. ['recipes', 'latest'])", async () => {
    (api.postRecipeSave as jest.Mock).mockResolvedValue({ saved: true });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const recipeId = "r1";
    queryClient.setQueryData(["recipes", "latest"], {
      content: [
        { id: "r1", favoriteByCurrentUser: false },
        { id: "r2", favoriteByCurrentUser: false },
      ],
      page: { size: 20, number: 0, totalElements: 2, totalPages: 1 },
    });

    const { result } = renderHook(() => useToggleRecipeSave(recipeId), {
      wrapper: createWrapper(queryClient),
    });

    act(() => result.current.mutate());

    await waitFor(() => {
      const data = queryClient.getQueryData<{
        content: { id: string; favoriteByCurrentUser: boolean }[];
      }>(["recipes", "latest"]);
      expect(data?.content[0].favoriteByCurrentUser).toBe(true);
      expect(data?.content[1].favoriteByCurrentUser).toBe(false);
    });
  });

  it("toggles favoriteByCurrentUser in recipes-status batch cache", async () => {
    (api.postRecipeSave as jest.Mock).mockResolvedValue({ saved: true });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const recipeId = "r1";
    queryClient.setQueryData(["recipes-status"], {
      r1: { likedByCurrentUser: false, favoriteByCurrentUser: false },
      r2: { likedByCurrentUser: true, favoriteByCurrentUser: false },
    });

    const { result } = renderHook(() => useToggleRecipeSave(recipeId), {
      wrapper: createWrapper(queryClient),
    });

    act(() => result.current.mutate());

    await waitFor(() => {
      const data = queryClient.getQueryData<
        Record<string, { favoriteByCurrentUser: boolean }>
      >(["recipes-status"]);
      expect(data?.r1.favoriteByCurrentUser).toBe(true);
      expect(data?.r2.favoriteByCurrentUser).toBe(false);
    });
  });
});
