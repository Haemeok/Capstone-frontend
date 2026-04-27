import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { ApiError } from "@/shared/api/errors";

import * as apiModule from "../api";
import { useChatMutation } from "../hooks";

jest.mock("../api");
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/widgets/Toast", () => ({
  useToastStore: () => ({ addToast: jest.fn() }),
}));

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe("useChatMutation", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("on success returns ChatResponse", async () => {
    jest.spyOn(apiModule, "postChat").mockResolvedValue({
      answer: "보통 매운맛이에요.",
      intent: "IN_SCOPE",
      fromLlm: true,
    });
    const { result } = renderHook(() => useChatMutation(), { wrapper });
    await act(async () => {
      await result.current.mutateAsync({
        recipeId: "x9Lb3a7Q",
        question: "이거 매워요?",
        sessionId: "uuid",
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.fromLlm).toBe(true);
  });

  it("on 705 ApiError surfaces error code via data", async () => {
    const apiErr = new ApiError(429, "Too Many Requests", {
      code: "705",
      message: "quota",
    });
    jest.spyOn(apiModule, "postChat").mockRejectedValue(apiErr);
    const { result } = renderHook(() => useChatMutation(), { wrapper });
    await act(async () => {
      try {
        await result.current.mutateAsync({
          recipeId: "x",
          question: "q",
          sessionId: "s",
        });
      } catch {
        /* expected */
      }
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as ApiError).data.code).toBe("705");
  });

  it("retry is disabled (retry: 0)", async () => {
    const spy = jest
      .spyOn(apiModule, "postChat")
      .mockRejectedValue(new ApiError(500, "boom", { code: "703" }));
    const { result } = renderHook(() => useChatMutation(), { wrapper });
    await act(async () => {
      try {
        await result.current.mutateAsync({
          recipeId: "x",
          question: "q",
          sessionId: "s",
        });
      } catch {
        /* expected */
      }
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
