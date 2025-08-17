import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { TAG_DEFINITIONS } from "@/shared/config/constants/recipe";

import { RecipeFormValues } from "../model/config";

const TagSection = () => {
  const { control, setValue } = useFormContext<RecipeFormValues>();

  const tagNames = useWatch({ control, name: "tagNames" });

  const handleTagToggle = (tag: string) => {
    const newTags = tagNames.includes(tag)
      ? tagNames.filter((t) => t !== tag)
      : [...tagNames, tag];
    setValue("tagNames", newTags, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="mt-6 mb-4">
      <h2 className="mb-3 text-xl font-semibold text-gray-700">태그</h2>
      <div className="flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow-sm">
        {TAG_DEFINITIONS.map((tag) => {
          const tagName = `${tag.emoji} ${tag.name}`;
          return (
            <button
              key={tagName}
              type="button"
              onClick={() => handleTagToggle(tagName)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                tagNames?.includes(tagName)
                  ? "border-olive-mint"
                  : "border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
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
