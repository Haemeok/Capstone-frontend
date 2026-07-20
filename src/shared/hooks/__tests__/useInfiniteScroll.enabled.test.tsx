import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { useInfiniteScroll } from "../useInfiniteScroll";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

const queryFn = jest.fn().mockResolvedValue({ content: [] });
const getNextPageParam = () => null;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

beforeEach(() => {
  queryFn.mockClear();
});

it("enabled:false면 queryFn을 호출하지 않는다 (T-06)", () => {
  renderHook(
    () =>
      useInfiniteScroll({
        queryKey: ["t06", "disabled"],
        queryFn,
        getNextPageParam,
        initialPageParam: 0,
        enabled: false,
      }),
    { wrapper: createWrapper() }
  );

  expect(queryFn).not.toHaveBeenCalled();
});

it("enabled 미지정이면 기존과 동일하게 queryFn을 호출한다 (T-06)", async () => {
  renderHook(
    () =>
      useInfiniteScroll({
        queryKey: ["t06", "default"],
        queryFn,
        getNextPageParam,
        initialPageParam: 0,
      }),
    { wrapper: createWrapper() }
  );

  await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(1));
});
