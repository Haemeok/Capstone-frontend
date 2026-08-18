import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

import CalendarTabContent from "../index";

const ja = getDictionary("ja").userPages.calendar;
const ko = getDictionary("ko").userPages.calendar;

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/shared/ui/DayPickerDynamic", () => ({
  DayPickerDynamic: () => <div data-testid="calendar" />,
}));
jest.mock("@/features/cooking-record-create", () => ({
  ManualCookingRecordDrawer: () => null,
}));
jest.mock("@/widgets/CalendarTabContent/hooks", () => ({
  useUserStreakQuery: () => ({ data: { streak: 0 } }),
  useProfileCookingRecords: () => ({
    records: [
      {
        recordId: "record-1",
        displayTitle: "된장찌개",
        stickerImageUrl: "/sticker.webp",
        imageUrl: "/original.webp",
      },
    ],
    dailySummaries: [],
    isPreviewPending: false,
    isPreviewError: false,
    retryPreview: jest.fn(),
  }),
}));

test("T-11 ja: 절약 영역 없이 요리 기록 우선 구조를 일본어로 보여줍니다", () => {
  (usePathname as jest.Mock).mockReturnValue("/ja/users/u1");
  render(<CalendarTabContent />);

  expect(screen.getByText(ja.dateSectionTitle)).toBeInTheDocument();
  expect(screen.getByText(ja.cookingRecord.viewAll)).toBeInTheDocument();
  expect(screen.queryByText(/節約|레시피오 서비스로/)).not.toBeInTheDocument();
});

test("T-12 ko: 날짜별 기록과 전체보기 문구를 한국어로 보여줍니다", () => {
  (usePathname as jest.Mock).mockReturnValue("/users/u1");
  render(<CalendarTabContent />);

  expect(screen.getByText(ko.dateSectionTitle)).toBeInTheDocument();
  expect(screen.getByText(ko.cookingRecord.viewAll)).toBeInTheDocument();
});
