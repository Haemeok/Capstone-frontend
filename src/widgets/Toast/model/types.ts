type ToastAction = {
  label?: string;
  onClick: () => void;
};

type ToastBase = {
  id: number;
  message: string;
  duration?: number;
  size?: "small" | "medium" | "large";
  position?: "top" | "middle" | "bottom";
  persistent?: boolean;
  dismissible?: "swipe" | "action" | "both";
  richContent?: {
    thumbnail?: string;
    title?: string;
    badgeIcon?: React.ReactNode;
    subtitle?: string;
    recipeId?: string;
  };
  action?: ToastAction;
};

/**
 * variant === "action" 일 때는 action prop 필수.
 * 다른 variant 에서도 action 을 optional 로 첨부 가능 (rich-youtube 의 "보기" 버튼 등).
 */
export type ToastType =
  | (ToastBase & {
      variant:
        | "success"
        | "error"
        | "warning"
        | "info"
        | "default"
        | "rich-youtube";
    })
  | (ToastBase & {
      variant: "action";
      action: ToastAction;
    });
