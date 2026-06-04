import { END_POINTS } from "@/shared/config/constants/api";
import GoogleIcon from "@/shared/ui/GoogleIcon";

type GoogleLoginButtonProps = {
  isRecent?: boolean;
  onClickCapture?: () => void;
};

const GoogleLoginButton = ({
  isRecent,
  onClickCapture,
}: GoogleLoginButtonProps) => {
  return (
    <a
      href={`${END_POINTS.GOOGLE_LOGIN_API_ROUTE}`}
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
  <span className="bg-olive-light/10 text-olive-dark absolute right-3 rounded-full px-2 py-0.5 text-xs font-medium">
    최근 로그인
  </span>
);

export default GoogleLoginButton;
