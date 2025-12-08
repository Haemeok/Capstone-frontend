"use client";

import { motion } from "framer-motion";

type ArchetypeLanding2Props = {
  onStart: () => void;
};

const ArchetypeLanding2 = ({ onStart }: ArchetypeLanding2Props) => {
  return (
    <div className="bg-beige relative flex min-h-screen flex-col overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center space-y-6 px-6 pt-20 pb-12"
      >
        <h1 className="text-dark -space-y-2 text-center font-sans text-7xl font-black tracking-tight uppercase md:-space-y-3 md:text-8xl lg:-space-y-4 lg:text-9xl">
          <div>DISCOVER</div>
          <div>FINE</div>
          <div>DINING</div>
          <div>PERSONA</div>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-dark/70 max-w-lg text-center text-sm leading-relaxed font-medium"
        >
          나를 파인다이닝 디쉬로 표현하고 공유해보세요.
          <br />
          5가지 질문으로 알아보는 나만의 식사 스타일 · 소요 시간: 약 1분
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          onClick={onStart}
          className="group bg-dark text-beige relative cursor-pointer overflow-hidden rounded-full px-12 py-4 font-sans text-base font-bold tracking-wide uppercase shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <span className="relative z-10">테스트 하러가기</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative w-full flex-1"
      >
        <img
          src="/fine.png"
          alt="Fine Dining Experience"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  );
};

export default ArchetypeLanding2;
