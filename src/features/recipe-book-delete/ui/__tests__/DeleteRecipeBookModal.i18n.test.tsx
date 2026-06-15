import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { format } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const addToast = jest.fn();
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: (sel: (s: { addToast: typeof addToast }) => unknown) =>
    sel({ addToast }),
}));

jest.mock("@/entities/recipe-book", () => ({
  ...jest.requireActual("@/entities/recipe-book"),
  useDeleteRecipeBook: () => ({
    mutateAsync: jest.fn().mockResolvedValue(undefined),
    isPending: false,
  }),
}));

import { DeleteRecipeBookModal } from "../DeleteRecipeBookModal";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DeleteRecipeBookModal i18n — ja", () => {
  it("T-19: title이 일본어로 표시되고 한글 없음", () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { baseElement } = render(
      <DeleteRecipeBookModal
        open
        onOpenChange={() => {}}
        bookId="b1"
        bookName="Home"
      />
    );
    expect(
      screen.getByText(
        format(userPagesMessages.ja.recipeBooks.deleteBook.title, {
          name: "Home",
        })
      )
    ).toBeInTheDocument();
    expect(baseElement.textContent).not.toMatch(/[가-힣]/);
  });

  it("T-18: confirm 클릭 후 ja toast 메시지 호출", async () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    render(
      <DeleteRecipeBookModal
        open
        onOpenChange={() => {}}
        bookId="b1"
        bookName="Home"
      />
    );
    const confirmLabel = userPagesMessages.ja.recipeBooks.deleteBook.confirm;
    await userEvent.click(screen.getByText(confirmLabel));
    await waitFor(() =>
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: format(userPagesMessages.ja.recipeBooks.deleteBook.toast, {
            name: "Home",
          }),
        })
      )
    );
  });
});
