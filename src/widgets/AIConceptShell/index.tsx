"use client";

import { type ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import type { AIModelId } from "@/shared/config/constants/aiModel";
import { Container } from "@/shared/ui/Container";

import { useAIRecipeFocusStore } from "@/features/recipe-create-ai/model/focusStore";
import type { ActiveAIJob } from "@/features/recipe-create-ai/model/types";

import { useToastStore } from "@/widgets/Toast";

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

const FormFocusGuard = ({ children }: { children: ReactNode }) => {
  const setFocusFormPage = useAIRecipeFocusStore((s) => s.setFocusFormPage);

  useEffect(() => {
    setFocusFormPage(true);
    return () => setFocusFormPage(false);
  }, [setFocusFormPage]);

  return <>{children}</>;
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
  const router = useRouter();
  const isCompleted = job?.state === "completed";
  const resultRecipeId = job?.resultRecipeId;
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
          error={job.message || "레시피 생성 중 오류가 발생했습니다."}
          onRetry={onRetry}
        />
      </Container>
    );
  }

  if (isCompleted) {
    return null;
  }

  return <FormFocusGuard>{children}</FormFocusGuard>;
};

export default AIConceptShell;
