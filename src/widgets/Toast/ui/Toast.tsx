"use client";

import { useEffect, useState } from "react";

import {
  AlertCircle,
  Bookmark,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";

import { getDictionary, useApiLocale } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

import { useToastStore } from "@/widgets/Toast/model/store";
import { ToastType } from "@/widgets/Toast/model/types";

type ToastProps = ToastType;

const SURFACE_STYLE = "bg-white text-ink border border-gray-100 shadow-md";

const ICON_STYLE: Record<ToastType["variant"], string> = {
  success: "text-ink-sub",
  error: "text-rose-400",
  warning: "text-ink-sub",
  info: "text-ink-sub",
  default: "text-ink-sub",
  "rich-youtube": "text-ink-sub",
  action: "text-ink-sub",
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
      "text-olive-light shrink-0 text-sm font-bold underline underline-offset-2",
      className
    )}
  >
    {label}
  </button>
);

const Toast = (props: ToastProps) => {
  const { id, message, duration = 1000 * 3, variant } = props;
  const removeToast = useToastStore((state) => state.removeToast);
  const t = getDictionary(useApiLocale());

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
    props.variant === "action"
      ? (props.action.label ?? t.appGlobal.toast.changeAction)
      : null;

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
            ? "translate-x-0 scale-100 opacity-100"
            : "translate-x-12 scale-95 opacity-0"
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
        <p className="text-ink flex-1 text-sm font-medium">{message}</p>
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
          aria-label={t.common.actions.close}
        >
          <X className="text-ink-sub h-4 w-4" />
        </button>
      </div>
    </>
  );
};

export default Toast;
