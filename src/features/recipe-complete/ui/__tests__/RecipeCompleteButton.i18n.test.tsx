import { fireEvent, render, screen } from "@testing-library/react";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";

import RecipeCompleteButton from "../RecipeCompleteButton";

const ko = getDictionary("ko").recipeDetail;
const ja = getDictionary("ja").recipeDetail;
const en = getDictionary("en").recipeDetail;

const mockState = {
  completeRecipe: jest.fn(),
  isCompleted: false,
  showReward: false,
  setShowReward: jest.fn(),
  markCompleted: jest.fn(),
};

jest.mock("../../model/hooks", () => ({
  useRecipeComplete: () => mockState,
  useCreateRecipeCookingRecordMutation: () => ({
    createRecord: jest.fn(),
    isPending: false,
  }),
}));
jest.mock("../RecipeCookingRecordFlow", () => ({
  RecipeCookingRecordFlow: ({
    isOpen,
    copy,
  }: {
    isOpen: boolean;
    copy: { formTitle: string };
  }) => (isOpen ? <div>{copy.formTitle}</div> : null),
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

const renderWith = (locale: "ja" | "en" | "ko") =>
  render(
    <DictionaryProvider dict={getDictionary(locale)}>
      <RecipeCompleteButton
        saveAmount={3000}
        recipeId="recipe-A"
        recipeTitle="동파육"
        recipeImageUrl="/dongpayuk.webp"
        locale={locale}
      />
    </DictionaryProvider>
  );

beforeEach(() => {
  mockState.completeRecipe = jest.fn();
  mockState.setShowReward = jest.fn();
  mockState.isCompleted = false;
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
  it("T-04: ja showReward -> 요리 기록 플로우", () => {
    mockState.showReward = true;
    renderWith("ja");
    expect(screen.getByText(ja.cookingRecord.formTitle)).toBeInTheDocument();
  });

  it("T-08: ko showReward -> 동일한 요리 기록 플로우", () => {
    mockState.showReward = true;
    renderWith("ko");
    expect(screen.getByText(ko.cookingRecord.formTitle)).toBeInTheDocument();
  });
});
