import { useToastStore } from "@/store/useToastStore";

export const useToasts = () => {
  const addToast = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);
  const toastList = useToastStore((state) => state.toastList);

  const showSuccessToast = (message: string, duration?: number) => {
    return addToast({ message, duration, variant: "success" });
  };

  const showErrorToast = (message: string, duration?: number) => {
    return addToast({ message, duration, variant: "error" });
  };

  const showInfoToast = (message: string, duration?: number) => {
    return addToast({ message, duration, variant: "info" });
  };

  const showWarningToast = (message: string, duration?: number) => {
    return addToast({ message, duration, variant: "warning" });
  };

  return {
    toastList,
    addToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    removeToast,
  };
};
