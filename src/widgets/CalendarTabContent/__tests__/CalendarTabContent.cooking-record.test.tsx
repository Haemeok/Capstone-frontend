import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import { triggerHaptic } from "@/shared/lib/bridge";

import type {
  CookingRecordCalendarMonthResponse,
  CookingRecordListItem,
  CookingRecordListResponse,
} from "@/entities/recipe";
import { useUserStore } from "@/entities/user";
import { getUserStreak } from "@/entities/user/model/api";

import CalendarTabContent from "../index";

const getCookingRecords = jest.fn<Promise<CookingRecordListResponse>, []>();
const getCookingRecordCalendarMonth = jest.fn<
  Promise<CookingRecordCalendarMonthResponse>,
  []
>();
const getRecipeHistory = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/shared/lib/gsap", () => ({
  gsap: {
    context: (callback: () => void) => {
      callback();
      return { revert: jest.fn() };
    },
    to: jest.fn(),
    fromTo: jest.fn(),
    set: jest.fn(),
  },
  ScrollTrigger: { create: jest.fn(), refresh: jest.fn() },
}));

jest.mock("@/shared/hooks/useScrollAnimate", () => () => ({
  targetRef: { current: null },
  playAnimation: jest.fn(),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock("@/widgets/MonthlySavingsSummary", () => ({
  __esModule: true,
  default: () => <div>절약했어요</div>,
}));

jest.mock("@/features/cooking-record-create", () => ({
  ManualCookingRecordDrawer: ({
    isOpen,
    initialCookedDate,
  }: {
    isOpen: boolean;
    initialCookedDate?: string;
  }) =>
    isOpen ? (
      <div role="dialog" data-initial-cooked-date={initialCookedDate}>
        요리 기록 추가 드로어
      </div>
    ) : null,
}));

jest.mock("@/entities/recipe/model/recordApi", () => ({
  getCookingRecords: () => getCookingRecords(),
  getCookingRecordCalendarMonth: () => getCookingRecordCalendarMonth(),
}));

jest.mock("@/entities/recipe/model/api", () => ({
  ...jest.requireActual("@/entities/recipe/model/api"),
  getRecipeHistory: () => getRecipeHistory(),
}));

jest.mock("@/entities/user/model/api", () => ({
  ...jest.requireActual("@/entities/user/model/api"),
  getUserStreak: jest.fn(),
}));

const mockedGetUserStreak = jest.mocked(getUserStreak);
const mockedTriggerHaptic = jest.mocked(triggerHaptic);

type CaptionLocaleExpectation = [pathname: string, recordCountLabel: string];

const captionLocaleExpectations: CaptionLocaleExpectation[] = [
  ["/en/users/u1", "8 dishes"],
  ["/ja/users/u1", "料理 8品"],
];

const makeRecord = (index: number): CookingRecordListItem => ({
  recordId: `record-${index}`,
  recipeId: `recipe-${index}`,
  displayTitle: index === 0 ? "동파육" : `요리 ${index + 1}`,
  ingredientCost: null,
  marketPrice: null,
  nutrition: null,
  calories: null,
  imageUrl: `/original-${index}.webp`,
  visibility: null,
  stickerImageUrl: `/sticker-${index}.webp`,
  stickerStatus: "READY",
  cookedAt: "2026-08-17T18:00:00+09:00",
  createdAt: "2026-08-17T18:00:00+09:00",
  sourceType: "RECIPE",
  reviewId: null,
  recipeAvailable: true,
  savings: null,
  isRemix: false,
});

const makeRecordPage = (count: number): CookingRecordListResponse => ({
  background: null,
  groups:
    count === 0
      ? []
      : [
          {
            date: "2026-08-17",
            records: Array.from({ length: count }, (_, index) =>
              makeRecord(index)
            ),
          },
        ],
  hasNext: false,
});

const makeCalendarMonth = (
  count: number,
  date = "2026-08-17"
): CookingRecordCalendarMonthResponse => ({
  dailySummaries:
    count === 0
      ? []
      : [
          {
            date,
            totalSavings: 0,
            totalCount: count,
            firstImageUrl: "/calendar-original.webp",
          },
        ],
  monthlyTotalSavings: 0,
});

const createDeferred = <T,>() => {
  let resolvePromise: (value: T) => void = (value) => {
    throw new Error(
      `Promise가 생성되기 전에 ${String(value)}로 resolve됐습니다.`
    );
  };
  let rejectPromise: (reason?: unknown) => void = (reason) => {
    throw new Error(
      `Promise가 생성되기 전에 ${String(reason)}으로 reject됐습니다.`
    );
  };
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  return { promise, resolve: resolvePromise, reject: rejectPromise };
};

const renderCalendarTab = (pathname = "/users/u1") => {
  (usePathname as jest.Mock).mockReturnValue(pathname);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const renderResult = render(<CalendarTabContent />, { wrapper: Wrapper });
  return { ...renderResult, queryClient };
};

describe("CalendarTabContent cooking record preview", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date(2026, 7, 27, 12) });
    jest.clearAllMocks();
    useUserStore.setState({
      isAuthReady: true,
      isAuthenticated: true,
    });
    getCookingRecords.mockResolvedValue(makeRecordPage(8));
    getCookingRecordCalendarMonth.mockResolvedValue(makeCalendarMonth(8));
    getRecipeHistory.mockResolvedValue(makeCalendarMonth(8));
    mockedGetUserStreak.mockResolvedValue({ streak: 0, cookedToday: false });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("T-01 기록 8개 중 스티커 미리보기 7개를 날짜별 기록보다 먼저 보여줍니다", async () => {
    renderCalendarTab();

    expect(
      await screen.findByRole("heading", {
        name: "이번 달 8번 요리했어요",
      })
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId("cooking-record-preview-sticker")
    ).toHaveLength(7);
    expect(screen.queryByText(/절약했어요/)).not.toBeInTheDocument();
    expect(screen.getByText("날짜별 기록")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "기록" })).toBeInTheDocument();
  });

  it("T-02 기록이 하나면 한 스티커와 같은 날짜의 캘린더 기록을 보여줍니다", async () => {
    getCookingRecords.mockResolvedValue(makeRecordPage(1));
    getCookingRecordCalendarMonth.mockResolvedValue(makeCalendarMonth(1));
    getRecipeHistory.mockResolvedValue(makeCalendarMonth(1));

    renderCalendarTab();

    expect(await screen.findByText("동파육")).toBeInTheDocument();
    expect(
      screen.getAllByTestId("cooking-record-preview-sticker")
    ).toHaveLength(1);
    expect(
      screen.getByRole("button", {
        name: "2026-08-17 요리 기록 레시피 1개",
      })
    ).toBeInTheDocument();
  });

  it("T-03 달력의 월을 바꾸면 같은 월의 스티커 미리보기를 보여줍니다", async () => {
    getCookingRecords.mockResolvedValue({
      background: null,
      groups: [
        { date: "2026-08-17", records: [makeRecord(0)] },
        {
          date: "2026-07-20",
          records: [
            { ...makeRecord(1), displayTitle: "가지볶음" },
            { ...makeRecord(2), displayTitle: "된장찌개" },
          ],
        },
      ],
      hasNext: false,
    });

    renderCalendarTab();
    expect(await screen.findByText("동파육")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Go to the Previous Month" })
    );

    expect(
      await screen.findByRole("heading", { name: "7월에 2번 요리했어요" })
    ).toBeInTheDocument();
    expect(screen.getByText("가지볶음")).toBeInTheDocument();
  });

  it("T-04 스티커 미리보기 조회가 실패해도 날짜별 기록은 유지합니다", async () => {
    getCookingRecords.mockRejectedValue(new Error("record list failed"));
    getCookingRecordCalendarMonth.mockResolvedValue(makeCalendarMonth(1));

    renderCalendarTab();

    expect(
      await screen.findByText("요리 기록을 불러오지 못했습니다.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "2026-08-17 요리 기록 레시피 1개",
      })
    ).toBeInTheDocument();
  });

  it("T-05 빈 달에서는 바로 요리 기록 추가 드로어를 열 수 있습니다", async () => {
    getCookingRecords.mockResolvedValue(makeRecordPage(0));
    getCookingRecordCalendarMonth.mockResolvedValue(makeCalendarMonth(0));

    renderCalendarTab();

    expect(
      await screen.findByRole("heading", { name: "이번 달 0번 요리했어요" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "전체보기" })).toHaveClass(
      "text-sm"
    );
    expect(screen.getByText("8월에 만든 요리들을 모아봤어요.")).toHaveClass(
      "text-sm"
    );
    const recordBoard = screen.getByRole("region", { name: "8월 요리 기록" });
    expect(
      within(recordBoard).queryByText("8월 요리 기록")
    ).not.toBeInTheDocument();
    expect(
      within(recordBoard).queryByText("0개의 요리")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("아직 이달의 요리가 없습니다.").parentElement
    ).toHaveClass("p-5");

    fireEvent.click(
      await screen.findByRole("button", { name: "요리 기록 추가" })
    );

    expect(screen.getByRole("dialog")).toHaveTextContent(
      "요리 기록 추가 드로어"
    );
  });

  it("기록 없는 지난 날짜를 누르면 해당 날짜로 요리 기록 추가 드로어를 엽니다", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 7, 27, 12));
    getCookingRecords.mockResolvedValue(makeRecordPage(0));
    getCookingRecordCalendarMonth.mockResolvedValue(makeCalendarMonth(0));

    renderCalendarTab();

    const emptyDay = await screen.findByRole("button", {
      name: "2026-08-12에 요리 기록 추가",
    });
    fireEvent.click(emptyDay);

    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-initial-cooked-date",
      "2026-08-12"
    );
    expect(mockedTriggerHaptic).toHaveBeenCalledWith("Light");
    expect(
      screen.queryByRole("button", {
        name: "2026-08-28에 요리 기록 추가",
      })
    ).not.toBeInTheDocument();
  });

  it("T-06 프로필 요리 기록에 서버에서 선택한 배경을 적용합니다", async () => {
    getCookingRecords.mockResolvedValue({
      ...makeRecordPage(1),
      background: {
        backgroundKey: "WOOD",
        backgroundType: "PRESET",
        imageUrl: "/backgrounds/wood.webp",
      },
    });

    renderCalendarTab();

    const backgroundLayer = await screen.findByTestId(
      "profile-cooking-record-background-layer"
    );
    expect(backgroundLayer.querySelector("img")).toHaveAttribute(
      "src",
      "/backgrounds/wood.webp"
    );
    expect(screen.queryByText("8월 요리 기록")).not.toBeInTheDocument();
    expect(screen.queryByText("1개의 요리")).not.toBeInTheDocument();
  });

  it("T-27 날짜별 기록 도구 행과 월별 요리 수를 한 캘린더 구조로 보여줍니다", async () => {
    renderCalendarTab();

    const heading = await screen.findByRole("heading", {
      name: "날짜별 기록",
    });
    const toolbar = heading.parentElement;
    if (!toolbar) throw new Error("날짜별 기록 도구 행을 찾지 못했습니다.");
    expect(
      within(toolbar).getByRole("button", { name: "기록" })
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByTestId("calendar-caption")).toHaveTextContent(
        "8개의 요리"
      )
    );
    const caption = screen.getByTestId("calendar-caption");
    expect(caption).toHaveTextContent("2026년 8월");
    expect(caption).toHaveClass("flex-col", "items-start");

    const modeToggle = screen.getByRole("button", {
      name: "기록",
    }).parentElement;
    expect(modeToggle).toHaveClass("bg-gray-100", "p-1");
    expect(modeToggle?.querySelector("img")).not.toBeInTheDocument();

    const previousButton = screen.getByRole("button", {
      name: "Go to the Previous Month",
    });
    const navigation = previousButton.parentElement;
    expect(navigation).toHaveClass("right-0");
    expect(caption.closest(".rdp-root")).toContainElement(navigation);
  });

  it("T-28 날짜 셀과 월 탐색에 44px 터치 영역을 유지합니다", async () => {
    renderCalendarTab();

    const recordDay = await screen.findByRole("button", {
      name: "2026-08-17 요리 기록 레시피 8개",
    });
    expect(recordDay).toHaveClass("min-h-11");

    const previousButton = screen.getByRole("button", {
      name: "Go to the Previous Month",
    });
    const nextButton = screen.getByRole("button", {
      name: "Go to the Next Month",
    });
    expect(previousButton).toHaveClass("h-11", "w-11");
    expect(nextButton).toHaveClass("h-11", "w-11");

    const week = document.querySelector(".rdp-week");
    expect(week).toHaveClass("h-[72px]", "md:h-24");

    const monthGrid = document.querySelector(".rdp-month_grid");
    expect(monthGrid).toHaveClass(
      "-mx-3",
      "w-[calc(100%+1.5rem)]",
      "md:mx-0",
      "md:w-full"
    );

    const calendarRoot = screen
      .getByTestId("calendar-caption")
      .closest(".rdp-root");
    expect(calendarRoot).toHaveStyle("--rdp-nav_button-height: 2.75rem");
    expect(calendarRoot).toHaveStyle("--rdp-nav_button-width: 2.75rem");
  });

  it.each(captionLocaleExpectations)(
    "T-30 %s 캘린더 캡션의 월 총 요리 수를 현지화합니다",
    async (pathname, recordCountLabel) => {
      renderCalendarTab(pathname);

      await waitFor(() =>
        expect(screen.getByTestId("calendar-caption")).toHaveTextContent(
          recordCountLabel
        )
      );
    }
  );

  it("T-34 캘린더 원본 사진 대신 같은 날짜의 READY 누끼 이미지를 사용합니다", async () => {
    renderCalendarTab();

    const recordDay = await screen.findByRole("button", {
      name: "2026-08-17 요리 기록 레시피 8개",
    });
    const image = recordDay.querySelector("img");

    expect(image).toHaveAttribute("src", "/sticker-0.webp");
    expect(image).not.toHaveAttribute("src", "/calendar-original.webp");
  });

  it("T-29 월과 스트릭 모드 전환 시 데이터와 Light 햅틱을 함께 갱신합니다", async () => {
    getCookingRecordCalendarMonth
      .mockResolvedValueOnce(makeCalendarMonth(8))
      .mockResolvedValueOnce(makeCalendarMonth(2, "2026-07-20"));
    getCookingRecords.mockResolvedValue({
      background: null,
      groups: [
        { date: "2026-08-17", records: [makeRecord(0)] },
        { date: "2026-07-20", records: [makeRecord(1), makeRecord(2)] },
      ],
      hasNext: false,
    });

    renderCalendarTab();
    fireEvent.click(
      await screen.findByRole("button", { name: "Go to the Previous Month" })
    );

    expect(
      await screen.findByRole("button", {
        name: "2026-07-20 요리 기록 레시피 2개",
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId("calendar-caption")).toHaveTextContent(
      "2개의 요리"
    );

    fireEvent.click(screen.getByRole("button", { name: "스트릭" }));

    expect(
      await screen.findByText("오늘부터 직접 요리하며 식비를 절약해보세요!")
    ).toBeInTheDocument();
    expect(mockedTriggerHaptic).toHaveBeenCalledTimes(2);
    expect(mockedTriggerHaptic).toHaveBeenNthCalledWith(1, "Light");
    expect(mockedTriggerHaptic).toHaveBeenNthCalledWith(2, "Light");
  });

  it("T-31 월 이동 응답을 기다리는 동안 빈 달 개수를 숨기고 완료 후 실제 개수를 보여줍니다", async () => {
    const julyCalendar = createDeferred<CookingRecordCalendarMonthResponse>();
    getCookingRecordCalendarMonth
      .mockResolvedValueOnce(makeCalendarMonth(8))
      .mockReturnValueOnce(julyCalendar.promise);

    renderCalendarTab();

    await waitFor(() =>
      expect(screen.getByTestId("calendar-caption")).toHaveTextContent(
        "8개의 요리"
      )
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Go to the Previous Month" })
    );

    await waitFor(() =>
      expect(screen.getByTestId("calendar-caption")).toHaveTextContent(
        "2026년 7월"
      )
    );
    expect(screen.getByTestId("calendar-caption")).not.toHaveTextContent(
      "0개의 요리"
    );
    expect(screen.getByTestId("calendar-caption")).not.toHaveTextContent(
      "8개의 요리"
    );

    await act(async () => {
      julyCalendar.resolve(makeCalendarMonth(2, "2026-07-20"));
    });

    await waitFor(() =>
      expect(screen.getByTestId("calendar-caption")).toHaveTextContent(
        "2개의 요리"
      )
    );
  });

  it("T-32 월 이동 요청이 실패하면 오류 정착 후에도 빈 달 개수를 표시하지 않습니다", async () => {
    const julyCalendar = createDeferred<CookingRecordCalendarMonthResponse>();
    getCookingRecordCalendarMonth
      .mockResolvedValueOnce(makeCalendarMonth(8))
      .mockReturnValueOnce(julyCalendar.promise);

    const { queryClient } = renderCalendarTab();

    await waitFor(() =>
      expect(screen.getByTestId("calendar-caption")).toHaveTextContent(
        "8개의 요리"
      )
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Go to the Previous Month" })
    );
    await waitFor(() =>
      expect(screen.getByTestId("calendar-caption")).toHaveTextContent(
        "2026년 7월"
      )
    );

    await act(async () => {
      julyCalendar.reject(new Error("calendar failed"));
      await expect(julyCalendar.promise).rejects.toThrow("calendar failed");
    });

    await waitFor(() =>
      expect(
        queryClient.getQueryState([
          "cooking-record",
          "calendar",
          "month",
          2026,
          7,
          "ko",
        ])?.status
      ).toBe("error")
    );
    await waitFor(() =>
      expect(screen.getByTestId("calendar-caption")).not.toHaveTextContent(
        "0개의 요리"
      )
    );
  });

  it("T-33 월 이동 요청이 빈 배열로 성공하면 0개의 요리를 표시합니다", async () => {
    const julyCalendar = createDeferred<CookingRecordCalendarMonthResponse>();
    getCookingRecordCalendarMonth
      .mockResolvedValueOnce(makeCalendarMonth(8))
      .mockReturnValueOnce(julyCalendar.promise);

    renderCalendarTab();

    await waitFor(() =>
      expect(screen.getByTestId("calendar-caption")).toHaveTextContent(
        "8개의 요리"
      )
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Go to the Previous Month" })
    );

    await act(async () => {
      julyCalendar.resolve(makeCalendarMonth(0));
      await julyCalendar.promise;
    });

    await waitFor(() =>
      expect(screen.getByTestId("calendar-caption")).toHaveTextContent(
        "0개의 요리"
      )
    );
  });
});
