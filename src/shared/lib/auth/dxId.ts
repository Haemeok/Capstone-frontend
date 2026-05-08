"use client";

const DX_ID_STORAGE_KEY = "dx_id";
const DX_ID_PATTERN = /^[a-f0-9]{32}$/;

const generateDxIdHex = (): string => {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
};

// LocalStorage-backed device id. Cookie jar과 분리되어 있어 clearAllCookies에
// 영향받지 않는다. 진짜 토큰 손실 사고에서도 보존 가능성이 높아 사고 전후의
// phase 시퀀스를 같은 dxId로 묶을 수 있다.
export const getDxId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(DX_ID_STORAGE_KEY);
    if (existing && DX_ID_PATTERN.test(existing)) return existing;
    const newId = generateDxIdHex();
    window.localStorage.setItem(DX_ID_STORAGE_KEY, newId);
    return newId;
  } catch {
    // localStorage 접근 차단 환경 (private mode 등): 일관성 포기하고 매번 새로.
    return generateDxIdHex();
  }
};
