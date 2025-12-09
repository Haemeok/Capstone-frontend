"use client";

import { useState } from "react";

import { Container } from "@/shared/ui/Container";

import ArchetypeLanding2 from "@/features/archetype/ui/ArchetypeLanding2";
import ArchetypeLanding from "@/features/archetype/ui/ArchetypeLanding";
import ArchetypeFunnel from "@/features/archetype/ui/ArchetypeFunnel";
import ArchetypeResult from "@/features/archetype/ui/ArchetypeResult";

type Step = "landing" | "funnel" | "result";

const ArchetypePage = () => {
  const [step, setStep] = useState<Step>("landing");
  const [result, setResult] = useState<string[]>([]);

  const handleStart = () => {
    setStep("funnel");
    setResult([]);
  };

  const handleComplete = (answers: string[]) => {
    setResult(answers);
    setStep("result");
  };

  const handleRestart = () => {
    setStep("landing");
    setResult([]);
  };

  return (
    <Container padding={false}>
      {step === "landing" && <ArchetypeLanding onStart={handleStart} />}
      {step === "funnel" && <ArchetypeFunnel onComplete={handleComplete} />}
      {step === "result" && (
        <ArchetypeResult result={result} onRestart={handleRestart} />
      )}
    </Container>
  );
};

export default ArchetypePage;
