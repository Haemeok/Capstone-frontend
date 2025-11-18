"use client";

import { useToastStore } from "@/widgets/Toast";
import Toast from "@/widgets/Toast/ui/Toast";

type ToastPosition = "top" | "middle" | "bottom";

const ToastProvider = () => {
  const toastList = useToastStore((state) => state.toastList);

  const getToastsByPosition = (position: ToastPosition) => {
    return toastList.filter((toast) => toast.position === position);
  };

  const topToasts = getToastsByPosition("top");
  const middleToasts = getToastsByPosition("middle");
  const bottomToasts = getToastsByPosition("bottom");

  const baseContainerStyle =
    "pointer-events-none fixed z-[9999] flex w-full flex-col items-center gap-2 p-4";

  return (
    <>
      <div
        id="toast-container-top"
        className={`${baseContainerStyle} top-10 justify-start md:hidden`}
      >
        {topToasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>

      <div
        id="toast-container-middle"
        className={`${baseContainerStyle} top-1/2 -translate-y-1/2 justify-center md:hidden`}
      >
        {middleToasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>

      <div
        id="toast-container-bottom"
        className={`${baseContainerStyle} bottom-10 justify-end md:hidden`}
      >
        {bottomToasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>

      <div
        id="toast-container-desktop"
        className="pointer-events-none fixed top-5 right-5 z-[9999] hidden w-96 flex-col gap-3 md:flex"
      >
        {toastList.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </>
  );
};

export default ToastProvider;
