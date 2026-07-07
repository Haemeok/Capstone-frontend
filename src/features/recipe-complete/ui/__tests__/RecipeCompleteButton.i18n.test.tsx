import { fireEvent, render, screen } from "@testing-library/react";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";

import RecipeCompleteButton from "../RecipeCompleteButton";

const ko = getDictionary("ko").recipeDetail;
const ja = getDictionary("ja").recipeDetail;
const en = getDictionary("en").recipeDetail;

const mockState = {
  completeRecipe: jest.fn(),
  isCompleted: false,
  isLoading: false,
  showReward: false,
  setShowReward: jest.fn(),
};

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => jest.requireMock("@/features/level-up").LevelUpModal,
}));
jest.mock("../../model/hooks", () => ({
  useRecipeComplete: () => mockState,
}));
jest.mock("@/features/recipe-status", () => ({
  useRecipeStatus: () => ({ recipeId: "x" }),
}));
jest.mock("@/features/notification-permission", () => ({
  useNotificationPermissionTrigger: () => ({
    checkAndTrigger: () => true,
  }),
}));
jest.mock("@/features/level-up", () => ({
  LevelUpModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="level-up-modal" /> : null,
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));
jest.mock("@/shared/lib/review", () => ({
  shouldShowReviewGate: () => false,
}));
jest.mock("@/features/review-gate", () => ({
  scheduleReviewGate: jest.fn(),
}));

const renderWith = (locale: "ja" | "en" | "ko") =>
  render(
    <DictionaryProvider dict={getDictionary(locale)}>
      <RecipeCompleteButton saveAmount={3000} locale={locale} />
    </DictionaryProvider>
  );

beforeEach(() => {
  mockState.completeRecipe = jest.fn();
  mockState.setShowReward = jest.fn();
  mockState.isCompleted = false;
  mockState.isLoading = false;
  mockState.showReward = false;
});

describe("RecipeCompleteButton i18n", () => {
  it("T-01: ja -> plain CTA(사전값), 절약액 없음", () => {
    renderWith("ja");
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent(ja.completeCtaPlain);
    expect(btn).not.toHaveTextContent("3,000");
    expect(btn).not.toHaveTextContent(ko.completeCtaPlain);
  });

  it("T-02: en -> plain CTA(사전값), 절약액 없음", () => {
    renderWith("en");
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent(en.completeCtaPlain);
    expect(btn).not.toHaveTextContent("3,000");
    expect(btn).not.toHaveTextContent(ko.completeCtaPlain);
  });

  it("T-07: ko -> completeCta 노출, 절약액 없음", () => {
    renderWith("ko");
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent(ko.completeCta);
    expect(btn).not.toHaveTextContent("3,000");
  });

  it("T-03: ja 클릭 -> completeRecipe 1회 호출", () => {
    renderWith("ja");
    fireEvent.click(screen.getByRole("button"));
    expect(mockState.completeRecipe).toHaveBeenCalledTimes(1);
  });

  it("T-09: ja 이미 완료 -> completeAlready 비활성", () => {
    mockState.isCompleted = true;
    renderWith("ja");
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent(ja.completeAlready);
    expect(btn).toBeDisabled();
  });

  it("T-10: ja 이미 완료 클릭 -> completeRecipe 미호출", () => {
    mockState.isCompleted = true;
    renderWith("ja");
    fireEvent.click(screen.getByRole("button"));
    expect(mockState.completeRecipe).not.toHaveBeenCalled();
  });
});

describe("RecipeCompleteButton reward branch", () => {
  it("T-04: ja showReward -> 축하 모달, LevelUp 아님", () => {
    mockState.showReward = true;
    renderWith("ja");
    expect(screen.getByText(ja.completeCelebrationTitle)).toBeInTheDocument();
    expect(screen.queryByTestId("level-up-modal")).toBeNull();
  });

  it("T-08: ko showReward -> LevelUp, 축하 모달 아님", () => {
    mockState.showReward = true;
    renderWith("ko");
    expect(screen.getByTestId("level-up-modal")).toBeInTheDocument();
    expect(screen.queryByText(ko.completeCelebrationTitle)).toBeNull();
  });
});
