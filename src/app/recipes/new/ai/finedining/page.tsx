"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Container } from "@/shared/ui/Container";

const FineDiningPage = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); 
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("OPEN!");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <div className="relative mx-auto flex min-h-screen flex-col items-center justify-center bg-dark p-6 text-white">
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">돌아가기</span>
        </button>

        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-olive-medium/20 ring-4 ring-olive-medium/50">
           <Clock className="h-16 w-16 text-olive-light" />
        </div>

        <h1 className="mb-4 text-center font-serif text-4xl font-light tracking-wider text-beige">
          FINE DINING
        </h1>
        <p className="mb-12 text-center text-lg font-light text-white/60">
          최고의 셰프가 당신을 위한<br />특별한 코스를 준비하고 있습니다.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-6 backdrop-blur-sm">
          <p className="text-center text-sm font-medium text-olive-light mb-2">OPENING SOON</p>
          <div className="font-mono text-3xl font-bold tracking-widest text-white">
            {timeLeft || "Loading..."}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FineDiningPage;

