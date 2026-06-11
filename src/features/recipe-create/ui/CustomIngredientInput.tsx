"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";

type CustomIngredientInputProps = {
  onAdd: (name: string) => boolean;
};

const CustomIngredientInput = ({ onAdd }: CustomIngredientInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = () => {
    const added = onAdd(name);
    if (added) setName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className="text-olive-medium hover:bg-olive-light/15 mt-2 flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg py-2 text-sm transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Pencil size={14} />
        <span>직접 입력</span>
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
        aria-label="재료명 직접 입력"
        placeholder="재료명을 입력하세요"
        autoFocus
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleAdd}
        className="bg-olive-light rounded-lg px-4 py-2 text-sm font-medium text-white"
      >
        추가
      </button>
    </div>
  );
};

export default CustomIngredientInput;
