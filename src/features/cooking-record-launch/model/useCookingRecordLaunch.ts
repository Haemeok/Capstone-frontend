"use client";

import { useState, useSyncExternalStore } from "react";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";
import { storage } from "@/shared/lib/storage";

const listeners = new Set<() => void>();
const readyListeners = new Set<() => void>();
const LAUNCH_OPEN_DELAY_MS = 750;
const LAUNCH_IDLE_TIMEOUT_MS = 1500;
let isClientReady = false;
let isReadyScheduled = false;

const getSnapshot = () =>
  storage.getBooleanItem(STORAGE_KEYS.COOKING_RECORD_LAUNCH_SEEN);

const getServerSnapshot = () => true;
const getReadySnapshot = () => isClientReady;
const getServerReadySnapshot = () => false;

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

const subscribeReady = (listener: () => void) => {
  readyListeners.add(listener);

  if (!isClientReady && !isReadyScheduled) {
    isReadyScheduled = true;
    const markReady = () => {
      isClientReady = true;
      readyListeners.forEach((readyListener) => readyListener());
    };
    const scheduleWhenIdle = () => {
      window.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(markReady, {
            timeout: LAUNCH_IDLE_TIMEOUT_MS,
          });
          return;
        }

        requestAnimationFrame(markReady);
      }, LAUNCH_OPEN_DELAY_MS);
    };

    if (document.readyState === "complete") {
      scheduleWhenIdle();
    } else {
      window.addEventListener("load", scheduleWhenIdle, { once: true });
    }
  }

  return () => {
    readyListeners.delete(listener);
  };
};

export const useCookingRecordLaunch = () => {
  const isReady = useSyncExternalStore(
    subscribeReady,
    getReadySnapshot,
    getServerReadySnapshot
  );
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
    isOpen: isReady && !hasStoredSeen && !hasSeenInSession,
    dismiss,
  };
};
