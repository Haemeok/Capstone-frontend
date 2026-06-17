import { render, screen } from "@testing-library/react";

import type { Locale } from "@/shared/i18n";
import { format, getDictionary } from "@/shared/i18n";

import type { MyFridgeRecipeItem } from "@/entities/recipe/model/types";

import MyFridgeRecipeCard from "../MyFridgeRecipeCard";

const cookTime = (locale: Locale) =>
  format(getDictionary(locale).fridge.cookTimeMinutes, { min: 40 });

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/features/recipe-save", () => ({
  RecipeSaveButton: () => null,
}));
jest.mock("@/shared/ui/image/Image", () => ({
  Image: () => null,
}));
jest.mock("@/shared/ui/badge/AIGeneratedBadge", () => ({
  default: () => null,
}));

const recipe = {
  id: "r1",
  title: "테스트",
  cookingTime: 40,
  missingIngredients: [],
  recipeType: "USER",
  imageUrl: "",
  favoriteByCurrentUser: false,
  favoriteCount: null,
  youtubeVideoViewCount: null,
  youtubeChannelName: null,
  authorId: "u1",
  authorName: "작성자",
  profileImage: "https://example.com/profile.jpg",
} as unknown as MyFridgeRecipeItem; // as unknown: fixture is partial, real type requires all fields

describe("MyFridgeRecipeCard 조리시간 단위 i18n", () => {
  it.each([
    ["/ja/recipes/my-fridge", cookTime("ja")],
    ["/en/recipes/my-fridge", cookTime("en")],
    ["/recipes/my-fridge", cookTime("ko")],
  ])("%s → %s (T-21/T-22)", (path, expected) => {
    mockPathname.mockReturnValue(path);
    render(<MyFridgeRecipeCard recipe={recipe} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
