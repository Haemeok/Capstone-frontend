"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { queryCodec } from "@/shared/lib/filters";

export const useSearchQuery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = queryCodec.decode(searchParams.get("q"));

  const [inputValue, setInputValue] = useState(q);

  const submitSearch = useCallback(
    (searchTerm: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      const encoded = queryCodec.encode(searchTerm);

      if (encoded) {
        newParams.set("q", encoded);
      } else {
        newParams.delete("q");
      }

      router.replace(`/search?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  return {
    q,
    inputValue,
    setInputValue,
    submitSearch,
  };
};
