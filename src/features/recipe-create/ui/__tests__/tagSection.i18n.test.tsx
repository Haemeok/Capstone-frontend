import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import type { RecipeFormValues } from "../../model/config";
import TagSection from "../TagSection";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const HANGUL = /[가-힣]/;

const FormHarness = ({ children }: { children: ReactNode }) => {
  const methods = useForm<RecipeFormValues>({
    defaultValues: { tags: [] },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("TagSection i18n", () => {
  it("ja에서 태그 칩이 ja 분류 사전값으로 표시되고 한글이 남지 않는다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new/manual");
    const { container } = render(
      <FormHarness>
        <TagSection />
      </FormHarness>
    );

    expect(
      screen.getByText(new RegExp(taxonomyMessages.ja.tags.BRUNCH))
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(taxonomyMessages.ja.tags.HEALTHY))
    ).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });
});
