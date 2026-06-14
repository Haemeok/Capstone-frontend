"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { TAG_DEFINITIONS } from "@/shared/config/constants/recipe";
import { useRecipeFormDict } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";

import { cn } from "@/lib/utils";

import { RecipeFormValues } from "../model/config";

const TagSection = () => {
  const { control, setValue } = useFormContext<RecipeFormValues>();
  const { labels } = useRecipeFormDict();
  const { localize } = useTaxonomy();

  const tags = useWatch({ control, name: "tags", defaultValue: [] }) || [];

  const handleTagToggle = (tag: string) => {
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setValue("tags", newTags, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="mt-6 mb-4">
      <h2 className="text-ink-sub text-xl font-bold">{labels.tags}</h2>
      <div className="flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow-sm">
        {TAG_DEFINITIONS.map((tag) => {
          const tagName = `${tag.emoji} ${tag.name}`;
          const tagLabel = `${tag.emoji} ${localize(tag.name, "tags")}`;
          return (
            <button
              key={tagName}
              type="button"
              onClick={() => handleTagToggle(tagName)}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors",
                tags?.includes(tagName)
                  ? "bg-olive-light text-white"
                  : "text-ink-sub border-gray-300 bg-gray-50 hover:bg-gray-100"
              )}
            >
              {tagLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagSection;
