import { act, renderHook } from "@testing-library/react";

import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";

const mockPathname = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: mockPush }),
}));

const addToast = jest.fn();
jest.mock("@/shared/ui/toast", () => ({
  useToastStore: () => ({ addToast }),
}));

const recipeFixture = {
  title: "김치찌개",
  imageUrl: "",
  ingredients: [] as {
    id: string;
    name: string;
    quantity: string;
    unit: string;
  }[],
  cookingTime: 10,
  servings: 2,
  dishType: "KOREAN",
  imageKey: "",
  description: "맛있는 김치찌개",
  steps: [],
  cookingTools: [],
  tags: [],
};
let mockRecipe = { ...recipeFixture };

jest.mock("@/entities/recipe", () => ({
  useRecipeDetailQuery: () => ({ recipeData: mockRecipe, isSuccess: true }),
}));

let capturedHandlers: {
  onSuccess: () => Promise<void>;
  onError: (e: Error) => void;
};
const submitRecipe = jest.fn((_vars, handlers) => {
  capturedHandlers = handlers;
});
jest.mock("../useSubmitRecipe", () => ({
  useSubmitRecipe: () => ({ submitRecipe, isPending: false, error: null }),
}));
jest.mock("@/shared/config/cache", () => ({
  invalidateCache: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
// onSubmit이 handleSubmit(zod)을 통과하도록 resolver를 무검증 passthrough로 대체
jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => async (values: unknown) => ({ values, errors: {} }),
}));

import { invalidateCache } from "@/shared/config/cache";

import { useRecipeEditForm } from "../useRecipeEditForm";

describe("useRecipeEditForm i18n (T-02/T-03)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRecipe = { ...recipeFixture };
    mockPathname.mockReturnValue("/ja/recipes/r1/edit");
  });

  it("ja 수정 성공 토스트가 ja editSuccess (T-02)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/edit");
    const { result } = renderHook(() => useRecipeEditForm("r1"));
    await act(async () => {
      await result.current.onSubmit();
    });
    await act(async () => {
      await capturedHandlers.onSuccess();
    });
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: recipeFormMessages.ja.ui.editSuccess })
    );
  });

  it("ja 수정 실패 토스트가 ja editError + 사유 (T-03)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/edit");
    const { result } = renderHook(() => useRecipeEditForm("r1"));
    await act(async () => {
      await result.current.onSubmit();
    });
    capturedHandlers.onError(new Error("network"));
    const msg = addToast.mock.calls.at(-1)![0].message as string;
    expect(msg).toContain("network");
    expect(msg).not.toMatch(/[가-힣]/);
  });

  it("재료가 없는 레시피도 재조회 시 편집 중인 제목을 유지한다", () => {
    const { result, rerender } = renderHook(() => useRecipeEditForm("r1"));
    act(() => result.current.methods.setValue("title", "편집한 제목"));
    mockRecipe = { ...recipeFixture, title: "서버의 새 제목" };
    rerender();
    expect(result.current.methods.getValues("title")).toBe("편집한 제목");
  });

  it("다른 레시피로 바뀌면 새 레시피로 초기화한다", () => {
    mockRecipe = {
      ...recipeFixture,
      ingredients: [{ id: "i1", name: "물", quantity: "100", unit: "ml" }],
    };
    const { result, rerender } = renderHook(({ id }) => useRecipeEditForm(id), {
      initialProps: { id: "r1" },
    });
    act(() => result.current.methods.setValue("title", "편집 중"));
    mockRecipe = { ...recipeFixture, title: "두 번째 레시피" };
    rerender({ id: "r2" });
    expect(result.current.methods.getValues("title")).toBe("두 번째 레시피");
  });

  it.each([
    [{ ingredientId: "i2", name: "물", quantity: "100", unit: "ml" }, true],
    [{ ingredientId: "i1", name: "물", quantity: "100", unit: "g" }, true],
    [{ ingredientId: "i1", name: "물", quantity: "100", unit: "ml" }, false],
  ])("재료 ID·단위 변경을 판정한다: %j", async (ingredient, modified) => {
    mockRecipe = {
      ...recipeFixture,
      ingredients: [{ id: "i1", name: "물", quantity: "100", unit: "ml" }],
    };
    const { result } = renderHook(() => useRecipeEditForm("r1"));
    act(() => result.current.methods.setValue("ingredients", [ingredient]));
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(submitRecipe).toHaveBeenCalledWith(
      expect.objectContaining({ isIngredientsModified: modified }),
      expect.any(Object)
    );
  });

  it("수정 성공 후 캐시 무효화 완료를 기다린 뒤 상세로 이동한다", async () => {
    let complete = () => {};
    jest.mocked(invalidateCache).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve;
        })
    );
    const { result } = renderHook(() => useRecipeEditForm("r1"));
    await act(async () => {
      await result.current.onSubmit();
    });
    let completion: Promise<void>;
    act(() => {
      completion = capturedHandlers.onSuccess();
    });
    expect(invalidateCache).toHaveBeenCalledWith({
      type: "RECIPE_MUTATED",
      recipeId: "r1",
    });
    expect(mockPush).not.toHaveBeenCalled();
    await act(async () => {
      complete();
      await completion;
    });
    expect(mockPush).toHaveBeenCalledWith("/ja/recipes/r1", undefined);
  });
});
