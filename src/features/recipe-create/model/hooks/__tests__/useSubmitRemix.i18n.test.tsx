import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";

import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";

import { useSubmitRemix } from "../useSubmitRemix";

const mockPathname = jest.fn();
const replace = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ replace }),
}));

const addToast = jest.fn();
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: () => ({ addToast }),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("../useFinalizeRecipe", () => ({
  useFinalizeRecipe: () => ({ mutate: jest.fn() }),
}));

const postRecipe = jest.fn();
jest.mock("@/entities/recipe/model/api", () => ({
  postRecipe: (...a: unknown[]) => postRecipe(...a),
}));

class FakeApiError extends Error {
  data: { code: string };
  constructor(code: string) {
    super("api");
    this.data = { code };
  }
}
jest.mock("@/shared/api/errors", () => ({
  ApiError: { isApiError: (e: unknown) => e instanceof FakeApiError },
  getErrorData: (e: FakeApiError) => e.data,
}));
jest.mock("@/shared/api/file", () => ({ handleS3Upload: jest.fn() }));

const wrapper = ({ children }: { children: ReactNode }) => {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

const submitVars = {
  originRecipeId: "o1",
  recipe: {} as never,
  fileInfos: [],
  fileObjects: [],
};

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("useSubmitRemix i18n (T-06/T-07/T-09)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("ja 성공 토스트 remixSuccess (T-06)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/o1/remix");
    postRecipe.mockResolvedValue({ recipeId: "n1", uploads: [] });
    const { result } = renderHook(() => useSubmitRemix(), { wrapper });
    result.current.submitRemix(submitVars);
    await flush();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: recipeFormMessages.ja.ui.remixSuccess,
      })
    );
  });

  it("ja 코드211/212 토스트 키 매핑 (T-07)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/o1/remix");
    postRecipe.mockRejectedValue(new FakeApiError("211"));
    const { result } = renderHook(() => useSubmitRemix(), { wrapper });
    result.current.submitRemix(submitVars);
    await flush();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: recipeFormMessages.ja.ui.remixAlreadyCloned,
      })
    );

    addToast.mockClear();
    postRecipe.mockRejectedValue(new FakeApiError("212"));
    result.current.submitRemix(submitVars);
    await flush();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: recipeFormMessages.ja.ui.remixNotCloneable,
      })
    );
  });

  it("ja 일반 오류 remixGeneric (T-09)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/o1/remix");
    postRecipe.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useSubmitRemix(), { wrapper });
    result.current.submitRemix(submitVars);
    await flush();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: recipeFormMessages.ja.ui.remixGeneric,
      })
    );
  });
});
