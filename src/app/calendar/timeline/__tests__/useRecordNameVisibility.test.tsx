import { act, renderHook } from "@testing-library/react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { useRecordNameVisibility } from "../_components/useRecordNameVisibility";

beforeEach(() => localStorage.clear());
afterEach(() => jest.restoreAllMocks());

test("이름 표시를 끄거나 켠 뒤 재진입해도 선택을 유지합니다", () => {
  const first = renderHook(useRecordNameVisibility);
  expect(first.result.current.isVisible).toBe(true);
  act(() => first.result.current.changeVisibility(false));
  first.unmount();

  const second = renderHook(useRecordNameVisibility);
  expect(second.result.current.isVisible).toBe(false);
  act(() => second.result.current.changeVisibility(true));
  second.unmount();

  expect(renderHook(useRecordNameVisibility).result.current.isVisible).toBe(
    true
  );
});

test("저장값이 손상됐으면 기본적으로 이름을 표시합니다", () => {
  localStorage.setItem(STORAGE_KEYS.COOKING_RECORD_NAMES_VISIBLE, "invalid");
  expect(renderHook(useRecordNameVisibility).result.current.isVisible).toBe(
    true
  );
});

test("저장소 접근이 차단돼도 현재 화면의 토글은 동작합니다", () => {
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  const { result } = renderHook(useRecordNameVisibility);
  act(() => result.current.changeVisibility(false));
  expect(result.current.isVisible).toBe(false);
});
