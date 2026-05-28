import { validateMarkdown } from "@/app/admin/curation-test/lib/validate";

jest.mock("ai", () => ({
  generateObject: jest.fn(),
  generateText: jest.fn(),
}));
jest.mock("@ai-sdk/openai", () => ({
  createOpenAI: () => Object.assign(() => ({}), { chat: () => ({}) }),
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

import { generateObject, generateText } from "ai";

import { getRecipe } from "@/entities/recipe/model/api";

import { generateCuration } from "../curation";
import { searchRecipeIds } from "../curation.search";

const mockGenObj = generateObject as jest.MockedFunction<typeof generateObject>;
const mockGenText = generateText as jest.MockedFunction<typeof generateText>;
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
        `## 섹션 ${i}\n\n{{img:${i}}}\n\n맛있는 본문 {{recipe:${i}}} 그리고 {{yt:${i}}}. 한 번 더 짚자면 {{ref:${i}}}.`,
    )
    .join("\n\n") +
  "\n\n결말 한 문단입니다." +
  " ".repeat(400);

beforeAll(() => {
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
  process.env.UPSTAGE_API_KEY = "test";
});

describe("generateCuration", () => {
  it("정상 흐름: search → recipes → title → body → validate → hydrate", async () => {
    mockSearch.mockResolvedValue(["a", "b", "c"]);
    mockGetRecipe.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (id: string) => fakeRecipe(id) as any,
    );
    mockGenObj.mockResolvedValueOnce({
      object: {
        h1: "겨울 보양식 한 그릇",
        dek: "오늘 저녁 메뉴",
        category: "FOOD & LIFE",
        selectedIndices: [0, 1, 2],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    mockGenText
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({ text: "솔라 raw 본문" } as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({ text: fakeBody(3) } as any);

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
    mockGenObj.mockResolvedValueOnce({
      object: {
        h1: "x",
        dek: "y".repeat(25),
        category: "FOOD & LIFE",
        selectedIndices: [0, 1, 2],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    mockGenText
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({ text: "솔라 raw 본문" } as any)
      .mockResolvedValueOnce({
        text: fakeBody(3).replace("{{yt:1}}", ""),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({ text: fakeBody(3) } as any);

    const result = await generateCuration({
      params: { dishType: "찌개" },
    });
    expect(result.markdown).toContain("[요리-a →](/recipes/a)");
    // Solar 1번 + Grok 슬롯 인서터 2번(첫 실패 후 retry 성공)
    expect(mockGenText).toHaveBeenCalledTimes(3);
  });

  it("validation 3회 실패 시 VALIDATION_FAILED throw", async () => {
    mockSearch.mockResolvedValue(["a", "b", "c"]);
    mockGetRecipe.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (id: string) => fakeRecipe(id) as any,
    );
    mockGenObj.mockResolvedValueOnce({
      object: {
        h1: "x",
        dek: "y".repeat(25),
        category: "FOOD & LIFE",
        selectedIndices: [0, 1, 2],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    mockGenText
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({ text: "솔라 raw 본문" } as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValue({ text: "너무 짧아" } as any);

    await expect(
      generateCuration({ params: { dishType: "찌개" } }),
    ).rejects.toMatchObject({ code: "VALIDATION_FAILED" });
  });
});
