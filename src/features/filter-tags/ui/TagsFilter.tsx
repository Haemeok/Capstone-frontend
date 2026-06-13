"use client";

import { useState } from "react";

import {
  TAG_DEFINITIONS,
  TAGS_BY_NAME,
} from "@/shared/config/constants/recipe";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import FilterChip from "@/shared/ui/FilterChip";

import CategoryPicker from "@/widgets/CategoryPicker/CategoryPicker";

import { useTagsFilter } from "../model";

const toTagName = (value: string) => value.split(" ").slice(1).join(" ");

export const TagsFilter = () => {
  const [tags, setTags] = useTagsFilter();
  const [isOpen, setIsOpen] = useState(false);
  const { localize, dict } = useTaxonomy();

  const handleValueChange = (value: string | string[]) => {
    setTags(value as string[]);
  };

  const chipHeader =
    tags.length > 0
      ? tags
          .map((tag) => {
            const name = toTagName(tag);
            return TAGS_BY_NAME[name as keyof typeof TAGS_BY_NAME]
              ? localize(name, "tags")
              : localize(tag, "tags");
          })
          .join(", ")
      : dict.filters.tagsChipDefault;

  return (
    <CategoryPicker
      trigger={<FilterChip header={chipHeader} isDirty={tags.length > 0} />}
      open={isOpen}
      onOpenChange={setIsOpen}
      isMultiple={true}
      setValue={handleValueChange}
      initialValue={tags}
      availableValues={TAG_DEFINITIONS.map((tag) => `${tag.emoji} ${tag.name}`)}
      header={dict.filters.tagsHeader}
      description={dict.filters.tagsDescription}
    />
  );
};
