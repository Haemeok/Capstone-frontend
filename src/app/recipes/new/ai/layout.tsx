import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

const AIRecipeLayout = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

export default AIRecipeLayout;
