"use client";

import { useState } from "react";
import { BugIcon } from "lucide-react";

import { ToastDebugPanel } from "./ToastDebugPanel";

export const ToastDebugButton = () => {
  const [open, setOpen] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-24 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-transform active:scale-95"
        aria-label="토스트 디버그"
      >
        <BugIcon size={20} />
      </button>
      <ToastDebugPanel open={open} onOpenChange={setOpen} />
    </>
  );
};
