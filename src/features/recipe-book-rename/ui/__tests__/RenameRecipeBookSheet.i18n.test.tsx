import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

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

jest.mock("@/entities/recipe-book", () => ({
  ...jest.requireActual("@/entities/recipe-book"),
  useRecipeBooks: () => ({ data: [] }),
  useUpdateRecipeBookName: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: () => ({ addToast: jest.fn() }),
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
