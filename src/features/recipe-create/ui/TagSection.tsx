import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { TAG_DEFINITIONS } from "@/shared/config/constants/recipe";

import { RecipeFormValues } from "../model/config";
import { cn } from "@/lib/utils";

const TagSection = () => {
  const { control, setValue } = useFormContext<RecipeFormValues>();

  const tags = useWatch({ control, name: "tags", defaultValue: [] }) || [];

  const handleTagToggle = (tag: string) => {
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setValue("tags", newTags, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="mt-6 mb-4">
      <h2 className="text-xl font-bold text-gray-700">태그</h2>
      <div className="flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow-sm">
        {TAG_DEFINITIONS.map((tag) => {
          const tagName = `${tag.emoji} ${tag.name}`;
          return (
            <button
              key={tagName}
              type="button"
              onClick={() => handleTagToggle(tagName)}
              className={cn(
                "rounded-full border px-3 py-1 cursor-pointer text-sm transition-colors",
                tags?.includes(tagName)
                  ? "bg-olive-light text-white"
                  : "border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              {tagName}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagSection;
