"use client";

import { ReactNode } from "react";

import { useUserStore } from "@/entities/user";

import { cn } from "@/lib/utils";

type UsersLayoutProps = {
  children: ReactNode;
};

const UsersLayout = ({ children }: UsersLayoutProps) => {
  const { isLoggingOut } = useUserStore();

  return (
    <div className="relative">
      {children}

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/20 backdrop-blur-xs transition-opacity duration-800 ease-in-out",
          isLoggingOut ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
    </div>
  );
};

export default UsersLayout;
