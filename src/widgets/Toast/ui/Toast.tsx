"use client";

import { useEffect, useState } from "react";

import { CheckCircle2, Info, AlertCircle, XCircle } from "lucide-react";

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
};

const DESKTOP_TOAST_STYLE = {
  success: "bg-white border-l-4 border-olive-light text-gray-800",
  error: "bg-white border-l-4 border-red-500 text-gray-800",
  warning: "bg-white border-l-4 border-yellow-500 text-gray-800",
  info: "bg-white border-l-4 border-blue-500 text-gray-800",
  default: "bg-white border-l-4 border-olive-mint text-gray-800",
};

const ICON_STYLE = {
  success: "text-olive-light",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
  default: "text-olive-mint",
};

const TOAST_ICON = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  default: Info,
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
    }, duration - 500);

    const removeTimer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [id, duration, removeToast]);

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
          "pointer-events-auto hidden items-center gap-3 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 md:flex",
          DESKTOP_TOAST_STYLE[variant],
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <Icon className={cn("h-5 w-5 flex-shrink-0", ICON_STYLE[variant])} />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </>
  );
};

export default Toast;
