import { postLogout } from '@/api/user';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/store/useUserStore';
import { useToastStore } from '@/store/useToastStore';

const useLogoutMutation = () => {
  const { logoutAction } = useUserStore();
  const { addToast, removeToast } = useToastStore();
  const mutation = useMutation({
    mutationFn: postLogout,
    onMutate: () => {
      const deletingToastId = addToast({
        message: '로그아웃 중...',
        variant: 'default',
        size: 'small',
        position: 'middle',
        duration: 1000 * 1000,
      });

      return { deletingToastId };
    },
    onSuccess: () => {
      logoutAction();
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error, variables, context) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.';

      addToast({
        message: `로그아웃에 실패했습니다: ${errorMessage}`,
        variant: 'error',
        position: 'middle',
      });
    },
    onSettled: (data, error, variables, context) => {
      if (context?.deletingToastId) {
        removeToast(context.deletingToastId);
      }
    },
  });

  return mutation;
};

export default useLogoutMutation;
