import { render, screen } from "@testing-library/react";

let mockPathname = "/calendar/2026-05-03";

jest.mock("next/navigation", () => ({
  useParams: () => ({ date: "2026-05-03" }),
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => mockPathname,
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

import CalendarDetailPage from "./page";

describe("CalendarDetailPage (T-19/20)", () => {
  it("ko → 절약 카드 + 레시피 목록 표시", () => {
    mockPathname = "/calendar/2026-05-03";
    render(<CalendarDetailPage />);
    expect(screen.getByText("절약")).toBeInTheDocument();
    expect(screen.getByText("김치볶음밥")).toBeInTheDocument();
    expect(screen.getByText("된장찌개")).toBeInTheDocument();
  });

  it("en → 절약 카드 부재 (T-20)", () => {
    mockPathname = "/en/calendar/2026-05-03";
    render(<CalendarDetailPage />);
    expect(screen.queryByText("절약")).not.toBeInTheDocument();
    expect(screen.queryByText("Savings")).not.toBeInTheDocument();
  });
});
