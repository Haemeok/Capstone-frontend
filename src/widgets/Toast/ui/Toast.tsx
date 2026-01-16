"use client";

import { useEffect, useState } from "react";

import { CheckCircle2, Info, AlertCircle, XCircle, X } from "lucide-react";

import { useToastStore } from "@/widgets/Toast/model/store";
import { ToastType } from "@/widgets/Toast/model/types";

import { cn } from "@/shared/lib/utils";

type ToastProps = ToastType;

const MOBILE_TOAST_STYLE = {
  success: "bg-olive-light text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-black",
  info: "bg-blue-500 text-white",
  default: "bg-olive-mint text-white",
  "rich-youtube": "bg-olive-mint text-white",
};

const DESKTOP_TOAST_STYLE = {
  success: "bg-emerald-50 border border-emerald-100",
  error: "bg-red-50 border border-red-100",
  warning: "bg-amber-50 border border-amber-100",
  info: "bg-blue-50 border border-blue-100",
  default: "bg-green-50 border border-green-100",
  "rich-youtube": "bg-green-50 border border-green-100",
};

const ICON_STYLE = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
  default: "text-olive-light",
  "rich-youtube": "text-olive-light",
};

const TOAST_ICON = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  default: Info,
  "rich-youtube": Info,
};

const TOAST_SIZE = {
  small: "w-fit h-8",
  medium: "h-8",
  large: "h-12",
};

const Toast = ({
  id,
  message,
  duration = 1000 * 3,
  variant,
  size = "medium",
}: ToastProps) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 300);

    const removeTimer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [id, duration, removeToast]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      removeToast(id);
    }, 300);
  };

  const Icon = TOAST_ICON[variant];

  return (
    <>
      <div
        className={cn(
          MOBILE_TOAST_STYLE[variant],
          "z-30 flex h-8 w-11/12 items-center justify-center rounded-md px-4 shadow-md md:hidden",
          TOAST_SIZE[size],
          isVisible ? "animate-slideInUp" : "animate-fadeOut"
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>

      <div
        className={cn(
          "pointer-events-auto hidden w-80 items-center gap-3 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ease-out md:flex",
          DESKTOP_TOAST_STYLE[variant],
          isVisible
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-12 opacity-0 scale-95"
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex-shrink-0">
          <Icon className={cn("h-5 w-5", ICON_STYLE[variant])} />
        </div>
        <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-black/5"
          aria-label="닫기"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </>
  );
};

export default Toast;
