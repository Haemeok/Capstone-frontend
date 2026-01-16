"use client";

import { useFilterParam, tagsCodec } from "@/shared/lib/filters";
import { TAG_DEFINITIONS } from "@/shared/config/constants/recipe";

export const useTagsFilter = () => {
  return useFilterParam("tags", tagsCodec);
};

export const useTagCodes = () => {
  const [tags] = useTagsFilter();
  return tags.map((tag) => {
    const matched = TAG_DEFINITIONS.find(
      (def) => tag === `${def.emoji} ${def.name}` || tag === def.name
    );
    return matched ? matched.code : tag;
  });
};
