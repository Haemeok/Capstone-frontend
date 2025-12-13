"use client";

import { useState } from "react";

import { Container } from "@/shared/ui/Container";

import ArchetypeLanding3 from "@/features/archetype/ui/ArchetypeLanding";
import ArchetypeFunnel from "@/features/archetype/ui/ArchetypeFunnel";

type Step = "landing" | "funnel";

const ArchetypePage = () => {
  const [step, setStep] = useState<Step>("landing");

  const handleStart = () => {
    setStep("funnel");
  };

  return (
    <Container padding={false}>
      {step === "landing" && <ArchetypeLanding3 onStart={handleStart} />}
      {step === "funnel" && <ArchetypeFunnel />}
    </Container>
  );
};

export default ArchetypePage;
