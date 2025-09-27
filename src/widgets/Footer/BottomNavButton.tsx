"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomNavButtonProps = {
  icon: React.ReactNode;
  label: string;
  path: string;
};

const BottomNavButton = ({ icon, label, path }: BottomNavButtonProps) => {
  const currentPath = usePathname();
  const isActive = currentPath === path;

  return (
    <Link
      href={path}
      className={`flex cursor-pointer flex-col items-center ${
        isActive ? "text-olive-light" : "text-gray-400"
      }`}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </Link>
  );
};

export default BottomNavButton;
