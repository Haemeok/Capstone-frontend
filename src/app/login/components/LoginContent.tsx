"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Info } from "lucide-react";

import AppleLoginButton from "@/features/auth/ui/AppleLoginButton";
import GoogleLoginButton from "@/features/auth/ui/GoogleLoginButton";
import KakaoLoginButton from "@/features/auth/ui/KakaoLoginButton";
import NaverLoginButton from "@/features/auth/ui/NaverLoginButton";
import { useIsApp } from "@/shared/hooks/useIsApp";
import { storage } from "@/shared/lib/storage";
import { Image } from "@/shared/ui/image/Image";
import TextAnimate from "@/shared/ui/shadcn/text-animate";

const TEST_LOGIN_CLICK_THRESHOLD = 7;
const LAST_LOGIN_PROVIDER_KEY = "last_login_provider";

type SocialProvider = "google" | "kakao" | "naver" | "apple";

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [clickCount, setClickCount] = useState(0);

  const lastProvider = storage.getItem(
    LAST_LOGIN_PROVIDER_KEY
  ) as SocialProvider | null;

  const saveProvider = useCallback((provider: SocialProvider) => {
    storage.setItem(LAST_LOGIN_PROVIDER_KEY, provider);
  }, []);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= TEST_LOGIN_CLICK_THRESHOLD) {
      setClickCount(0);
      window.location.href = "/api/token/test-login";
    }
  };

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
            className="cursor-pointer text-8xl font-bold tracking-tighter text-white md:text-8xl"
            onClick={handleLogoClick}
          />
        </div>

        <div className="w-full max-w-md space-y-4">
          <AndroidAppLoginNotice />
          <GoogleLoginButton
            isRecent={lastProvider === "google"}
            onClickCapture={() => saveProvider("google")}
          />
          <KakaoLoginButton
            isRecent={lastProvider === "kakao"}
            onClickCapture={() => saveProvider("kakao")}
          />
          <NaverLoginButton
            isRecent={lastProvider === "naver"}
            onClickCapture={() => saveProvider("naver")}
          />
          <AppleLoginButton
            isRecent={lastProvider === "apple"}
            onClickCapture={() => saveProvider("apple")}
          />
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

const AndroidAppLoginNotice = () => {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setIsAndroid(/android/i.test(navigator.userAgent));
  }, []);

  // TODO: 테스트 후 원복 — if (!isApp || !isAndroid) return null;
  if (false) return null;

  return (
    <div className="flex items-start gap-2.5 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/80" />
      <p className="text-sm leading-snug text-white/90">
        카카오 로그인 시{" "}
        <span className="font-semibold text-white">
          이메일/비밀번호를 직접 입력
        </span>
        해주세요. 카카오톡 앱 로그인은 일부 기기에서 동작하지 않을 수 있어요.
      </p>
    </div>
  );
};

export default LoginContent;
