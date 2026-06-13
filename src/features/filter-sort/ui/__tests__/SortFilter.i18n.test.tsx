import { render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import { SortFilter } from "../SortFilter";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

jest.mock("../../model", () => ({
  useSortFilter: () => ["인기순", jest.fn()],
}));

jest.mock("@/widgets/CategoryPicker/CategoryPicker", () => ({
  __esModule: true,
  default: ({ trigger }: { trigger: React.ReactNode }) => <>{trigger}</>,
}));

describe("SortFilter i18n", () => {
  it("T-06: /ja 정렬 칩이 ja 사전값으로 표시된다", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    render(<SortFilter />);
    expect(
      screen.getByText(taxonomyMessages.ja.sort["popularityScore,DESC"])
    ).toBeInTheDocument();
    expect(screen.queryByText("인기순")).not.toBeInTheDocument();
  });

  it("T-09: ko 정렬 칩은 한글 그대로", () => {
    mockPathname.mockReturnValue("/search/results");
    render(<SortFilter />);
    expect(screen.getByText("인기순")).toBeInTheDocument();
  });
});
