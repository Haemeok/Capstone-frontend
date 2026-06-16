import { render } from "@testing-library/react";

const replaceMock = jest.fn();

jest.mock("@/shared/i18n", () => ({
  ...jest.requireActual("@/shared/i18n"),
  useLocalizedRouter: () => ({ replace: replaceMock, push: jest.fn() }),
}));

let mockVisibility: "PUBLIC" | "PRIVATE" = "PUBLIC";
jest.mock("@/features/recipe-visibility", () => ({
  LockButton: function LockButton({
    onToggleSuccess,
  }: {
    onToggleSuccess: (next: "PUBLIC" | "PRIVATE") => void;
  }) {
    return (
      <button
        data-testid="lock"
        onClick={() =>
          onToggleSuccess(mockVisibility === "PUBLIC" ? "PRIVATE" : "PUBLIC")
        }
      >
        toggle
      </button>
    );
  },
}));

jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: { id: "u1" } }),
}));
jest.mock("@/features/recipe-status", () => ({
  useRecipeStatus: () => ({ status: null }),
}));
jest.mock("@/features/recipe-save", () => ({
  RecipeSaveButton: function RecipeSaveButton() {
    return <div />;
  },
}));
jest.mock(
  "@/widgets/ShareButton",
  () =>
    function ShareButton() {
      return <div />;
    }
);
jest.mock("@/widgets/LoginEncourageDrawer/model/store", () => ({
  useLoginEncourageDrawerStore: () => ({ openDrawer: jest.fn() }),
}));

import RecipeInteractionButtons from "../index";

const fireToggle = () => {
  const { getByTestId } = render(
    <RecipeInteractionButtons
      recipeId="r1"
      initialIsFavorite={false}
      visibility="PUBLIC"
      title="t"
      authorId="u1"
      isCloneable={false}
    />
  );
  getByTestId("lock").click();
};

describe("RecipeInteractionButtons 가시성 토글 nav (T-P08)", () => {
  afterEach(() => jest.clearAllMocks());

  it("비공개로 토글 시 localized replace로 /recipes/private/{id} 호출", () => {
    mockVisibility = "PUBLIC";
    fireToggle();
    expect(replaceMock).toHaveBeenCalledWith("/recipes/private/r1");
  });

  it("공개로 토글 시 /recipes/{id} 호출", () => {
    mockVisibility = "PRIVATE";
    fireToggle();
    expect(replaceMock).toHaveBeenCalledWith("/recipes/r1");
  });
});
