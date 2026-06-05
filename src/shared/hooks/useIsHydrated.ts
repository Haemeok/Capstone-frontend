"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export const useIsHydrated = (): boolean =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
