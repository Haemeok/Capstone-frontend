"use client";

import { useEffect, useState } from "react";

import { AlertCircle, Bookmark,CheckCircle2, Info, X,XCircle } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { useToastStore } from "@/widgets/Toast/model/store";
import { ToastType } from "@/widgets/Toast/model/types";

type ToastProps = ToastType;

const MOBILE_TOAST_STYLE: Record<ToastType["variant"], string> = {
  success: "bg-white text-gray-900 border border-gray-100 shadow-lg",
  error: "bg-white text-gray-900 border border-gray-100 shadow-lg",
  warning: "bg-white text-gray-900 border border-gray-100 shadow-lg",
  info: "bg-white text-gray-900 border border-gray-100 shadow-lg",
  default: "bg-white text-gray-900 border border-gray-100 shadow-lg",
  "rich-youtube": "bg-white text-gray-900 border border-gray-100 shadow-lg",
  action: "bg-white text-gray-900 border border-gray-100 shadow-lg",
};

const DESKTOP_TOAST_STYLE: Record<ToastType["variant"], string> = {
  success: "bg-white border border-gray-100 shadow-md",
  error: "bg-white border border-gray-100 shadow-md",
  warning: "bg-white border border-gray-100 shadow-md",
  info: "bg-white border border-gray-100 shadow-md",
  default: "bg-white border border-gray-100 shadow-md",
  "rich-youtube": "bg-white border border-gray-100 shadow-md",
  action: "bg-white border border-gray-100 shadow-md",
};

const ICON_STYLE = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
  default: "text-olive-light",
  "rich-youtube": "text-olive-light",
  action: "text-olive-light",
};

const TOAST_ICON = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  default: Info,
  "rich-youtube": Info,
  action: Bookmark,
};

const Toast = ({
  id,
  message,
  duration = 1000 * 3,
  variant,
  action,
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
          "pointer-events-auto z-30 flex w-11/12 items-center gap-3 rounded-xl px-5 py-3 shadow-md md:hidden",
          isVisible ? "animate-slideInUp" : "animate-fadeOut"
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <Icon className={cn("h-5 w-5 shrink-0", ICON_STYLE[variant])} />
        <span className="flex-1 text-sm">{message}</span>
        {variant === "action" && action && (
          <button
            type="button"
            onClick={() => {
              action.onClick();
              removeToast(id);
            }}
            className="shrink-0 px-2 py-1 text-sm font-bold text-olive-light underline underline-offset-2"
          >
            {action.label ?? "변경"}
          </button>
        )}
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
        {variant === "action" && action && (
          <button
            type="button"
            onClick={() => {
              action.onClick();
              removeToast(id);
            }}
            className="ml-3 shrink-0 text-sm font-medium text-olive-light underline underline-offset-2"
          >
            {action.label ?? "변경"}
          </button>
        )}
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
