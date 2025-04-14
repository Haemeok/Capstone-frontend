import GoogleLoginButton from "@/components/Button/GoogleLoginButton";
import KakaoLoginButton from "@/components/Button/KakaoLoginButton";
import NaverLoginButton from "@/components/Button/NaverLoginButton";
import { useNavigate } from "react-router";
const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-2 justify-center h-screen bg-[#fbefdb] overflow-y-auto scrollbar-hide">
      <img src="/meat.png" />
      <GoogleLoginButton />
      <NaverLoginButton />
      <KakaoLoginButton />
      <button
        onClick={() => navigate("/")}
        className="text-sm text-[#747775] underline cursor-pointer"
      >
        로그인 없이 볼게요
      </button>
    </div>
  );
};

export default LoginPage;
