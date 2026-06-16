import { useMutation } from "@tanstack/react-query";

import { useChromeLocale, useCommonDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { queryClient } from "@/shared/lib/queryClient";

import { useUserStore } from "@/entities/user";

import { useToastStore } from "@/widgets/Toast";

import { deleteAccount } from "../api";
import { composeFailureToast } from "../lib/composeFailureToast";

const useDeleteAccountMutation = () => {
  const { logoutAction } = useUserStore();
  const { addToast, removeToast } = useToastStore();
  const locale = useChromeLocale();
  const t = useCommonDict();

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onMutate: () => {
      const deletingToastId = addToast({
        message: t.toast.deleteAccount.pending,
        variant: "default",
        size: "small",
        position: "middle",
        duration: 1000 * 1000,
      });

      return { deletingToastId };
    },
    onSuccess: () => {
      triggerHaptic("Success");
      queryClient.cancelQueries();
      queryClient.clear();
      logoutAction();

      addToast({
        message: t.toast.deleteAccount.success,
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
      addToast({
        message: composeFailureToast({
          template: t.toast.deleteAccount.error,
          locale,
          error,
          unknownText: t.errors.unknown,
        }),
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
