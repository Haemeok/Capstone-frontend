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
          "fixed inset-0 bg-black/20 backdrop-blur-xs z-50 transition-opacity duration-800 ease-in-out",
          isLoggingOut ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
    </div>
  );
};

export default UsersLayout;
