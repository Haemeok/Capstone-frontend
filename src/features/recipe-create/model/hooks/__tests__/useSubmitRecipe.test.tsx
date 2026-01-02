import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/entities/recipe/model/api", () => ({
  postRecipe: jest.fn(),
  editRecipe: jest.fn(),
}));
jest.mock("@/shared/api/file", () => ({
  handleS3Upload: jest.fn(),
}));

jest.mock("@/features/recipe-create/model/hooks/useFinalizeRecipe", () => {
  const finalize = { mutate: jest.fn(), mutateAsync: jest.fn() };
  return {
    useFinalizeRecipe: () => finalize,
    __finalizeMock: finalize,
  };
});
jest.mock("@/features/recipe-create/lib/prepareRecipeData", () => ({
  prepareRecipeData: jest.fn(),
}));

const finalizeModule = jest.requireMock(
  "@/features/recipe-create/model/hooks/useFinalizeRecipe"
) as {
  __finalizeMock: { mutate: jest.Mock; mutateAsync: jest.Mock };
};
const { __finalizeMock } = finalizeModule;

import { postRecipe, editRecipe } from "@/entities/recipe/model/api";
import { handleS3Upload } from "@/shared/api/file";
import { prepareRecipeData } from "@/features/recipe-create/lib/prepareRecipeData";
import { useSubmitRecipe } from "@/features/recipe-create/model/hooks/useSubmitRecipe";

function makeQC() {
  return new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
}
function renderUseSubmitRecipe() {
  const queryClient = makeQC();
  const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(() => useSubmitRecipe(), { wrapper });
  return { submit: result.current.submitRecipe, invalidateSpy };
}

const dummyForm = { title: "t", steps: [], images: [] } as any;
const makePresign = (recipeId = 123, uploads: any[] = []) => ({
  recipeId,
  uploads,
});

beforeEach(() => {
  jest.clearAllMocks();
});

it("신규 레시피 생성 시, 첨부 파일이 없으면 S3 업로드 없이 게시를 완료하고 목록 캐시를 무효화한다.", async () => {
  (prepareRecipeData as jest.Mock).mockReturnValue({
    recipeData: { a: 1 },
    filesToUploadInfo: [],
    fileObjects: [],
  });
  (postRecipe as jest.Mock).mockResolvedValue(makePresign(123, []));
  (handleS3Upload as jest.Mock).mockResolvedValue(undefined);

  const { submit, invalidateSpy } = renderUseSubmitRecipe();
  const onSuccess = jest.fn();
  const onError = jest.fn();

  await act(async () => {
    submit({ formData: dummyForm }, { onSuccess, onError });
  });

  await waitFor(() => {
    expect(prepareRecipeData).toHaveBeenCalledWith(dummyForm);
    expect(postRecipe).toHaveBeenCalledWith({ recipe: { a: 1 }, files: [] });
    expect(editRecipe).not.toHaveBeenCalled();
    expect(handleS3Upload).not.toHaveBeenCalled();

    expect(__finalizeMock.mutate).toHaveBeenCalledWith(123);

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["recipes"] });

    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});

it("신규 레시피 생성 시, 첨부 파일이 있으면 S3 업로드 성공 후 게시를 완료하고 목록 캐시를 무효화한다.", async () => {
  const filesToUploadInfo = [{ key: "k" }];
  const fileObj = new File(["x"], "a.png");

  (prepareRecipeData as jest.Mock).mockReturnValue({
    recipeData: { b: 1 },
    filesToUploadInfo,
    fileObjects: [fileObj],
  });
  (postRecipe as jest.Mock).mockResolvedValue(
    makePresign(456, [{ url: "u", key: "k" }])
  );
  (handleS3Upload as jest.Mock).mockResolvedValue(undefined);

  const { submit, invalidateSpy } = renderUseSubmitRecipe();
  const onSuccess = jest.fn();
  const onError = jest.fn();

  await act(async () => {
    submit({ formData: dummyForm }, { onSuccess, onError });
  });

  await waitFor(() => {
    expect(postRecipe).toHaveBeenCalledWith({
      recipe: { b: 1 },
      files: filesToUploadInfo,
    });
    expect(handleS3Upload).toHaveBeenCalledWith(
      [{ url: "u", key: "k" }],
      [fileObj]
    );
    expect(__finalizeMock.mutate).toHaveBeenCalledWith(456);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["recipes"] });

    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});

