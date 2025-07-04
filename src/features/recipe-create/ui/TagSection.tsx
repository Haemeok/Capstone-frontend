import { RecipeFormValues } from "../model/types";
import { UseFormSetValue } from "react-hook-form";
import React from "react";
import { UseFormWatch } from "react-hook-form";
import { TAG_EMOJI, TAGS } from "@/shared/config/constants/recipe";
type TagSectionProps = {
  watch: UseFormWatch<RecipeFormValues>;
  setValue: UseFormSetValue<RecipeFormValues>;
  tagNames: string[];
};

const TagSection = ({ watch, setValue, tagNames }: TagSectionProps) => {
  const handleTagToggle = (tag: string) => {
    const currentTags = watch("tagNames") || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setValue("tagNames", newTags, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="mt-6 mb-4">
      <h2 className="mb-3 text-xl font-semibold text-gray-700">태그</h2>
      <div className="flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow-sm">
        {TAGS.map((tag) => {
          const tagName = `${TAG_EMOJI[tag as keyof typeof TAG_EMOJI]} ${tag}`;
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
