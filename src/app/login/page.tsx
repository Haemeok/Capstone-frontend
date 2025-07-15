"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { LOGIN_IMAGE_URL } from "@/shared/config/constants/user";

import GoogleLoginButton from "@/features/auth/ui/GoogleLoginButton";
import KakaoLoginButton from "@/features/auth/ui/KakaoLoginButton";
import NaverLoginButton from "@/features/auth/ui/NaverLoginButton";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  return (
    <div className="scrollbar-hide flex h-screen flex-col items-center justify-center gap-2 overflow-y-auto">
      <img src={LOGIN_IMAGE_URL} alt="login" className="mb-4 p-4" />
      <GoogleLoginButton from={from} />
      <NaverLoginButton />
      <KakaoLoginButton />
      <button
        onClick={() => router.replace(from)}
        className="cursor-pointer text-sm text-[#747775] underline"
      >
        로그인 없이 볼게요
      </button>
    </div>
  );
};

export default LoginPage;
