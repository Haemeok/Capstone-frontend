"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { ARCHETYPE_RESULTS } from "../model/archeTypeResult";
import { ARCHETYPE_QUESTIONS } from "../model/questions";
import { alegreya, robotoMono } from "./fonts";
import ProgressBar from "./ProgressBar";

const ArchetypeFunnel = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string>("");
  const router = useRouter();

  const currentQuestion = ARCHETYPE_QUESTIONS[currentStep];

  const handleAnswer = (type: string) => {
    const newAnswers = answers + type;

    setAnswers(newAnswers);

    if (currentStep === ARCHETYPE_QUESTIONS.length - 1) {
      const code =
        ARCHETYPE_RESULTS[
          newAnswers.toUpperCase() as keyof typeof ARCHETYPE_RESULTS
        ].code;

      router.push(`/archetype/${code}`);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div
      className={`mx-auto min-h-[calc(100vh-200px)] max-w-2xl px-6 py-12 ${alegreya.variable} ${robotoMono.variable} `}
      style={{
        backgroundImage: "url('/arche/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mb-8 text-center">
        <div
          className="text-ink text-6xl tracking-tight"
          style={{ fontFamily: "var(--font-alegreya), serif" }}
        >
          RECIPIO
        </div>
        <div
          className="text-ink-sub mt-2 text-sm font-light tracking-widest"
          style={{
            fontFamily: "var(--font-roboto-mono), monospace",
            letterSpacing: "0.3em",
          }}
        >
          FINE DINING
        </div>
      </div>

      <div className="mb-4">
        <ProgressBar
          current={currentStep + 1}
          total={ARCHETYPE_QUESTIONS.length}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <div className="space-y-4 p-4 text-center">
            <p
              className="text-ink-sub text-sm font-medium tracking-wider uppercase"
              style={{ fontFamily: "var(--font-roboto-mono), monospace" }}
            >
              Question {currentQuestion.id} of {ARCHETYPE_QUESTIONS.length}
            </p>
            <h2
              className="text-ink text-3xl font-bold"
              style={{ fontFamily: "var(--font-pretendard), serif" }}
            >
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.answers.map((answer) => (
              <button
                key={answer.type}
                onClick={() => handleAnswer(answer.type)}
                className="w-full cursor-pointer border-2 border-gray-400 bg-white/80 p-6 text-left backdrop-blur-sm transition-all hover:border-gray-800 hover:bg-white/95 hover:shadow-md"
                style={{
                  borderStyle: "solid",
                }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="text-ink text-lg font-bold"
                    style={{
                      fontFamily: "var(--font-pretendard), serif",
                    }}
                  >
                    {answer.label}
                  </span>
                </div>
                <p className="text-ink-sub leading-relaxed">
                  {answer.description}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ArchetypeFunnel;
