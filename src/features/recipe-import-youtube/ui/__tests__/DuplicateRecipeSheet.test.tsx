import { type ReactNode } from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import { commonMessages, youtubeMessages } from "@/shared/i18n";

import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import { DuplicateRecipeSheet } from "../DuplicateRecipeSheet";

const mockPathname = jest.fn();
let mockIsMobile = true;

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const OpenChangeContext = React.createContext<(open: boolean) => void>(
    () => undefined
  );

  return {
    useResponsiveSheet: () => ({
      isMobile: mockIsMobile,
      Container: ({
        children,
        open,
        onOpenChange,
      }: {
        children: ReactNode;
        open: boolean;
        onOpenChange: (isOpen: boolean) => void;
      }) =>
        open ? (
          <OpenChangeContext.Provider value={onOpenChange}>
            <div>{children}</div>
          </OpenChangeContext.Provider>
        ) : null,
      Content: ({
        children,
        className,
        closeLabel,
      }: {
        children: ReactNode;
        className?: string;
        closeLabel?: string;
      }) => {
        const onOpenChange = React.useContext(OpenChangeContext);

        return (
          <section
            role="dialog"
            data-testid={mockIsMobile ? "drawer-surface" : "dialog-surface"}
            className={className}
          >
            {children}
            <button
              type="button"
              data-slot={mockIsMobile ? "drawer-close" : "dialog-close"}
              aria-label={closeLabel ?? "Close"}
              onClick={() => onOpenChange(false)}
              className="text-ink-sub focus-visible:outline-olive-dark h-11 w-11 cursor-pointer focus-visible:outline-2"
            />
          </section>
        );
      },
      Header: ({ children, className }: TestPrimitiveProps) => (
        <header className={className}>{children}</header>
      ),
      Title: ({ children, className }: TestPrimitiveProps) => (
        <h2 className={className}>{children}</h2>
      ),
      Description: ({ children, className }: TestPrimitiveProps) => (
        <p className={className}>{children}</p>
      ),
      Footer: ({ children, className }: TestPrimitiveProps) => (
        <footer className={className}>{children}</footer>
      ),
      Close: undefined,
    }),
  };
});

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({
    src,
    alt,
    aspectRatio,
  }: {
    src: string;
    alt: string;
    aspectRatio: string;
  }) => <img src={src} alt={alt} data-aspect-ratio={aspectRatio} />,
}));

type TestPrimitiveProps = {
  children: ReactNode;
  className?: string;
};

const recipeItem: DetailedRecipeGridItem = {
  id: "recipe-1",
  title: "토마토 파스타",
  imageUrl: "https://example.com/pasta.jpg",
  authorName: "레시피오",
  authorId: "author-1",
  profileImage: "https://example.com/profile.jpg",
  cookingTime: 35,
  createdAt: "2026-08-15T00:00:00.000Z",
  favoriteByCurrentUser: false,
  avgRating: 4.8,
  ratingCount: 24,
  source: "YOUTUBE",
  youtubeChannelName: "주방 채널",
};

const defaultProps = {
  recipeId: "recipe-1",
  recipeItem,
  isLoading: false,
  isFavorited: false,
  wasAutoSaved: false,
  onSaveClick: jest.fn(),
};

