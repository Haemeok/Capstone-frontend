import { CalendarDay } from "react-day-picker";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { getDictionary, type Locale } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { CookingRecordCalendarDailySummary } from "@/entities/recipe";

import { CookingRecordCalendarDay } from "../components/CookingRecordCalendarDay";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: true, entry: undefined }),
}));

type RenderDayOptions = {
  totalCount: number;
  firstImageUrl: string | null;
  locale?: Locale;
  date?: Date;
  isToday?: boolean;
  hasSummary?: boolean;
  canAddRecord?: boolean;
  onAddRecord?: (date: Date) => void;
};

type LocaleExpectation = [
  locale: Locale,
  badgeLabel: string,
  accessibleName: string,
];

const localeExpectations: LocaleExpectation[] = [
  ["ko", "3개", "2026-08-17 요리 기록 레시피 3개"],
  ["en", "3", "2026-08-17 Cooking log 3 recipes"],
  ["ja", "3品", "2026-08-17 料理の記録 3品"],
];

const renderDay = ({
  totalCount,
  firstImageUrl,
  locale = "ko",
  date = new Date(2026, 7, 17),
  isToday = false,
  hasSummary = true,
  canAddRecord = false,
  onAddRecord = jest.fn(),
}: RenderDayOptions) => {
  const copy = getDictionary(locale).userPages.calendar;
  const summary: CookingRecordCalendarDailySummary = {
    date: "2026-08-17",
    totalSavings: 0,
    totalCount,
    firstImageUrl,
  };

  render(
    <table>
      <tbody>
        <tr>
          <CookingRecordCalendarDay
            day={new CalendarDay(date, new Date(2026, 7, 1))}
            modifiers={{ today: isToday }}
            mode="photo"
            summary={hasSummary ? summary : undefined}
            stickerImageUrl={firstImageUrl}
            ranges={[]}
            recordLabel={copy.timelineHeading}
            recipeCountTemplate={copy.daySummaryRecipeCount}
            dayCountBadgeTemplate={copy.dayCountBadge}
            emptyDayAddRecordTemplate={copy.emptyDayAddRecord}
            canAddRecord={canAddRecord}
            onAddRecord={onAddRecord}
          />
        </tr>
      </tbody>
    </table>
  );
};

