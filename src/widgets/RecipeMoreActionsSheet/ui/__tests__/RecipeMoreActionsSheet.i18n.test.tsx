import { render } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

let mockPathname = "/";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));
jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => ({
  useResponsiveSheet: () => ({
    isMobile: false,
    Container: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Content: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  }),
}));
jest.mock("@/features/recipe-visibility", () => ({
  VisibilityRowAction: () => <div />,
}));
jest.mock("@/features/recipe-delete", () => ({
  DeleteRowAction: () => <div />,
}));
jest.mock("@/shared/ui/shadcn/dialog", () => ({
  DialogTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <h2 className={className}>{children}</h2>,
}));

import RecipeMoreActionsSheet from "../RecipeMoreActionsSheet";

const jaActions = getDictionary("ja").common.actions;
const koActions = getDictionary("ko").common.actions;

describe("RecipeMoreActionsSheet i18n", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("ja에서 옵션 제목·수정 라벨이 일본어다 (T-16)", () => {
    mockPathname = "/ja/recipes/r1";
    const { baseElement } = render(
      <RecipeMoreActionsSheet
        target={{ id: "r1", isPrivate: false }}
        onOpenChange={() => {}}
      />
    );
    const text = baseElement.textContent ?? "";
    expect(text).toContain(jaActions.recipeOptions);
    expect(text).toContain(jaActions.edit);
    expect(text).not.toContain(koActions.recipeOptions);
  });

  it("ko 루트에서 기존 한국어가 불변이다 (T-18)", () => {
    mockPathname = "/recipes/r1";
    const { baseElement } = render(
      <RecipeMoreActionsSheet
        target={{ id: "r1", isPrivate: false }}
        onOpenChange={() => {}}
      />
    );
    const text = baseElement.textContent ?? "";
    expect(text).toContain("레시피 옵션");
    expect(text).toContain("수정");
  });
});
