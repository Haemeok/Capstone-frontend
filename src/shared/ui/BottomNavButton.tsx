"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { useLocalizedRouter } from "@/shared/i18n";
type BottomNavButtonProps = {
  icon: React.ReactNode;
  label: string;
  path: string;
};

const BottomNavButton = ({ icon, label, path }: BottomNavButtonProps) => {
  const router = useLocalizedRouter();
  const pathname = usePathname();
  return (
    <button
      className={`flex cursor-pointer flex-col items-center ${
        pathname === path ? "text-olive-light" : "text-gray-400"
      }`}
      onClick={() => router.push(path)}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
};

export default BottomNavButton;
