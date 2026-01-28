"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Codec<T> = {
  encode: (value: T) => string | null;
  decode: (code: string | null) => T;
};

export const useFilterParam = <T>(paramName: string, codec: Codec<T>) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = useMemo(
    () => codec.decode(searchParams.get(paramName)),
    [searchParams, paramName, codec]
  );

  const setValue = useCallback(
    (newValue: T) => {
      const newParams = new URLSearchParams(searchParams.toString());
      const encoded = codec.encode(newValue);

      if (encoded) {
        newParams.set(paramName, encoded);
      } else {
        newParams.delete(paramName);
      }

      router.replace(`/search/results?${newParams.toString()}`);
    },
    [router, searchParams, paramName, codec]
  );

  return [value, setValue] as const;
};
