"use client";

import { Loader2 } from "lucide-react";

type CookingRecordBoardStateProps =
  | { kind: "loading"; message: string }
  | {
      kind: "loading-more";
      message: string;
      sentinelRef: (node?: Element | null) => void;
    }
  | { kind: "empty"; title: string; description: string }
  | {
      kind: "error";
      message: string;
      actionLabel: string;
      onAction: () => void;
    }
  | {
      kind: "login";
      title: string;
      description: string;
      actionLabel: string;
      onAction: () => void;
    };

export const CookingRecordBoardState = (
  props: CookingRecordBoardStateProps
) => {
  if (props.kind === "loading" || props.kind === "loading-more") {
    return (
      <div
        ref={props.kind === "loading-more" ? props.sentinelRef : undefined}
        aria-live="polite"
        className="text-ink-muted flex min-h-24 items-center justify-center gap-2 text-sm"
      >
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        {props.message}
      </div>
    );
  }

  const isActionState = props.kind === "error" || props.kind === "login";
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
      <p className="text-ink text-[15px] font-bold">
        {props.kind === "empty"
          ? props.title
          : props.kind === "login"
            ? props.title
            : props.message}
      </p>
      {props.kind !== "error" ? (
        <p className="text-ink-muted mt-2 max-w-72 text-[13px] leading-5.5">
          {props.description}
        </p>
      ) : null}
      {isActionState ? (
        <button
          type="button"
          onClick={props.onAction}
          className="text-ink focus-visible:outline-olive-dark mt-4 min-h-11 cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {props.actionLabel}
        </button>
      ) : null}
    </div>
  );
};
