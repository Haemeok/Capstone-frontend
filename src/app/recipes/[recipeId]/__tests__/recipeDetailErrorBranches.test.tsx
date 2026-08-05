/**
 * @jest-environment node
 */
import { getStaticrecipionServer } from "@/entities/recipe/model/api.server";

import {
  buildRecipeMetadata,
  RecipeDetailPageView,
} from "../RecipeDetailPageView";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("@/entities/recipe/model/api.server", () => ({
  getStaticrecipionServer: jest.fn(),
}));

jest.mock("@/entities/recipe", () => ({
  isPrivateRecipe: jest.requireActual("@/entities/recipe/lib/visibility")
    .isPrivateRecipe,
}));

jest.mock("@/entities/recipe/lib/metadata", () => ({
  generateNotFoundRecipeMetadata: jest.fn(() => ({ title: "not-found" })),
  generateRecipeMetadata: jest.fn(() => ({ title: "recipe" })),
  generateRecipeJsonLd: jest.fn(() => ({})),
}));

jest.mock("@/widgets/RecipeDetailView", () => ({
  RecipeDetailView: () => null,
}));
jest.mock(
  "@/widgets/RecipeDetailView/server/RecipeCoupangProducts",
  () => () => null
);
jest.mock("@/widgets/RecipeSlide/server", () => ({
  RecipeDetailServerSlides: () => null,
}));
jest.mock("@/shared/adsense/BottomAnchorAdSlot", () => ({
  BottomAnchorAdSlot: () => null,
}));
jest.mock("@/features/smart-app-banner", () => ({
  SmartAppBanner: () => null,
}));
jest.mock("@/shared/ui/ScrollReset", () => ({
  ScrollReset: ({ children }: { children: unknown }) => children,
}));
jest.mock("../RemixRedirectToast", () => ({ RemixRedirectToast: () => null }));

const { notFound } = jest.requireMock("next/navigation");
const { generateNotFoundRecipeMetadata, generateRecipeMetadata } =
  jest.requireMock("@/entities/recipe/lib/metadata");

const fetchRecipe = getStaticrecipionServer as jest.MockedFunction<
  typeof getStaticrecipionServer
>;

const publicRecipe = { id: "r1", title: "마늘쫑무침", visibility: "PUBLIC" };
const privateRecipe = { id: "r1", title: "마늘쫑무침", visibility: "PRIVATE" };
const transientFailure = () => Promise.reject(new Error("API Error: 503"));

const render = () =>
  RecipeDetailPageView({ recipeId: "r1", renderTrack: "static" });

describe("RecipeDetailPageView — 분기별 동작", () => {
  afterEach(() => jest.clearAllMocks());

  it("T-321: 레시피가 있으면 notFound를 부르지 않는다", async () => {
    fetchRecipe.mockResolvedValue(publicRecipe as never);

    await render();

    expect(notFound).not.toHaveBeenCalled();
  });

  it("T-322: 레시피가 없으면(null) notFound를 부른다", async () => {
    fetchRecipe.mockResolvedValue(null);

    await expect(render()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("T-323: 비공개 레시피면 notFound를 부른다", async () => {
    fetchRecipe.mockResolvedValue(privateRecipe as never);

    await expect(render()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("T-324: 일시 장애는 notFound가 아니라 그대로 전파한다", async () => {
    fetchRecipe.mockImplementation(transientFailure);

    await expect(render()).rejects.toThrow("API Error: 503");
    expect(notFound).not.toHaveBeenCalled();
  });
});

describe("buildRecipeMetadata — 분기별 동작", () => {
  afterEach(() => jest.clearAllMocks());

  it("T-331: 레시피가 있으면 정상 메타를 만든다", async () => {
    fetchRecipe.mockResolvedValue(publicRecipe as never);

    await buildRecipeMetadata("r1");

    expect(generateRecipeMetadata).toHaveBeenCalled();
    expect(generateNotFoundRecipeMetadata).not.toHaveBeenCalled();
  });

  it.each([
    ["없는 레시피", null],
    ["비공개 레시피", privateRecipe],
  ])("T-332: %s면 notFound 메타를 만든다", async (_label, recipe) => {
    fetchRecipe.mockResolvedValue(recipe as never);

    await buildRecipeMetadata("r1");

    expect(generateNotFoundRecipeMetadata).toHaveBeenCalled();
    expect(generateRecipeMetadata).not.toHaveBeenCalled();
  });

  it("T-333: 일시 장애는 notFound 메타로 덮지 않고 전파한다", async () => {
    fetchRecipe.mockImplementation(transientFailure);

    await expect(buildRecipeMetadata("r1")).rejects.toThrow("API Error: 503");
    expect(generateNotFoundRecipeMetadata).not.toHaveBeenCalled();
  });
});
