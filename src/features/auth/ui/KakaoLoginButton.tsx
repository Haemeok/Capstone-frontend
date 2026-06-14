import { END_POINTS } from "@/shared/config/constants/api";

type KakaoLoginButtonProps = {
  className?: string;
  isRecent?: boolean;
  recentLabel?: string;
  kakaoLabel?: string;
  onClickCapture?: () => void;
};

const KakaoLoginButton = ({
  className,
  isRecent,
  recentLabel,
  kakaoLabel,
  onClickCapture,
}: KakaoLoginButtonProps) => {
  return (
    <a
      href={END_POINTS.KAKAO_LOGIN}
      onClickCapture={onClickCapture}
      className={`relative flex h-12 w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#fee500] p-2 text-black ${className}`}
    >
      <div className="flex h-full w-full items-center justify-center gap-1">
        <img src="/KakaoIcon.png" className="h-full" alt="Kakao" />
        <p>{kakaoLabel ?? "카카오로 시작하기"}</p>
      </div>
      {isRecent && <RecentBadge label={recentLabel ?? "최근 로그인"} />}
    </a>
  );
};

const RecentBadge = ({ label }: { label: string }) => (
  <span className="absolute right-3 rounded-full bg-black/10 px-2 py-0.5 text-xs font-medium text-black/70">
    {label}
  </span>
);

export default KakaoLoginButton;