describe("DuplicateRecipeSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsMobile = true;
    mockPathname.mockReturnValue("/recipes/new/youtube");
  });

  it("T-01: 모바일에서는 열린 Drawer 표면에 높이와 상단 모서리 규칙을 적용한다", () => {
    render(<DuplicateRecipeSheet {...defaultProps} />);

    expect(screen.getByTestId("drawer-surface")).toHaveClass(
      "max-h-[90dvh]",
      "rounded-t-3xl",
      "data-[vaul-drawer-direction=bottom]:max-h-[90dvh]",
      "data-[vaul-drawer-direction=bottom]:rounded-t-3xl"
    );
  });

  it("T-02: 데스크톱에서는 열린 Dialog 표면에 너비와 모서리 규칙을 적용한다", () => {
    mockIsMobile = false;
    render(<DuplicateRecipeSheet {...defaultProps} />);

    expect(screen.getByTestId("dialog-surface")).toHaveClass(
      "max-h-[calc(100dvh-2rem)]",
      "max-w-md",
      "sm:max-w-md",
      "rounded-2xl"
    );
  });

  it("T-13: 홈에 포함될 때 별도 Dialog 없이 중복 내용을 표시한다", () => {
    mockIsMobile = false;
    render(<DuplicateRecipeSheet {...defaultProps} isEmbedded />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText(youtubeMessages.ko.duplicateTitle)).toBeVisible();
    expect(screen.getByRole("img", { name: "토마토 파스타" })).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: youtubeMessages.ko.duplicateViewButton,
      })
    ).toBeVisible();
  });

  it.each([
    [true, "drawer-surface", "aspect-[16/10]"],
    [false, "dialog-surface", "aspect-[16/9]"],
  ] as const)(
    "T-03: isMobile=%s 로딩 시 시트 안에 정확한 비율의 스켈레톤을 표시한다",
    (isMobile, surfaceTestId, aspectClass) => {
      mockIsMobile = isMobile;
      render(
        <DuplicateRecipeSheet {...defaultProps} isLoading recipeItem={null} />
      );

      const skeleton = screen.getByTestId("duplicate-recipe-skeleton");
      expect(screen.getByTestId(surfaceTestId)).toContainElement(skeleton);
      expect(skeleton.firstElementChild).toHaveClass("px-5");
      expect(skeleton.firstElementChild?.firstElementChild).toHaveClass(
        aspectClass,
        "rounded-card"
      );
    }
  );

  it("T-04: 완료된 레시피의 이미지와 채널, 제목, 현 locale 조리 시간, 크레딧 안내를 표시한다", () => {
    render(<DuplicateRecipeSheet {...defaultProps} />);

    expect(screen.getByRole("img", { name: "토마토 파스타" })).toHaveAttribute(
      "src",
      "https://example.com/pasta.jpg"
    );
    expect(screen.getByText("주방 채널")).toBeInTheDocument();
    expect(screen.getByText("토마토 파스타")).toBeInTheDocument();
    expect(screen.getByText("35분")).toBeInTheDocument();
    expect(screen.getByText(youtubeMessages.ko.duplicateNoCredit)).toHaveClass(
      "text-olive-dark"
    );
  });

  it.each([true, false])(
    "T-04: 자동 저장 성공 상태가 %s일 때만 저장 완료 문구를 표시한다",
    (wasAutoSaved) => {
      render(
        <DuplicateRecipeSheet {...defaultProps} wasAutoSaved={wasAutoSaved} />
      );

      const addedMessage = screen.queryByText(
        youtubeMessages.ko.duplicateAdded
      );

      if (wasAutoSaved) {
        expect(addedMessage).toBeInTheDocument();
        expect(addedMessage).toHaveClass("block", "text-ink-sub");
        return;
      }

      expect(addedMessage).not.toBeInTheDocument();
    }
  );

  it("T-05: 닫은 뒤 같은 key와 recipeId로 rerender해도 닫힘을 유지한다", () => {
    const { rerender } = render(
      <DuplicateRecipeSheet key="recipe-1" {...defaultProps} />
    );
    fireEvent.click(
      screen.getByRole("button", { name: commonMessages.ko.actions.close })
    );

    rerender(<DuplicateRecipeSheet key="recipe-1" {...defaultProps} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("T-10: controlled 상태에서는 닫기 요청을 상위 모달 상태에 전달한다", () => {
    const onOpenChange = jest.fn();
    const { rerender } = render(
      <DuplicateRecipeSheet
        {...defaultProps}
        open
        onOpenChange={onOpenChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: commonMessages.ko.actions.close })
    );

    expect(onOpenChange).toHaveBeenCalledWith(false);

    rerender(
      <DuplicateRecipeSheet
        {...defaultProps}
        open={false}
        onOpenChange={onOpenChange}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("T-06: key와 recipeId가 바뀌면 새 시트를 연다", () => {
    const { rerender } = render(
      <DuplicateRecipeSheet key="recipe-1" {...defaultProps} />
    );
    fireEvent.click(
      screen.getByRole("button", { name: commonMessages.ko.actions.close })
    );

    rerender(
      <DuplicateRecipeSheet
        key="recipe-2"
        {...defaultProps}
        recipeId="recipe-2"
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it.each([
    [true, "drawer-surface", "w-full"],
    [false, "dialog-surface", "max-w-md"],
  ] as const)(
    "T-07: isMobile=%s 표면의 너비와 overflow-hidden 조건을 유지한다",
    (isMobile, testId, widthClass) => {
      mockIsMobile = isMobile;
      render(<DuplicateRecipeSheet {...defaultProps} />);

      expect(screen.getByTestId(testId)).toHaveClass(
        widthClass,
        "overflow-hidden",
        "flex-col"
      );
      expect(screen.getByRole("contentinfo")).toHaveClass("grid", "sm:grid");
    }
  );

  it.each([
    ["/recipes/new/youtube", "/recipes/recipe-1"],
    ["/ja/recipes/new/youtube", "/ja/recipes/recipe-1"],
    ["/en/recipes/new/youtube", "/en/recipes/recipe-1"],
  ])("T-08: %s에서 상세 링크를 %s로 지역화한다", (pathname, href) => {
    mockPathname.mockReturnValue(pathname);
    render(<DuplicateRecipeSheet {...defaultProps} />);

    expect(
      screen.getByRole("link", {
        name: youtubeMessages[
          pathname.startsWith("/ja")
            ? "ja"
            : pathname.startsWith("/en")
              ? "en"
              : "ko"
        ].duplicateViewButton,
      })
    ).toHaveAttribute("href", href);
  });

  it.each([
    ["/recipes/new/youtube", "ko"],
    ["/ja/recipes/new/youtube", "ja"],
    ["/en/recipes/new/youtube", "en"],
  ] as const)(
    "T-10: %s에서 이미 저장된 레시피는 저장 버튼 대신 locale 안내를 표시한다",
    (pathname, locale) => {
      mockPathname.mockReturnValue(pathname);
      render(<DuplicateRecipeSheet {...defaultProps} isFavorited />);

      expect(
        screen.queryByRole("button", {
          name: youtubeMessages[locale].duplicateSaveButton,
        })
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(youtubeMessages[locale].duplicateAlreadySaved)
      ).toBeInTheDocument();
    }
  );

  it("T-12: 닫기, 저장, 상세 보기 액션은 접근 가능한 이름과 터치 높이, focus outline을 제공한다", () => {
    const onSaveClick = jest.fn();
    render(
      <DuplicateRecipeSheet {...defaultProps} onSaveClick={onSaveClick} />
    );

    const closeButton = screen.getByRole("button", {
      name: commonMessages.ko.actions.close,
    });
    const saveButton = screen.getByRole("button", {
      name: youtubeMessages.ko.duplicateSaveButton,
    });
    const detailLink = screen.getByRole("link", {
      name: youtubeMessages.ko.duplicateViewButton,
    });

    expect(closeButton).toHaveClass(
      "h-11",
      "cursor-pointer",
      "focus-visible:outline-2"
    );
    expect(saveButton).toHaveClass(
      "h-12",
      "cursor-pointer",
      "focus-visible:outline-2"
    );
    expect(saveButton).toHaveTextContent(commonMessages.ko.actions.save);
    expect(detailLink).toHaveClass(
      "h-12",
      "cursor-pointer",
      "focus-visible:outline-2"
    );

    fireEvent.click(saveButton);
    expect(onSaveClick).toHaveBeenCalledTimes(1);
  });
});
