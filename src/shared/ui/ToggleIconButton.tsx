import { cn } from "@/shared/lib/utils";

type ToggleIconButtonProps = {
  isActive?: boolean;
  onToggle?: (isActive: boolean) => void;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  activeClassName?: string;
  inactiveClassName?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
};

const ToggleIconButton = ({
  isActive,
  onToggle,
  activeIcon,
  icon,
  activeClassName = "",
  inactiveClassName = "",
  className = "",
  children,
  ...props
}: ToggleIconButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    onToggle?.(!isActive);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      className={cn(
        "flex cursor-pointer items-center justify-center gap-1",
        isActive ? activeClassName : inactiveClassName,
        className
      )}
      {...props}
    >
      {isActive ? activeIcon : icon}
      {children}
    </button>
  );
};

export default ToggleIconButton;
