"use client";

import { useToastStore } from "@/widgets/Toast";
import Toast from "@/widgets/Toast/ui/Toast";
import { RichToast } from "@/widgets/Toast/ui/RichToast";

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

  const renderToast = (toast: (typeof toastList)[0]) => {
    if (toast.richContent) {
      return <RichToast key={toast.id} {...toast} />;
    }
    return <Toast key={toast.id} {...toast} />;
  };

  return (
    <>
      <div
        id="toast-container-top"
        className={`${baseContainerStyle} top-10 justify-start md:hidden`}
      >
        {topToasts.map(renderToast)}
      </div>

      <div
        id="toast-container-middle"
        className={`${baseContainerStyle} top-1/2 -translate-y-1/2 justify-center md:hidden`}
      >
        {middleToasts.map(renderToast)}
      </div>

      <div
        id="toast-container-bottom"
        className={`${baseContainerStyle} bottom-18 justify-end md:hidden`}
      >
        {bottomToasts.map(renderToast)}
      </div>

      <div
        id="toast-container-desktop"
        className="pointer-events-none fixed right-5 bottom-5 z-[9999] hidden w-96 flex-col gap-3 md:flex"
      >
        {toastList.map(renderToast)}
      </div>
    </>
  );
};

export default ToastProvider;
