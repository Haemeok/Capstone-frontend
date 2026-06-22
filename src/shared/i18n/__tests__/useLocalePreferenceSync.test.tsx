import { renderHook } from "@testing-library/react";

const replace = jest.fn();
const usePathnameMock = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
  useRouter: () => ({ replace }),
}));

import {
  getLocaleCookie,
  LOCALE_COOKIE,
  setLocaleCookie,
} from "../localeCookie";
import { useLocalePreferenceSync } from "../useLocalePreferenceSync";

const clearCookie = () => {
  document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`;
};

describe("useLocalePreferenceSync", () => {
  beforeEach(() => {
    replace.mockClear();
    localStorage.clear();
    clearCookie();
    usePathnameMock.mockReturnValue("/");
  });

  it("T-18: 쿠키 없음 + localStorage=ko → 쿠키=ko 시드", () => {
    localStorage.setItem("preferred_locale", "ko");
    usePathnameMock.mockReturnValue("/");
    renderHook(() => useLocalePreferenceSync(null));
    expect(getLocaleCookie()).toBe("ko");
  });

  it("T-19: 쿠키·localStorage 없음 + account=ja → 쿠키·localStorage=ja", () => {
    usePathnameMock.mockReturnValue("/ja");
    renderHook(() => useLocalePreferenceSync("ja"));
    expect(getLocaleCookie()).toBe("ja");
    expect(localStorage.getItem("preferred_locale")).toBe("ja");
  });

  it("T-20: resolved=ko, pathname=/en/x → replace('/x') 1회", () => {
    setLocaleCookie("ko");
    usePathnameMock.mockReturnValue("/en/x");
    renderHook(() => useLocalePreferenceSync(null));
    expect(replace).toHaveBeenCalledWith("/x");
  });

  it("T-21: resolved==경로 locale → 이동 없음", () => {
    setLocaleCookie("ko");
    usePathnameMock.mockReturnValue("/x");
    renderHook(() => useLocalePreferenceSync(null));
    expect(replace).not.toHaveBeenCalled();
  });
});
