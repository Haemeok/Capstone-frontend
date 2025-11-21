import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/shared/lib/queryClient";

import { useUserStore } from "@/entities/user";

import { useToastStore } from "@/widgets/Toast";

import { postLogout } from "../api";

const useLogoutMutation = () => {
  const { logoutAction } = useUserStore();
  const { addToast, removeToast } = useToastStore();

  const mutation = useMutation({
    mutationFn: postLogout,
    onMutate: () => {
      useUserStore.setState({ isLoggingOut: true });

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const userIdMatch = currentPath.match(/^\/users\/(\d+)$/);

        if (userIdMatch) {
          window.location.replace("/users/guestUser");
        }
      }

      const deletingToastId = addToast({
        message: "로그아웃 중...",
        variant: "default",
        size: "small",
        position: "middle",
        duration: 1000 * 1000,
      });

      return { deletingToastId };
    },
    onSuccess: () => {
      logoutAction();
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";

      addToast({
        message: `로그아웃에 실패했습니다: ${errorMessage}`,
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

export default useLogoutMutation;
