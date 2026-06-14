import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { render, screen } from "@testing-library/react";

import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";

import type { RecipeFormValues } from "@/features/recipe-create/model/config";

import { ImageUploader } from "../ImageUploader";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const HANGUL = /[가-힣]/;

const FormHarness = ({ children }: { children: ReactNode }) => {
  const methods = useForm<RecipeFormValues>();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("ImageUploader i18n", () => {
  it("ja에서 업로드 placeholder가 ja 사전값으로 표시되고 한글이 남지 않는다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new/manual");
    const { container } = render(
      <FormHarness>
        <ImageUploader fieldName="image" />
      </FormHarness>
    );

    expect(
      screen.getByText(recipeFormMessages.ja.ui.imageUploadPlaceholder)
    ).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("ko에서는 한글 placeholder를 그대로 쓴다", () => {
    mockPathname.mockReturnValue("/recipes/new/manual");
    render(
      <FormHarness>
        <ImageUploader fieldName="image" />
      </FormHarness>
    );

    expect(
      screen.getByText(recipeFormMessages.ko.ui.imageUploadPlaceholder)
    ).toBeInTheDocument();
  });
});
