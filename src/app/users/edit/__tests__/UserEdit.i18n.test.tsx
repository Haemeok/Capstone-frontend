import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ApiError } from "@/shared/api/errors";
import { format } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import type { User } from "@/entities/user";
import { useUserStore } from "@/entities/user";

import { useToastStore } from "@/widgets/Toast";

const mockBack = jest.fn();
let mockPathname = "/users/edit";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ back: mockBack, push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

jest.mock("@/entities/user/model/api", () => ({
  putUserInfo: jest.fn(),
}));

import { putUserInfo } from "@/entities/user/model/api";

import UserEditPage from "../page";

const putUserInfoMock = putUserInfo as jest.Mock;

const ja = userPagesMessages.ja.profile.edit;
const ko = userPagesMessages.ko.profile.edit;

const HANGUL = /[가-힣]/;
const MAX_NICKNAME = 12;

const SEEDED_USER: User = {
  id: "user-1",
  nickname: "홍길동",
  introduction: "안녕하세요",
  profileImage: "",
  hasFirstRecord: false,
  remainingAiGenerationQuota: 0,
  remainingYoutubeExtractionCredits: 0,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
};

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <UserEditPage />
    </QueryClientProvider>
  );
};

const seedUser = (overrides: Partial<User> = {}) => {
  useUserStore.getState().setUser({ ...SEEDED_USER, ...overrides });
};

beforeEach(() => {
  mockPathname = "/users/edit";
  putUserInfoMock.mockReset();
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: false,
  });
  useToastStore.setState({ toastList: [] });
});

describe("UserEdit i18n (T-16~21)", () => {
  it("T-16: /ja 렌더 시 헤더·라벨·placeholder가 ja 값이고 한글이 없다", () => {
    mockPathname = "/ja/users/edit";
    seedUser({ nickname: "ascii", introduction: "ascii intro" });
    const { container } = renderPage();

    expect(screen.getByText(ja.heading)).toBeInTheDocument();
    expect(screen.getByText(ja.nameLabel)).toBeInTheDocument();
    expect(screen.getByText(ja.introLabel)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(ja.introPlaceholder)
    ).toBeInTheDocument();

    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-17: /ja 닉네임 검증 메시지가 ja 값이다", async () => {
    mockPathname = "/ja/users/edit";
    seedUser({ nickname: "x" });
    renderPage();

    const nickname = screen.getByLabelText(ja.nameLabel);

    fireEvent.change(nickname, { target: { value: "" } });
    await waitFor(() => {
      expect(screen.getByText(ja.nicknameRequired)).toBeInTheDocument();
    });

    const tooLong = "a".repeat(MAX_NICKNAME + 1);
    fireEvent.change(nickname, { target: { value: tooLong } });
    await waitFor(() => {
      expect(
        screen.getByText(format(ja.nicknameTooLong, { max: MAX_NICKNAME }))
      ).toBeInTheDocument();
    });
  });

  it("T-18: /ja gif 업로드 시 imageFormatError(ja)를 보여준다", async () => {
    mockPathname = "/ja/users/edit";
    seedUser();
    const { container } = renderPage();

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const gif = new File(["x"], "x.gif", { type: "image/gif" });

    fireEvent.change(fileInput, { target: { files: [gif] } });

    await waitFor(() => {
      expect(screen.getByText(ja.imageFormatError)).toBeInTheDocument();
    });
  });

  it("T-19: /ja mutation 실패 시 updateError(ja) toast, code 102면 닉네임 필드 에러", async () => {
    mockPathname = "/ja/users/edit";
    seedUser({ nickname: "old" });
    renderPage();

    const nickname = screen.getByLabelText(ja.nameLabel) as HTMLInputElement;
    const submit = screen.getByText(ja.submit);

    putUserInfoMock.mockRejectedValueOnce(
      new ApiError(500, "Server Error", { code: 999, message: "boom" })
    );
    fireEvent.change(nickname, { target: { value: "newname" } });
    await waitFor(() => expect(nickname.value).toBe("newname"));
    fireEvent.click(submit);

    await waitFor(() => {
      expect(useToastStore.getState().toastList).toContainEqual(
        expect.objectContaining({ message: ja.updateError, variant: "error" })
      );
    });

    putUserInfoMock.mockRejectedValueOnce(
      new ApiError(409, "Conflict", {
        code: 102,
        message: "duplicate-nickname-ja",
      })
    );
    fireEvent.change(nickname, { target: { value: "another" } });
    await waitFor(() => expect(nickname.value).toBe("another"));
    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText("duplicate-nickname-ja")).toBeInTheDocument();
    });
  });

  it("T-20: 시드된 닉네임은 번역 없이 그대로 입력값으로 보인다", () => {
    mockPathname = "/ja/users/edit";
    seedUser({ nickname: "홍길동" });
    renderPage();

    const nickname = screen.getByLabelText(ja.nameLabel) as HTMLInputElement;
    expect(nickname.value).toBe("홍길동");
  });

  it("T-21: ko(/users/edit) 렌더 시 헤더가 한글 그대로다", () => {
    mockPathname = "/users/edit";
    seedUser();
    renderPage();

    expect(screen.getByText(ko.heading)).toBeInTheDocument();
    expect(screen.getByText(ko.nameLabel)).toBeInTheDocument();
  });
});
