import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { format } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { useEditModeStore } from "../../model/useEditModeStore";
import { BulkDeleteConfirmModal } from "../BulkDeleteConfirmModal";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const addToast = jest.fn();
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: (sel: (s: { addToast: jest.Mock }) => unknown) =>
    sel({ addToast }),
}));

const mockMutateAsync = jest.fn().mockResolvedValue(undefined);
jest.mock("@/entities/recipe-book", () => ({
  useRemoveRecipesFromBook: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
  getRecipeBookErrorMessage: (e: unknown) => String(e),
}));

const HANGUL = /[가-힣]/;

beforeEach(() => {
  jest.clearAllMocks();
  useEditModeStore.setState({ selectedIds: new Set(["r1", "r2"]) });
});

afterEach(() => {
  useEditModeStore.getState().exit();
});

describe("BulkDeleteConfirmModal i18n", () => {
  it("T-12: ja title이 현지어로 표시되고 baseElement 한글 0", () => {
    mockPathname.mockReturnValue("/ja/users/u1/recipe-books/b1");
    const { baseElement } = render(
      <BulkDeleteConfirmModal open onOpenChange={() => {}} bookId="b1" />
    );
    const t = userPagesMessages.ja.recipeBooks.bulkDelete;
    const expectedTitle = format(t.title, { count: 2 });
    expect(baseElement.textContent).toContain(expectedTitle);
    expect(baseElement.textContent ?? "").not.toMatch(HANGUL);
  });

  it("T-13: ja confirm 클릭 시 토스트가 현지어 메시지로 호출됨", async () => {
    mockPathname.mockReturnValue("/ja/users/u1/recipe-books/b1");
    render(<BulkDeleteConfirmModal open onOpenChange={() => {}} bookId="b1" />);
    const t = userPagesMessages.ja.recipeBooks.bulkDelete;
    const confirmBtn = screen.getByRole("button", { name: t.confirm });
    await userEvent.click(confirmBtn);
    expect(addToast).toHaveBeenCalledTimes(1);
    const msg: string = addToast.mock.calls[0][0].message;
    expect(msg).toBe(format(t.toast, { count: 2 }));
  });
});
