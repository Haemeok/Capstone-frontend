import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { ApiError } from "@/shared/api/errors";

jest.mock("@/features/comment-create/model/api", () => ({
  postComment: jest.fn(),
}));
jest.mock("@/features/comment-create/model/useCommentImageUpload", () => ({
  uploadCommentImages: jest.fn(),
  NOT_READY_RETRY_COUNT: 3,
  NOT_READY_RETRY_DELAY_MS: 1,
}));
jest.mock("@/shared/config/cache", () => ({
  invalidateCache: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: () => ({ addToast: jest.fn() }),
}));

import { postComment } from "@/features/comment-create/model/api";
import { uploadCommentImages } from "@/features/comment-create/model/useCommentImageUpload";

import useCreateCommentMutation from "../hooks";

const postMock = postComment as jest.Mock;
const uploadMock = uploadCommentImages as jest.Mock;

const wrapper = ({ children }: React.PropsWithChildren) => {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

const makeApi409NotReady = () =>
  new ApiError(409, "Conflict", { code: 308, message: "not ready" });

beforeEach(() => {
  postMock.mockReset();
  uploadMock.mockReset();
});

describe("useCreateCommentMutation", () => {
  it("uploads file then posts comment with imageKeys", async () => {
    uploadMock.mockResolvedValue(["k1"]);
    postMock.mockResolvedValue({ id: "c1" });

    const { result } = renderHook(() => useCreateCommentMutation("r1"), {
      wrapper,
    });
    const file = new File([new Uint8Array(1)], "a.jpg", { type: "image/jpeg" });

    await act(async () => {
      result.current.createComment({ recipeId: "r1", comment: "hi", file });
    });

    await waitFor(() => expect(postMock).toHaveBeenCalled());
    expect(uploadMock).toHaveBeenCalledWith("r1", [file]);
    expect(postMock).toHaveBeenCalledWith({
      recipeId: "r1",
      comment: "hi",
      imageKeys: ["k1"],
    });
  });

  it("retries postComment on 409 COMMENT_IMAGE_NOT_READY up to NOT_READY_RETRY_COUNT", async () => {
    uploadMock.mockResolvedValue(["k1"]);
    postMock
      .mockRejectedValueOnce(makeApi409NotReady())
      .mockRejectedValueOnce(makeApi409NotReady())
      .mockResolvedValueOnce({ id: "c1" });

    const { result } = renderHook(() => useCreateCommentMutation("r1"), {
      wrapper,
    });
    const file = new File([new Uint8Array(1)], "a.jpg", { type: "image/jpeg" });

    await act(async () => {
      result.current.createComment({ recipeId: "r1", comment: "hi", file });
    });

    await waitFor(() => expect(postMock).toHaveBeenCalledTimes(3));
    expect(uploadMock).toHaveBeenCalledTimes(1);
  });

  it("does not retry on non-409 errors", async () => {
    uploadMock.mockResolvedValue(["k1"]);
    postMock.mockRejectedValue(
      new ApiError(403, "Forbidden", { code: 307, message: "forbidden" })
    );

    const { result } = renderHook(() => useCreateCommentMutation("r1"), {
      wrapper,
    });
    const file = new File([new Uint8Array(1)], "a.jpg", { type: "image/jpeg" });

    await act(async () => {
      result.current.createComment({ recipeId: "r1", comment: "hi", file });
    });

    await waitFor(() => expect(postMock).toHaveBeenCalledTimes(1));
  });

  it("skips upload when no file provided", async () => {
    postMock.mockResolvedValue({ id: "c1" });

    const { result } = renderHook(() => useCreateCommentMutation("r1"), {
      wrapper,
    });

    await act(async () => {
      result.current.createComment({ recipeId: "r1", comment: "hi" });
    });

    await waitFor(() => expect(postMock).toHaveBeenCalled());
    expect(uploadMock).not.toHaveBeenCalled();
    expect(postMock).toHaveBeenCalledWith({
      recipeId: "r1",
      comment: "hi",
      imageKeys: undefined,
    });
  });
});
