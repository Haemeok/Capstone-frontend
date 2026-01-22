"use client";

import { motion } from "framer-motion";

export const ReportSuccessView = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center px-6 py-12"
    >
      <motion.svg
        viewBox="0 0 50 50"
        className="h-20 w-20"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.path
          d="M14 27 L22 35 L36 18"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1 },
          }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
        />
      </motion.svg>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-lg font-bold text-gray-900"
      >
        수정사항이 접수되었습니다
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-2 text-center text-sm text-gray-500"
      >
        개발자가 빠르게 확인해서
        <br />
        수정조치를 취하겠습니다
      </motion.p>
    </motion.div>
  );
};
