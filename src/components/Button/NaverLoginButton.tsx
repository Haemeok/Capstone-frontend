import { END_POINTS } from "@/constants/api";
import { useNavigate } from "react-router";

type NaverLoginButtonProps = {
  className?: string;
};

const NaverLoginButton = ({ className }: NaverLoginButtonProps) => {
  const navigate = useNavigate();
  return (
    <button
      className={`w-3/4 h-12 flex-shrink-0 rounded-lg cursor-pointer bg-[#03c75a] text-white flex items-center justify-center ${className}`}
      onClick={() => navigate(END_POINTS.NAVER_LOGIN)}
    >
      <img src="/NaverIcon.png" className="w-12 h-12" />
      <p>네이버로 시작하기</p>
    </button>
  );
};

export default NaverLoginButton;
