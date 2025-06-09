import { useUserStore } from '@/store/useUserStore';
import { useNavigate, useLocation } from 'react-router';
import { useToastStore } from '@/store/useToastStore';

type UseAuthenticatedActionOptions = {
  notifyOnly?: boolean;
};

const useAuthenticatedAction = <TVariables, TOptions, TResult = void>(
  actionFn: (variables: TVariables, options?: TOptions) => TResult,
  hookOptions?: UseAuthenticatedActionOptions,
) => {
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();

  return (variables: TVariables, options?: TOptions): TResult | undefined => {
    if (!isAuthenticated) {
      if (hookOptions?.notifyOnly) {
        addToast({
          message: '로그인이 필요합니다.',
          variant: 'default',
          position: 'bottom',
        });
        return undefined;
      }

      navigate('/login', {
        state: { from: location },
        replace: true,
      });

      return undefined;
    } else {
      return actionFn(variables, options);
    }
  };
};

export default useAuthenticatedAction;
