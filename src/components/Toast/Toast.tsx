import { useEffect, useState } from 'react';
import { ToastType, useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';

type ToastProps = ToastType;

const TOAST_STYLE = {
  success: 'bg-olive-light text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-500 text-white',
  default: 'bg-olive-mint text-white',
};

const TOAST_SIZE = {
  small: 'w-fit h-8',
  medium: 'h-8',
  large: 'h-12',
};

const Toast = ({
  id,
  message,
  duration = 1000 * 3,
  variant,
  size = 'medium',
}: ToastProps) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 500);

    const removeTimer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [id, duration, removeToast]);

  return (
    <div
      className={cn(
        TOAST_STYLE[variant],
        'z-30 flex h-8 w-11/12 items-center justify-center rounded-md px-4 shadow-md',
        TOAST_SIZE[size],
        isVisible ? 'animate-slideInUp' : 'animate-fadeOut',
      )}
    >
      {message}
    </div>
  );
};

export default Toast;
