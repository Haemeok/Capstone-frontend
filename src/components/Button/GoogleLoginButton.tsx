import GoogleIcon from '../Icon/GoogleIcon';
import { useNavigate } from 'react-router';
import { END_POINTS } from '@/constants/api';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="flex h-12 w-3/4 flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border-1 border-[#747775]"
      onClick={() => navigate(END_POINTS.GOOGLE_LOGIN)}
    >
      <GoogleIcon />
      <p className="font-semibold">Sign in with Google</p>
    </button>
  );
};

export default GoogleLoginButton;
