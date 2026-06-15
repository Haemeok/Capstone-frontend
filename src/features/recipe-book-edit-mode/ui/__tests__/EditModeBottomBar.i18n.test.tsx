import { render, screen } from "@testing-library/react";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { useEditModeStore } from "../../model/useEditModeStore";
import { EditModeBottomBar } from "../EditModeBottomBar";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

jest.mock("@/entities/recipe-book", () => ({
  useBookRecipeIds: () => ["r1", "r2", "r3"],
}));

jest.mock("../MoveRecipesSheet", () => ({
  MoveRecipesSheet: () => null,
}));

jest.mock("../BulkDeleteConfirmModal", () => ({
  BulkDeleteConfirmModal: () => null,
}));

const HANGUL = /[가-힣]/;

afterEach(() => {
  useEditModeStore.getState().exit();
});

describe("EditModeBottomBar i18n", () => {
  it("T-09: ja 편집 바에 move/remove 라벨이 현지어이고 한글 0", () => {
    mockPathname.mockReturnValue("/ja/users/u1/recipe-books/b1");
    useEditModeStore.getState().enter();
    const { container } = render(<EditModeBottomBar bookId="b1" />);
    const t = userPagesMessages.ja.recipeBooks.editMode;
    expect(screen.getByText(t.move)).toBeInTheDocument();
    expect(screen.getByText(t.remove)).toBeInTheDocument();
    expect(container.textContent ?? "").not.toMatch(HANGUL);
  });

  it("T-14: ko 편집 바에 '이동'/'삭제' 라벨이 한글로 표시", () => {
    mockPathname.mockReturnValue("/users/u1/recipe-books/b1");
    useEditModeStore.getState().enter();
    const t = userPagesMessages.ko.recipeBooks.editMode;
    render(<EditModeBottomBar bookId="b1" />);
    expect(screen.getByText(t.move)).toBeInTheDocument();
    expect(screen.getByText(t.remove)).toBeInTheDocument();
  });
});
