import { RecipeFormValues } from '@/type/recipe';
import { UseFormWatch } from 'react-hook-form';
import React, { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { X } from 'lucide-react';

type CookingToolsInputProps = {
  watch: UseFormWatch<RecipeFormValues>;
  setValue: UseFormSetValue<RecipeFormValues>;
};

const CookingToolsInput = ({ watch, setValue }: CookingToolsInputProps) => {
  const [currentToolInput, setCurrentToolInput] = useState('');

  const cookingToolsValue = watch('cookingTools') || [];

  const handleToolInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      const toolName = currentToolInput.trim();
      if (toolName) {
        const currentTools = watch('cookingTools') || [];

        if (!currentTools.includes(toolName)) {
          setValue('cookingTools', [...currentTools, toolName], {
            shouldDirty: true,
          });
        }
        setCurrentToolInput('');
      }
    }
  };

  const removeCookingTool = (toolToRemove: string) => {
    const currentTools = watch('cookingTools') || [];
    const updatedTools = currentTools.filter((tool) => tool !== toolToRemove);
    setValue('cookingTools', updatedTools, { shouldDirty: true });
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700">조리도구</h2>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap gap-2">
          {cookingToolsValue.map((tool) => (
            <div
              key={tool}
              className="flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              <span>{tool}</span>
              <button
                type="button"
                onClick={() => removeCookingTool(tool)}
                className="-mr-1 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-red-500"
                aria-label={`Remove ${tool}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={currentToolInput}
          onChange={(e) => setCurrentToolInput(e.target.value)}
          onKeyDown={handleToolInputKeyDown}
          className="focus:border-olive-light focus:ring-olive-light w-full rounded border border-gray-300 p-2 focus:ring-1 focus:outline-none"
          placeholder="조리도구 입력 후 스페이스바 (예: 냄비 프라이팬)"
        />
      </div>
    </div>
  );
};

export default CookingToolsInput;
