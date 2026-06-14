import { render, screen } from "@testing-library/react";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";

import RecipeCompleteButton from "../RecipeCompleteButton";

const HANGUL = /[가-힣]/;

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

const renderWith = (locale: "ja" | "ko") =>
  render(
    <DictionaryProvider dict={getDictionary(locale)}>
      <RecipeCompleteButton saveAmount={3000} />
    </DictionaryProvider>
  );

describe("RecipeCompleteButton i18n", () => {
  it("T-14: ja -> localized complete CTA, no Hangul", () => {
    const t = getDictionary("ja");
    const { container } = renderWith("ja");
    expect(screen.getByRole("button")).toHaveTextContent(
      t.recipeDetail.completeCta.split("{")[0].trim()
    );
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-15: ko preserved", () => {
    renderWith("ko");
    expect(screen.getByRole("button")).toHaveTextContent("요리 완료");
  });
});
