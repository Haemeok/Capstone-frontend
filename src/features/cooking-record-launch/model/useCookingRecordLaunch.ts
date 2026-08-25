"use client";

import { useState, useSyncExternalStore } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { storage } from "@/shared/lib/storage";

const listeners = new Set<() => void>();

const getSnapshot = () =>
  storage.getBooleanItem(STORAGE_KEYS.COOKING_RECORD_LAUNCH_SEEN);

const getServerSnapshot = () => true;

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.COOKING_RECORD_LAUNCH_SEEN) {
      listener();
    }
  };

  listeners.add(listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
};

export const useCookingRecordLaunch = () => {
  const hasStoredSeen = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [hasSeenInSession, setHasSeenInSession] = useState(false);

  const dismiss = () => {
    storage.setBooleanItem(STORAGE_KEYS.COOKING_RECORD_LAUNCH_SEEN, true);
    setHasSeenInSession(true);
    emitChange();
  };

  return {
    isOpen: !hasStoredSeen && !hasSeenInSession,
    dismiss,
  };
};
