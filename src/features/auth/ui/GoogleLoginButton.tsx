import { END_POINTS } from "@/shared/config/constants/api";
import GoogleIcon from "@/shared/ui/GoogleIcon";

type GoogleLoginButtonProps = {
  isRecent?: boolean;
  isApp?: boolean;
  onClickCapture?: () => void;
};

const GoogleLoginButton = ({
  isRecent,
  isApp,
  onClickCapture,
}: GoogleLoginButtonProps) => {
  const href = isApp
    ? `${END_POINTS.GOOGLE_LOGIN_API_ROUTE}?platform=app`
    : END_POINTS.GOOGLE_LOGIN_API_ROUTE;

  return (
    <a
      href={href}
      onClickCapture={onClickCapture}
      className="relative flex h-12 w-full flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#747775] bg-white text-current no-underline"
    >
      <GoogleIcon />
      <p className="font-bold">Sign in with Google</p>
      {isRecent && <RecentBadge />}
    </a>
  );
};

const RecentBadge = () => (
  <span className="absolute right-3 rounded-full bg-olive-light/10 px-2 py-0.5 text-xs font-medium text-olive-dark">
    최근 로그인
  </span>
);

export default GoogleLoginButton;
