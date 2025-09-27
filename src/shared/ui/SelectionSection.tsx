import { ReactNode } from "react";

import SelectButton from "@/shared/ui/SelectButton";

type SelectionSectionProps = {
  title: string;
  icon: ReactNode;
  items: string[];
  selectedItems: string | string[];
  onToggle: (item: string) => void;
  className?: string;
  isSingleSelect?: boolean;
};

const SelectionSection = ({
  title,
  icon,
  items,
  selectedItems,
  onToggle,
  className = "",
  isSingleSelect = false,
}: SelectionSectionProps) => {
  return (
    <div className={`border-b pb-5 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-olive-mint">{icon}</span>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <SelectButton
            key={item}
            label={item}
            isSelected={
              isSingleSelect
                ? selectedItems === item
                : Array.isArray(selectedItems) && selectedItems.includes(item)
            }
            onClick={() => onToggle(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectionSection;
