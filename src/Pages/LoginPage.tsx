import GoogleLoginButton from '@/components/Button/GoogleLoginButton';
import KakaoLoginButton from '@/components/Button/KakaoLoginButton';
import NaverLoginButton from '@/components/Button/NaverLoginButton';
import { useNavigate, useLocation } from 'react-router';
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  return (
    <div className="scrollbar-hide flex h-screen flex-col items-center justify-center gap-2 overflow-y-auto bg-[#fbefdb]">
      <img src="/meat.png" />
      <GoogleLoginButton from={from} />
      <NaverLoginButton />
      <KakaoLoginButton />
      <button
        onClick={() => navigate(from, { replace: true })}
        className="cursor-pointer text-sm text-[#747775] underline"
      >
        로그인 없이 볼게요
      </button>
    </div>
  );
};

export default LoginPage;
