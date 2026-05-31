import { render } from "@testing-library/react";

type MockUser = { id: string } | undefined;
type MockRecipeStatus = { favoriteByCurrentUser: boolean } | undefined;

let mockUser: MockUser;
let mockRecipeData: { id: string } | undefined;
let mockRecipeStatus: MockRecipeStatus;
let mockIsLoading = false;

const mockToggleFavorite = jest.fn();

jest.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

jest.mock("@/entities/recipe-book", () => ({
  useRecipeBooks: () => ({ data: [{ id: "b1", isDefault: true }] }),
}));

jest.mock("@/entities/recipe/model/hooks", () => ({
  useRecipeDetailQuery: () => ({
    recipeData: mockRecipeData,
    isLoading: mockIsLoading,
  }),
  useRecipeStatusQuery: () => ({ data: mockRecipeStatus }),
}));

jest.mock("@/entities/user/model/hooks", () => ({
  useMyInfoQuery: () => ({ user: mockUser }),
}));

jest.mock("@/features/recipe-save/model/hooks", () => ({
  useToggleRecipeSave: () => ({ mutate: mockToggleFavorite }),
}));

jest.mock("@/features/recipe-save/model/useSaveToastWithChange", () => ({
  useSaveToastWithChange: () => ({
    notifySaved: jest.fn(),
    changeSheet: null,
  }),
}));

jest.mock("../../model/duplicateRecipeMapper", () => ({
  toDetailedRecipeItem: (data: { id: string }) => ({ id: data.id }),
}));

jest.mock("../DuplicateRecipeCard", () => ({
  DuplicateRecipeCard: () => <div data-testid="duplicate-card" />,
}));

jest.mock("../DuplicateRecipeSkeleton", () => ({
  DuplicateRecipeSkeleton: () => <div data-testid="duplicate-skeleton" />,
}));

import DuplicateRecipeSection from "../DuplicateRecipeSection";

beforeEach(() => {
  jest.clearAllMocks();
  mockUser = undefined;
  mockRecipeData = { id: "rec-1" };
  mockRecipeStatus = { favoriteByCurrentUser: false };
  mockIsLoading = false;
});

describe("DuplicateRecipeSection — direct paste 자동 저장 가드", () => {
  it("로그인 + direct + 미저장 → 자동 저장 1회", () => {
    mockUser = { id: "u1" };

    render(<DuplicateRecipeSection recipeId="rec-1" urlSource="direct" />);

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it("비로그인 + direct + 미저장 → 자동 저장 호출되지 않음", () => {
    mockUser = undefined;

    render(<DuplicateRecipeSection recipeId="rec-1" urlSource="direct" />);

    expect(mockToggleFavorite).not.toHaveBeenCalled();
  });

  it("로그인 + trending 진입 → 자동 저장 호출되지 않음", () => {
    mockUser = { id: "u1" };

    render(<DuplicateRecipeSection recipeId="rec-1" urlSource="trending" />);

    expect(mockToggleFavorite).not.toHaveBeenCalled();
  });

  it("로그인 + direct + 이미 저장됨 → 자동 저장 호출되지 않음", () => {
    mockUser = { id: "u1" };
    mockRecipeStatus = { favoriteByCurrentUser: true };

    render(<DuplicateRecipeSection recipeId="rec-1" urlSource="direct" />);

    expect(mockToggleFavorite).not.toHaveBeenCalled();
  });
});
