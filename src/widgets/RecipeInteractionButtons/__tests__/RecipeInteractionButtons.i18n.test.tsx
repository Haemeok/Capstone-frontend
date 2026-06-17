import { render, screen } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

let mockPathname = "/";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));
jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: { id: "owner-1" } }),
}));
jest.mock("@/features/recipe-status", () => ({
  useRecipeStatus: () => ({ status: { clonedByMe: false } }),
}));
jest.mock("@/widgets/LoginEncourageDrawer/model/store", () => ({
  useLoginEncourageDrawerStore: () => ({ openDrawer: jest.fn() }),
}));
jest.mock("@/features/recipe-save", () => ({
  RecipeSaveButton: ({ label }: { label: string }) => <p>{label}</p>,
}));
jest.mock("@/features/recipe-visibility", () => ({
  LockButton: () => <button aria-label="lock" />,
}));
jest.mock("@/widgets/ShareButton", () => ({
  __esModule: true,
  default: ({ label }: { label: string }) => <p>{label}</p>,
}));

import RecipeInteractionButtons from "../index";

const baseProps = {
  recipeId: "r1",
  initialIsFavorite: false,
  visibility: "PUBLIC" as const,
  title: "김치찌개",
  authorId: "owner-1",
  isCloneable: true,
};

const jaActions = getDictionary("ja").common.actions;
const koActions = getDictionary("ko").common.actions;

describe("RecipeInteractionButtons i18n", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("ja에서 저장·수정·공유 라벨과 수정 aria가 일본어다 (T-15)", () => {
    mockPathname = "/ja/recipes/r1";
    render(<RecipeInteractionButtons {...baseProps} />);
    const text = document.body.textContent ?? "";
    expect(text).toContain(jaActions.save);
    expect(text).toContain(jaActions.edit);
    expect(text).toContain(jaActions.shareLabel);
    expect(text).not.toContain(koActions.save);
    expect(
      screen.getByRole("link", { name: jaActions.editRecipeAria })
    ).toBeInTheDocument();
  });

  it("ko 루트에서 기존 한국어 라벨/aria가 불변이다 (T-18)", () => {
    mockPathname = "/recipes/r1";
    render(<RecipeInteractionButtons {...baseProps} />);
    const text = document.body.textContent ?? "";
    expect(text).toContain("저장");
    expect(text).toContain("수정");
    expect(text).toContain("공유");
    expect(
      screen.getByRole("link", { name: "레시피 수정" })
    ).toBeInTheDocument();
  });
});
