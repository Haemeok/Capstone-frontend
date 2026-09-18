"use client";

import { useSyncExternalStore } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

const VISIBILITY_CHANGED = "cooking-record-name-visibility-changed";
let fallbackVisibility = true;

const getVisibility = () => {
  try {
    return (
      localStorage.getItem(STORAGE_KEYS.COOKING_RECORD_NAMES_VISIBLE) !==
      "false"
    );
  } catch {
    return fallbackVisibility;
  }
};

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(VISIBILITY_CHANGED, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(VISIBILITY_CHANGED, onChange);
  };
};

const changeVisibility = (visible: boolean) => {
  fallbackVisibility = visible;
  try {
    localStorage.setItem(
      STORAGE_KEYS.COOKING_RECORD_NAMES_VISIBLE,
      String(visible)
    );
  } catch {
    return;
  } finally {
    window.dispatchEvent(new Event(VISIBILITY_CHANGED));
  }
};

export const useRecordNameVisibility = () => {
  const isVisible = useSyncExternalStore(subscribe, getVisibility, () => true);
  return { isVisible, changeVisibility };
};
