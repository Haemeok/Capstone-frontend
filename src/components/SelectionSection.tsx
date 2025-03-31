import { ReactNode } from "react";
import SelectButton from "@/components/SelectButton";

type SelectionSectionProps = {
  title: string;
  icon: ReactNode;
  items: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
  className?: string;
};

const SelectionSection = ({
  title,
  icon,
  items,
  selectedItems,
  onToggle,
  className = "",
}: SelectionSectionProps) => {
  return (
    <div className={`border-b pb-5 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-green-600">{icon}</span>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <SelectButton
            key={item}
            label={item}
            isSelected={selectedItems.includes(item)}
            onClick={() => onToggle(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectionSection;
