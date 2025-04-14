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
        "rounded-full flex items-center gap-1.5 cursor-pointer hover:border-green-700 transition-all duration-100",
        isSelected
          ? "bg-olive-light text-white border-olive-light hover:bg-olive-light hover:border-olive-light hover:text-white"
          : "border-gray-300",
        className
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default SelectButton;
