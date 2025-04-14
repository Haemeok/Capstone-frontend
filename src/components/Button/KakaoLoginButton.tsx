import { END_POINTS } from "@/constants/api";
import { useNavigate } from "react-router";

type KakaoLoginButtonProps = {
  className?: string;
};

const KakaoLoginButton = ({ className }: KakaoLoginButtonProps) => {
  const navigate = useNavigate();
  return (
    <button
      className={`w-3/4 flex-shrink-0 h-12 p-2 cursor-pointer rounded-lg bg-[#fee500] text-black flex items-center justify-center ${className}`}
      onClick={() => navigate(END_POINTS.KAKAO_LOGIN)}
    >
      <div className="flex w-full h-full justify-center items-center gap-1">
        <img src="/KakaoIcon.png" className="h-full" />
        <p>카카오로 시작하기</p>
      </div>
    </button>
  );
};

export default KakaoLoginButton;
