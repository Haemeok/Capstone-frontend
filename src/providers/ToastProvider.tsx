import { useToastStore } from "@/store/useToastStore";
import Toast from "@/components/Toast/Toast";

const ToastProvider = () => {
  const toastList = useToastStore((state) => state.toastList);

  return (
    <div
      id="toast-container"
      className="pointer-events-none fixed top-10 z-[9999] flex w-full flex-col items-center justify-end gap-2 p-4"
    >
      {toastList.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastProvider;
