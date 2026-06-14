import { END_POINTS } from "@/shared/config/constants/api";
import GoogleIcon from "@/shared/ui/GoogleIcon";

type GoogleLoginButtonProps = {
  isRecent?: boolean;
  recentLabel?: string;
  onClickCapture?: () => void;
};

const GoogleLoginButton = ({
  isRecent,
  recentLabel,
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
      {isRecent && <RecentBadge label={recentLabel ?? "최근 로그인"} />}
    </a>
  );
};

const RecentBadge = ({ label }: { label: string }) => (
  <span className="bg-olive-light/10 text-olive-dark absolute right-3 rounded-full px-2 py-0.5 text-xs font-medium">
    {label}
  </span>
);

export default GoogleLoginButton;
