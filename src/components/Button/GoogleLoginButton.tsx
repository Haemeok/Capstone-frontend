import GoogleIcon from "../Icon/GoogleIcon";
import { useNavigate } from "react-router";
import { END_POINTS } from "@/constants/api";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="w-3/4 h-12 flex-shrink-0 cursor-pointer flex items-center justify-center border-1 border-[#747775] rounded-full gap-2"
      onClick={() => navigate(END_POINTS.GOOGLE_LOGIN)}
    >
      <GoogleIcon />
      <p className="font-semibold">Sign in with Google</p>
    </button>
  );
};

export default GoogleLoginButton;
