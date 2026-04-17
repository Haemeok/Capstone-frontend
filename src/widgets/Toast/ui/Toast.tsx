"use client";

import { useEffect, useState } from "react";

import { AlertCircle, Bookmark, CheckCircle2, Info, X, XCircle } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { useToastStore } from "@/widgets/Toast/model/store";
import { ToastType } from "@/widgets/Toast/model/types";

type ToastProps = ToastType;

const SURFACE_STYLE = "bg-white text-gray-900 border border-gray-100 shadow-md";

const ICON_STYLE: Record<ToastType["variant"], string> = {
  success: "text-gray-700",
  error: "text-rose-400",
  warning: "text-gray-700",
  info: "text-gray-700",
  default: "text-gray-700",
  "rich-youtube": "text-gray-700",
  action: "text-gray-700",
};

const TOAST_ICON: Record<ToastType["variant"], typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  default: Info,
  "rich-youtube": Info,
  action: Bookmark,
};

type ActionButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

const ActionButton = ({ label, onClick, className }: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "shrink-0 text-sm font-bold text-olive-light underline underline-offset-2",
      className
    )}
  >
    {label}
  </button>
);

const Toast = (props: ToastProps) => {
  const { id, message, duration = 1000 * 3, variant } = props;
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

  const handleAction =
    props.variant === "action"
      ? () => {
          props.action.onClick();
          removeToast(id);
        }
      : undefined;

  const actionLabel =
    props.variant === "action" ? props.action.label ?? "변경" : null;

  return (
    <>
      <div
        className={cn(
          SURFACE_STYLE,
          "pointer-events-auto z-30 flex w-11/12 items-center gap-3 rounded-xl px-5 py-4 md:hidden",
          isVisible ? "animate-slideInUp" : "animate-fadeOut"
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <Icon
          className={cn(
            "h-5 w-5 shrink-0",
            ICON_STYLE[variant],
            variant === "action" && "fill-olive-light text-olive-light"
          )}
        />
        <span className="flex-1 text-sm">{message}</span>
        {handleAction && actionLabel && (
          <ActionButton
            label={actionLabel}
            onClick={handleAction}
            className="px-2 py-1"
          />
        )}
      </div>

      <div
        className={cn(
          SURFACE_STYLE,
          "pointer-events-auto hidden w-80 items-center gap-3 rounded-lg px-4 py-4 shadow-lg transition-all duration-300 ease-out md:flex",
          isVisible
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-12 opacity-0 scale-95"
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex-shrink-0">
          <Icon
            className={cn(
              "h-5 w-5",
              ICON_STYLE[variant],
              variant === "action" && "fill-olive-light text-olive-light"
            )}
          />
        </div>
        <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
        {handleAction && actionLabel && (
          <ActionButton
            label={actionLabel}
            onClick={handleAction}
            className="ml-3"
          />
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
