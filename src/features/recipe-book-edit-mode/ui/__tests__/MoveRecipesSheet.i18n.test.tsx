import { type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { format } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { useEditModeStore } from "../../model/useEditModeStore";
import { MoveRecipesSheet } from "../MoveRecipesSheet";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const addToast = jest.fn();
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: (sel: (s: { addToast: jest.Mock }) => unknown) =>
    sel({ addToast }),
}));

jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => ({
  useResponsiveSheet: () => ({
    Container: ({
      children,
      open,
    }: {
      children: ReactNode;
      open: boolean;
      onOpenChange: (o: boolean) => void;
    }) => (open ? <div>{children}</div> : null),
    Content: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Header: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Title: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  }),
}));

jest.mock("@/features/recipe-book-create", () => ({
  CreateRecipeBookSheet: () => null,
}));

const mockMutateAsync = jest.fn().mockResolvedValue(undefined);
jest.mock("@/entities/recipe-book", () => ({
  useRecipeBooks: jest.fn(),
  useMoveRecipes: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
  MAX_RECIPE_BOOKS: 10,
  getRecipeBookError: () => ({ code: null, message: "" }),
}));

const { useRecipeBooks } = jest.requireMock("@/entities/recipe-book") as {
  useRecipeBooks: jest.Mock;
};

const HANGUL = /[가-힣]/;

beforeEach(() => {
  jest.clearAllMocks();
  useEditModeStore.setState({ selectedIds: new Set(["r1", "r2"]) });
});

afterEach(() => {
  useEditModeStore.getState().exit();
});

describe("MoveRecipesSheet i18n", () => {
  it("T-10: ja heading 현지어 + baseElement 한글 0 (라틴 책 이름)", () => {
    mockPathname.mockReturnValue("/ja/users/u1/recipe-books/b1");
    useRecipeBooks.mockReturnValue({
      data: [
        { id: "b1", name: "Home", recipeCount: 3 },
        { id: "b2", name: "Daily", recipeCount: 1 },
      ],
    });
    const { baseElement } = render(
      <MoveRecipesSheet open onOpenChange={() => {}} fromBookId="b1" />
    );
    const t = userPagesMessages.ja.recipeBooks.move;
    expect(screen.getByText(t.heading)).toBeInTheDocument();
    expect(baseElement.textContent ?? "").not.toMatch(HANGUL);
  });

  it("T-11: ja 책 이름 클릭 시 토스트에 '으로' 미포함 + ja 조사 포함", async () => {
    mockPathname.mockReturnValue("/ja/users/u1/recipe-books/b1");
    useRecipeBooks.mockReturnValue({
      data: [
        { id: "b1", name: "Home", recipeCount: 3 },
        { id: "b2", name: "집밥상", recipeCount: 1 },
      ],
    });
    render(<MoveRecipesSheet open onOpenChange={() => {}} fromBookId="b1" />);
    await userEvent.click(screen.getByRole("button", { name: /집밥상/ }));
    expect(addToast).toHaveBeenCalledTimes(1);
    const msg: string = addToast.mock.calls[0][0].message;
    const expected = format(userPagesMessages.ja.recipeBooks.move.toast, {
      count: 2,
      name: "집밥상",
    });
    expect(msg).toBe(expected);
    expect(msg).not.toContain("으로");
  });

  it("T-14: ko 책 이름 클릭 시 토스트 메시지가 한글 조사 포함", async () => {
    mockPathname.mockReturnValue("/users/u1/recipe-books/b1");
    useRecipeBooks.mockReturnValue({
      data: [
        { id: "b1", name: "Home", recipeCount: 3 },
        { id: "b2", name: "집밥상", recipeCount: 1 },
      ],
    });
    render(<MoveRecipesSheet open onOpenChange={() => {}} fromBookId="b1" />);
    await userEvent.click(screen.getByRole("button", { name: /집밥상/ }));
    expect(addToast).toHaveBeenCalledTimes(1);
    const msg: string = addToast.mock.calls[0][0].message;
    expect(msg).toBe("2개를 집밥상으로 이동했어요");
  });
});
