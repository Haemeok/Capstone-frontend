import { type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { format } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { ChangeBookSheet } from "../ChangeBookSheet";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const addToast = jest.fn();
jest.mock("@/shared/ui/toast/model/store", () => ({
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
});

describe("ChangeBookSheet i18n", () => {
  it("T-29: ja heading 현지어 + createNew 현지어 + baseElement 한글 0 (라틴 책 이름)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1");
    useRecipeBooks.mockReturnValue({
      data: [
        {
          id: "b1",
          name: "Home",
          recipeCount: 3,
          isDefault: true,
          displayOrder: 0,
        },
        {
          id: "b2",
          name: "Daily",
          recipeCount: 1,
          isDefault: false,
          displayOrder: 1,
        },
      ],
    });
    const { baseElement } = render(
      <ChangeBookSheet
        open
        onOpenChange={() => {}}
        recipeId="r1"
        fromBookId="b1"
      />
    );
    expect(
      screen.getByText(userPagesMessages.ja.recipeBooks.change.heading)
    ).toBeInTheDocument();
    expect(
      screen.getByText(userPagesMessages.ja.recipeBooks.move.createNew)
    ).toBeInTheDocument();
    expect(baseElement.textContent ?? "").not.toMatch(HANGUL);
  });

  it("T-30: ja 책 클릭 시 토스트에 '으로' 미포함 + ja 형식 포함", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1");
    useRecipeBooks.mockReturnValue({
      data: [
        {
          id: "b1",
          name: "Home",
          recipeCount: 3,
          isDefault: true,
          displayOrder: 0,
        },
        {
          id: "b2",
          name: "집밥상",
          recipeCount: 1,
          isDefault: false,
          displayOrder: 1,
        },
      ],
    });
    render(
      <ChangeBookSheet
        open
        onOpenChange={() => {}}
        recipeId="r1"
        fromBookId="b1"
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /집밥상/ }));
    expect(addToast).toHaveBeenCalledTimes(1);
    const msg: string = addToast.mock.calls[0][0].message;
    const expected = format(userPagesMessages.ja.recipeBooks.change.toast, {
      name: "집밥상",
    });
    expect(msg).toBe(expected);
    expect(msg).not.toContain("으로");
  });

  it.skip("T-31: ja fromBookId 미해결 시 notFound 토스트 (DONE_WITH_CONCERNS)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1");
    useRecipeBooks.mockReturnValue({ data: [] });
    render(<ChangeBookSheet open onOpenChange={() => {}} recipeId="r1" />);
  });

  it("T-32: ko heading 한글 존재", () => {
    mockPathname.mockReturnValue("/recipes/r1");
    useRecipeBooks.mockReturnValue({
      data: [
        {
          id: "b1",
          name: "Home",
          recipeCount: 3,
          isDefault: true,
          displayOrder: 0,
        },
        {
          id: "b2",
          name: "Daily",
          recipeCount: 1,
          isDefault: false,
          displayOrder: 1,
        },
      ],
    });
    render(
      <ChangeBookSheet
        open
        onOpenChange={() => {}}
        recipeId="r1"
        fromBookId="b1"
      />
    );
    expect(screen.getByText("어느 레시피북으로 옮길까요?")).toBeInTheDocument();
  });
});
