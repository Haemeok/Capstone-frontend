"use client";

import { motion } from "framer-motion";

type ArchetypeResultProps = {
  result: string[];
  onRestart: () => void;
};

const ArchetypeResult = ({ result, onRestart }: ArchetypeResultProps) => {
  const archetypeCode = result.join("");

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg space-y-8 text-center"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-700">
            당신의 아키타입은
          </h2>
          <div className="rounded-2xl bg-gradient-to-br from-olive-light to-olive-mint p-8">
            <p className="text-6xl font-black tracking-wider text-white">
              {archetypeCode}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full cursor-pointer rounded-xl border-2 border-olive-mint bg-white px-8 py-4 text-lg font-semibold text-olive-mint transition-colors hover:bg-olive-mint hover:text-white"
          >
            다시 체험하기
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ArchetypeResult;
