import { END_POINTS } from "@/shared/config/constants/api";
import AppleIcon from "@/shared/ui/AppleIcon";

const AppleLoginButton = () => {
  return (
    <a
      href={END_POINTS.APPLE_LOGIN}
      className="flex h-12 w-full flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-black text-white no-underline"
    >
      <AppleIcon />
      <p className="font-bold">Sign in with Apple</p>
    </a>
  );
};

export default AppleLoginButton;
