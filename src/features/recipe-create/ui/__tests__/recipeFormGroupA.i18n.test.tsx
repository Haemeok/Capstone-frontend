import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { render, screen } from "@testing-library/react";

import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";

import CookingToolsInput from "../CookingToolsInput";
import ServingCounter from "../ServingCounter";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const HANGUL = /[가-힣]/;

const FormHarness = ({ children }: { children: ReactNode }) => {
  const methods = useForm({
    defaultValues: { servings: 2, cookingTools: [] },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("recipe form group A i18n", () => {
  it("ja ServingCounter가 ja 사전값으로 표시되고 한글이 남지 않는다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    const { ui } = recipeFormMessages.ja;
    const { container } = render(
      <FormHarness>
        <ServingCounter />
      </FormHarness>
    );

    expect(screen.getByLabelText(ui.servingsLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(ui.servingsDecrease)).toBeInTheDocument();
    expect(screen.getByLabelText(ui.servingsIncrease)).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("ja CookingToolsInput placeholder가 ja 사전값이다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    const { ui } = recipeFormMessages.ja;
    render(
      <FormHarness>
        <CookingToolsInput />
      </FormHarness>
    );

    expect(
      screen.getByPlaceholderText(ui.cookingToolPlaceholder)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(ui.cookingToolInputLabel)).toBeInTheDocument();
  });

  it("ko ServingCounter는 한글 사전값을 그대로 쓴다", () => {
    mockPathname.mockReturnValue("/recipes/new");
    const { ui } = recipeFormMessages.ko;
    render(
      <FormHarness>
        <ServingCounter />
      </FormHarness>
    );

    expect(screen.getByLabelText(ui.servingsLabel)).toBeInTheDocument();
  });
});
