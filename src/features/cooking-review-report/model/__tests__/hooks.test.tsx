import type { PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { api } from "@/shared/api/client";

import { useReportCookingReview } from "../hooks";

jest.mock("@/shared/api/client", () => ({
  api: {
    post: jest.fn(),
  },
}));

const postMock = jest.mocked(api.post);

it("신고 성공은 cooking-review 캐시를 무효화하지 않습니다", async () => {
  postMock.mockResolvedValue({ message: "reported" });
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const queryKey = ["cooking-review", "public", "recipe-report", false, 20];
  queryClient.setQueryData(queryKey, { totalCount: 1 });
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(() => useReportCookingReview(), {
    wrapper: Wrapper,
  });

  await act(async () => {
    await result.current.mutateAsync({
      reviewId: "review-report",
      reasonType: "INAPPROPRIATE",
      detail: "음식 사진이 아님",
    });
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(queryClient.getQueryState(queryKey)?.isInvalidated).toBe(false);
});
