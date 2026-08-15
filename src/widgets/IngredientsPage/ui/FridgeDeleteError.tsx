"use client";

import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";

export const FridgeDeleteError = ({ isVisible }: { isVisible: boolean }) => {
  const t = useIngredientsDict().deleteDialog;

  if (!isVisible) return null;

  return (
    <p
      role="alert"
      className="text-ink-sub mx-5 rounded-xl bg-gray-100 px-4 py-3 text-sm md:mx-6"
    >
      {t.error}
    </p>
  );
};
