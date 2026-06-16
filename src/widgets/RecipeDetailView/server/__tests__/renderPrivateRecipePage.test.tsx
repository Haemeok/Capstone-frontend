import { render } from "@testing-library/react";

const notFoundMock = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
jest.mock("next/navigation", () => ({ notFound: () => notFoundMock() }));
jest.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  unstable_cache: (_fn: unknown) => _fn,
}));

const recipeDetailViewSpy = jest.fn((_props: unknown) => (
  <div data-testid="rdv" />
));
jest.mock("@/widgets/RecipeDetailView/ui/RecipeDetailView", () => ({
  RecipeDetailView: (props: unknown) => recipeDetailViewSpy(props),
}));
jest.mock("@/shared/adsense/BottomAnchorAdSlot", () => ({
  BottomAnchorAdSlot: () => <div />,
}));
jest.mock("@/features/smart-app-banner", () => ({
  SmartAppBanner: () => <div />,
}));
jest.mock("@/shared/ui/ScrollReset", () => ({
  ScrollReset: ({ children }: { children?: unknown }) => <>{children}</>,
}));

import {
  privateRecipeMetadata,
  PrivateRecipePage,
} from "../renderPrivateRecipePage";

const privateRecipe = {
  id: "abc123",
  title: "비공개 김치찌개",
  visibility: "PRIVATE",
};

const mockFetch = (body: unknown, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as unknown as typeof fetch;
};

describe("renderPrivateRecipePage", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("T-P03: recipe가 null이거나 비공개가 아니면 notFound", async () => {
    mockFetch(null, 404);
    await expect(
      PrivateRecipePage({ recipeId: "abc123", locale: "ko" })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalled();

    mockFetch({ id: "abc123", visibility: "PUBLIC" }, 200);
    await expect(
      PrivateRecipePage({ recipeId: "abc123", locale: "ko" })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("T-P04: ko 비공개를 RecipeDetailView(locale=ko)로 렌더한다", async () => {
    mockFetch(privateRecipe, 200);
    render(await PrivateRecipePage({ recipeId: "abc123", locale: "ko" }));
    expect(recipeDetailViewSpy).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "ko", recipeId: "abc123" })
    );
  });

  it("T-P07: ja면 fetch에 ja, RecipeDetailView에 locale=ja를 전달한다", async () => {
    mockFetch(privateRecipe, 200);
    render(await PrivateRecipePage({ recipeId: "abc123", locale: "ja" }));
    expect(String((global.fetch as jest.Mock).mock.calls[0][0])).toContain(
      "lang=ja"
    );
    expect(recipeDetailViewSpy).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "ja" })
    );
  });

  it("T-P05: 비공개 메타는 noindex이고 hreflang을 방출하지 않는다", () => {
    expect(privateRecipeMetadata.robots).toEqual({
      index: false,
      follow: false,
    });
    expect(privateRecipeMetadata.alternates).toBeUndefined();
  });
});
