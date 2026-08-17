import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

import { useUserStore } from "@/entities/user";

import { MonthlyCookingRecordPageClient } from "../_components/MonthlyCookingRecordPageClient";

const replace = jest.fn();
const getCookingRecords = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/calendar/timeline",
  useSearchParams: () => new URLSearchParams("month=2026-08"),
  useRouter: () => ({
    push: jest.fn(),
    replace,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/entities/recipe/model/recordApi", () => ({
  getCookingRecords: (...args: unknown[]) => getCookingRecords(...args),
  getCookingRecord: jest.fn(),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => ({
  useResponsiveSheet: () => ({
    isMobile: true,
    Container: ({ children, open }: { children: ReactNode; open: boolean }) =>
      open ? <div>{children}</div> : null,
    Content: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Header: ({ children }: { children: ReactNode }) => (
      <header>{children}</header>
    ),
    Title: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
    Description: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  }),
}));

const makeRecord = (recordId: string, title: string, imageUrl: string) => ({
  recordId,
  recipeId: `recipe-${recordId}`,
  displayTitle: title,
  ingredientCost: null,
  marketPrice: null,
  nutrition: null,
  calories: null,
  imageUrl,
  visibility: null,
  stickerImageUrl: imageUrl,
  stickerStatus: "READY" as const,
  cookedAt: null,
  createdAt: "2026-08-11T12:00:00+09:00",
  sourceType: "RECIPE" as const,
  reviewId: null,
  recipeAvailable: true,
  savings: null,
  isRemix: null,
});

describe("MonthlyCookingRecordPageClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ isAuthReady: true, isAuthenticated: true });
    getCookingRecords.mockResolvedValue({
      groups: [
        {
          date: "2026-08-11",
          records: [makeRecord("august", "동파육", "/august.webp")],
        },
        {
          date: "2026-07-20",
          records: [makeRecord("july", "냉면", "/july.webp")],
        },
      ],
      hasNext: false,
    });
  });

  it("month 쿼리에 해당하는 이미지 스티커만 월별 보드에 보여줍니다", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );

    expect(
      await screen.findByRole("img", { name: "동파육" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "냉면" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "2026년 8월" })
    ).toBeInTheDocument();
  });

  it("다음 달을 누르면 locale을 보존하는 month 쿼리로 이동합니다", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );
    await screen.findByRole("img", { name: "동파육" });

    fireEvent.click(screen.getByRole("button", { name: "다음 달" }));

    expect(replace).toHaveBeenCalledWith(
      "/calendar/timeline?month=2026-09",
      undefined
    );
  });

  it("인증 확인이 끝난 비회원에게는 로딩 대신 로그인 안내를 보여줍니다", () => {
    useUserStore.setState({ isAuthReady: true, isAuthenticated: false });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyCookingRecordPageClient />
      </QueryClientProvider>
    );

    expect(
      screen.getByText("로그인하고 요리 기록을 모아보세요.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("요리 기록을 불러오는 중입니다.")
    ).not.toBeInTheDocument();
  });
});
