import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";

import { format } from "@/shared/i18n";
import { commentsMessages } from "@/shared/i18n/commentsMessages";

import { useDeleteCommentMutation } from "../hooks";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/shared/config/cache", () => ({
  invalidateCache: jest.fn().mockResolvedValue(undefined),
}));

const addToast = jest.fn(() => "toast-id");
const removeToast = jest.fn();
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: () => ({ addToast, removeToast }),
}));

const deleteCommentApi = jest.fn();
jest.mock("../api", () => ({
  deleteComment: (...a: unknown[]) => deleteCommentApi(...a),
}));

const wrapper = ({ children }: { children: ReactNode }) => {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};
const flush = () => new Promise((r) => setTimeout(r, 0));

describe("useDeleteCommentMutation i18n (T-31)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("ja 진행/성공 토스트가 ja 사전값", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments");
    const t = commentsMessages.ja;
    deleteCommentApi.mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteCommentMutation("c1", "r1"), {
      wrapper,
    });
    result.current.mutate();
    await flush();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: t.deleting })
    );
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: t.deleteSuccess })
    );
  });

  it("ja 실패 토스트가 ja deleteError + 사유", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments");
    const t = commentsMessages.ja;
    deleteCommentApi.mockRejectedValue(new Error("network"));
    const { result } = renderHook(() => useDeleteCommentMutation("c1", "r1"), {
      wrapper,
    });
    result.current.mutate();
    await flush();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: format(t.deleteError, { message: "network" }),
      })
    );
  });
});
