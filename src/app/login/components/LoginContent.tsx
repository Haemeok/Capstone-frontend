"use client";

import { useRouter, useSearchParams } from "next/navigation";

import GoogleLoginButton from "@/features/auth/ui/GoogleLoginButton";
import KakaoLoginButton from "@/features/auth/ui/KakaoLoginButton";
import NaverLoginButton from "@/features/auth/ui/NaverLoginButton";

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  return (
    <>
      <GoogleLoginButton />
      <NaverLoginButton />
      <KakaoLoginButton />
      <button
        onClick={() => router.replace(from)}
        className="cursor-pointer text-sm text-[#747775] underline"
      >
        로그인 없이 볼게요
      </button>
    </>
  );
};

export default LoginContent;
