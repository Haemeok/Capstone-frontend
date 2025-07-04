import { END_POINTS } from "@/shared/config/constants/api";
import GoogleIcon from "@/shared/ui/GoogleIcon";

type GoogleLoginButtonProps = {
  from?: string;
};

const GoogleLoginButton = ({ from = "/" }: GoogleLoginButtonProps) => {
  const loginUrlWithState = `${END_POINTS.GOOGLE_LOGIN}?state=${encodeURIComponent(from)}`;
  return (
    <a
      href={loginUrlWithState}
      className="flex h-12 w-3/4 flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#747775] text-current no-underline"
    >
      <GoogleIcon />
      <p className="font-semibold">Sign in with Google</p>
    </a>
  );
};

export default GoogleLoginButton;