describe("CookingRecordCalendarDay 기록 셀", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("T-21 누끼 음식은 별도 배치 래퍼 안에서 contain으로 표시하고 날짜를 함께 보여줍니다", async () => {
    renderDay({ totalCount: 1, firstImageUrl: "/sticker.webp" });

    const button = screen.getByRole("button", {
      name: "2026-08-17 요리 기록 레시피 1개",
    });
    const image = button.querySelector("img");
    if (!image) {
      throw new Error("누끼 음식 이미지가 렌더링되지 않았습니다.");
    }
    const imageRoot = image.parentElement?.parentElement;
    const positioningWrapper = imageRoot?.parentElement;

    expect(button).toHaveTextContent("17");
    expect(button).not.toHaveClass("rounded-card");
    expect(image).toHaveAttribute("src", "/sticker.webp");
    expect(image).toHaveClass("object-contain");
    expect(imageRoot).toHaveClass("relative", "h-full", "w-full");
    expect(imageRoot).not.toHaveClass("absolute");
    expect(positioningWrapper).toHaveClass(
      "absolute",
      "top-5",
      "right-0.5",
      "bottom-0",
      "left-0.5"
    );

    fireEvent.load(image);
    await waitFor(() => expect(image.parentElement).toHaveClass("opacity-100"));
  });

  it.each([null, "/broken.webp"])(
    "T-22 이미지가 %s여도 날짜와 상세 이동을 유지하고 오류 박스를 숨깁니다",
    (firstImageUrl) => {
      if (firstImageUrl) {
        jest.useFakeTimers();
      }
      renderDay({ totalCount: 1, firstImageUrl });

      const button = screen.getByRole("button", {
        name: "2026-08-17 요리 기록 레시피 1개",
      });
      expect(button).toHaveTextContent("17");

      if (firstImageUrl) {
        for (let retryCount = 0; retryCount < 2; retryCount += 1) {
          const image = button.querySelector("img");
          if (!image) {
            throw new Error("재시도할 음식 이미지가 렌더링되지 않았습니다.");
          }
          fireEvent.error(image);
          act(() => {
            jest.advanceTimersByTime(2000);
          });
        }
        const finalImage = button.querySelector("img");
        if (!finalImage) {
          throw new Error("최종 오류를 발생시킬 음식 이미지가 없습니다.");
        }
        fireEvent.error(finalImage);
      }

      expect(
        button.querySelector('[data-slot="skeleton"]')
      ).not.toBeInTheDocument();
      expect(button.querySelector(".bg-gray-100")).not.toBeInTheDocument();
      expect(button).toHaveTextContent("17");

      fireEvent.click(button);

      expect(triggerHaptic).toHaveBeenCalledWith("Light");
      expect(mockPush).toHaveBeenCalledWith("/calendar/2026-08-17", undefined);
    }
  );

  it("T-23 오늘 기록은 olive 날짜와 작은 점으로 표시합니다", () => {
    renderDay({
      totalCount: 1,
      firstImageUrl: "/sticker.webp",
      date: new Date(2026, 7, 18),
      isToday: true,
    });

    const button = screen.getByRole("button", {
      name: "2026-08-18 요리 기록 레시피 1개",
    });
    const dateNumber = screen.getByText("18");

    expect(dateNumber).toHaveClass("text-olive-dark");
    expect(screen.getByTestId("calendar-day-today-dot")).toHaveClass(
      "bg-olive-dark"
    );
    expect(button.className).not.toContain("violet");
  });

  it("T-23 기록 없는 오늘도 테두리 없이 olive 날짜와 작은 점으로 표시합니다", () => {
    renderDay({
      totalCount: 0,
      firstImageUrl: null,
      date: new Date(2026, 7, 18),
      isToday: true,
      hasSummary: false,
    });

    const dateNumber = screen.getByText("18");

    expect(dateNumber).toHaveClass(
      "text-olive-dark",
      "font-semibold",
      "absolute",
      "top-1"
    );
    expect(dateNumber).not.toHaveClass(
      "border-2",
      "border-violet-500",
      "rounded-full"
    );
    expect(screen.getByTestId("calendar-day-today-dot")).toHaveClass(
      "bg-olive-dark"
    );
  });

  it("빈 날짜를 선택하면 Light 햅틱과 함께 해당 날짜 추가를 요청합니다", () => {
    const onAddRecord = jest.fn();
    renderDay({
      totalCount: 0,
      firstImageUrl: null,
      date: new Date(2026, 7, 12),
      hasSummary: false,
      canAddRecord: true,
      onAddRecord,
    });

    const addButton = screen.getByRole("button", {
      name: "2026-08-12에 요리 기록 추가",
    });
    expect(addButton).toHaveClass("min-h-11", "cursor-pointer");

    fireEvent.click(addButton);

    expect(triggerHaptic).toHaveBeenCalledWith("Light");
    expect(onAddRecord).toHaveBeenCalledWith(new Date(2026, 7, 12));
  });

  it("T-23 기록 없는 날짜와 다른 달 날짜도 숫자를 셀 상단에 맞춥니다", () => {
    const copy = getDictionary("ko").userPages.calendar;
    const { rerender } = render(
      <table>
        <tbody>
          <tr>
            <CookingRecordCalendarDay
              day={new CalendarDay(new Date(2026, 7, 19), new Date(2026, 7, 1))}
              modifiers={{}}
              mode="photo"
              stickerImageUrl={null}
              ranges={[]}
              recordLabel={copy.timelineHeading}
              recipeCountTemplate={copy.daySummaryRecipeCount}
              dayCountBadgeTemplate={copy.dayCountBadge}
              emptyDayAddRecordTemplate={copy.emptyDayAddRecord}
              canAddRecord={false}
              onAddRecord={jest.fn()}
            />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText("19")).toHaveClass("absolute", "top-1");

    rerender(
      <table>
        <tbody>
          <tr>
            <CookingRecordCalendarDay
              day={new CalendarDay(new Date(2026, 6, 31), new Date(2026, 7, 1))}
              modifiers={{}}
              mode="photo"
              stickerImageUrl={null}
              ranges={[]}
              recordLabel={copy.timelineHeading}
              recipeCountTemplate={copy.daySummaryRecipeCount}
              dayCountBadgeTemplate={copy.dayCountBadge}
              emptyDayAddRecordTemplate={copy.emptyDayAddRecord}
              canAddRecord={false}
              onAddRecord={jest.fn()}
            />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText("31")).toHaveClass("absolute", "top-1");
  });

  it.each([0, 1])("T-24 기록이 %d개면 개수 배지를 숨깁니다", (totalCount) => {
    renderDay({ totalCount, firstImageUrl: "/sticker.webp" });

    expect(
      screen.queryByTestId("calendar-day-count-badge")
    ).not.toBeInTheDocument();
    expect(screen.queryByText(String(totalCount))).not.toBeInTheDocument();
  });

  it.each([
    [2, "2개"],
    [12, "12개"],
  ])(
    "T-25 기록이 %d개면 짙은 사각 배지에 %s를 표시합니다",
    (totalCount, expectedLabel) => {
      renderDay({ totalCount, firstImageUrl: "/sticker.webp" });

      const button = screen.getByRole("button");
      const badge = screen.getByTestId("calendar-day-count-badge");

      expect(badge).toHaveTextContent(expectedLabel);
      expect(badge).toHaveClass(
        "bg-ink/80",
        "rounded-md",
        "right-0.5",
        "bottom-1",
        "z-20"
      );
      expect(badge.parentElement).toBe(button);
      expect(button.querySelector("img")).toBeInTheDocument();
    }
  );

  it.each(localeExpectations)(
    "T-26 %s에서는 개수와 버튼 이름을 현지화합니다",
    (locale, badgeLabel, accessibleName) => {
      renderDay({ locale, totalCount: 3, firstImageUrl: "/sticker.webp" });

      expect(screen.getByTestId("calendar-day-count-badge")).toHaveTextContent(
        badgeLabel
      );
      expect(
        screen.getByRole("button", { name: accessibleName })
      ).toBeInTheDocument();
    }
  );

  it("T-26 영어 1개 기록은 단수형 접근 이름을 사용합니다", () => {
    renderDay({ locale: "en", totalCount: 1, firstImageUrl: "/single.webp" });

    expect(
      screen.getByRole("button", {
        name: "2026-08-17 Cooking log 1 recipe",
      })
    ).toBeInTheDocument();
  });
});
