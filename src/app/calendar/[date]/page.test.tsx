import { render, screen } from "@testing-library/react";

import CalendarDetailPage from "./page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ date: "2026-05-03" }),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: () => ({ addToast: jest.fn() }),
}));

jest.mock("@/entities/recipe/model/hooks", () => ({
  useRecipeHistoryItemsQuery: () => ({
    data: [
      {
        recipeId: "r1",
        recipeTitle: "김치볶음밥",
        imageUrl: "/x.webp",
        calories: 600,
        nutrition: { carbohydrate: 80, protein: 20, fat: 15, sodium: 3500 },
        ingredientCost: 3000,
        marketPrice: 9000,
      },
      {
        recipeId: "r2",
        recipeTitle: "된장찌개",
        imageUrl: "/y.webp",
        calories: 400,
        nutrition: { carbohydrate: 30, protein: 18, fat: 10, sodium: 1200 },
        ingredientCost: 2500,
        marketPrice: 7800,
      },
    ],
  }),
}));

describe("CalendarDetailPage (T-01)", () => {
  it("토글 없이 절약·영양·레시피가 한 화면에 모두 보인다", () => {
    render(<CalendarDetailPage />);

    expect(screen.getByText("직접 만들어서")).toBeInTheDocument();
    expect(screen.getByText("나트륨")).toBeInTheDocument();
    expect(screen.getByText("김치볶음밥")).toBeInTheDocument();
    expect(screen.getByText("된장찌개")).toBeInTheDocument();
  });
});
