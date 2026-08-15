import { fireEvent, render, screen } from "@testing-library/react";

type MockUser = { id: string } | undefined;
type MockRecipeStatus = { favoriteByCurrentUser: boolean } | undefined;
type MockSheetProps = {
  recipeId: string;
  recipeItem: { id: string } | null;
  isLoading: boolean;
  isFavorited: boolean;
  onSaveClick: () => void;
  urlSource?: "direct" | "trending" | null;
};

let mockUser: MockUser;
let mockRecipeData: { id: string } | undefined;
let mockRecipeStatus: MockRecipeStatus;
let mockIsLoading = false;
let mockSheetProps: MockSheetProps | null;

const mockToggleFavorite = jest.fn();
const mockTriggerHaptic = jest.fn();
const mockNotifySaved = jest.fn();

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: (...args: unknown[]) => mockTriggerHaptic(...args),
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
    notifySaved: mockNotifySaved,
    changeSheet: null,
  }),
}));

jest.mock("../../model/duplicateRecipeMapper", () => ({
  toDetailedRecipeItem: (data: { id: string }) => ({ id: data.id }),
}));

jest.mock("../DuplicateRecipeSheet", () => {
  const React = jest.requireActual<typeof import("react")>("react");

  return {
    DuplicateRecipeSheet: (props: MockSheetProps) => {
      const [isOpen, setIsOpen] = React.useState(true);
      mockSheetProps = props;

      if (!isOpen) return null;

      return (
        <div data-testid="duplicate-recipe-sheet">
          <button type="button" onClick={() => setIsOpen(false)}>
            시트 닫기
          </button>
          <button type="button" onClick={props.onSaveClick}>
            저장하기
          </button>
        </div>
      );
    },
  };
});

import DuplicateRecipeSection from "../DuplicateRecipeSection";

beforeEach(() => {
  jest.clearAllMocks();
  mockToggleFavorite.mockReset();
  mockUser = undefined;
  mockRecipeData = { id: "rec-1" };
  mockRecipeStatus = { favoriteByCurrentUser: false };
  mockIsLoading = false;
  mockSheetProps = null;
});

it("T-01 wiring: direct 중복 결과를 반응형 시트에 전달한다", () => {
  render(<DuplicateRecipeSection recipeId="recipe-sheet" urlSource="direct" />);

  expect(screen.getByTestId("duplicate-recipe-sheet")).toBeInTheDocument();
  expect(mockSheetProps).toMatchObject({
    recipeId: "recipe-sheet",
    recipeItem: { id: "rec-1" },
    isLoading: false,
    isFavorited: false,
    urlSource: "direct",
  });
});

it("T-03 wiring: 레시피 상세 로딩 중에도 열린 시트에 로딩 상태를 전달한다", () => {
  mockRecipeData = undefined;
  mockIsLoading = true;

  render(<DuplicateRecipeSection recipeId="recipe-loading" />);

  expect(screen.getByTestId("duplicate-recipe-sheet")).toBeInTheDocument();
  expect(mockSheetProps).toMatchObject({
    recipeId: "recipe-loading",
    recipeItem: null,
    isLoading: true,
  });
});

it("T-03 wiring: 로딩도 중복 레시피도 없으면 시트를 마운트하지 않는다", () => {
  mockRecipeData = undefined;
  mockIsLoading = false;

  render(<DuplicateRecipeSection recipeId="recipe-empty" />);

  expect(
    screen.queryByTestId("duplicate-recipe-sheet")
  ).not.toBeInTheDocument();
});

it("T-06 wiring: 닫은 중복 결과가 다른 recipeId로 바뀌면 새 시트를 연다", () => {
  mockRecipeData = { id: "recipe-a" };
  const { rerender } = render(<DuplicateRecipeSection recipeId="recipe-a" />);
  fireEvent.click(screen.getByRole("button", { name: "시트 닫기" }));
  expect(
    screen.queryByTestId("duplicate-recipe-sheet")
  ).not.toBeInTheDocument();

  mockRecipeData = { id: "recipe-b" };
  rerender(<DuplicateRecipeSection recipeId="recipe-b" />);

  expect(screen.getByTestId("duplicate-recipe-sheet")).toBeInTheDocument();
  expect(mockSheetProps).toMatchObject({
    recipeId: "recipe-b",
    recipeItem: { id: "recipe-b" },
  });
});

it("T-09: 저장 요청 성공 시 mutation·Success 햅틱·토스트가 한 번 실행된다", () => {
  mockToggleFavorite.mockImplementation(
    (_value: undefined, options: { onSuccess: () => void }) => {
      options.onSuccess();
    }
  );

  render(
    <DuplicateRecipeSection recipeId="recipe-save" urlSource="trending" />
  );
  fireEvent.click(screen.getByRole("button", { name: "저장하기" }));

  expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
  expect(mockTriggerHaptic).toHaveBeenCalledTimes(1);
  expect(mockTriggerHaptic).toHaveBeenCalledWith("Success");
  expect(mockNotifySaved).toHaveBeenCalledTimes(1);
});

describe("T-11: direct 자동 저장 가드", () => {
  it("로그인 + direct + 미저장 → 자동 저장 1회", () => {
    mockUser = { id: "u1" };

    render(<DuplicateRecipeSection recipeId="rec-1" urlSource="direct" />);

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it("비로그인 + direct + 미저장 → 자동 저장 호출되지 않음", () => {
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
