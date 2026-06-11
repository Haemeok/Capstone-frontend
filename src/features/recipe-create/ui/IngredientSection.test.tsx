import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

import { RECIPE_FORM_DEFAULT_VALUES, RecipeFormValues } from "../model/config";
import IngredientSection from "./IngredientSection";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

const Wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const methods = useForm<RecipeFormValues>({
    defaultValues: RECIPE_FORM_DEFAULT_VALUES,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...methods}>{children}</FormProvider>
    </QueryClientProvider>
  );
};

describe("IngredientSection 직접 입력", () => {
  it("검색 없이 재료명을 입력하면 재료 목록에 나타난다", () => {
    render(
      <Wrapper>
        <IngredientSection onRemoveIngredientCallback={() => {}} />
      </Wrapper>
    );

    fireEvent.click(screen.getByRole("button", { name: "직접 입력" }));
    fireEvent.change(screen.getByLabelText("재료명 직접 입력"), {
      target: { value: "수제 육수" },
    });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(screen.getByText("수제 육수")).toBeInTheDocument();
  });
});
