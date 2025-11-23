import { useCallback, useEffect, useRef, useState } from "react";

type UseWakeLockReturn = {
  isActive: boolean;
  isSupported: boolean;
  toggle: () => Promise<void>;
};

export const useWakeLock = (): UseWakeLockReturn => {
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "wakeLock" in navigator) {
      setIsSupported(true);
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav = navigator as any;
      if (nav.wakeLock) {
        wakeLockRef.current = await nav.wakeLock.request("screen");
        setIsActive(true);
      }
    } catch (err) {
      console.error("Wake Lock request failed:", err);
      setIsActive(false);
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current && !wakeLockRef.current.released) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setIsActive(false);
      } catch (err) {
        console.error("Wake Lock release failed:", err);
      }
    }
  }, []);

  const toggle = useCallback(async () => {
    if (isActive) {
      await releaseWakeLock();
    } else {
      await requestWakeLock();
    }
  }, [isActive, releaseWakeLock, requestWakeLock]);

  useEffect(() => {
    if (!isSupported) return;

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        isActive &&
        wakeLockRef.current?.released
      ) {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSupported, isActive, requestWakeLock]);

  useEffect(() => {
    return () => {
      if (wakeLockRef.current && !wakeLockRef.current.released) {
        releaseWakeLock();
      }
    };
  }, [releaseWakeLock]);

  return {
    isActive,
    isSupported,
    toggle,
  };
};
