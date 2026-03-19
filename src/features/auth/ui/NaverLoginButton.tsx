import { END_POINTS } from "@/shared/config/constants/api";

type NaverLoginButtonProps = {
  className?: string;
  isRecent?: boolean;
  onClickCapture?: () => void;
};

const NaverLoginButton = ({
  className,
  isRecent,
  onClickCapture,
}: NaverLoginButtonProps) => {
  return (
    <a
      href={END_POINTS.NAVER_LOGIN}
      onClickCapture={onClickCapture}
      className={`relative flex h-12 w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#03c75a] text-white ${className}`}
    >
      <img
        src="/NaverIcon.png"
        className="h-12 w-12"
        alt="Naver"
        width={48}
        height={48}
      />
      <p>네이버로 시작하기</p>
      {isRecent && <RecentBadge />}
    </a>
  );
};

const RecentBadge = () => (
  <span className="absolute right-3 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
    최근 로그인
  </span>
);

export default NaverLoginButton;
