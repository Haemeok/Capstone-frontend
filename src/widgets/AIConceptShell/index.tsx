"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import type { AIModelId } from "@/shared/config/constants/aiModel";
import { Container } from "@/shared/ui/Container";

import type { ActiveAIJob } from "@/features/recipe-create-ai/model/types";

const AiLoading = dynamic(() => import("@/widgets/AiLoading/AiLoading"), {
  ssr: false,
});
const AIRecipeError = dynamic(() => import("@/widgets/AIRecipeError"), {
  ssr: false,
});

type AIConceptShellProps = {
  concept: AIModelId;
  job: ActiveAIJob | undefined;
  isPending: boolean;
  isFailed: boolean;
  progress: number;
  onRetry: () => void;
  children: ReactNode;
};

const AIConceptShell = ({
  concept,
  job,
  isPending,
  isFailed,
  progress,
  onRetry,
  children,
}: AIConceptShellProps) => {
  if (isPending && job) {
    return (
      <Container padding={false}>
        <AiLoading
          aiModelId={concept}
          progress={progress}
          startTime={job.startTime}
        />
      </Container>
    );
  }

  if (isFailed && job) {
    return (
      <Container padding={false}>
        <AIRecipeError
          error={job.message || "레시피 생성 중 오류가 발생했습니다."}
          onRetry={onRetry}
        />
      </Container>
    );
  }

  return <>{children}</>;
};

export default AIConceptShell;
