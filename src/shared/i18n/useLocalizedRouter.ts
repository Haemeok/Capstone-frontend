"use client";

import { useRouter } from "next/navigation";

import { localizedHref } from "./localizedHref";
import { useChromeLocale } from "./useChromeDict";

export const useLocalizedRouter = () => {
  const router = useRouter();
  const locale = useChromeLocale();

  return {
    push: (href: string, options?: Parameters<typeof router.push>[1]) =>
      router.push(localizedHref(href, locale), options),
    replace: (href: string, options?: Parameters<typeof router.replace>[1]) =>
      router.replace(localizedHref(href, locale), options),
    prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) =>
      router.prefetch(localizedHref(href, locale), options),
    back: () => router.back(),
    forward: () => router.forward(),
    refresh: () => router.refresh(),
  };
};
