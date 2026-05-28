"use client";

const DX_ID_STORAGE_KEY = "dx_id";
const DX_ID_PATTERN = /^[a-f0-9]{32}$/;

const generateDxIdHex = (): string => {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
};

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
