import { END_POINTS } from '@/constants/api';
import { useNavigate } from 'react-router';

type KakaoLoginButtonProps = {
  className?: string;
};

const KakaoLoginButton = ({ className }: KakaoLoginButtonProps) => {
  const navigate = useNavigate();
  return (
    <button
      className={`flex h-12 w-3/4 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#fee500] p-2 text-black ${className}`}
      onClick={() => navigate(END_POINTS.KAKAO_LOGIN)}
    >
      <div className="flex h-full w-full items-center justify-center gap-1">
        <img src="/KakaoIcon.png" className="h-full" />
        <p>카카오로 시작하기</p>
      </div>
    </button>
  );
};

export default KakaoLoginButton;
