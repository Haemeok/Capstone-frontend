"use client";

import { usePathname } from "next/navigation";

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        backgroundColor: "#fff",
      }}
    >
      {children}
    </div>
  );
};
