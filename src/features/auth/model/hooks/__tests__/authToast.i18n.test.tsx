import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

const addToast = jest.fn();
let mockPathname = "/";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));
jest.mock("@/widgets/Toast", () => ({
  useToastStore: () => ({ addToast, removeToast: jest.fn() }),
}));
jest.mock("@/entities/user", () => ({
  useUserStore: Object.assign(() => ({ logoutAction: jest.fn() }), {
    setState: jest.fn(),
  }),
}));
jest.mock("@/shared/lib/bridge/authStateBridge", () => ({
  notifyAuthState: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/shared/lib/queryClient", () => ({
  queryClient: {
    invalidateQueries: jest.fn(),
    cancelQueries: jest.fn(),
    clear: jest.fn(),
  },
}));

const postLogout = jest.fn();
const deleteAccount = jest.fn();
jest.mock("../../api", () => ({
  postLogout: () => postLogout(),
  deleteAccount: () => deleteAccount(),
}));

import useLogoutMutation from "../useLogoutMutation";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe("auth toast i18n", () => {
  beforeEach(() => {
    addToast.mockClear();
    mockPathname = "/";
  });

  it("ja 로그아웃 진행 toast가 일본어다 (T-19)", async () => {
    mockPathname = "/ja";
    postLogout.mockResolvedValue(undefined);
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });
    result.current.mutate();
    await waitFor(() =>
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({ message: "ログアウト中..." })
      )
    );
  });

  it("ja 로그아웃 실패 toast에 한글이 없다 (T-24)", async () => {
    mockPathname = "/ja";
    postLogout.mockRejectedValue(new Error("토큰 만료"));
    const { result } = renderHook(() => useLogoutMutation(), { wrapper });
    result.current.mutate();
    await waitFor(() =>
      expect(addToast.mock.calls.some(([arg]) => arg.variant === "error")).toBe(
        true
      )
    );
    const errorCall = addToast.mock.calls.find(
      ([arg]) => arg.variant === "error"
    );
    expect(/[가-힣]/.test(errorCall?.[0].message ?? "")).toBe(false);
  });
});
