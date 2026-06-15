import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { render, screen } from "@testing-library/react";

import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";

import RecipeProgressButton from "../RecipeProgressButton";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

const Harness = ({ children }: { children: ReactNode }) => {
  const methods = useForm({ defaultValues: { title: "김치찌개" } });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const labelOf = () => screen.getByRole("button").textContent ?? "";

describe("RecipeProgressButton submit label by mode (T-01/T-04/T-05/T-10)", () => {
  it("ja edit → submitEdit (T-01)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/edit");
    render(
      <Harness>
        <RecipeProgressButton isLoading={false} mode="edit" />
      </Harness>
    );
    expect(labelOf()).toContain(recipeFormMessages.ja.ui.submitEdit);
  });

  it("ja remix → submitRemix, NOT submitCreate (T-05)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/remix");
    render(
      <Harness>
        <RecipeProgressButton isLoading={false} mode="remix" />
      </Harness>
    );
    expect(labelOf()).toContain(recipeFormMessages.ja.ui.submitRemix);
    expect(labelOf()).not.toContain(recipeFormMessages.ja.ui.submitCreate);
  });

  it("ko edit → '레시피 수정하기' (T-04)", () => {
    mockPathname.mockReturnValue("/recipes/r1/edit");
    render(
      <Harness>
        <RecipeProgressButton isLoading={false} mode="edit" />
      </Harness>
    );
    expect(labelOf()).toContain(recipeFormMessages.ko.ui.submitEdit);
  });

  it("ko create → '레시피 등록하기' (T-10)", () => {
    mockPathname.mockReturnValue("/recipes/new/manual");
    render(
      <Harness>
        <RecipeProgressButton isLoading={false} mode="create" />
      </Harness>
    );
    expect(labelOf()).toContain(recipeFormMessages.ko.ui.submitCreate);
  });
});
