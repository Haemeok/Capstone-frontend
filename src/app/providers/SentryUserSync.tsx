"use client";

import { useEffect } from "react";

import { useUserStore } from "@/entities/user/model/store";
import { scheduleInit, setUser } from "@/shared/lib/sentry";

export const SentryUserSync = () => {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    scheduleInit();
  }, []);

  useEffect(() => {
    if (user?.id) {
      setUser({ id: String(user.id) });
    } else {
      setUser(null);
    }
  }, [user?.id]);

  return null;
};
