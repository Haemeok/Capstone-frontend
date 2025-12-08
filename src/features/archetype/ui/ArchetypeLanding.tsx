"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

type ArchetypeLandingProps = {
  onStart: () => void;
};

const ArchetypeLanding = ({ onStart }: ArchetypeLandingProps) => {
  const [currentVideo, setCurrentVideo] = useState<"A" | "B">("A");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    if (currentVideo === "A") {
      setCurrentVideo("B");
    }
  };

  return (
    <div className="bg-beige relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full">
        <video
          ref={videoRef}
          key={currentVideo}
          autoPlay
          muted
          playsInline
          loop={currentVideo === "B"}
          onEnded={handleVideoEnd}
          className="h-[70vh] w-full object-cover"
        >
          <source
            src={currentVideo === "A" ? "/videoA.webm" : "/videoB.webm"}
            type="video/webm"
          />
        </video>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-8 left-1/2 z-20 -translate-x-1/2"
        >
          <h1 className="text-brown font-serif text-6xl font-bold tracking-wider md:text-7xl lg:text-8xl">
            Fine Dining Test
          </h1>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative z-10 mt-10 mb-8 space-y-2 text-center"
      >
        <p className="text-brown font-serif text-2xl leading-tight font-medium tracking-tight">
          나를 파인다이닝 디쉬로
          <br />
          표현해보세요
        </p>
        <p className="text-brown/70 text-sm font-medium tracking-normal">
          소요 시간: 약 1분
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        onClick={onStart}
        className="group border-brown bg-beige text-brown hover:bg-brown hover:text-beige relative z-10 w-full max-w-xs cursor-pointer overflow-hidden rounded-xl border-2 px-10 py-4 font-serif text-lg font-semibold tracking-wide shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <span className="relative z-10">테스트 하러가기</span>
        <div className="bg-brown absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.button>
    </div>
  );
};

export default ArchetypeLanding;
