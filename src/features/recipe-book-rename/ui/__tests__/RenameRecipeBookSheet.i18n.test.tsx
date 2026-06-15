import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ApiError } from "@/shared/api/client";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => ({
  useResponsiveSheet: () => ({
    isMobile: false,
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
    Description: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
    Footer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Close: undefined,
  }),
}));

const updateMock = jest.fn();
jest.mock("@/entities/recipe-book", () => ({
  ...jest.requireActual("@/entities/recipe-book"),
  useRecipeBooks: () => ({ data: [] }),
  useUpdateRecipeBookName: () => ({
    mutateAsync: updateMock,
    isPending: false,
  }),
}));

const addToast = jest.fn();
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: (sel: (s: { addToast: jest.Mock }) => unknown) =>
    sel({ addToast }),
}));

import { RenameRecipeBookSheet } from "../RenameRecipeBookSheet";

const makeQc = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderJa = () =>
  render(
    <QueryClientProvider client={makeQc()}>
      <RenameRecipeBookSheet
        open
        onOpenChange={() => {}}
        bookId="book-1"
        currentName="Home"
      />
    </QueryClientProvider>
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe("RenameRecipeBookSheet i18n — ja", () => {
  it("T-15: title과 placeholder가 일본어로 표시되고 한글 없음", () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { baseElement } = renderJa();
    expect(screen.getByText("レシピブック名を変更")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("レシピブック名")).toBeInTheDocument();
    expect(baseElement.textContent).not.toMatch(/[가-힣]/);
  });

  it("T-17: 공백 입력 후 submit 시 ja validation 메시지 표시", async () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    renderJa();
    const input = screen.getByPlaceholderText("レシピブック名");
    fireEvent.change(input, { target: { value: "  " } });
    fireEvent.click(screen.getByText("変更"));
    await waitFor(() =>
      expect(
        screen.getByText("レシピブック名を入力してください")
      ).toBeInTheDocument()
    );
  });

  it("1107 → 인라인 필드 에러(ja), 토스트 아님 (T-25)", async () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    updateMock.mockRejectedValueOnce(
      new ApiError(400, "Bad Request", { code: 1107 })
    );
    renderJa();
    const input = screen.getByPlaceholderText(
      userPagesMessages.ja.recipeBooks.rename.placeholder
    );
    fireEvent.change(input, { target: { value: "New" } });
    fireEvent.click(
      screen.getByText(userPagesMessages.ja.recipeBooks.rename.submit)
    );
    await waitFor(() =>
      expect(
        screen.getByText(userPagesMessages.ja.recipeBooks.errors[1107])
      ).toBeInTheDocument()
    );
    expect(addToast).not.toHaveBeenCalled();
  });

  it("1102 → 토스트(ja), 필드 에러 아님 (T-26)", async () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    updateMock.mockRejectedValueOnce(
      new ApiError(400, "Bad Request", { code: 1102 })
    );
    renderJa();
    const input = screen.getByPlaceholderText(
      userPagesMessages.ja.recipeBooks.rename.placeholder
    );
    fireEvent.change(input, { target: { value: "New" } });
    fireEvent.click(
      screen.getByText(userPagesMessages.ja.recipeBooks.rename.submit)
    );
    await waitFor(() =>
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: userPagesMessages.ja.recipeBooks.errors[1102],
        })
      )
    );
  });
});

describe("RenameRecipeBookSheet i18n — ko (T-21)", () => {
  it("T-21: ko locale로 렌더하면 title이 한국어로 표시됨", () => {
    mockPathname.mockReturnValue("/recipe-books/b1");
    render(
      <QueryClientProvider client={makeQc()}>
        <RenameRecipeBookSheet
          open
          onOpenChange={() => {}}
          bookId="book-1"
          currentName="Home"
        />
      </QueryClientProvider>
    );
    expect(screen.getByText("레시피북 이름 변경")).toBeInTheDocument();
  });
});
