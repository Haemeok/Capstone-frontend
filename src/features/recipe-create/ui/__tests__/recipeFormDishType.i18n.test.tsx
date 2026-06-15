import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import type { RecipeFormValues } from "../../model/config";
import RecipeFormLayout from "../RecipeFormLayout";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const FormHarness = ({ children }: { children: ReactNode }) => {
  const methods = useForm<RecipeFormValues>();
  return (
    <QueryClientProvider client={new QueryClient()}>
      <FormProvider {...methods}>{children}</FormProvider>
    </QueryClientProvider>
  );
};

const renderLayout = () =>
  render(
    <FormHarness>
      <RecipeFormLayout
        handleMainIngredientRemoved={() => {}}
        isLoading={false}
        recipeCreationError={null}
        onSubmit={async () => {}}
        mode="create"
      />
    </FormHarness>
  );

describe("RecipeFormLayout dishType option i18n", () => {
  it("ja에서 옵션 표시는 ja 택소노미 라벨, value는 ko canonical을 유지한다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new/manual");
    renderLayout();

    const soupStew = screen.getByRole("option", {
      name: taxonomyMessages.ja.dishType.SOUP_STEW,
    }) as HTMLOptionElement;

    expect(soupStew).toBeInTheDocument();
    expect(soupStew.value).toBe("국/찌개/탕");
  });

  it("ko에서는 ko canonical 라벨을 그대로 표시한다", () => {
    mockPathname.mockReturnValue("/recipes/new/manual");
    renderLayout();

    const soupStew = screen.getByRole("option", {
      name: "국/찌개/탕",
    }) as HTMLOptionElement;

    expect(soupStew.value).toBe("국/찌개/탕");
  });
});
