import { validateMarkdown } from "@/app/admin/curation-test/lib/validate";

jest.mock("ai", () => ({
  generateObject: jest.fn(),
}));
jest.mock("@ai-sdk/openai", () => ({
  createOpenAI: () => () => ({}),
}));
jest.mock("@/entities/recipe/model/api", () => ({
  getRecipe: jest.fn(),
}));
jest.mock("../curation.search", () => ({
  searchRecipeIds: jest.fn(),
}));
jest.mock("@/shared/lib/admin-guard", () => ({
  requireAdminAction: jest.fn().mockResolvedValue(undefined),
}));

import { generateObject } from "ai";

import { getRecipe } from "@/entities/recipe/model/api";

import { generateCuration } from "../curation";
import { searchRecipeIds } from "../curation.search";

const mockGen = generateObject as jest.MockedFunction<typeof generateObject>;
const mockSearch = searchRecipeIds as jest.MockedFunction<
  typeof searchRecipeIds
>;
const mockGetRecipe = getRecipe as jest.MockedFunction<typeof getRecipe>;

const fakeRecipe = (id: string) => ({
  id,
  title: `요리-${id}`,
  imageUrl: `https://cdn/img/${id}.jpg`,
  youtubeUrl: `https://youtu.be/${id}`,
  description: "맛있어요",
  ingredients: [{ name: "재료", amount: "1" }],
  cookingTime: 20,
  totalCalories: 200,
  steps: [],
});

const fakeBody = (n: number) =>
  Array(50).fill("아주 길게 쓴 인트로 한 문단입니다. ").join("") +
  "\n\n" +
  Array.from({ length: n })
    .map(
      (_, i) =>
        `## 섹션 ${i}\n\n{{img:${i}}}\n\n맛있는 본문 {{recipe:${i}}} 그리고 {{yt:${i}}}.`,
    )
    .join("\n\n") +
  "\n\n결말 한 문단입니다." +
  " ".repeat(400);

beforeAll(() => {
  // fakeBody가 validate 룰을 실제 통과하는지 sanity check.
  // validate.ts 룰이 변하면 silent test rot 대신 여기서 즉시 실패한다.
  const sanity = validateMarkdown(fakeBody(3), 3);
  if (!sanity.ok) {
    throw new Error(
      `fakeBody(3) violates validateMarkdown: ${sanity.errors.join(", ")}`,
    );
  }
});

beforeEach(() => {
  jest.clearAllMocks();
  process.env.XAI_API_KEY = "test";
});

describe("generateCuration", () => {
  it("정상 흐름: search → recipes → title → body → validate → hydrate", async () => {
    mockSearch.mockResolvedValue(["a", "b", "c"]);
    mockGetRecipe.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (id: string) => fakeRecipe(id) as any,
    );
    mockGen
      .mockResolvedValueOnce({
        object: {
          h1: "겨울 보양식 한 그릇",
          dek: "오늘 저녁 메뉴",
          category: "FOOD & LIFE",
          selectedIndices: [0, 1, 2],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .mockResolvedValueOnce({
        object: { bodyMarkdown: fakeBody(3) },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

    const result = await generateCuration({
      params: { dishType: "찌개", season: "겨울" },
    });

    expect(result.h1).toBe("겨울 보양식 한 그릇");
    expect(result.recipeIds).toEqual(["a", "b", "c"]);
    expect(result.markdown).toContain("![요리-a](https://cdn/img/a.jpg)");
    expect(result.markdown).toContain("[요리-b →](/recipes/b)");
    expect(result.markdown).not.toMatch(/\{\{/);
  });

  it("레시피 부족(<3)면 INSUFFICIENT_RECIPES throw", async () => {
    mockSearch.mockResolvedValue(["a"]);
    await expect(
      generateCuration({ params: { dishType: "찌개" } }),
    ).rejects.toMatchObject({ code: "INSUFFICIENT_RECIPES" });
  });

  it("validation 실패 시 1회 retry", async () => {
    mockSearch.mockResolvedValue(["a", "b", "c"]);
    mockGetRecipe.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (id: string) => fakeRecipe(id) as any,
    );
    mockGen
      .mockResolvedValueOnce({
        object: {
          h1: "x",
          dek: "y".repeat(25),
          category: "FOOD & LIFE",
          selectedIndices: [0, 1, 2],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .mockResolvedValueOnce({
        object: { bodyMarkdown: fakeBody(3).replace("{{yt:1}}", "") },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .mockResolvedValueOnce({
        object: { bodyMarkdown: fakeBody(3) },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

    const result = await generateCuration({
      params: { dishType: "찌개" },
    });
    expect(result.markdown).toContain("[요리-a →](/recipes/a)");
    expect(mockGen).toHaveBeenCalledTimes(3);
  });

  it("validation 3회 실패 시 VALIDATION_FAILED throw", async () => {
    mockSearch.mockResolvedValue(["a", "b", "c"]);
    mockGetRecipe.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (id: string) => fakeRecipe(id) as any,
    );
    mockGen
      .mockResolvedValueOnce({
        object: {
          h1: "x",
          dek: "y".repeat(25),
          category: "FOOD & LIFE",
          selectedIndices: [0, 1, 2],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .mockResolvedValue({
        object: { bodyMarkdown: "너무 짧아" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

    await expect(
      generateCuration({ params: { dishType: "찌개" } }),
    ).rejects.toMatchObject({ code: "VALIDATION_FAILED" });
  });
});
