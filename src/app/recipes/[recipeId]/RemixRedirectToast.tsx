"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useLocalizedRouter } from "@/shared/i18n";
import { useRecipeFormDict } from "@/shared/i18n";
import { useToastStore } from "@/shared/ui/toast/model/store";

import { REMIX_REDIRECT_ERRORS } from "./lib/remixRedirectErrors";

export const RemixRedirectToast = () => {
  const searchParams = useSearchParams();
  const router = useLocalizedRouter();
  const pathname = usePathname();
  const { addToast } = useToastStore();
  const { ui } = useRecipeFormDict();

  useEffect(() => {
    const err = searchParams.get("error");

    if (err === REMIX_REDIRECT_ERRORS.NOT_CLONEABLE) {
      addToast({ message: ui.remixNotCloneable, variant: "error" });
      router.replace(pathname);
    } else if (err === REMIX_REDIRECT_ERRORS.ALREADY_CLONED) {
      addToast({ message: ui.remixAlreadyCloned, variant: "error" });
      router.replace(pathname);
    }
  }, [searchParams, router, pathname, addToast, ui]);

  return null;
};
