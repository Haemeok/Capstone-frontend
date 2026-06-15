import { renderHook } from "@testing-library/react";

import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/shared/i18n", () => {
  const { recipeFormMessages: msgs } = jest.requireActual<
    typeof import("@/shared/i18n/recipeFormMessages")
  >("@/shared/i18n/recipeFormMessages");
  const { resolveChromeLocale } = jest.requireActual<
    typeof import("@/shared/i18n/resolveChromeLocale")
  >("@/shared/i18n/resolveChromeLocale");
  const { format } = jest.requireActual<typeof import("@/shared/i18n/format")>(
    "@/shared/i18n/format"
  );

  return {
    useRecipeFormDict: () => {
      // usePathname is already mocked in the test scope via jest.mock("next/navigation")
      const { usePathname } = jest.requireMock<{ usePathname: () => string }>(
        "next/navigation"
      );
      return msgs[resolveChromeLocale(usePathname() ?? "/")];
    },
    format,
  };
});

const addToast = jest.fn();
jest.mock("@/widgets/Toast", () => ({
  useToastStore: () => ({ addToast }),
}));

const recipeFixture = {
  title: "김치찌개",
  imageUrl: "",
  ingredients: [],
  cookingTime: 10,
  servings: 2,
  dishType: "KOREAN",
  imageKey: "",
  description: "맛있는 김치찌개",
  steps: [],
  cookingTools: [],
  tags: [],
};

jest.mock("@/entities/recipe", () => ({
  useRecipeDetailQuery: () => ({ recipeData: recipeFixture, isSuccess: true }),
}));

let capturedHandlers: { onSuccess: () => void; onError: (e: Error) => void };
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

import { useRecipeEditForm } from "../useRecipeEditForm";

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("useRecipeEditForm i18n (T-02/T-03)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("ja 수정 성공 토스트가 ja editSuccess (T-02)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/edit");
    const { result } = renderHook(() => useRecipeEditForm("r1"));
    result.current.onSubmit();
    await flush();
    capturedHandlers.onSuccess();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: recipeFormMessages.ja.ui.editSuccess })
    );
  });

  it("ja 수정 실패 토스트가 ja editError + 사유 (T-03)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/edit");
    const { result } = renderHook(() => useRecipeEditForm("r1"));
    result.current.onSubmit();
    await flush();
    capturedHandlers.onError(new Error("network"));
    const msg = addToast.mock.calls.at(-1)![0].message as string;
    expect(msg).toContain("network");
    expect(msg).not.toMatch(/[가-힣]/);
  });
});
