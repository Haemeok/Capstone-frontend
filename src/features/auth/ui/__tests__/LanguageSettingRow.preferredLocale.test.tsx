// eslint-disable-next-line local/no-raw-router -- 테스트: next/navigation 모킹용 import
import { usePathname, useRouter } from "next/navigation";

import { fireEvent, render, screen } from "@testing-library/react";

import { useUserStore } from "@/entities/user/model/store";
import { updatePreferredLocale } from "@/entities/user/model/updatePreferredLocale";

import { LanguageSettingRow } from "../LanguageSettingRow";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock("@/entities/user/model/updatePreferredLocale", () => ({
  updatePreferredLocale: jest.fn(),
}));

const putMock = updatePreferredLocale as jest.Mock;
const push = jest.fn();

const setAuthenticated = (value: boolean) =>
  useUserStore.setState({ isAuthenticated: value });

beforeEach(() => {
  push.mockClear();
  putMock.mockReset().mockResolvedValue(undefined);
  localStorage.clear();
  (useRouter as jest.Mock).mockReturnValue({ push });
  (usePathname as jest.Mock).mockReturnValue("/recipes/1");
  setAuthenticated(false);
});

describe("LanguageSettingRow preferred-locale", () => {
  it("T-301: 로그인 유저가 English 선택 → PUT 1회", () => {
    setAuthenticated(true);
    render(<LanguageSettingRow />);
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(putMock).toHaveBeenCalledTimes(1);
    expect(putMock).toHaveBeenCalledWith("en");
  });

  it("T-302: 비로그인 유저 선택 → PUT 미발생, 네비게이션은 정상", () => {
    setAuthenticated(false);
    render(<LanguageSettingRow />);
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(putMock).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/en/recipes/1");
  });

  it("T-303: PUT 실패해도 throw 없이 전환 완료", () => {
    setAuthenticated(true);
    putMock.mockRejectedValue(new Error("network"));
    render(<LanguageSettingRow />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "English" }))
    ).not.toThrow();
    expect(push).toHaveBeenCalledWith("/en/recipes/1");
  });
});
