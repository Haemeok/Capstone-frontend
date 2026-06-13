"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { X } from "lucide-react";

import { format, useRecipeFormDict } from "@/shared/i18n";

import { RecipeFormValues } from "../model/config";

const CookingToolsInput = () => {
  const { control, setValue } = useFormContext<RecipeFormValues>();
  const { labels, ui } = useRecipeFormDict();
  const cookingToolsValue = useWatch({
    control,
    name: "cookingTools",
    defaultValue: [],
  });

  const [currentToolInput, setCurrentToolInput] = useState("");

  const handleToolInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      const toolName = currentToolInput.trim();
      if (toolName) {
        if (!cookingToolsValue.includes(toolName)) {
          setValue("cookingTools", [...cookingToolsValue, toolName], {
            shouldDirty: true,
          });
        }
        setCurrentToolInput("");
      }
    }
  };

  const removeCookingTool = (toolToRemove: string) => {
    const updatedTools = cookingToolsValue.filter(
      (tool) => tool !== toolToRemove
    );
    setValue("cookingTools", updatedTools, { shouldDirty: true });
  };

  return (
    <div className="mb-6">
      <h2 className="text-ink-sub text-xl font-bold">{labels.cookingTools}</h2>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        {cookingToolsValue.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {cookingToolsValue.map((tool) => (
              <div
                key={tool}
                className="text-ink-sub flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm"
              >
                <span>{tool}</span>
                <button
                  type="button"
                  onClick={() => removeCookingTool(tool)}
                  className="-mr-1 cursor-pointer rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-red-500"
                  aria-label={format(ui.cookingToolRemove, { name: tool })}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="text"
          id="cooking-tools-input"
          value={currentToolInput}
          onChange={(e) => setCurrentToolInput(e.target.value)}
          onKeyDown={handleToolInputKeyDown}
          aria-label={ui.cookingToolInputLabel}
          className="focus:border-olive-light focus:ring-olive-light w-full rounded border border-gray-300 p-2 focus:ring-1 focus:outline-none"
          placeholder={ui.cookingToolPlaceholder}
        />
      </div>
    </div>
  );
};

export default CookingToolsInput;
