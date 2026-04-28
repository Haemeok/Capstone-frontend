"use client";

import { useEffect } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useToastStore } from "@/widgets/Toast/model/store";

export const RemixRedirectToast = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { addToast } = useToastStore();

  useEffect(() => {
    const err = searchParams.get("error");

    if (err === "not-cloneable") {
      addToast({ message: "이 레시피는 편집할 수 없어요", variant: "error" });
      router.replace(pathname);
    } else if (err === "already-cloned") {
      addToast({ message: "이미 편집한 레시피예요", variant: "error" });
      router.replace(pathname);
    }
  }, [searchParams, router, pathname, addToast]);

  return null;
};
