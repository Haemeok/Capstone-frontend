"use client";

import { useRouter, useSearchParams } from "next/navigation";

import AppleLoginButton from "@/features/auth/ui/AppleLoginButton";
import GoogleLoginButton from "@/features/auth/ui/GoogleLoginButton";
import KakaoLoginButton from "@/features/auth/ui/KakaoLoginButton";
import NaverLoginButton from "@/features/auth/ui/NaverLoginButton";
import { Image } from "@/shared/ui/image/Image";
import TextAnimate from "@/shared/ui/shadcn/text-animate";

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/back1.webp"
          alt="background"
          wrapperClassName="w-full h-full"
          imgClassName="object-cover brightness-90"
          fit="cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between px-6 py-16">
        <div className="flex w-full flex-1 items-center justify-center">
          <TextAnimate
            text="Recipio"
            type="popIn"
            delay={0.5}
            duration={2}
            className="text-8xl font-bold tracking-tighter text-white md:text-8xl"
          />
        </div>

        <div className="w-full max-w-md space-y-4">
          <AppleLoginButton />
          <GoogleLoginButton />
          <NaverLoginButton />
          <KakaoLoginButton />
          <button
            onClick={() => router.replace(from)}
            className="w-full cursor-pointer text-center text-sm text-white/90 underline underline-offset-4 transition-colors hover:text-white"
          >
            로그인 없이 볼게요
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginContent;
