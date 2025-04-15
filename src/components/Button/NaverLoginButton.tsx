import { END_POINTS } from '@/constants/api';
import { useNavigate } from 'react-router';

type NaverLoginButtonProps = {
  className?: string;
};

const NaverLoginButton = ({ className }: NaverLoginButtonProps) => {
  const navigate = useNavigate();
  return (
    <button
      className={`flex h-12 w-3/4 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#03c75a] text-white ${className}`}
      onClick={() => navigate(END_POINTS.NAVER_LOGIN)}
    >
      <img src="/NaverIcon.png" className="h-12 w-12" />
      <p>네이버로 시작하기</p>
    </button>
  );
};

export default NaverLoginButton;
