import { useMutation } from "@tanstack/react-query";

import { useToastStore } from "@/widgets/Toast/model/store";

import { postSurvey } from "./api";
import { SurveyAnswers, SurveyResponse } from "./types";

type UseSurveyMutationOptions = {
  onSuccess?: (data: SurveyResponse) => void;
  onError?: (error: Error) => void;
};

export const useSurveyMutation = (options?: UseSurveyMutationOptions) => {
  const { addToast } = useToastStore();

  const mutation = useMutation<SurveyResponse, Error, SurveyAnswers>({
    mutationFn: postSurvey,
    onSuccess: (data) => {
      addToast({
        message: "설문조사가 완료되었습니다!",
        variant: "success",
        position: "bottom",
      });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("설문조사 제출 실패:", error);
      addToast({
        message: "설문조사 제출에 실패했습니다. 다시 시도해주세요.",
        variant: "error",
        position: "bottom",
      });
      options?.onError?.(error);
    },
  });

  return mutation;
};
