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
