"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomNavButtonProps = {
  icon: React.ReactNode;
  label: string;
  path: string;
  onClick?: (e: React.MouseEvent) => void;
};

const BottomNavButton = ({ icon, label, path, onClick }: BottomNavButtonProps) => {
  const currentPath = usePathname();
  const isActive = currentPath === path;

  return (
    <Link
      href={path}
      onClick={onClick}
      className={`flex cursor-pointer flex-col items-center ${
        isActive ? "text-olive-light" : "text-gray-400"
      }`}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </Link>
  );
};

export default BottomNavButton;
