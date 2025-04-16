import { END_POINTS } from '@/constants/api';

type KakaoLoginButtonProps = {
  className?: string;
};

const KakaoLoginButton = ({ className }: KakaoLoginButtonProps) => {
  return (
    <a
      href={END_POINTS.KAKAO_LOGIN}
      className={`flex h-12 w-3/4 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#fee500] p-2 text-black ${className}`}
    >
      <div className="flex h-full w-full items-center justify-center gap-1">
        <img src="/KakaoIcon.png" className="h-full" />
        <p>카카오로 시작하기</p>
      </div>
    </a>
  );
};

export default KakaoLoginButton;
