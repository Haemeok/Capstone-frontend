export type ToastType = {
  id: number;
  message: string;
  duration?: number;
  variant: "success" | "error" | "warning" | "info" | "default";
  size?: "small" | "medium" | "large";
  position?: "top" | "middle" | "bottom";
};
