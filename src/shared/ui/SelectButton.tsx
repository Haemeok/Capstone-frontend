import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        'flex cursor-pointer items-center gap-1.5 rounded-full transition-all duration-100 hover:border-green-700',
        isSelected
          ? 'bg-olive-mint border-olive-mint hover:bg-olive-mint hover:border-olive-mint text-white hover:text-white'
          : 'border-gray-300',
        className,
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default SelectButton;