it("신규 레시피 생성 시, S3 업로드가 실패하면 게시 완료 및 캐시 무효화를 중단하고 에러를 반환한다.", async () => {
  const filesToUploadInfo = [{ key: "k" }];
  const fileObj = new File(["x"], "a.png");

  (prepareRecipeData as jest.Mock).mockReturnValue({
    recipeData: { c: 1 },
    filesToUploadInfo,
    fileObjects: [fileObj],
  });
  (postRecipe as jest.Mock).mockResolvedValue(
    makePresign(789, [{ url: "u", key: "k" }])
  );
  (handleS3Upload as jest.Mock).mockRejectedValue(new Error("upload fail"));

  const { submit, invalidateSpy } = renderUseSubmitRecipe();
  const onSuccess = jest.fn();
  const onError = jest.fn();

  await act(async () => {
    submit({ formData: dummyForm }, { onSuccess, onError });
  });

  await waitFor(() => {
    expect(postRecipe).toHaveBeenCalledTimes(1);
    expect(handleS3Upload).toHaveBeenCalledTimes(1);

    expect(__finalizeMock.mutate).not.toHaveBeenCalled();
    expect(invalidateSpy).not.toHaveBeenCalled();

    expect(onError).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

it("기존 레시피 수정 시, 첨부 파일이 없으면 서버 데이터만 수정하고 게시를 완료한다.", async () => {
  (prepareRecipeData as jest.Mock).mockReturnValue({
    recipeData: { d: 1 },
    filesToUploadInfo: [],
    fileObjects: [],
  });
  (editRecipe as jest.Mock).mockResolvedValue(makePresign(321, []));
  (handleS3Upload as jest.Mock).mockResolvedValue(undefined);

  const { submit, invalidateSpy } = renderUseSubmitRecipe();
  const onSuccess = jest.fn();
  const onError = jest.fn();

  await act(async () => {
    submit({ formData: dummyForm, recipeId: "321" }, { onSuccess, onError });
  });

  await waitFor(() => {
    expect(editRecipe).toHaveBeenCalledWith({
      recipe: { d: 1 },
      files: [],
      recipeId: "321",
    });
    expect(postRecipe).not.toHaveBeenCalled();
    expect(handleS3Upload).not.toHaveBeenCalled();

    expect(__finalizeMock.mutate).toHaveBeenCalledWith(321);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["recipes"] });

    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});

it("Presigned URL 요청이 실패하면, S3 업로드 단계를 진행하지 않고 즉시 에러를 반환한다.", async () => {
  (prepareRecipeData as jest.Mock).mockReturnValue({
    recipeData: { e: 1 },
    filesToUploadInfo: [],
    fileObjects: [],
  });
  (postRecipe as jest.Mock).mockRejectedValue(new Error("presign fail"));

  const { submit, invalidateSpy } = renderUseSubmitRecipe();
  const onSuccess = jest.fn();
  const onError = jest.fn();

  await act(async () => {
    submit({ formData: dummyForm }, { onSuccess, onError });
  });

  await waitFor(() => {
    expect(postRecipe).toHaveBeenCalledTimes(1);
    expect(handleS3Upload).not.toHaveBeenCalled();
    expect(__finalizeMock.mutate).not.toHaveBeenCalled();
    expect(invalidateSpy).not.toHaveBeenCalled();

    expect(onError).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

it("첨부 파일이 있음에도 서버가 Presigned URL 목록을 비워서 응답하면, 에러를 반환한다.", async () => {
  (prepareRecipeData as jest.Mock).mockReturnValue({
    recipeData: { x: 1 },
    filesToUploadInfo: [{ key: "k" }],
    fileObjects: [new File(["x"], "a.png")],
  });
  (postRecipe as jest.Mock).mockResolvedValue(makePresign(999, []));

  const { submit, invalidateSpy } = renderUseSubmitRecipe();
  const onSuccess = jest.fn();
  const onError = jest.fn();

  await act(async () => {
    submit({ formData: dummyForm }, { onSuccess, onError });
  });

  await waitFor(() => {
    expect(handleS3Upload).not.toHaveBeenCalled();

    expect(onError).toHaveBeenCalled();
    expect(__finalizeMock.mutate).not.toHaveBeenCalled();
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
