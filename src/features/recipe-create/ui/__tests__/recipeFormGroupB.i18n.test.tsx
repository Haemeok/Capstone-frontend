import type { ReactNode } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";

import type { RecipeFormValues } from "../../model/config";
import IngredientItem from "../IngredientItem";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const HANGUL = /[가-힣]/;

const ingredientField = {
  id: "field-1",
  ingredientId: "",
  name: "tomato",
  unit: "",
};

const slightDefaults: Partial<RecipeFormValues> = {
  ingredients: [
    { ingredientId: "", name: "tomato", quantity: "약간", unit: "" },
  ],
};

const ItemWithRegister = () => {
  const { register } = useFormContext<RecipeFormValues>();
  return (
    <IngredientItem
      field={ingredientField}
      index={0}
      onRemove={() => {}}
      register={register}
    />
  );
};

const FormHarness = ({
  children,
  onMethods,
}: {
  children: ReactNode;
  onMethods?: (methods: ReturnType<typeof useForm<RecipeFormValues>>) => void;
}) => {
  const methods = useForm<RecipeFormValues>({
    defaultValues: slightDefaults,
  });
  onMethods?.(methods);
  return (
    <QueryClientProvider client={new QueryClient()}>
      <FormProvider {...methods}>{children}</FormProvider>
    </QueryClientProvider>
  );
};

describe("recipe form group B i18n", () => {
  it("ja IngredientItem이 ja 사전값으로 표시되고 한글이 남지 않는다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    const { ui } = recipeFormMessages.ja;
    const { container } = render(
      <FormHarness>
        <ItemWithRegister />
      </FormHarness>
    );

    expect(screen.getAllByText(ui.unitlessSlight).length).toBeGreaterThan(0);
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("ja에서 무단위 표시는 현지화되지만 폼 값은 ko canonical을 유지한다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    const { ui } = recipeFormMessages.ja;
    let captured: ReturnType<typeof useForm<RecipeFormValues>> | undefined;
    render(
      <FormHarness onMethods={(m) => (captured = m)}>
        <ItemWithRegister />
      </FormHarness>
    );

    expect(screen.getAllByText(ui.unitlessSlight).length).toBeGreaterThan(0);
    expect(captured?.getValues("ingredients.0.quantity")).toBe("약간");
  });

  it("ko IngredientItem은 한글 사전값을 그대로 쓴다", () => {
    mockPathname.mockReturnValue("/recipes/new");
    const { ui } = recipeFormMessages.ko;
    render(
      <FormHarness>
        <ItemWithRegister />
      </FormHarness>
    );

    expect(screen.getAllByText(ui.unitlessSlight).length).toBeGreaterThan(0);
  });
});
