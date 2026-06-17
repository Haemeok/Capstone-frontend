import { render, screen } from "@testing-library/react";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";

import AIModelSelection from "../index";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/",
}));
jest.mock("@/entities/user/model/store", () => ({
  useUserStore: () => ({ user: null }),
}));
jest.mock("next/dynamic", () => (fn: () => Promise<unknown>) => {
  fn();
  return () => null;
});

const base = getDictionary("ko");
const sentinelDict = {
  ...base,
  aiRecipe: {
    ...base.aiRecipe,
    modelSelectHeading: "__HEADING__",
    models: {
      ...base.aiRecipe.models,
      INGREDIENT_FOCUS: {
        name: "__MODEL_NAME__",
        description: "__MODEL_DESC__",
      },
    },
  },
};

describe("AIModelSelection i18n (T-03)", () => {
  it("주입된 dict의 카피를 렌더하고 ko 하드코딩을 남기지 않는다", () => {
    render(
      <DictionaryProvider dict={sentinelDict}>
        <AIModelSelection />
      </DictionaryProvider>
    );
    expect(screen.getByText("__HEADING__")).toBeInTheDocument();
    expect(screen.getByText("__MODEL_NAME__")).toBeInTheDocument();
    expect(
      screen.queryByText("어떤 AI와 함께 요리할까요?")
    ).not.toBeInTheDocument();
  });
});
