import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@/hooks/useUser";

function GoogleCallback() {
  const navigate = useNavigate();
  const { refreshTokenOnLoad } = useUser();

  useEffect(() => {
    refreshTokenOnLoad().then((success) => {
      if (success) {
        navigate("/");
      } else {
        navigate("/login", { state: { error: "로그인에 실패했습니다." } });
      }
    });
  }, [navigate, refreshTokenOnLoad]);

  return <div>로그인 처리 중...</div>;
}

export default GoogleCallback;
