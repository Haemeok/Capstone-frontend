import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

jest.mock("@/entities/recipe/model/api", () => ({
  postRecipe: jest.fn(),
}));
jest.mock("@/shared/api/file", () => ({
  handleS3Upload: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: jest.fn(() => ({ addToast: jest.fn() })),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ replace: jest.fn() })),
}));

import { useRouter } from "next/navigation";

import { handleS3Upload } from "@/shared/api/file";
import { triggerHaptic } from "@/shared/lib/bridge";

import { postRecipe } from "@/entities/recipe/model/api";

import { useToastStore } from "@/widgets/Toast/model/store";

import { useSubmitRemix } from "@/features/recipe-create/model/hooks/useSubmitRemix";

function makeQC() {
  return new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
}

function renderUseSubmitRemix() {
  const queryClient = makeQC();
  const mockRouter = { replace: jest.fn() };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  const mockAddToast = jest.fn();
  (useToastStore as unknown as jest.Mock).mockReturnValue({ addToast: mockAddToast });

  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useSubmitRemix(), { wrapper });
  return { submitRemix: result.current.submitRemix, mockRouter, mockAddToast };
}

const dummyRecipePayload = { title: "remix" } as any;
const makePresign = (recipeId = "new-abc", uploads: any[] = []) => ({
  recipeId,
  uploads,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useSubmitRemix", () => {
  it("posts with originRecipeId and replaces to new recipe detail on success (no files)", async () => {
    (postRecipe as jest.Mock).mockResolvedValue(makePresign("new-abc", []));
    (handleS3Upload as jest.Mock).mockResolvedValue(undefined);

    const { submitRemix, mockRouter, mockAddToast } = renderUseSubmitRemix();
    const onSuccess = jest.fn();
    const onError = jest.fn();

    await act(async () => {
      submitRemix(
        {
          originRecipeId: "ORIGIN_ID",
          recipe: dummyRecipePayload,
          fileInfos: [],
          fileObjects: [],
        },
        { onSuccess, onError },
      );
    });

    await waitFor(() => {
      expect(postRecipe).toHaveBeenCalledWith({
        recipe: dummyRecipePayload,
        files: [],
      });
      expect(handleS3Upload).not.toHaveBeenCalled();
      expect(triggerHaptic).toHaveBeenCalledWith("Success");
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "success" }),
      );
      expect(mockRouter.replace).toHaveBeenCalledWith("/recipes/new-abc");
      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  it("uploads to S3 when presigned uploads are returned", async () => {
    const uploads = [{ url: "https://s3.example.com/upload", key: "k1" }];
    (postRecipe as jest.Mock).mockResolvedValue(makePresign("new-xyz", uploads));
    (handleS3Upload as jest.Mock).mockResolvedValue(undefined);

    const mockFileObject = { file: new File(["data"], "img.png"), type: "main" as const };
    const fileInfos = [{ contentType: "image/webp" as const, type: "main" as const }];

    const { submitRemix, mockRouter } = renderUseSubmitRemix();

    await act(async () => {
      submitRemix(
        {
          originRecipeId: "ORIGIN_ID",
          recipe: dummyRecipePayload,
          fileInfos,
          fileObjects: [mockFileObject],
        },
        {},
      );
    });

    await waitFor(() => {
      expect(postRecipe).toHaveBeenCalledWith({
        recipe: dummyRecipePayload,
        files: fileInfos,
      });
      expect(handleS3Upload).toHaveBeenCalledWith(uploads, [mockFileObject]);
      expect(mockRouter.replace).toHaveBeenCalledWith("/recipes/new-xyz");
    });
  });

  it("redirects to origin with error toast on 409 RECIPE_REMIX_ALREADY_EXISTS (code 211)", async () => {
    const apiError = { status: 409, data: { code: 211, message: "already cloned" } };
    (postRecipe as jest.Mock).mockRejectedValue(apiError);

    const { submitRemix, mockRouter, mockAddToast } = renderUseSubmitRemix();
    const onError = jest.fn();

    await act(async () => {
      submitRemix(
        {
          originRecipeId: "ORIGIN_ID",
          recipe: dummyRecipePayload,
          fileInfos: [],
          fileObjects: [],
        },
        { onError },
      );
    });

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "error" }),
      );
      expect(mockRouter.replace).toHaveBeenCalledWith("/recipes/ORIGIN_ID");
      expect(onError).toHaveBeenCalled();
    });
  });

  it("redirects to origin with error toast on 403 RECIPE_REMIX_NOT_ALLOWED (code 212)", async () => {
    const apiError = { status: 403, data: { code: 212, message: "not allowed" } };
    (postRecipe as jest.Mock).mockRejectedValue(apiError);

    const { submitRemix, mockRouter, mockAddToast } = renderUseSubmitRemix();
    const onError = jest.fn();

    await act(async () => {
      submitRemix(
        {
          originRecipeId: "ORIGIN_ID",
          recipe: dummyRecipePayload,
          fileInfos: [],
          fileObjects: [],
        },
        { onError },
      );
    });

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "error" }),
      );
      expect(mockRouter.replace).toHaveBeenCalledWith("/recipes/ORIGIN_ID");
      expect(onError).toHaveBeenCalled();
    });
  });

  it("shows generic error toast on unknown errors without redirecting", async () => {
    (postRecipe as jest.Mock).mockRejectedValue(new Error("network fail"));

    const { submitRemix, mockRouter, mockAddToast } = renderUseSubmitRemix();

    await act(async () => {
      submitRemix(
        {
          originRecipeId: "ORIGIN_ID",
          recipe: dummyRecipePayload,
          fileInfos: [],
          fileObjects: [],
        },
        {},
      );
    });

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "error" }),
      );
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });
});
