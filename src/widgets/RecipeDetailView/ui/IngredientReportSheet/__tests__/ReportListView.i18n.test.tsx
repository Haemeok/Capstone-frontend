import { render, screen } from "@testing-library/react";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";

import { ReportListView } from "../views/ReportListView";

const sheetComponents = {
  Header: ({ children }: React.HTMLAttributes<HTMLDivElement>) => (
    <div>{children}</div>
  ),
  Title: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2>{children}</h2>
  ),
  Description: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p>{children}</p>
  ),
};

const enRecipe = {
  ingredients: [
    { id: "a", name: "Olive oil", quantity: "3", unit: "tablespoon", price: 0 },
  ],
} as never;

describe("ReportListView amount formatting", () => {
  it("T-C7: en 신고 시트 amount '3 tbsp'", () => {
    render(
      <DictionaryProvider dict={getDictionary("en")}>
        <ReportListView
          recipe={enRecipe}
          servingRatio={1}
          locale="en"
          onIngredientSelect={() => {}}
          onMissingSelect={() => {}}
          {...sheetComponents}
        />
      </DictionaryProvider>
    );
    expect(screen.getByText(/3 tbsp/)).toBeInTheDocument();
  });
});
