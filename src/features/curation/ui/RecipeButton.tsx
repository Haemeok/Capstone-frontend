"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

type RecipeButtonProps = {
  href: string;
  children: ReactNode;
};

export const RecipeButton = ({ href, children }: RecipeButtonProps) => (
  <Link
    href={href}
    onClick={() => triggerHaptic("Light")}
    className="my-3 inline-flex items-center gap-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
  >
    {children}
  </Link>
);
