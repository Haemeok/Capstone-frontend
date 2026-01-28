"use client";

import { useCallback,useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useRecentSearches } from "@/shared/hooks/useRecentSearches";
import { queryCodec } from "@/shared/lib/filters";

export const useSearchQuery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = queryCodec.decode(searchParams.get("q"));
  const { addSearch } = useRecentSearches();

  const [inputValue, setInputValue] = useState(q);

  const submitSearch = useCallback(
    (searchTerm: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      const encoded = queryCodec.encode(searchTerm);

      if (encoded) {
        newParams.set("q", encoded);
        // 최근 검색어에 저장
        addSearch(searchTerm.trim());
      } else {
        newParams.delete("q");
      }

      // types 파라미터가 없으면 기본값 설정
      if (!newParams.has("types")) {
        newParams.set("types", "USER,AI,YOUTUBE");
      }

      router.replace(`/search/results?${newParams.toString()}`);
    },
    [router, searchParams, addSearch]
  );

  return {
    q,
    inputValue,
    setInputValue,
    submitSearch,
  };
};
