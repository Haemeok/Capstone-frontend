import { fireEvent, render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import { DishTypeFilter } from "../DishTypeFilter";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const setDishType = jest.fn();
jest.mock("../../model", () => ({
  useDishTypeFilter: () => ["볶음", setDishType],
}));

type PickerProps = {
  trigger: React.ReactNode;
  setValue: (value: string | string[]) => void;
};

jest.mock("@/widgets/CategoryPicker/CategoryPicker", () => ({
  __esModule: true,
  default: ({ trigger, setValue }: PickerProps) => (
    <>
      {trigger}
      <button type="button" onClick={() => setValue("국/찌개/탕")}>
        pick
      </button>
    </>
  ),
}));

beforeEach(() => {
  setDishType.mockClear();
});

describe("DishTypeFilter i18n", () => {
  it("T-07: /ja 칩은 ja 표시, 선택 시 ko canonical 값이 setter로 전달된다", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    render(<DishTypeFilter />);

    expect(
      screen.getByText(taxonomyMessages.ja.dishType.FRYING)
    ).toBeInTheDocument();
    expect(screen.queryByText("볶음")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("pick"));
    expect(setDishType).toHaveBeenCalledWith("국/찌개/탕");
  });

  it("T-09: ko 칩은 한글 그대로", () => {
    mockPathname.mockReturnValue("/search/results");
    render(<DishTypeFilter />);
    expect(screen.getByText("볶음")).toBeInTheDocument();
  });
});
