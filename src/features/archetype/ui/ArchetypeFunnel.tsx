"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ARCHETYPE_QUESTIONS } from "../model/questions";
import ProgressBar from "./ProgressBar";

type ArchetypeFunnelProps = {
  onComplete: (result: string[]) => void;
};

const ArchetypeFunnel = ({ onComplete }: ArchetypeFunnelProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const currentQuestion = ARCHETYPE_QUESTIONS[currentStep];

  const handleAnswer = (type: string) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentStep === ARCHETYPE_QUESTIONS.length - 1) {
      onComplete(newAnswers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="mx-auto min-h-[calc(100vh-200px)] max-w-2xl px-6 py-12">
      <div className="mb-8">
        <ProgressBar
          current={currentStep + 1}
          total={ARCHETYPE_QUESTIONS.length}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-olive-mint">
              Q{currentQuestion.id}. {currentQuestion.category}
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.answers.map((answer) => (
              <button
                key={answer.type}
                onClick={() => handleAnswer(answer.type)}
                className="w-full cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-olive-mint hover:bg-olive-mint/5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-md bg-olive-mint/10 px-2 py-1 text-sm font-bold text-olive-mint">
                    {answer.type}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {answer.label}
                  </span>
                </div>
                <p className="text-gray-600">{answer.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ArchetypeFunnel;
