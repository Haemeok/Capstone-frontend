import { useLocation } from 'react-router';
import { Share2 } from 'lucide-react';
import clsx from 'clsx';
import { useToastStore } from '@/store/useToastStore';
import { BASE_URL } from '@/constants/api';

type ShareButtonProps = {
  className?: string;
  label?: string;
  message?: string;
};

const ShareButton = ({
  className,
  label,
  message,
  ...props
}: ShareButtonProps) => {
  const { pathname } = useLocation();
  const { addToast } = useToastStore();

  const finalButtonClassName = clsx(
    'nav-button-base',
    'flex h-10 w-10 items-center justify-center',
    className,
  );

  const handleShareClick = () => {
    const shareUrl = `${BASE_URL}${pathname}`;

    if (window.ReactNativeWebView) {
      const messageContent = JSON.stringify({
        type: 'share',
        data: {
          url: shareUrl,
          title: '공유할 앱 선택',
          message: message,
        },
      });
      window.ReactNativeWebView.postMessage(messageContent);
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          addToast({
            message: '공유 링크가 복사되었습니다!',
            position: 'bottom',
            variant: 'success',
          });
        })
        .catch((err) => {
          console.error('링크 복사에 실패했습니다.', err);
          addToast({
            message: '오류가 발생했습니다. 다시 시도해주세요.',
            position: 'bottom',
            variant: 'error',
          });
        });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleShareClick}
        className={finalButtonClassName}
        {...props}
      >
        <Share2 width={24} height={24} />
      </button>
      {label && <p className="mt-1 text-sm font-bold">{label}</p>}
    </div>
  );
};

export default ShareButton;
