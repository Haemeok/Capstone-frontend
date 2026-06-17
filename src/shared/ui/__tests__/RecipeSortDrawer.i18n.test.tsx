import { render, screen } from "@testing-library/react";

import { commonMessages } from "@/shared/i18n/commonMessages";

let mockPathname = "/";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import RecipeSortButton from "../RecipeSortButton";
import RecipeSortDrawer from "../RecipeSortDrawer";

const SORTS = ["최신순", "인기순"] as const;
const jaSort = commonMessages.ja.sort;

describe("RecipeSortDrawer i18n", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("ja 드로어 헤더·버튼·옵션이 일본어다 (T-12)", () => {
    mockPathname = "/ja";
    render(
      <RecipeSortDrawer
        open
        onOpenChange={() => {}}
        currentSort="최신순"
        availableSorts={SORTS}
        onSortChange={() => {}}
      />
    );
    const text = document.body.textContent ?? "";
    expect(text).toContain(jaSort.reset);
    expect(text).toContain(jaSort.apply);
    expect(text).not.toContain("최신순");
  });

  it("en 정렬 버튼 표시값이 영어이고 canonical 코드값으로 dirty 판정한다 (T-12/T-13)", () => {
    mockPathname = "/en";
    render(<RecipeSortButton currentSort="최신순" />);
    const button = screen.getByRole("button");
    expect(button.textContent).not.toContain("최신순");
    expect(button).toHaveClass("bg-white");
  });

  it("ko 루트 드로어가 기존 한국어로 불변이다 (T-14)", () => {
    mockPathname = "/";
    render(
      <RecipeSortDrawer
        open
        onOpenChange={() => {}}
        currentSort="최신순"
        availableSorts={SORTS}
        onSortChange={() => {}}
      />
    );
    const text = document.body.textContent ?? "";
    expect(text).toContain("초기화");
    expect(text).toContain("완료");
    expect(text).toContain("최신순");
  });
});
