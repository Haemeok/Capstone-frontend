import { useMutation } from "@tanstack/react-query";

import { useUserStore } from "@/entities/user";
import { triggerHaptic } from "@/shared/lib/bridge";
import { queryClient } from "@/shared/lib/queryClient";
import { useToastStore } from "@/widgets/Toast";

import { deleteAccount } from "../api";

const useDeleteAccountMutation = () => {
  const { logoutAction } = useUserStore();
  const { addToast, removeToast } = useToastStore();

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onMutate: () => {
      const deletingToastId = addToast({
        message: "계정 삭제 중...",
        variant: "default",
        size: "small",
        position: "middle",
        duration: 1000 * 1000,
      });

      return { deletingToastId };
    },
    onSuccess: () => {
      triggerHaptic("Success");
      logoutAction();
      queryClient.clear();

      addToast({
        message: "계정이 삭제되었습니다.",
        variant: "default",
        position: "middle",
        duration: 2000,
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    },
    onError: (error) => {
      triggerHaptic("Error");

      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";

      addToast({
        message: `계정 삭제에 실패했습니다: ${errorMessage}`,
        variant: "error",
        position: "middle",
      });
    },
    onSettled: (_, __, ___, context) => {
      if (context?.deletingToastId) {
        removeToast(context.deletingToastId);
      }
    },
  });

  return mutation;
};

export default useDeleteAccountMutation;
