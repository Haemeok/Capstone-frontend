"use client";

import { useState } from "react";

import { Pencil, X } from "lucide-react";

import { useRecipeFormDict } from "@/shared/i18n";

type CustomIngredientInputProps = {
  onAdd: (name: string) => boolean;
};

const CustomIngredientInput = ({ onAdd }: CustomIngredientInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const { ui } = useRecipeFormDict();

  const close = () => {
    setIsOpen(false);
    setName("");
  };

  const handleAdd = () => {
    const added = onAdd(name);
    if (added) setName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") {
      close();
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-ink-muted active:text-ink-sub mt-2 flex w-full cursor-pointer items-center justify-center gap-1 py-1.5 text-sm transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" />
        {ui.customIngredientTrigger}
      </button>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={ui.customIngredientInputLabel}
        placeholder={ui.customIngredientPlaceholder}
        autoFocus
        className="text-ink placeholder:text-ink-disabled focus:border-olive-light focus:ring-olive-light h-12 flex-1 rounded-xl border border-gray-200 px-4 text-base focus:ring-1 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleAdd}
        className="bg-olive-light active:bg-olive-dark h-12 shrink-0 cursor-pointer rounded-xl px-5 text-sm font-semibold text-white transition-colors"
      >
        {ui.add}
      </button>
      <button
        type="button"
        onClick={close}
        aria-label={ui.customIngredientCloseLabel}
        className="text-ink-muted flex h-12 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors active:bg-gray-100"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CustomIngredientInput;
