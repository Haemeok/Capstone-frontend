"use client";

import { type ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";

import type { AIModelId } from "@/shared/config/constants/aiModel";
import { useLocalizedRouter, useT } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import { useToastStore } from "@/shared/ui/toast";

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
  const router = useLocalizedRouter();
  const t = useT();
  const isCompleted = job?.state === "completed";
  const resultRecipeId =
    job?.state === "completed" ? job.resultRecipeId : undefined;
  const successToastId = job?.successToastId;

  useEffect(() => {
    if (!isCompleted || !resultRecipeId) return;
    if (successToastId !== undefined) {
      useToastStore.getState().removeToast(successToastId);
    }
    router.replace(`/recipes/${resultRecipeId}`);
  }, [isCompleted, resultRecipeId, successToastId, router]);

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
          error={
            (job.state === "failed" && job.message) ||
            t.aiRecipe.error.defaultMessage
          }
          onRetry={onRetry}
        />
      </Container>
    );
  }

  if (isCompleted) {
    return null;
  }

  return <>{children}</>;
};

export default AIConceptShell;
