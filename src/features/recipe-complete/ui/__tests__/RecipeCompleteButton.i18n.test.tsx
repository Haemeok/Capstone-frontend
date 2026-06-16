import { fireEvent, render, screen } from "@testing-library/react";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";

import RecipeCompleteButton from "../RecipeCompleteButton";

const mockState = {
  completeRecipe: jest.fn(),
  isCompleted: false,
  isLoading: false,
  showReward: false,
  setShowReward: jest.fn(),
};

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
  it("T-01: ja -> plain CTA, 절약액 없음", () => {
    renderWith("ja");
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent("作りました");
    expect(btn).not.toHaveTextContent("3,000");
    expect(btn).not.toHaveTextContent("お得");
  });

  it("T-02: en -> plain CTA, 절약액 없음", () => {
    renderWith("en");
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent("I made this");
    expect(btn).not.toHaveTextContent("3,000");
    expect(btn).not.toHaveTextContent("saved");
  });

  it("T-07: ko -> 절약액 CTA (anchor)", () => {
    renderWith("ko");
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent("요리 완료");
    expect(btn).toHaveTextContent("3,000");
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
    expect(btn).toHaveTextContent("すでに作った記録があります");
    expect(btn).toBeDisabled();
  });

  it("T-10: ja 이미 완료 클릭 -> completeRecipe 미호출", () => {
    mockState.isCompleted = true;
    renderWith("ja");
    fireEvent.click(screen.getByRole("button"));
    expect(mockState.completeRecipe).not.toHaveBeenCalled();
  });
});
