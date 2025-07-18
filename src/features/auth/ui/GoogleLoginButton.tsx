import { END_POINTS } from "@/shared/config/constants/api";
import GoogleIcon from "@/shared/ui/GoogleIcon";

const GoogleLoginButton = () => {
  return (
    <a
      href={`${END_POINTS.GOOGLE_LOGIN_API_ROUTE}`}
      className="flex h-12 w-3/4 flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#747775] text-current no-underline"
    >
      <GoogleIcon />
      <p className="font-semibold">Sign in with Google</p>
    </a>
  );
};

export default GoogleLoginButton;
