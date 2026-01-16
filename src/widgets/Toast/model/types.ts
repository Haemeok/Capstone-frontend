export type ToastType = {
  id: number;
  message: string;
  duration?: number;
  variant:
    | "success"
    | "error"
    | "warning"
    | "info"
    | "default"
    | "rich-youtube";
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
  action?: {
    label?: string;
    onClick: () => void;
  };
};
