import { render, screen } from "@testing-library/react";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";

import RecipeCompleteButton from "../RecipeCompleteButton";

jest.mock("../../model/hooks", () => ({
  useRecipeComplete: () => ({
    completeRecipe: jest.fn(),
    isCompleted: false,
    isLoading: false,
    showReward: false,
    setShowReward: jest.fn(),
  }),
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
  LevelUpModal: () => null,
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

describe("RecipeCompleteButton i18n", () => {
  it("T-06: ja -> 버튼 미렌더", () => {
    renderWith("ja");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("T-06: en -> 버튼 미렌더", () => {
    renderWith("en");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("T-08(anchor): ko -> 버튼 + 절약액 렌더", () => {
    renderWith("ko");
    expect(screen.getByRole("button")).toHaveTextContent("요리 완료");
    expect(screen.getByRole("button")).toHaveTextContent("3,000");
  });
});
