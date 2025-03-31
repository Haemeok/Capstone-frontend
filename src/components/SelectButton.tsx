import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

type SelectButtonProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
};

const SelectButton = ({
  label,
  isSelected,
  onClick,
  className,
}: SelectButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "rounded-full flex items-center gap-1.5 cursor-pointer hover:border-green-700 transition-all duration-250",
        isSelected
          ? "bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 hover:text-white"
          : "border-gray-300",
        className
      )}
      onClick={onClick}
    >
      {isSelected ? (
        <span className="flex items-center justify-center w-4 h-4 relative">
          <Check size={16} className="text-white absolute" />
        </span>
      ) : (
        <Plus size={14} />
      )}
      {label}
    </Button>
  );
};

export default SelectButton;
