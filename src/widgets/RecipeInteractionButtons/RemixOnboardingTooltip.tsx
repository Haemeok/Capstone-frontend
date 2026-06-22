"use client";

import { useEffect, useState } from "react";

import { useRecipeActionsDict } from "@/shared/i18n";

const STORAGE_KEY = "recipe-remix-onboarded";
const AUTO_DISMISS_MS = 6000;

type Props = {
  children: React.ReactNode;
  show: boolean;
  onDismiss: () => void;
};

export const RemixOnboardingTooltip = ({
  children,
  show,
  onDismiss,
}: Props) => {
  const [open, setOpen] = useState(false);
  const t = useRecipeActionsDict();

  useEffect(() => {
    if (!show) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY) === "true") return;
    const raf = requestAnimationFrame(() => setOpen(true));
    const t = setTimeout(() => {
      setOpen(false);
      window.localStorage.setItem(STORAGE_KEY, "true");
      onDismiss();
    }, AUTO_DISMISS_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [show, onDismiss]);

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    onDismiss();
  };

  return (
    <div className="relative inline-flex">
      {children}
      {open && (
        <div
          role="status"
          className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white shadow-lg"
        >
          {t.remixOnboarding}
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.onboardingCloseAria}
            className="-mr-1 ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10"
          >
            ✕
          </button>
          <div
            aria-hidden
            className="absolute top-full left-1/2 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-gray-900"
          />
        </div>
      )}
    </div>
  );
};

export const markRemixOnboarded = () => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, "true");
  }
};
