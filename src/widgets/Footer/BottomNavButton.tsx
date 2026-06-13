"use client";

import { usePathname } from "next/navigation";

import { LocalizedLink, stripLocale } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

type BottomNavButtonProps = {
  icon: React.ReactNode;
  label: string;
  path: string;
  onClick?: (e: React.MouseEvent) => void;
};

const BottomNavButton = ({
  icon,
  label,
  path,
  onClick,
}: BottomNavButtonProps) => {
  const { barePath } = stripLocale(usePathname());
  const isActive = path === "/" ? barePath === "/" : barePath.startsWith(path);

  return (
    <LocalizedLink
      href={path}
      onClick={(e) => {
        triggerHaptic("Light");
        onClick?.(e);
      }}
      className={`flex cursor-pointer flex-col items-center ${
        isActive ? "text-olive-light" : "text-gray-400"
      }`}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </LocalizedLink>
  );
};

export default BottomNavButton;
