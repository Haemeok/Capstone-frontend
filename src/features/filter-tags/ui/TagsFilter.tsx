"use client";

import { useState } from "react";

import {
  BASE_DRAWER_CONFIGS,
  TAG_DEFINITIONS,
} from "@/shared/config/constants/recipe";
import FilterChip from "@/shared/ui/FilterChip";
import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";

import { useTagsFilter } from "../model";

export const TagsFilter = () => {
  const [tags, setTags] = useTagsFilter();
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (value: string | string[]) => {
    setTags(value as string[]);
  };

  return (
    <CategoryPicker
      trigger={
        <FilterChip
          header={tags.length > 0 ? tags.join(", ") : "태그"}
          isDirty={tags.length > 0}
        />
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      isMultiple={true}
      setValue={handleValueChange}
      initialValue={tags}
      availableValues={TAG_DEFINITIONS.map((tag) => `${tag.emoji} ${tag.name}`)}
      header={BASE_DRAWER_CONFIGS.tags.header}
      description={BASE_DRAWER_CONFIGS.tags.description}
    />
  );
};
