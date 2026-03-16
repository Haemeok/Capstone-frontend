import { END_POINTS } from "@/shared/config/constants/api";
import AppleIcon from "@/shared/ui/AppleIcon";

type AppleLoginButtonProps = {
  isRecent?: boolean;
  isApp?: boolean;
  onClickCapture?: () => void;
};

const AppleLoginButton = ({
  isRecent,
  isApp,
  onClickCapture,
}: AppleLoginButtonProps) => {
  const href = isApp
    ? `${END_POINTS.APPLE_LOGIN}?platform=app`
    : END_POINTS.APPLE_LOGIN;

  return (
    <a
      href={href}
      onClickCapture={onClickCapture}
      className="relative flex h-12 w-full flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-black text-white no-underline"
    >
      <AppleIcon />
      <p className="font-bold">Sign in with Apple</p>
      {isRecent && <RecentBadge />}
    </a>
  );
};

const RecentBadge = () => (
  <span className="absolute right-3 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
    최근 로그인
  </span>
);

export default AppleLoginButton;
